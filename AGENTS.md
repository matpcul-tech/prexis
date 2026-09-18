# Prexis

Interactive offline-first lesson player. Curriculum lives in data files. Do not replace authored lessons with generated filler.

## First thing for Grok Build

```bash
chmod +x bootstrap.sh && ./bootstrap.sh
python3 -m http.server 8765
```

That extracts the original player from git history, applies `app.patch`, and builds `content_extra.js`.

## Layout

- `index.html` — shell; loads `content.js`, `content_extra.js`, `app.jsx`
- `app.patch` — library-first player changes
- `build_library.py` + `extra_*.py` — extra tracks
- `content.js` — original 67 lessons

## Rules

- New lessons use existing step types only
- JS output/code steps must run in the sandbox
- Prefer expanding extra_*.py over the AI generator
- Voice: short, specific, no cheerleading
