import importlib.util
import math
from pathlib import Path
import struct
import tempfile
import unittest
import wave

spec = importlib.util.spec_from_file_location("voicepack", Path(__file__).resolve().parents[1] / "tools" / "voicepack.py")
vp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vp)


def fixture(path, channels=1, rate=32000, amplitude=5000, seconds=0.6):
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        data = b"".join(struct.pack("<h", round(amplitude * math.sin(2 * math.pi * 440 * i / rate))) * channels for i in range(int(rate * seconds)))
        wav.writeframes(data)


class AudioGateTests(unittest.TestCase):
    def test_wrong_format_silence_and_long_alert_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "test.wav"
            for values in ({"rate": 44100}, {"channels": 2}, {"amplitude": 0}, {"seconds": 4}):
                with self.subTest(values=values):
                    fixture(path, **values)
                    with self.assertRaises(ValueError):
                        vp.inspect_wav(path, max_seconds=3.5)

    def test_incomplete_release_is_blocked(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "release.zip"
            with self.assertRaises(ValueError):
                vp.release_zip(destination, [{"available": False}])
            self.assertFalse(destination.exists())

    def test_real_ffmpeg_conversion_accepts_stereo_source(self):
        if not vp.shutil.which("ffmpeg"):
            self.skipTest("FFmpeg not installed")
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "source.wav"
            fixture(source, channels=2, rate=44100)
            for priority, effect in (("normal", "none"), ("normal", "dual"), ("critical", "dual")):
                with self.subTest(priority=priority, effect=effect):
                    destination = Path(directory) / f"{priority}-{effect}.wav"
                    result = vp.convert_one(source, destination, {"priority": priority, "max_seconds": 3.5}, effect)
                    self.assertGreater(result["duration"], 0.5)
                    self.assertLess(result["peak_dbfs"], -1)


if __name__ == "__main__":
    unittest.main()
