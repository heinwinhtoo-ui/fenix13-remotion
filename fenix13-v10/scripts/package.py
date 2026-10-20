"""Package the editable sources, assets and completed QA evidence."""
from pathlib import Path
import shutil
import zipfile

root = Path(__file__).resolve().parent.parent
parent = root.parent
for name in ['FENIX13_V10_CHANGELOG.md', 'FENIX13_V10_QA_REPORT.md']:
    if (parent / name).is_file():
        shutil.copy2(parent / name, root / name)
    assert (root / name).is_file(), name
required = [
    'QUALITY_REPORT.json', 'PREVIEW_REPORT.json', 'package-lock.json',
    'blender/FENIX_V10_CREATURE.blend', 'public/models/FENIX_V10_CREATURE.glb',
    'public/audio/FENIX_ORIGINAL_MASTER.wav', 'src/PhoenixFilm.tsx',
]
for name in required:
    assert (root / name).is_file(), name
excluded = {'node_modules', 'out', '.remotion', '__pycache__', '.git'}
destination = parent / 'FENIX13_V10_EDITABLE_PROJECT.zip'
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for p in sorted(root.rglob('*')):
        rel = p.relative_to(root)
        if not p.is_file() or any(part in excluded for part in rel.parts):
            continue
        if p.suffix in {'.log', '.blend1', '.pyc'} or p.name == 'premaster.wav':
            continue
        z.write(p, Path(root.name) / rel)
with zipfile.ZipFile(destination) as z:
    assert z.testzip() is None
    print(f'{destination.name}: {len(z.namelist())} files; CRC check passed')
print(f'{destination.stat().st_size:,} bytes')
