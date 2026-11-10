from concurrent.futures import ThreadPoolExecutor, as_completed
from hashlib import sha256
from zipfile import ZipFile
import json
from pathlib import Path, PurePosixPath
import subprocess
import sys
from urllib.parse import quote

base = 'https://zet-arcwarden-edgetx.nevembert.chatgpt.site/tmr6gep/'
root = Path('segl7hd')
new_url = 'https://nevembert.github.io/rusich-edgetx-voicepack/' + root.name + '/'
items = json.loads(Path('.github/arc-migration-files.json').read_text())

def download(item):
    path = PurePosixPath(item['path'])
    if path.is_absolute() or '..' in path.parts:
        raise ValueError(f'Invalid path: {path}')
    destination = root.joinpath(*path.parts)
    destination.parent.mkdir(parents=True, exist_ok=True)
    url = base + quote(path.as_posix(), safe='/')
    content = subprocess.check_output([
        'curl', '--fail', '--silent', '--show-error', '--location',
        '--user-agent', 'Mozilla/5.0', '--retry', '2', '--max-time', '40', url,
    ])
    digest = sha256(content).hexdigest()
    if item.get('sha256') and digest != item['sha256']:
        raise ValueError(f'SHA-256 mismatch: {path} {digest}')
    if path.suffix in ('.wav', '.zip') and not content.startswith(b'RIFF' if path.suffix == '.wav' else b'PK\x03\x04'):
        raise ValueError(f'Invalid file: {path}')
    destination.write_bytes(content)
    return path

failures = []
with ThreadPoolExecutor(max_workers=8) as pool:
    for count, future in enumerate(as_completed([pool.submit(download, item) for item in items]), 1):
        try:
            future.result()
        except Exception as exc:
            print(exc, flush=True)
            failures.append(exc)
        if count % 20 == 0 or count == len(items):
            print(f'{count}/{len(items)}', flush=True)
if failures:
    sys.exit(1)

for folder, archive in (
    (root, 'ArcWarden_EdgeTX_ru.zip'),
    (root / 'short', 'ArcWarden_EdgeTX_ru_short.zip'),
):
    wav_paths = {str(path.relative_to(folder)) for path in (folder / 'SOUNDS').rglob('*.wav')}
    if len(wav_paths) != 77:
        raise ValueError(f'Expected 77 WAV files in {folder}, found {len(wav_paths)}')
    with ZipFile(root / archive) as zip_file:
        if zip_file.testzip() or {name for name in zip_file.namelist() if name.endswith('.wav')} != wav_paths:
            raise ValueError(f'Invalid or incomplete archive: {archive}')

with ZipFile(root / 'ArcWarden_Project_Source.zip') as zip_file:
    if zip_file.testzip():
        raise ValueError('Invalid source archive')

index = root / 'index.html'
html = index.read_text(encoding='utf-8')
index.write_text(html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex">', 1), encoding='utf-8')

install = root / 'INSTALL.md'
install.write_text(install.read_text(encoding='utf-8').replace(base.removesuffix('tmr6gep/'), new_url), encoding='utf-8')
short_install = root / 'short/INSTALL.md'
old_home = base.removesuffix('/tmr6gep/')
short_instructions = short_install.read_text(encoding='utf-8').replace(old_home + '/', new_url).replace(old_home, new_url)
short_install.write_text(short_instructions, encoding='utf-8')

for archive, replacements in (
    ('ArcWarden_EdgeTX_ru.zip', {'INSTALL.md': install}),
    ('ArcWarden_Project_Source.zip', {'INSTALL.md': install, 'short/INSTALL.md': short_install}),
):
    archive_path = root / archive
    updated_path = archive_path.with_suffix('.tmp')
    with ZipFile(archive_path) as original, ZipFile(updated_path, 'w') as updated:
        for entry in original.infolist():
            replacement = replacements.get(entry.filename)
            data = replacement.read_bytes() if replacement else original.read(entry)
            updated.writestr(entry, data)
    updated_path.replace(archive_path)
