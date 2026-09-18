#!/bin/sh
# Rebuild app.jsx from the original player commit, then apply library patches.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
if [ ! -f app.orig.jsx ]; then
  git show 5addaf3957ab53ecc21621df931aee36cd7d69da:index.html \
    | python3 -c "import sys,re; t=sys.stdin.read(); m=re.search(r'<script type=\"text/babel\"[^>]*>(.*?)</script>', t, re.S); sys.stdout.write(m.group(1) if m else '')" \
    > app.orig.jsx
fi
cp app.orig.jsx app.jsx
patch -p0 < app.patch
python3 build_library.py
echo "Ready. python3 -m http.server 8765"
