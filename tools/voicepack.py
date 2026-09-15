#!/usr/bin/env python3
"""Arc Warden / EdgeTX production tools. Python 3.10+, FFmpeg for conversion."""
from __future__ import annotations

import argparse
import array
import hashlib
import json
import math
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import wave
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PREVIEW_FILES = ["SYSTEM/hello.wav", "armed.wav", "fm-acr.wav", "SYSTEM/telemko.wav", "batcrt.wav", "fm-rth.wav"]


def load_manifest(root=ROOT):
    data = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    seen = set()
    for track in data["tracks"]:
        name = track["file"]
        if not re.fullmatch(r"(?:SYSTEM/)?[a-z0-9_-]+\.wav", name):
            raise ValueError(f"Invalid track path: {name}")
        key = name.casefold()
        if key in seen:
            raise ValueError(f"Duplicate track: {name}")
        seen.add(key)
        stem = PurePosixPath(name).stem
        if len(stem) > (8 if name.startswith("SYSTEM/") else 6):
            raise ValueError(f"Track filename too long: {name}")
        if not track["text"].strip():
            raise ValueError(f"Empty text: {name}")
        if track["priority"] not in ("normal", "warning", "critical"):
            raise ValueError(f"Invalid priority: {name}")
    return data


def inspect_wav(path, max_seconds=6):
    with wave.open(str(path), "rb") as wav:
        params = (wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getcomptype())
        if params != (1, 2, 32000, "NONE"):
            raise ValueError(f"Expected mono PCM16 32000 Hz; got {params}")
        duration = wav.getnframes() / wav.getframerate()
        if not 0.1 <= duration <= max_seconds:
            raise ValueError(f"Duration {duration:.2f}s outside 0.1–{max_seconds}s")
        raw = wav.readframes(wav.getnframes())
        if len(raw) != wav.getnframes() * 2:
            raise ValueError("Truncated WAV data")
    samples = array.array("h", raw)
    if sys.byteorder != "little":
        samples.byteswap()
    peak = max((abs(value) for value in samples), default=0)
    rms = math.sqrt(sum(value * value for value in samples) / max(1, len(samples)))
    if peak < 256 or rms < 30:
        raise ValueError("Empty or near-silent audio")
    if peak >= 32760:
        raise ValueError("Audio reaches digital clipping level")
    return {"duration": round(duration, 3), "peak_dbfs": round(20 * math.log10(peak / 32768), 2)}


def scan(root=ROOT):
    manifest = load_manifest(root)
    result = []
    for track in manifest["tracks"]:
        item = {**track, "available": False}
        path = root / "SOUNDS" / "ru" / track["file"]
        if path.is_file():
            try:
                item.update(inspect_wav(path, track["max_seconds"]))
                item["available"] = True
            except (ValueError, wave.Error, EOFError) as error:
                item["error"] = str(error)
        result.append(item)
    return manifest, result


def selected_tracks(manifest, preview=False):
    return [t for t in manifest["tracks"] if not preview or t["file"] in PREVIEW_FILES]


def generate(args):
    manifest = load_manifest()
    tracks = selected_tracks(manifest, args.preview)
    pending = [t for t in tracks if args.overwrite or not (args.raw / t["file"]).with_suffix(".mp3").exists()]
    print(f"Selected {len(tracks)} tracks, pending {len(pending)}, {sum(len(t['text']) for t in pending)} characters")
    if args.dry_run:
        for track in pending:
            print(f"{track['file']}: {track['text']}")
        return
    key = os.environ.get("ELEVENLABS_API_KEY")
    voice_id = args.voice_id or os.environ.get("ELEVENLABS_VOICE_ID")
    if not key or not voice_id:
        raise ValueError("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID locally. No voice has been selected by this project.")
    for track in pending:
        payload = json.dumps({
            "text": track["text"], "model_id": args.model,
            "voice_settings": {"stability": 0.65, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True}
        }, ensure_ascii=False).encode("utf-8")
        url = "https://api.elevenlabs.io/v1/text-to-speech/" + urllib.parse.quote(voice_id, safe="") + "?output_format=mp3_44100_128"
        request = urllib.request.Request(url, data=payload, headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"}, method="POST")
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                if "audio" not in response.headers.get("Content-Type", "").lower():
                    raise ValueError("Provider returned a non-audio response")
                content = response.read()
        except urllib.error.HTTPError as error:
            raise ValueError(f"ElevenLabs HTTP {error.code}. Stopped without automatic retries. Check voice access and quota.") from None
        except urllib.error.URLError:
            raise ValueError("Network error. Generation stopped; already saved files are preserved.") from None
        if not content:
            raise ValueError("Provider returned empty audio")
        output = (args.raw / track["file"]).with_suffix(".mp3")
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_suffix(".part")
        temporary.write_bytes(content)
        temporary.replace(output)
        print(f"Saved {output.relative_to(args.raw)}")


def convert_one(source, target, track, effect):
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise ValueError("FFmpeg is required on PATH")
    # Keep urgent messages dry. Layering is a creative effect, not a voice clone.
    start = "aresample=32000,aformat=sample_fmts=fltp:channel_layouts=mono,highpass=f=85"
    finish = "loudnorm=I=-18:TP=-2:LRA=7,alimiter=limit=0.89:level=false,aresample=32000"
    if effect == "dual" and track["priority"] == "normal":
        graph = f"[0:a]{start},asplit=2[dry][copy];[copy]asetrate=30400,aresample=32000,atempo=1.052632,adelay=23,lowpass=f=5200,volume=0.20[ghost];[dry][ghost]amix=inputs=2:normalize=0,{finish}[out]"
    else:
        graph = f"[0:a]{start},{finish}[out]"
    target.parent.mkdir(parents=True, exist_ok=True)
    handle = tempfile.NamedTemporaryFile(suffix=".wav", dir=target.parent, delete=False)
    handle.close()
    temporary = Path(handle.name)
    try:
        process = subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source), "-filter_complex", graph, "-map", "[out]", "-map_metadata", "-1", "-ac", "1", "-ar", "32000", "-c:a", "pcm_s16le", str(temporary)], capture_output=True, text=True)
        if process.returncode:
            raise ValueError(f"FFmpeg failed: {process.stderr[-800:]}")
        info = inspect_wav(temporary, track["max_seconds"])
        temporary.replace(target)
        return info
    finally:
        temporary.unlink(missing_ok=True)


def convert(args):
    manifest = load_manifest()
    converted = 0
    for track in selected_tracks(manifest, args.preview):
        source = next((path for suffix in (".wav", ".mp3", ".flac", ".ogg", ".m4a") if (path := (args.raw / track["file"]).with_suffix(suffix)).is_file()), None)
        if source is None:
            continue
        output = ROOT / "SOUNDS" / "ru" / track["file"]
        info = convert_one(source, output, track, args.effect)
        converted += 1
        print(f"{track['file']}: {info['duration']}s")
    if not converted:
        raise ValueError("No source recordings found in raw/. Keep the filenames from manifest.json, including SYSTEM/.")
    print(f"Converted {converted} recordings")


def validate(args):
    manifest, tracks = scan()
    invalid = [t for t in tracks if "error" in t]
    missing = [t for t in tracks if not t["available"]]
    print(f"Valid WAV files: {len(tracks) - len(missing)}/{len(tracks)}; system: {sum(t['kind'] == 'system' for t in tracks)}")
    for track in invalid:
        print(f"INVALID {track['file']}: {track['error']}")
    if invalid or (args.require_complete and missing):
        raise ValueError(f"Release blocked: {len(missing)} missing or invalid recordings")


def phrase_markdown(manifest):
    out = ["# ЗЕТ: Раскол — сценарий озвучки", "", "77 новых реплик для пульта. Это авторская адаптация под Arc Warden, не цитаты из Dota 2. Голос ещё не записан.", "", "| Файл | Событие | Текст |", "| --- | --- | --- |"]
    for track in manifest["tracks"]:
        out.append(f"| `{track['file']}` | {track['tag']} | {track['text']} |")
    return "\n".join(out) + "\n"


def release_zip(path, tracks, root=ROOT):
    if not tracks or not all(track["available"] for track in tracks):
        raise ValueError("Cannot package an incomplete voice pack")
    temporary = path.with_suffix(".tmp")
    try:
        with zipfile.ZipFile(temporary, "w", zipfile.ZIP_DEFLATED) as archive:
            for track in tracks:
                rel = "SOUNDS/ru/" + track["file"]
                archive.write(root / rel, rel)
            archive.write(root / "INSTALL.md", "INSTALL.md")
            archive.write(root / "AUDIO-NOTES.md", "AUDIO-NOTES.md")
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)


def build_site(args):
    manifest, tracks = scan()
    invalid = [track for track in tracks if "error" in track]
    if invalid:
        raise ValueError("Fix invalid recordings before publishing: " + ", ".join(t["file"] for t in invalid))
    dist = ROOT / "dist"
    dist.mkdir(exist_ok=True)
    # Only these derived outputs are removed; authored website files stay intact.
    sounds = dist / "SOUNDS"
    if sounds.exists():
        shutil.rmtree(sounds)
    for track in tracks:
        if track["available"]:
            destination = sounds / "ru" / track["file"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / "SOUNDS" / "ru" / track["file"], destination)
    markdown = phrase_markdown(manifest)
    (ROOT / "PHRASES.md").write_text(markdown, encoding="utf-8")
    (dist / "PHRASES.md").write_text(markdown, encoding="utf-8")
    (dist / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for name in ("INSTALL.md", "VOICE-BRIEF.md", "AUDIO-NOTES.md"):
        shutil.copyfile(ROOT / name, dist / name)
    archive_path = dist / "ArcWarden_EdgeTX_ru.zip"
    complete = bool(tracks) and all(track["available"] for track in tracks)
    if complete:
        release_zip(archive_path, tracks)
    else:
        archive_path.unlink(missing_ok=True)
    payload = {**manifest, "tracks": tracks, "ready": sum(t["available"] for t in tracks), "complete": complete, "release": archive_path.name if complete else None}
    serialized = json.dumps(payload, ensure_ascii=False, indent=2).replace("</", "<\\/")
    (dist / "tracks.js").write_text("window.VOICEPACK = " + serialized + ";\n", encoding="utf-8")
    print(f"Site catalog: {payload['ready']}/{len(tracks)} recordings. Install archive: {'ready' if complete else 'not created'}")


def source_zip(args):
    destination = ROOT / "dist" / "ArcWarden_Project_Source.zip"
    # Explicit allowlist: never include credentials, raw recordings, Git or hosting identity.
    sources = [ROOT / name for name in ("README.md", "manifest.json", "PHRASES.md", "VOICE-BRIEF.md", "INSTALL.md", "AUDIO-NOTES.md", "ARTWORK.md", "LICENSE", ".gitignore")]
    for folder in ("tools", "tests", ".github", "SOUNDS", "dist", "design"):
        sources.extend(p for p in (ROOT / folder).rglob("*") if p.is_file() and "__pycache__" not in p.parts and p.suffix not in (".zip", ".pyc"))
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED) as archive:
        for source in sorted(set(sources)):
            archive.write(source, "arcwarden-edgetx-voicepack/" + source.relative_to(ROOT).as_posix())
    print(f"Source archive: {destination.name}, {destination.stat().st_size} bytes")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    generator = commands.add_parser("generate", help="Generate from an explicitly selected ElevenLabs voice")
    generator.add_argument("--voice-id")
    generator.add_argument("--model", default="eleven_multilingual_v2")
    generator.add_argument("--raw", type=Path, default=ROOT / "raw")
    generator.add_argument("--preview", action="store_true")
    generator.add_argument("--dry-run", action="store_true")
    generator.add_argument("--overwrite", action="store_true")
    generator.set_defaults(func=generate)
    converter = commands.add_parser("convert", help="Convert recordings to EdgeTX WAV")
    converter.add_argument("--raw", type=Path, default=ROOT / "raw")
    converter.add_argument("--effect", choices=("none", "dual"), default="none")
    converter.add_argument("--preview", action="store_true")
    converter.set_defaults(func=convert)
    validator = commands.add_parser("validate")
    validator.add_argument("--require-complete", action="store_true")
    validator.set_defaults(func=validate)
    commands.add_parser("build-site").set_defaults(func=build_site)
    commands.add_parser("source-zip").set_defaults(func=source_zip)
    args = parser.parse_args()
    try:
        args.func(args)
    except (ValueError, OSError, wave.Error) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
