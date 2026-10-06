/* Drawing checks for the Drafting track, in Node (no browser, no build).
 *
 *   node tests/drafting-checks.js
 *
 * tests/fixtures holds real .sdraft files saved from Sovereign Draft after
 * doing each lesson the right way (Lx-good) and a typical wrong way
 * (Lx-bad). They were made by driving the app with typed commands, chips
 * and panels, the way the lesson's how-to describes. */
const fs = require("fs");
const path = require("path");
global.window = {};
require("../content.js");
require("../content_extra.js");
const D = require("../drafting.js");

let fails = 0;
const ok = (cond, msg) => { console.log((cond ? "ok   " : "FAIL ") + msg); if (!cond) fails++; };
const course = window.PREXIS_CONTENT.courses.find((c) => c.id === "drafting");
const lessons = [].concat(...course.units.map((u) => u.lessons));
const draftOf = (L) => L.steps.find((s) => s.type === "draft");
const KINDS = ["count", "rect", "scale", "sheet", "field", "solid", "views", "confirm", "dimLen", "chain", "dimsOutside", "footprint", "schedule", "areaNote", "solidNames", "dormer", "sheet3", "sheetsUnique", "views3d", "cut", "coverIndex", "titleBlock"];
const ONLY = process.argv[2] ? process.argv[2].split(",") : null;

(async () => {
  ok(course.track === "drafting" && lessons.length === 12 && course.units.length === 3, "Drafting from scratch has 12 lessons in 3 units on the drafting track");
  ok(!(course.soon || []).length, "no lesson is left as coming soon");

  for (const [i, L] of lessons.entries()) {
    const n = "L" + (i + 1);
    if (ONLY && ONLY.indexOf(n) < 0) continue;
    const st = draftOf(L);
    ok(!!st && L.steps[L.steps.length - 1] === st, n + " ends with a draft step");
    const stamp = st.starter.layers.find((x) => x.name === st.stamp);
    ok(!!stamp && stamp.plot === false, n + " starter carries the non plotting " + st.stamp + " layer");
    ok(st.starter.entities.every((e, k) => e.id === k + 1) && st.starter.idSeq === st.starter.entities.length + 1, n + " starter numbers its entities");
    ok(st.checks.every((c) => KINDS.some((k) => c[k] !== undefined) && c.label && c.hint), n + " checks are known kinds with labels and hints");
    ok(!JSON.stringify(L).match(/[\u2013\u2014]/), n + " has no en or em dashes");

    const starterRes = D.runChecks(st.starter, st);
    ok(starterRes[0].pass && !starterRes.every((r) => r.pass), n + " the untouched starter does not pass");

    const url = await D.starterUrl(st.starter, "https://sovereign-draft-one.vercel.app/");
    const back = await D.readSubmission(url);
    ok(back.via === "link" && JSON.stringify(back.drawing) === JSON.stringify(st.starter), n + " starter survives a share link round trip");

    const good = await D.readSubmission(fs.readFileSync(path.join(__dirname, "fixtures", n + "-good.sdraft"), "utf8"));
    const selfAll = {}; st.checks.forEach((c) => { if (c.confirm) selfAll[c.label] = true; });
    const g = D.runChecks(good.drawing, st, selfAll);
    ok(g.every((r) => r.pass), n + " real Sovereign Draft drawing done right passes (" + g.filter((r) => !r.pass).map((r) => r.label + ": " + r.why).join("; ") + ")");

    const bad = await D.readSubmission(fs.readFileSync(path.join(__dirname, "fixtures", n + "-bad.sdraft"), "utf8"));
    const b = D.runChecks(bad.drawing, st);
    const failed = b.filter((r) => !r.pass);
    ok(failed.length > 0 && failed.every((r) => r.why && r.hint), n + " real drawing done wrong fails, each failure says why and what to try (" + failed.length + " failed)");

    const other = draftOf(lessons[(i + 1) % lessons.length]);
    const wrongLesson = D.runChecks(good.drawing, other);
    ok(wrongLesson.length === 1 && !wrongLesson[0].pass, n + " drawing handed to another lesson stops at the stamp check");
  }

  // reader: friendly errors
  const msg = async (t) => { try { await D.readSubmission(t); return ""; } catch (e) { return e.message; } };
  ok(/Nothing to read/.test(await msg("   ")), "empty input asks for a file or link");
  ok(/no drawing in it/.test(await msg("https://sovereign-draft-one.vercel.app/")), "a link without #sd= is explained");
  ok(/cut off or damaged/.test(await msg("https://x/#sd=H4sIAAAAAAAAA_broken")), "a truncated link is explained");
  ok(/not a Sovereign Draft drawing/.test(await msg("hello")), "plain text is explained");
  ok(/no layers or entities/.test(await msg('{"a":1}')), "JSON that is not a drawing is explained");
  ok(/over 2 MB/.test(await msg("x".repeat(2000001))), "huge input is refused");

  // preview escapes text and hides the stamp
  const svg = D.previewSVG({ layers: [{ name: "T" }, { name: "PREXIS-L01", plot: false }], entities: [
    { type: "line", layer: "T", x1: 0, y1: 0, x2: 4, y2: 0 },
    { type: "text", layer: "T", x: 0, y: 1, size: 0.5, content: "<script>alert(1)</script>" },
    { type: "text", layer: "PREXIS-L01", x: 0, y: 2, size: 0.5, content: "SECRET STAMP" }] }, "PREXIS-L01");
  ok(svg.indexOf("<script>") < 0 && svg.indexOf("&lt;script&gt;") >= 0, "preview escapes drawing text");
  ok(svg.indexOf("SECRET STAMP") < 0, "preview hides the stamp layer");

  const c = D.compact({ layers: [], entities: [{ type: "image", src: "data:image/png;base64,AAAA", x: 0 }] });
  ok(!c.entities[0].src && c.entities[0].srcOmitted, "compact drops placed image data");
  ok(D.fmtFt(3.0417) === "3'-0 1/2\"" && D.fmtFt(12) === "12'-0\"", "feet and inches format");

  console.log(fails ? "\n" + fails + " check(s) failed" : "\nall drafting checks pass");
  process.exit(fails ? 1 : 0);
})();
