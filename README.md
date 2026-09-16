# Prexis

**Learn anything. By doing it.** An adaptive, interactive teaching tool — short Brilliant-style lessons where you answer, build, and drag, wrapped in a learning engine that adapts to how you answer and a style system that adapts to how you like to read.

## Run it

Open `index.html` in any modern browser (keep `content.js` beside it). No build step, no server. React, Babel and mathjs load from jsDelivr; everything else ships with the app.

## Built-in curriculum (no key, no account)

Like Brilliant, the core content is authored, not generated: `content.js` carries 31 curated lessons across 6 subjects, all fully offline —

- **JavaScript, by hand** — variables, arrays, debugging, async, objects, small programs (with real in-browser code grading)
- **Web pages from scratch** — HTML structure, links & images, CSS selectors, the box model, flexbox, responsive design
- **Websites that work** — visual hierarchy, type & color, copywriting, domains/hosting/going live, site maintenance
- **Found on Google** — how search works, keywords, on-page SEO, backlinks, measuring
- **Numbers you can use** — percentages, ratios, compound growth, probability, averages (with interactive graphs)
- **Clear thinking** — logical fallacies, correlation vs causation, Fermi estimation, base rates & risk

Lessons teach before they test: a concept, then a worked example you reveal step by step, then the questions — every question answerable from what came above it. Typing a topic checks the library first: "website design" or "flexbox" opens the curated lesson instantly; the AI only gets called for subjects the library doesn't cover. MCQ options are shuffled at launch so answers have no home position.

## The intelligence

- **Mastery model** — every graded step feeds a per-subject accuracy score (exponential moving average). Mastery bars appear on the home screen, and each subject's recommended difficulty is applied automatically the next time you study it.
- **Smart review (spaced repetition)** — anything you get wrong becomes a review card. Cards come due on an expanding schedule (1 → 3 → 7 → 18 days); miss one and it resets to tomorrow. A "Smart Review" session assembles due cards into a lesson, and cards that survive three weeks graduate out.
- **Adaptive AI lessons** — add an API key in the Studio tab and the AI writes lessons live on any subject you type ("website design", "SEO basics", "Excel formulas"…). Two engines are supported: **Claude (Anthropic)** — the default, using `claude-opus-5` with `claude-sonnet-5` and `claude-haiku-4-5` as options — and **Grok (xAI)**. Your mastery score and your recent misses are fed into every prompt, so new lessons reteach weak spots from a fresh angle. Generated code steps are executed against their own tests before shipping, and quiz answers are independently re-solved for verification. Keys stay in your browser; each visitor uses their own.
- **Hint ladder** — every graded step offers hints at an XP cost: MCQs eliminate a wrong option, code tasks reveal the solution line by line, ordering tasks place the next item, output/numeric tasks narrow the target.
- **AI tutor** — after a wrong answer, "Why did I miss this?" asks Grok to name the specific misconception in two sentences.
- **Interactive exploration** — explore steps plot the live function curve as you drag, Brilliant-style.

## Your style

The **Style** tab (and first-run setup) reshapes the whole app:

- Four complete looks: **Notebook** (ruled paper), **Chalkboard** (dark board), **Terminal** (phosphor on black), **Gallery** (clean white, indigo)
- Text size, page width (focus / wide), serif or sans headings
- Daily XP goal with streaks and a today counter

All progress, preferences, mastery and the review deck persist locally (host key-value storage when available, `localStorage` otherwise). No account, no server.

## Step types

`concept` · `worked` (a problem solved with you, one revealed step at a time — you learn the method before being tested on it) · `mcq` · `numeric` · `order` · `output` (predict what code prints — it actually runs) · `code` (write a function, graded by real tests) · `explore` (drag a variable, watch the curve)

All 31 curated lessons and 6 courses work fully offline with no API key.
