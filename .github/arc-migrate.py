import concurrent.futures, hashlib, json, pathlib, time, urllib.parse, urllib.request
root = pathlib.Path('q7v4m9x')
base = 'https://zet-arcwarden-edgetx.nevembert.chatgpt.site/tmr6gep/'
files = json.loads(pathlib.Path('.github/arc-migration-files.json').read_text(encoding='utf-8'))
def download(item):
    p = pathlib.PurePosixPath(item['path'])
    if p.is_absolute() or '..' in p.parts:
        raise ValueError('unsafe path')
    url = base + urllib.parse.quote(p.as_posix(), safe='/')
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=90) as response:
                data = response.read()
            digest = hashlib.sha256(data).hexdigest()
            if item.get('sha256') and digest != item['sha256']:
                raise ValueError('SHA-256 mismatch: ' + str(p))
            if not data or (p.suffix in ('.wav', '.zip') and data[:15].lower().startswith(b'<!doctype html')):
                raise ValueError('incorrect file response: ' + str(p))
            dest = root.joinpath(*p.parts)
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            return str(p)
        except Exception:
            if attempt == 2: raise
            time.sleep(2 ** attempt)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for i, path in enumerate(pool.map(download, files), 1):
        if i % 20 == 0 or i == len(files): print(f'{i}/{len(files)}', flush=True)
