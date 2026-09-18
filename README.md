# Prexis

Interactive lesson player with a sequenced offline library (code, web, numbers, thinking, writing, money). No account. Studio AI is optional.

## Run locally

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/

Needs HTTP so Babel can compile the app inside `index.html`.

## Grok Build

```bash
git clone https://github.com/matpcul-tech/prexis.git
cd prexis
grok
```

See `AGENTS.md` for conventions. Expand `content_extra.js` (via `build_library.py`) rather than generating one-off lessons.

## Layout

| File | Role |
|---|---|
| `index.html` | Player shell + embedded React app |
| `app.jsx` | Source copy of the player |
| `content.js` | Original 67 lessons |
| `content_extra.js` | Intermediate/advanced tracks |
| `build_library.py` | Rebuild extra curriculum |

## Catalog

20 courses, 107 lessons. Tracks: code, web, quant, thinking, writing, money. Intermediate courses name a `prereq`.
