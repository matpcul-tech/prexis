/* Prexis drafting: the bridge to Sovereign Draft and the checks that grade
   a learner's drawing. Plain JavaScript, no dependencies, no build.

   window.PREXIS_DRAFT:
   - starterUrl(project): a Sovereign Draft link that opens the lesson's
     starter drawing (gzip + base64url in the #sd= hash, the same format the
     editor's Copy share link writes).
   - readSubmission(text): a pasted share link, a raw token, or the text of a
     .sdraft / .json file, turned into a drawing object. Throws an Error whose
     message is safe to show the learner.
   - runChecks(drawing, step): every check computed from the drawing data.
     Nothing is guessed: a check passes only when the numbers say so.
   - stats(drawing), previewSVG(drawing), compact(drawing).

   The drawing is data from outside Prexis. It is parsed with JSON.parse,
   never evaluated, and the preview escapes every string it prints. */
(function (root) {
  "use strict";

  var SD_URL = "https://sovereign-draft-one.vercel.app/";
  var MAX_CHARS = 2000000;
  var SKIP_LAYERS = ["NOTES", "TEXT", "DIMS", "DEFPOINTS", "UNDERLAY", "SCHEDULES", "ROOMS", "GRID"];

  /* ---------- share link codec ---------- */

  function toU8(text) { return new TextEncoder().encode(String(text)); }
  function fromU8(u8) { return new TextDecoder().decode(u8); }

  function b64urlEncode(u8) {
    var s = "";
    for (var i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function b64urlDecode(token) {
    var t = String(token || "").replace(/-/g, "+").replace(/_/g, "/");
    var pad = t.length % 4 === 0 ? "" : "====".slice(t.length % 4);
    var bin = atob(t + pad);
    var u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }

  /* Read while writing: awaiting write() and close() before draining the
     readable side deadlocks (the bug fixed in Sovereign Draft's share.js). */
  async function through(stream, u8) {
    var w = stream.writable.getWriter();
    var fed = Promise.all([w.write(u8), w.close()]);
    fed.catch(function () {});
    var out = await new Response(stream.readable).arrayBuffer();
    await fed;
    return new Uint8Array(out);
  }

  async function encodeShare(text) {
    return b64urlEncode(await through(new CompressionStream("gzip"), toU8(text)));
  }

  async function decodeShare(token) {
    return fromU8(await through(new DecompressionStream("gzip"), b64urlDecode(token)));
  }

  async function starterUrl(project, base) {
    return (base || SD_URL) + "#sd=" + (await encodeShare(JSON.stringify(project)));
  }

  /* A share link, a bare hash, or a raw token. Gzip always starts H4sI. */
  function tokenFrom(text) {
    var s = String(text || "").trim();
    var m = s.match(/(?:^|[#&?])sd=([A-Za-z0-9_\-%]+)/);
    if (m) return decodeURIComponent(m[1]);
    if (/^H4sI[A-Za-z0-9_-]+$/.test(s)) return s;
    return "";
  }

  function validDrawing(o) {
    return !!o && typeof o === "object" && Array.isArray(o.entities) && Array.isArray(o.layers);
  }

  async function readSubmission(text) {
    var s = String(text == null ? "" : text);
    if (!s.trim()) throw new Error("Nothing to read yet. Drop your .sdraft file here, or paste a share link.");
    if (s.length > MAX_CHARS) throw new Error("That file is over 2 MB, too big to keep in Prexis. Remove placed images in Sovereign Draft and save a copy again.");
    var token = tokenFrom(s);
    var via = "file";
    var json = s;
    if (token) {
      via = "link";
      try { json = await decodeShare(token); }
      catch (e) { throw new Error("That share link is cut off or damaged. Copy it again from Sovereign Draft (Menu, Copy share link) and paste the whole thing."); }
    } else if (/^\s*https?:\/\//i.test(s)) {
      throw new Error("That link has no drawing in it. A Sovereign Draft share link ends in #sd= followed by a long code.");
    }
    var o;
    try { o = JSON.parse(json); }
    catch (e) { throw new Error("That is not a Sovereign Draft drawing. Use Menu, Save a copy (.sdraft) in Sovereign Draft, then drop that file here."); }
    if (!validDrawing(o)) throw new Error("That file is JSON but not a Sovereign Draft drawing (it has no layers or entities).");
    return { drawing: o, via: via };
  }

  /* What Prexis keeps: the drawing as Sovereign Draft saved it, minus
     placed raster images (they can be megabytes and no check reads them). */
  function compact(o) {
    var c = {};
    Object.keys(o).forEach(function (k) { c[k] = o[k]; });
    c.entities = (o.entities || []).map(function (e) {
      if (e && e.type === "image" && e.src) { var x = {}; Object.keys(e).forEach(function (k) { if (k !== "src") x[k] = e[k]; }); x.srcOmitted = true; return x; }
      return e;
    });
    return c;
  }

  /* ---------- geometry ---------- */

  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }

  function fmtFt(v) {
    var neg = v < 0;
    var x = Math.abs(v);
    var ft = Math.floor(x + 1e-9);
    var inch = Math.round((x - ft) * 12 * 2) / 2;
    if (inch >= 12) { ft += 1; inch -= 12; }
    var ins = Math.floor(inch) + (inch % 1 ? " 1/2" : "");
    return (neg ? "-" : "") + ft + "'-" + ins + '"';
  }

  function arcPts(cx, cy, r, a1, a2) {
    var s = a1 * Math.PI / 180, e = a2 * Math.PI / 180;
    while (e <= s) e += Math.PI * 2;
    var n = Math.max(6, Math.ceil((e - s) / (Math.PI / 18)));
    var out = [];
    for (var i = 0; i <= n; i++) { var a = s + (e - s) * i / n; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return out;
  }

  /* Points that outline an entity, for bounds and the preview. */
  function ptsOf(e) {
    if (!e) return [];
    switch (e.type) {
      case "line": case "xline": case "dim": case "cutplane": return [[num(e.x1), num(e.y1)], [num(e.x2), num(e.y2)]];
      case "poly": case "hatch": case "profile": case "cloud": case "leader": case "room": case "centerline":
        return (e.pts || []).map(function (p) { return [num(p[0]), num(p[1])]; });
      case "circle": return [[num(e.cx) - num(e.r), num(e.cy) - num(e.r)], [num(e.cx) + num(e.r), num(e.cy) + num(e.r)]];
      case "arc": return arcPts(num(e.cx), num(e.cy), num(e.r), num(e.a1), num(e.a2));
      case "ellipse": return [[num(e.cx) - num(e.rx), num(e.cy) - num(e.ry)], [num(e.cx) + num(e.rx), num(e.cy) + num(e.ry)]];
      case "text": case "mtext": case "insert": case "table": return [[num(e.x), num(e.y)]];
      default: return [];
    }
  }

  function bboxOf(list) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    list.forEach(function (e) {
      ptsOf(e).forEach(function (p) {
        if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1];
        if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1];
      });
    });
    return b;
  }

  function lengthOf(e) {
    if (e.type === "line") return Math.hypot(num(e.x2) - num(e.x1), num(e.y2) - num(e.y1));
    var p = ptsOf(e), L = 0;
    for (var i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    return L;
  }

  function ltOf(e) { return String((e && e.lt) || "CONTINUOUS").toUpperCase(); }
  /* 0 means "default", which Sovereign Draft plots at 0.25 mm. */
  function lwOf(e) { var w = Number(e && e.lw); return w > 0 ? w : 0.25; }
  function textOf(e) { return String((e && (e.content != null ? e.content : e.text)) || ""); }

  function matches(e, f, stamp) {
    if (!e) return false;
    if (stamp && e.layer === stamp) return false;
    f = f || {};
    if (f.type) { var ts = [].concat(f.type); if (ts.indexOf(e.type) < 0) return false; }
    if (f.layer) { var ls = [].concat(f.layer).map(function (x) { return String(x).toUpperCase(); }); if (ls.indexOf(String(e.layer || "0").toUpperCase()) < 0) return false; }
    if (f.lt) { var lts = [].concat(f.lt); if (lts.indexOf(ltOf(e)) < 0) return false; }
    if (f.minLw != null && lwOf(e) < f.minLw - 1e-9) return false;
    if (f.maxLw != null && lwOf(e) > f.maxLw + 1e-9) return false;
    if (f.minLength != null && lengthOf(e) < f.minLength - 1e-6) return false;
    if (f.r) { var r = num(e.r); if (r < f.r[0] - 1e-6 || r > f.r[1] + 1e-6) return false; }
    if (f.inBox) {
      var b = bboxOf([e]), q = f.inBox;
      if (!(b[0] >= q[0] - 1e-6 && b[1] >= q[1] - 1e-6 && b[2] <= q[2] + 1e-6 && b[3] <= q[3] + 1e-6)) return false;
    }
    if (f.text) { if (!new RegExp(f.text, "i").test(textOf(e))) return false; }
    if (f.minWords) { if (textOf(e).trim().split(/\s+/).filter(Boolean).length < f.minWords) return false; }
    return true;
  }

  /* Signed volume of a closed triangle mesh (divergence theorem). */
  function meshVolume(s) {
    var v = s.verts || [], V = 0;
    (s.faces || []).forEach(function (f) {
      for (var k = 1; k + 1 < f.length; k++) {
        var a = v[f[0]], b = v[f[k]], c = v[f[k + 1]];
        if (!a || !b || !c) continue;
        V += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
      }
    });
    return Math.abs(V);
  }

  function meshSize(s) {
    var lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    (s.verts || []).forEach(function (p) { for (var i = 0; i < 3; i++) { if (p[i] < lo[i]) lo[i] = p[i]; if (p[i] > hi[i]) hi[i] = p[i]; } });
    return [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]];
  }

  /* A closed rectangle W x H: a closed 4-corner polyline, or four lines
     that meet at the corners of one. Either orientation counts. */
  function findRect(ents, w, h, tol, stamp) {
    var near = function (a, b) { return Math.abs(a - b) <= tol; };
    var fits = function (bw, bh) { return (near(bw, w) && near(bh, h)) || (near(bw, h) && near(bh, w)); };
    var found = [];
    ents.forEach(function (e) {
      if (stamp && e.layer === stamp) return;
      if (e.type === "poly" && e.closed !== false && (e.pts || []).length >= 4) {
        var b = bboxOf([e]);
        var pts = (e.pts || []).length;
        if (pts <= 5) found.push({ w: b[2] - b[0], h: b[3] - b[1], ok: fits(b[2] - b[0], b[3] - b[1]) });
      }
    });
    var lines = ents.filter(function (e) { return e.type === "line" && !(stamp && e.layer === stamp); });
    var hz = lines.filter(function (e) { return Math.abs(num(e.y1) - num(e.y2)) < 1e-3; });
    var vt = lines.filter(function (e) { return Math.abs(num(e.x1) - num(e.x2)) < 1e-3; });
    hz.forEach(function (a) {
      hz.forEach(function (b) {
        if (a === b || num(b.y1) <= num(a.y1)) return;
        var ax0 = Math.min(num(a.x1), num(a.x2)), ax1 = Math.max(num(a.x1), num(a.x2));
        var bx0 = Math.min(num(b.x1), num(b.x2)), bx1 = Math.max(num(b.x1), num(b.x2));
        if (!near(ax0, bx0) || !near(ax1, bx1)) return;
        var y0 = num(a.y1), y1 = num(b.y1);
        var side = function (x) {
          return vt.some(function (v) {
            var vy0 = Math.min(num(v.y1), num(v.y2)), vy1 = Math.max(num(v.y1), num(v.y2));
            return near(num(v.x1), x) && near(vy0, y0) && near(vy1, y1);
          });
        };
        if (side(ax0) && side(ax1)) found.push({ w: ax1 - ax0, h: y1 - y0, ok: fits(ax1 - ax0, y1 - y0) });
      });
    });
    return found;
  }

  /* Separate views: entities grouped where their bounds touch or overlap. */
  function viewsOf(ents, stamp, gap) {
    var list = ents.filter(function (e) {
      if (stamp && e.layer === stamp) return false;
      if (["line", "poly", "circle", "arc", "ellipse", "spline"].indexOf(e.type) < 0) return false;
      if (SKIP_LAYERS.indexOf(String(e.layer || "").toUpperCase()) >= 0) return false;
      return ltOf(e) !== "CENTER" && ltOf(e) !== "PHANTOM";
    });
    var boxes = list.map(function (e) { return bboxOf([e]); });
    var parent = list.map(function (_, i) { return i; });
    var find = function (i) { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
    for (var i = 0; i < list.length; i++) for (var j = i + 1; j < list.length; j++) {
      var a = boxes[i], b = boxes[j];
      if (a[0] - gap <= b[2] && b[0] - gap <= a[2] && a[1] - gap <= b[3] && b[1] - gap <= a[3]) parent[find(i)] = find(j);
    }
    var groups = {};
    list.forEach(function (e, k) { var r = find(k); (groups[r] = groups[r] || []).push(e); });
    return Object.keys(groups).map(function (k) {
      var b = bboxOf(groups[k]);
      return { ents: groups[k], x0: b[0], y0: b[1], x1: b[2], y1: b[3], w: b[2] - b[0], h: b[3] - b[1] };
    }).filter(function (v) { return v.w > 0.25 || v.h > 0.25; });
  }

  function size2(v) { return fmtFt(v.w) + " wide x " + fmtFt(v.h) + " tall"; }

  /* Third-angle projection: top view straight above the front view with the
     same left and right edges, right view straight to the right of the
     front view with the same top and bottom edges. */
  function checkViews(o, spec, stamp) {
    var tol = spec.tol || 0.1;
    var near = function (a, b) { return Math.abs(a - b) <= tol; };
    var vs = viewsOf(o.entities || [], stamp, spec.gap || 0.3);
    if (vs.length < 3) return { pass: false, why: "Found " + vs.length + " separate view" + (vs.length === 1 ? "" : "s") + ". Draw three, with clear space between them: front, top above it, right side to its right." };
    var best = null, topPair = null;
    vs.forEach(function (F) {
      vs.forEach(function (T) {
        if (T === F || !(T.y0 > F.y1 - tol) || !near(T.x0, F.x0) || !near(T.x1, F.x1)) return;
        vs.forEach(function (R) {
          if (R === F || R === T || !(R.x0 > F.x1 - tol) || !near(R.y0, F.y0) || !near(R.y1, F.y1)) return;
          if (!best) best = { F: F, T: T, R: R };
        });
        if (!topPair) topPair = { F: F, T: T };
      });
    });
    if (!best) {
      if (!topPair) return { pass: false, why: "No view sits straight above another with matching left and right edges. The top view goes directly above the front view, the same width, its edges lined up with the front view's. Views found: " + vs.map(size2).join("; ") + "." };
      return { pass: false, why: "The top view lines up over the front view, but no view sits straight to the right of the front view with matching top and bottom edges. Project the right side view across from the front view." };
    }
    var F = best.F, T = best.T, R = best.R;
    var want = function (v, wh, name) {
      if (!wh) return null;
      if (near(v.w, wh[0]) && near(v.h, wh[1])) return null;
      return "The " + name + " view is " + size2(v) + "; it should be " + fmtFt(wh[0]) + " wide x " + fmtFt(wh[1]) + " tall.";
    };
    var bad = want(F, spec.front, "front") || want(T, spec.top, "top") || want(R, spec.right, "right side");
    if (bad) return { pass: false, why: bad };
    if (!near(T.h, R.w)) return { pass: false, why: "Depth does not carry over: the top view is " + fmtFt(T.h) + " deep but the right side view is " + fmtFt(R.w) + " wide. Both show the same depth of the block." };
    return { pass: true, why: "Front " + size2(F) + ", top above it, right side beside it. Edges line up." };
  }

  /* ---------- checks ---------- */

  function getField(o, path) {
    return String(path.split(".").reduce(function (a, k) { return a == null ? a : a[k]; }, o) || "").trim();
  }

  function oneCheck(o, c, stamp, self) {
    var ents = o.entities || [];
    var r = { label: c.label, hint: c.hint || "", pass: false, why: "" };
    if (c.confirm) { r.pass = !!self; r.self = true; return r; }
    if (c.count) {
      var n = ents.filter(function (e) { return matches(e, c.count, stamp); }).length;
      var lo = c.min == null ? 1 : c.min, hi = c.max == null ? Infinity : c.max;
      r.pass = n >= lo && n <= hi;
      r.why = r.pass ? "Found " + n + "." : (n < lo ? "Found " + n + ", need " + (hi === lo ? "exactly " : "at least ") + lo + "." : "Found " + n + ", the most allowed is " + hi + ".");
      return r;
    }
    if (c.rect) {
      var tol = c.rect.tol == null ? 0.042 : c.rect.tol;
      var rs = findRect(ents, c.rect.w, c.rect.h, tol, stamp);
      r.pass = rs.some(function (x) { return x.ok; });
      if (r.pass) r.why = "Found a closed " + fmtFt(c.rect.w) + " x " + fmtFt(c.rect.h) + " rectangle.";
      else if (rs.length) r.why = "Closest closed rectangle is " + fmtFt(rs[0].w) + " x " + fmtFt(rs[0].h) + "; it should be " + fmtFt(c.rect.w) + " x " + fmtFt(c.rect.h) + ".";
      else r.why = "No closed rectangle found. Use RECT, or four lines whose ends meet.";
      return r;
    }
    if (c.scale) {
      var hits = [];
      (o.layouts || []).forEach(function (L) {
        if (Math.abs(num(L.ppf) - c.scale) < 0.01) hits.push(L.name);
        (L.viewports || []).forEach(function (v) { if (Math.abs(num(v.ppf) - c.scale) < 0.01 && hits.indexOf(L.name) < 0) hits.push(L.name); });
      });
      r.pass = hits.length > 0;
      var have = (o.layouts || []).map(function (L) { return (L.sheetNumber || L.name || "sheet") + " at " + scaleName(num(L.ppf)); });
      r.why = r.pass ? "Sheet " + hits[0] + " plots at " + scaleName(c.scale) + "." : (have.length ? "Sheets found: " + have.join(", ") + "." : "This drawing has no sheet (layout) yet.");
      return r;
    }
    if (c.sheet) {
      var sz = (o.layouts || []).map(function (L) { return L.sheet; });
      r.pass = sz.indexOf(c.sheet) >= 0;
      r.why = r.pass ? "A sheet is " + sheetName(c.sheet) + "." : (sz.length ? "Sheet size now: " + sz.map(sheetName).join(", ") + "." : "This drawing has no sheet (layout) yet.");
      return r;
    }
    if (c.field) {
      var v = getField(o, c.field);
      var not = (c.notIn || []).map(function (x) { return String(x).toLowerCase(); });
      r.pass = !!v && not.indexOf(v.toLowerCase()) < 0;
      r.why = r.pass ? "Set to \u201c" + v.slice(0, 60) + "\u201d." : (v ? "Still \u201c" + v.slice(0, 60) + "\u201d, change it to your own." : "Still empty.");
      return r;
    }
    if (c.solid) {
      var sol = o.solids || [];
      if (!sol.length) { r.why = "No 3D solid in this drawing yet."; return r; }
      var vt = c.solid.volTol == null ? 0.5 : c.solid.volTol, st = c.solid.sizeTol == null ? 0.05 : c.solid.sizeTol;
      var desc = sol.map(function (s) { var z = meshSize(s); return { s: s, v: meshVolume(s), z: z }; });
      var okSize = function (d) { return !c.solid.size || c.solid.size.every(function (x, i) { return Math.abs(d.z[i] - x) <= st; }); };
      var okVol = function (d) { return c.solid.volume == null || Math.abs(d.v - c.solid.volume) <= vt; };
      var hit = desc.filter(function (d) { return okSize(d) && okVol(d); })[0];
      r.pass = !!hit;
      if (hit) r.why = hit.s.name + ": " + hit.z.map(fmtFt).join(" x ") + ", " + hit.v.toFixed(1) + " cubic feet.";
      else {
        var big = desc.sort(function (a, b) { return b.v - a.v; })[0];
        r.why = "Largest solid is " + big.s.name + ": " + big.z.map(fmtFt).join(" x ") + ", " + big.v.toFixed(1) + " cubic feet" + (c.solid.volume != null ? "; the finished block is about " + c.solid.volume.toFixed(1) + "." : ".") + (sol.length > 1 ? " " + sol.length + " solids in the drawing; cutters that are still separate solids mean a subtract did not run." : "");
      }
      return r;
    }
    if (c.views) { var cv = checkViews(o, c.views, stamp); r.pass = cv.pass; r.why = cv.why; return r; }
    r.why = "Unknown check.";
    return r;
  }

  function scaleName(ppf) {
    var m = { 864: "1:1", 432: "6\" = 1'-0\"", 72: "1\" = 1'-0\"", 54: "3/4\" = 1'-0\"", 36: "1/2\" = 1'-0\"", 27: "3/8\" = 1'-0\"", 18: "1/4\" = 1'-0\"", 13.5: "3/16\" = 1'-0\"", 9: "1/8\" = 1'-0\"", 6.75: "3/32\" = 1'-0\"", 4.5: "1/16\" = 1'-0\"" };
    return m[ppf] || (ppf ? ppf + " points per foot" : "no scale");
  }

  function sheetName(k) { return { letter: "Letter", tabloid: "Tabloid (11 x 17)", archd: "Arch D (24 x 36)", archdp: "Arch D portrait" }[k] || String(k || "unknown"); }

  /* The stamp layer proves the file came from this lesson's starter. */
  function runChecks(o, step, self) {
    var stamp = step.stamp || "";
    var out = [];
    if (stamp) {
      var has = (o.layers || []).some(function (L) { return L && L.name === stamp; });
      out.push({ label: "This is the drawing from this lesson's starter", pass: has, why: has ? "" : "This drawing has no " + stamp + " layer, so it did not start from this lesson. Press Open the starter, draw in that tab, then save that drawing.", hint: "" });
      if (!has) return out;
    }
    (step.checks || []).forEach(function (c) { out.push(oneCheck(o, c, stamp, self && self[c.label])); });
    return out;
  }

  function stats(o) {
    var ents = o.entities || [];
    return {
      entities: ents.length,
      lines: ents.filter(function (e) { return e.type === "line" || e.type === "poly"; }).length,
      text: ents.filter(function (e) { return e.type === "text" || e.type === "mtext"; }).length,
      sheets: (o.layouts || []).length,
      solids: (o.solids || []).length,
      name: String(o.name || "Untitled")
    };
  }

  /* ---------- preview ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  var DASH = { HIDDEN: "0.25 0.15", DASHED: "0.5 0.25", CENTER: "1.2 0.2 0.25 0.2", PHANTOM: "1.2 0.2 0.15 0.2 0.15 0.2", DOT: "0.05 0.2" };

  function previewSVG(o, stampLayer) {
    var hide = (o.layers || []).filter(function (L) { return L && (L.visible === false || L.plot === false); }).map(function (L) { return L.name; });
    var ents = (o.entities || []).filter(function (e) { return e && hide.indexOf(e.layer) < 0 && e.layer !== stampLayer && ["line", "poly", "circle", "arc", "ellipse", "text", "mtext", "dim", "hatch"].indexOf(e.type) >= 0; });
    var b = bboxOf(ents.filter(function (e) { return e.type !== "text" && e.type !== "mtext"; }));
    if (!isFinite(b[0])) b = bboxOf(ents);
    if (!isFinite(b[0])) return "";
    var pad = Math.max(b[2] - b[0], b[3] - b[1], 1) * 0.08;
    var x0 = b[0] - pad, y0 = b[1] - pad, w = b[2] - b[0] + pad * 2, h = b[3] - b[1] + pad * 2;
    var sw = Math.max(w, h) / 260;
    var Y = function (y) { return (b[3] + pad - y + y0).toFixed(3); };
    var f = function (v) { return Number(v).toFixed(3); };
    var parts = [];
    ents.forEach(function (e) {
      var lt = ltOf(e);
      var dash = DASH[lt] ? ' stroke-dasharray="' + DASH[lt].split(" ").map(function (d) { return f(d * Math.max(w, h) / 40); }).join(" ") + '"' : "";
      var wt = f(sw * (lwOf(e) / 0.25) * (e.type === "dim" ? 0.6 : 1));
      var st = ' stroke="currentColor" stroke-width="' + wt + '" fill="none"' + dash;
      if (e.type === "line" || e.type === "dim") {
        parts.push('<line x1="' + f(e.x1) + '" y1="' + Y(e.y1) + '" x2="' + f(e.x2) + '" y2="' + Y(e.y2) + '"' + st + (e.type === "dim" ? ' opacity="0.6"' : "") + "/>");
      } else if (e.type === "poly" || e.type === "hatch") {
        var pts = (e.pts || []).map(function (p) { return f(p[0]) + "," + Y(p[1]); }).join(" ");
        parts.push("<" + (e.closed === false || e.type === "hatch" ? "polyline" : "polygon") + ' points="' + pts + '"' + st + (e.type === "hatch" ? ' opacity="0.35"' : "") + "/>");
      } else if (e.type === "circle") {
        parts.push('<circle cx="' + f(e.cx) + '" cy="' + Y(e.cy) + '" r="' + f(Math.abs(num(e.r))) + '"' + st + "/>");
      } else if (e.type === "ellipse") {
        parts.push('<ellipse cx="' + f(e.cx) + '" cy="' + Y(e.cy) + '" rx="' + f(Math.abs(num(e.rx))) + '" ry="' + f(Math.abs(num(e.ry))) + '"' + st + "/>");
      } else if (e.type === "arc") {
        parts.push('<polyline points="' + ptsOf(e).map(function (p) { return f(p[0]) + "," + Y(p[1]); }).join(" ") + '"' + st + "/>");
      } else if (e.type === "text" || e.type === "mtext") {
        var size = Math.max(num(e.size) || num(e.h) || 0.5, 0.2);
        var lines = textOf(e).split(/\n|\\P/).slice(0, 6);
        lines.forEach(function (t, i) {
          parts.push('<text x="' + f(e.x) + '" y="' + f(Number(Y(e.y)) + i * size * 1.3) + '" font-size="' + f(size) + '" fill="currentColor" font-family="ui-monospace, monospace">' + esc(t.slice(0, 80)) + "</text>");
        });
      }
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + f(x0) + " " + f(y0) + " " + f(w) + " " + f(h) + '" role="img" aria-label="Preview of ' + esc(String(o.name || "your drawing")) + '">' + parts.join("") + "</svg>";
  }

  var api = {
    SD_URL: SD_URL,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    starterUrl: starterUrl,
    tokenFrom: tokenFrom,
    readSubmission: readSubmission,
    runChecks: runChecks,
    stats: stats,
    compact: compact,
    previewSVG: previewSVG,
    fmtFt: fmtFt,
    scaleName: scaleName,
    meshVolume: meshVolume,
    viewsOf: viewsOf
  };
  root.PREXIS_DRAFT = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
