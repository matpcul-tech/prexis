# Prexis

Interactive offline-first lesson player. Curriculum lives in data files. Do not replace authored lessons with generated filler.

## First thing

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/. The player (`app.jsx`) and `content_extra.js` are committed; nothing needs generating to run the app.

## Layout

- `index.html`: shell; loads `content.js`, then `content_extra.js`, then `app.jsx` (order matters)
- `app.jsx`: the player. Edit it directly.
- `content.js`: original 67 lessons
- `content_extra.js`: extra tracks plus course metadata overlay. Regenerate with `python3 build_library.py` after editing `extra_*.py`; do not hand-edit both.
- `build_library.py` + `extra_*.py`: extra track sources
- `app.patch` + `bootstrap.sh`: historical record of how the player was split out of the old single-file app. Running `bootstrap.sh` OVERWRITES `app.jsx` from git history plus the patch and will discard later player edits. Do not run it unless you mean to reset the player.

## Rules

- New lessons use existing step types only (concept, worked, mcq, numeric, order, output, code, explore, build)
- JS output/code steps must run in the sandbox
- Prefer expanding extra_*.py over the AI generator
- Voice: short, specific, no cheerleading. No em or en dashes anywhere; see CLAUDE.md.
- Never commit an index.html that references files not in the repo. Vercel serves main as-is; there is no build step on deploy.
