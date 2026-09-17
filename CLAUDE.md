# Prexis project rules

## Writing style (applies to ALL text: app copy, lesson content, README, commit messages, PR titles and bodies, code comments)

- **Never use em dashes (—) or en dashes (–).** Use commas, colons, periods, or parentheses instead. Numeric ranges use a plain hyphen (10-30 seconds).
- Voice: direct, specific, no cheerleading. Short sentences over long ones.
- The AI lesson-generation prompt in index.html also forbids dashes; keep that rule if the prompt is rewritten.
- `tidyStr` retro-converts dashes in stored generated lessons; do not remove that.
- Step arrays in content.js carry trailing commas. Scripted insertions must not add a second comma; validate for array holes after any content edit (holes become null steps after the deep clone and crash tidyLesson).

## Architecture (read before editing)

- Single-file no-build app: `index.html` (React 18 UMD + Babel standalone + mathjs, all from cdn.jsdelivr.net/npm only). `content.js` sets `window.PREXIS_CONTENT` with the curated curriculum.
- No frameworks, no bundler, no package.json. Keep it that way.
- API keys live only in the visitor's browser and are sent only to the chosen AI provider. Never include keys in exported backups or anywhere else.

## Workflow

- All work lands on `main` through PRs (non-draft). Vercel auto-deploys `main`.
- Before pushing: compile-check the JSX (Babel preset-react, classic runtime), validate `content.js` (code/output steps must actually run), and run a headless Chromium pass with zero console errors.
