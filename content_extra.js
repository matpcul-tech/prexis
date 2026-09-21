/* Prexis extra curriculum. Merges into PREXIS_CONTENT. */
window.PREXIS_EXTRA = {"courses": [], "quickPicks": [], "overlay": {"core-js": {"track": "code", "blurb": "Bindings, lists, errors, async, objects, closures, reduce, copies."}, "web-pages": {"track": "web", "blurb": "HTML, CSS, box model, flex, grid, accessibility."}, "site-design": {"track": "web", "prereq": "web-pages", "blurb": "Hierarchy, type, copy, hosting."}, "seo": {"track": "web", "prereq": "site-design", "blurb": "Crawlers, titles, intent."}, "math": {"track": "quant", "blurb": "Percents, rates, probability."}, "thinking": {"track": "thinking", "blurb": "Arguments, correlation, estimation, bias."}, "money": {"track": "money", "blurb": "Pay yourself first, debt, investing."}, "sheets": {"track": "quant", "blurb": "Cells, references, functions, pivots."}, "writing": {"track": "writing", "blurb": "Fog, paragraphs, emails, revision."}}};

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
