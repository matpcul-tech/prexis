# Prexis

Interactive offline-first lesson player. Curriculum lives in data files. Do not replace authored lessons with generated filler.

## First thing

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/. The player (`app.jsx`) and `content_extra.js` are committed; nothing needs generating to run the app.

## Layout

- `index.html`: shell; loads `content.js`, then `content_extra.js`, then `master.js`, then `drafting.js`, then `app.jsx` (order matters)
- `master.js`: Master level, endless practice and project generators plus the SM-2 scheduler (`window.PREXIS_MASTER`). Plain JavaScript, hand-edited, no build. Every generated answer must be computed by its generator.
- `drafting.js`: the bridge to Sovereign Draft (`window.PREXIS_DRAFT`): share link codec, .sdraft and share link reader, drawing checks for `draft` steps, SVG preview. Plain JavaScript, hand-edited, no build. Also loads in Node (`module.exports`) for tests: run `node tests/drafting-checks.js` after touching drafting.js or extra_drafting.py. Its fixtures are real .sdraft saves from Sovereign Draft (each lesson done right and done wrong).
- `app.jsx`: the player. Edit it directly.
- `content.js`: original 67 lessons
- `content_extra.js`: extra tracks plus course metadata overlay. Regenerate with `python3 build_library.py` after editing `extra_*.py`; do not hand-edit both.
- `build_library.py` + `extra_*.py`: extra track sources
- `app.patch` + `bootstrap.sh`: historical record of how the player was split out of the old single-file app. Running `bootstrap.sh` OVERWRITES `app.jsx` from git history plus the patch and will discard later player edits. Do not run it unless you mean to reset the player.

## Rules

- New lessons use existing step types only (concept, worked, mcq, numeric, order, output, code, explore, build, write, draft). `draft` is an approved exception (Oct 2026) and is used only by the Drafting track: it opens Sovereign Draft with the step's `starter` drawing through a `#sd=` share link, reads back a .sdraft file or share link, and grades the drawing data with the `checks` in drafting.js. Every draft starter carries a hidden, non plotting `stamp` layer (PREXIS-Lxx) that the first check looks for, and every draft step keeps a self check fallback. A draft check with `confirm` is something the file cannot prove (for example that the PDF prints): the step shows it as a tick box above the drop zone and passes it to `runChecks` as `self[label]`. A course with every lesson written sets `complete: true` so the player hides its placeholder note. Ladder courses are generated from extra_*.py modules through ladder_kit.py; rebuild with python3 build_library.py
- JS output/code steps must run in the sandbox
- Prefer expanding extra_*.py over the AI generator
- Voice: short, specific, no cheerleading. No em or en dashes anywhere; see CLAUDE.md.
- Never commit an index.html that references files not in the repo. Vercel serves main as-is; there is no build step on deploy.
