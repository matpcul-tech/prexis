# Prexis project rules

## Writing style (applies to ALL text: app copy, lesson content, README, commit messages, PR titles and bodies, code comments)

- **Never use em dashes (—) or en dashes (–).** Use commas, colons, periods, or parentheses instead. Numeric ranges use a plain hyphen (10-30 seconds).
- Voice: direct, specific, no cheerleading. Short sentences over long ones.
- The AI lesson-generation prompt in app.jsx also forbids dashes; keep that rule if the prompt is rewritten.
- `tidyStr` retro-converts dashes in stored generated lessons; do not remove that.
- Step arrays in content.js carry trailing commas. Scripted insertions must not add a second comma; validate for array holes after any content edit (holes become null steps after the deep clone and crash tidyLesson).

## Architecture (read before editing)

- No-build split app: `index.html` is the shell (styles + CDN scripts, React 18 UMD + Babel standalone + mathjs, all from cdn.jsdelivr.net/npm only). `app.jsx` is the player, compiled in the browser by Babel standalone. `content.js` sets `window.PREXIS_CONTENT` with the curated curriculum; `content_extra.js` sets `window.PREXIS_EXTRA` (extra courses plus track/prereq/blurb overlay) and merges itself into PREXIS_CONTENT. Script order in index.html matters: content.js, then content_extra.js, then app.jsx.
- Because Babel fetches app.jsx at runtime, the app needs a local HTTP server; plain file:// no longer works.
- Every course id referenced by app.jsx quick-pick filters or content_extra.js must exist or be handled as absent; never commit an index.html that references files not in the repo.
- No frameworks, no bundler, no package.json. Keep it that way. `build_library.py` is an authoring tool that regenerates content_extra.js; it is not a build step the app needs.
- API keys live only in the visitor's browser and are sent only to the chosen AI provider. Never include keys in exported backups or anywhere else.

## Workflow

- All work lands on `main` through PRs (non-draft). Vercel auto-deploys `main`.
- Before pushing: compile-check `app.jsx` (Babel preset-react, classic runtime), validate `content.js` and `content_extra.js` (code/output steps must actually run), and run a headless Chromium pass over HTTP with zero console errors.
