from pathlib import Path
import getpass, os, re
root = Path(__file__).resolve().parents[1]
target = root / '.env.local'
if target.is_symlink():
    raise SystemExit('Refusing a symlink destination.')
print('Lingo Garden — secure Claude key setup')
print('Paste your Claude API key below. Input is hidden and will not be printed.')
key = getpass.getpass('ANTHROPIC_API_KEY: ').strip()
if not key.startswith('sk-ant-') or len(key) < 25 or any(c.isspace() for c in key):
    raise SystemExit('No valid Claude key was entered. Nothing was saved.')
lines = target.read_text().splitlines() if target.exists() else []
lines = [line for line in lines if not re.match(r'^\s*(?:export\s+)?ANTHROPIC_API_KEY\s*=', line)]
lines.append('ANTHROPIC_API_KEY=' + key)
fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, 'w') as f:
    f.write('\n'.join(lines) + '\n')
os.chmod(target, 0o600)
print('Saved ANTHROPIC_API_KEY to the ignored .env.local file. The key was not printed.')
