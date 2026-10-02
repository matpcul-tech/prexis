# Prexis

**Learn anything. By doing it.** An adaptive, interactive teaching tool: short Brilliant-style lessons where you answer, build, and drag, wrapped in a learning engine that adapts to how you answer and a style system that adapts to how you like to read.

Repo: https://github.com/matpcul-tech/prexis

## Run it

Serve the folder and open it in a browser (the player loads `app.jsx` at runtime, so plain `file://` will not work):

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/. No build step, no account. React, Babel and mathjs load from jsDelivr; everything else ships with the app.

## Files

- `index.html`: the shell (styles, CDN scripts, mount point)
- `app.jsx`: the player, compiled in the browser by Babel standalone
- `content.js`: the original curated curriculum (67 lessons, 9 courses)
- `content_extra.js`: extra tracks (including the web ladder from `extra_web.py`) and course metadata (track, prereq, unlock, blurb), merged into the curriculum at load
- `build_library.py` + `extra_*.py`: rebuild `content_extra.js` from source
- `app.patch`, `bootstrap.sh`, `AGENTS.md`: the agent authoring pipeline. `bootstrap.sh` regenerates `app.jsx` from git history plus `app.patch`; you only need it when changing the player through the patch.

## Built-in curriculum (no key, no account)

The core content is authored, not generated. The library is sequenced: beginner courses carry a track (code, web, numbers, thinking, writing, money), and intermediate courses declare prereqs. Today the library ships **67 curated lessons across 9 subjects**, all fully offline:

- **JavaScript, by hand** (9): variables, arrays, debugging, async, objects, small programs, then closures, reduce, and immutability (with real in-browser code grading)
- **Web pages from scratch** (9): HTML structure, links & images, CSS selectors, the box model, flexbox, responsive design, then CSS Grid, design tokens, and accessibility
- **Websites that work** (8): visual hierarchy, type & color, copywriting, going live, maintenance, then conversion, mini design systems, and performance
- **Found on Google** (8): how search works, keywords, on-page SEO, backlinks, measuring, then content clusters, technical SEO, and local search
- **Numbers you can use** (8): percentages, ratios, compound growth, probability, averages, then expected value, spread, and real-vs-nominal money math (with interactive graphs)
- **Clear thinking** (7): fallacies, correlation vs causation, Fermi estimation, base rates, then cognitive biases, incentives, and Bayesian updating
- **Money that behaves** (6): pay-yourself-first budgeting, emergency funds, debt strategy, index investing, big purchases, insurance & tax brackets
- **Spreadsheet thinking** (6): cells & formulas, absolute/relative references, core functions, IF/COUNTIF/SUMIF, clean tables, pivot thinking
- **Writing that works** (6): cutting fog, paragraph craft, emails people answer, BLUF structure, writing for skimmers, revising like an editor

### The web ladder (build as you go)

After **Web pages from scratch** (Beginner), the web track keeps going on the same Workshop site, nine lessons per level:

- **Websites you run** (Intermediate, 9): put your site online, multi page navigation, forms, SEO and sharing, the cascade, motion, images, a little JavaScript, Git and GitHub
- **Web apps with real tools** (Advanced, 9): modern CSS architecture, modules, fetching data, npm and Vite, deploy from Git, custom domain and HTTPS, performance, accessibility deep dive, linting and CI
- **Shipping real web apps** (Expert, 9): TypeScript, a component framework, routing, your own API, databases and sign in, security, testing, running in production, working like a pro

Each level unlocks when you finish the course before it, or reach the mastery line in that subject (55% for Intermediate, 85% for Advanced and Expert). The last lesson of each level ends with a capstone build. Work done outside Prexis (deploys, Git, DNS, config files) is checked with a self check and a pasted link. Self checks are marked as such, and pasted links are checked for the right kind of address (a live site, a GitHub repo, a CI run, a custom domain), not visited. Lessons that need an outside account, an install or money open with a short "what you need" card. The Workshop's **Export my site** button downloads your page as one index.html ready for GitHub Pages, Netlify or Vercel, and warns before you export if your Content-Security-Policy would block your own styles, scripts or images, or if the page asks for files the export cannot include.

### Ladders for every subject

Every Beginner subject now climbs to Intermediate, Advanced and Expert, nine lessons per level in three units, each level ending with a capstone. Gating matches the web ladder: finish the level before, or reach its mastery line (55% for Intermediate, 85% above). The level filters on the home screen and the level you pick for a quick lesson both follow the ladder, so a topic asked at Advanced opens the Advanced course of the same subject (or explains what unlocks it).

- **JavaScript, by hand** continues with **JavaScript that holds up** (Intermediate), **JavaScript under the hood** (Advanced) and **JavaScript engineering** (Expert). Code steps are graded by real tests.
- **Websites that work** continues with **Websites people use**, **Design with evidence** and **Design systems and strategy**. Build steps measure the rendered page, including text contrast, sizes and spacing; research and strategy work uses write steps.
- **Found on Google** continues with **SEO you can ship**, **Technical SEO in depth** and **Search strategy at scale**. Build steps add real head tags, headings, links, images, hreflang and JSON-LD to the Workshop site (JSON-LD is parsed and checked for its type and keys); robots files, sitemaps, redirect maps and strategy memos are write steps.
- **Writing that works** continues with **Writing people act on**, **Writing that persuades** and **Writing with authority**. Every lesson has write steps: rewrite a draft or write from a brief, checked for length, sentence length, required and banned phrases, with a model answer.

Lessons teach before they test: a concept, then a worked example you reveal step by step, then the questions. Typing a topic checks the library first, preferring lessons at your level; Studio AI is optional and secondary.

## The intelligence

- **Questions that never repeat**: more than 150 curated questions carry generators or variant pools. A question like "What is 15% of 80?" carries named number ranges and a formula, and it re-rolls with fresh numbers every time it appears. Every generator is machine-checked against its original.
- **Practice mode**: every course and mastery screen has a Practice button that assembles a fresh set of eight graded questions for that subject, weighted toward your weak lessons, with your open review misses leading the set.
- **Fresh variants on replay**: replaying a passed lesson with an AI key rewrites its fixed questions as verified variants. Parameterized questions re-roll on replay even without a key.
- **Mastery model**: every graded step feeds a per-subject accuracy score. Mastery bars appear on the home screen; tap any subject for its history graph, session count, and a practice launcher.
- **Smart review (spaced repetition)**: misses become SM-2 style cards with ease factors, most-lapsed first, topics interleaved, re-teach before re-test on repeat misses. Cards graduate past a month.
- **Adaptive AI lessons (optional)**: add an API key in Studio and the AI writes lessons on any subject the library does not cover. Claude (Anthropic) is the default engine, Grok (xAI) the alternative. Generated code steps are executed against their own tests before shipping. Keys stay in your browser.
- **Hint ladder**: every graded step offers hints at an XP cost.
- **Interactive exploration**: explore steps plot the live function curve as you drag.

## Build while you learn

The **Web pages from scratch** course is a build-along: every lesson ends with a build step that adds to **My Site**, a real page with real HTML and CSS that you keep. A live preview renders as you type (resizable, with a full screen editor and a phone width toggle), and each build step is graded by measuring your rendered page, not by matching strings. The preview never runs scripts: they are removed before rendering, and image files the Workshop cannot hold show a labeled placeholder. The **Workshop** button on the course screen opens the same page for free editing any time.

## Your style

The **Style** tab (and first-run setup) reshapes the whole app: four complete looks (Notebook, Chalkboard, Terminal, Gallery), text size, page width, serif or sans headings, a daily XP goal with streaks and streak repair, and sound/vibration toggles.

All progress, preferences, mastery and the review deck persist locally. Sharing a device? The Style tab has profiles, and each keeps its own XP, streaks, courses and review deck.

## Step types

`concept` · `worked` · `mcq` · `numeric` · `order` · `output` (predict what code prints, and it actually runs) · `code` (write a function, graded by real tests) · `explore` (drag a variable, watch the curve) · `build` (grow My Site, graded from the rendered page, including measured contrast, sizes and element counts) · `write` (free text practice checked for length, sentence length, required and banned phrases, a real rewrite of the draft, and self checks, with a model answer)

## Agents

`AGENTS.md` documents the authoring pipeline for coding agents. New lessons use existing step types only, JS output/code steps must run in the sandbox, and authored lessons are never replaced with generated filler.
