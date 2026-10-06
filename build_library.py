#!/usr/bin/env python3
"""Build content_extra.js. Full course sources live in extra_*.py when present."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
courses = []
try:
    from extra_algo import add as add_algo
    from extra_math import add as add_math
    from extra_data import add as add_data
    from extra_http import add as add_http
    from extra_debug import add as add_debug
    from extra_logic import add as add_logic
    from extra_deepen import add as add_deepen
    from build_helpers import *  # optional
except Exception:
    pass

picks = []
# Web track ladder (Intermediate, Advanced, Expert). Imported on its own so
# a missing optional extra_* file above can never drop these courses.
from extra_web import add as add_web
add_web(courses, picks)

# Subject ladders (Intermediate, Advanced, Expert) for the other Beginner
# courses. Each module adds three courses gated on the one before.
import importlib
for mod in ["extra_js", "extra_design", "extra_seo", "extra_writing", "extra_math", "extra_sheets", "extra_money", "extra_thinking", "extra_drafting"]:
    importlib.import_module(mod).add(courses, picks)

overlay = {
    "core-js": {"track": "code", "blurb": "Bindings, lists, errors, async, objects, closures, reduce, copies."},
    "web-pages": {"track": "web", "blurb": "HTML, CSS, box model, flex, grid, accessibility."},
    "site-design": {"track": "web", "prereq": "web-pages", "blurb": "Hierarchy, type, copy, hosting."},
    "seo": {"track": "web", "prereq": "site-design", "blurb": "Crawlers, titles, intent."},
    "math": {"track": "quant", "blurb": "Percents, rates, probability."},
    "thinking": {"track": "thinking", "blurb": "Arguments, correlation, estimation, bias."},
    "money": {"track": "money", "blurb": "Pay yourself first, debt, investing."},
    "sheets": {"track": "quant", "blurb": "Cells, references, functions, pivots."},
    "writing": {"track": "writing", "blurb": "Fog, paragraphs, emails, revision."},
}

out = root / "content_extra.js"
payload = {"courses": courses, "quickPicks": picks, "overlay": overlay}
out.write_text(
    "/* Prexis extra curriculum. Merges into PREXIS_CONTENT. */\n"
    + "window.PREXIS_EXTRA = "
    + json.dumps(payload, ensure_ascii=False)
    + ";\n"
    + """
(function () {
  const extra = window.PREXIS_EXTRA;
  const root = window.PREXIS_CONTENT;
  if (!root || !extra) return;
  const overlay = extra.overlay || {};
  (root.courses || []).forEach((c) => {
    const o = overlay[c.id];
    if (!o) return;
    if (o.track) c.track = o.track;
    if (o.prereq) c.prereq = o.prereq;
    if (o.blurb) c.blurb = o.blurb;
  });
  root.courses = (root.courses || []).concat(extra.courses || []);
  root.quickPicks = (root.quickPicks || []).concat(extra.quickPicks || []);
})();
"""
)
print("wrote", out, "courses", len(courses))
