# Prexis

**Learn anything. By doing it.** An adaptive, interactive teaching tool: short Brilliant-style lessons where you answer, build, and drag, wrapped in a learning engine that adapts to how you answer and a style system that adapts to how you like to read.

## Run it

Open `index.html` in any modern browser (keep `content.js` beside it). No build step, no server. React, Babel and mathjs load from jsDelivr; everything else ships with the app.

## Built-in curriculum (no key, no account)

Like Brilliant, the core content is authored, not generated. `content.js` carries **67 curated lessons across 9 subjects**, all fully offline:

- **JavaScript, by hand** (9): variables, arrays, debugging, async, objects, small programs, then closures, reduce, and immutability (with real in-browser code grading)
- **Web pages from scratch** (9): HTML structure, links & images, CSS selectors, the box model, flexbox, responsive design, then CSS Grid, design tokens, and accessibility
- **Websites that work** (8): visual hierarchy, type & color, copywriting, going live, maintenance, then conversion, mini design systems, and performance
- **Found on Google** (8): how search works, keywords, on-page SEO, backlinks, measuring, then content clusters, technical SEO, and local search
- **Numbers you can use** (8): percentages, ratios, compound growth, probability, averages, then expected value, spread, and real-vs-nominal money math (with interactive graphs)
- **Clear thinking** (7): fallacies, correlation vs causation, Fermi estimation, base rates, then cognitive biases, incentives, and Bayesian updating
- **Money that behaves** (6): pay-yourself-first budgeting, emergency funds, debt strategy, index investing, big purchases, insurance & tax brackets
- **Spreadsheet thinking** (6): cells & formulas, absolute/relative references, core functions, IF/COUNTIF/SUMIF, clean tables, pivot thinking
- **Writing that works** (6): cutting fog, paragraph craft, emails people answer, BLUF structure, writing for skimmers, revising like an editor

Lessons teach before they test: a concept, then a worked example you reveal step by step, then the questions. Every question is answerable from what came above it. Typing a topic checks the library first: "website design" or "flexbox" opens the curated lesson instantly; the AI only gets called for subjects the library doesn't cover. MCQ options are shuffled at launch so answers have no home position.

## The intelligence

- **Mastery model**: every graded step feeds a per-subject accuracy score (exponential moving average). Mastery bars appear on the home screen, and each subject's recommended difficulty is applied automatically the next time you study it. Tap any subject for a detail screen: your score history graphed over time (with the intermediate/advanced thresholds marked), session count, what's still in review, and a one-tap practice launcher.
- **Smart review (spaced repetition)**: anything you get wrong becomes a review card scheduled SM-2 style: each card carries an ease factor that grows when you answer cleanly, shrinks when you need hints (counted as "hard"), and drops hard on a miss. Sessions prioritize your most-lapsed and most-overdue cards, interleave topics so no two of the same subject sit adjacent, and **re-teach before re-testing**: a card you've missed twice gets its lesson's concept and worked example replayed before the question. With an AI key, due questions are rewritten as fresh variants testing the same idea (different numbers, names, code). Each variant is mechanically verified before use, so you prove the skill, not the memorized answer. Cards graduate once their interval passes a month.
- **Adaptive AI lessons**: add an API key in the Studio tab and the AI writes lessons live on any subject you type ("website design", "SEO basics", "Excel formulas"…). Two engines are supported: **Claude (Anthropic)**, the default, using `claude-opus-5` with `claude-sonnet-5` and `claude-haiku-4-5` as options, and **Grok (xAI)**. Your mastery score and your recent misses are fed into every prompt, so new lessons reteach weak spots from a fresh angle. Generated code steps are executed against their own tests before shipping, and quiz answers are independently re-solved for verification. Keys stay in your browser; each visitor uses their own.
- **Hint ladder**: every graded step offers hints at an XP cost: MCQs eliminate a wrong option, code tasks reveal the solution line by line, ordering tasks place the next item, output/numeric tasks narrow the target.
- **AI tutor**: after a wrong answer, "Why did I miss this?" asks Grok to name the specific misconception in two sentences.
- **Interactive exploration**: explore steps plot the live function curve as you drag, Brilliant-style.

## Your style

The **Style** tab (and first-run setup) reshapes the whole app:

- Four complete looks: **Notebook** (ruled paper), **Chalkboard** (dark board), **Terminal** (phosphor on black), **Gallery** (clean white, indigo)
- Text size, page width (focus / wide), serif or sans headings
- Daily XP goal with streaks and a today counter, miss a day and you can spend 50 XP to repair the streak
- Sound and vibration feedback on answers (tiny synth, no audio files), each with its own toggle

All progress, preferences, mastery and the review deck persist locally (host key-value storage when available, `localStorage` otherwise). No account, no server. **Sharing a device?** The Style tab has profiles, and each keeps its own XP, streaks, courses and review deck, and switching is instant.

## Step types

`concept` · `worked` (a problem solved with you, one revealed step at a time, so you learn the method before being tested on it) · `mcq` · `numeric` · `order` · `output` (predict what code prints, and it actually runs) · `code` (write a function, graded by real tests) · `explore` (drag a variable, watch the curve)

All 67 curated lessons and 9 courses work fully offline with no API key.
