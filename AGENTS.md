# Prexis

Interactive offline-first lesson player. Curriculum lives in data files. Do not replace authored lessons with generated filler.

## Run

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/ — Babel loads over HTTP, not `file://`.

## Layout

- `index.html` — styles, CDN React/Babel/mathjs, mounts the app
- `app.jsx` — embedded in `index.html` as `text/babel`; source copy lives here
- `content.js` — original 67-lesson library (`window.PREXIS_CONTENT`)
- `content_extra.js` — extra tracks; merges into `PREXIS_CONTENT`
- `build_library.py` + `extra_*.py` — regenerate `content_extra.js`

## Rules

- New lessons use existing step types: concept, worked, mcq, numeric, order, output, code, explore, build
- JS `output`/`code` steps must run in the player sandbox (`new Function` + fake console)
- Prefer expanding `content_extra.js` over changing the AI generator
- Keep voice short, specific, no cheerleading
- Course fields: `track`, `prereq`, `blurb`, `level`
