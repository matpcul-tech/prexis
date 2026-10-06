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
    /* api.SD_URL, so a test or a self-hosted copy can point at its own build */
    return (base || api.SD_URL || SD_URL) + "#sd=" + (await encodeShare(JSON.stringify(project)));
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
    if (f.kind) { var ks = [].concat(f.kind); if (ks.indexOf(e.kind) < 0) return false; }
    if (f.def) { var ds = [].concat(f.def); if (ds.indexOf(e.def) < 0) return false; }
    if (f.th) { var th = num(e.th); if (th < f.th[0] - 1e-6 || th > f.th[1] + 1e-6) return false; }
    if (f.name) { if (!new RegExp(f.name, "i").test(String(e.name || ""))) return false; }
    if (f.nameNot) { if (new RegExp(f.nameNot, "i").test(String(e.name || ""))) return false; }
    if (f.title) { if (!new RegExp(f.title, "i").test(String(e.title || ""))) return false; }
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
      var hitList = ents.filter(function (e) { return matches(e, c.count, stamp); });
      var n = hitList.length;
      /* distinct: count walls, not the face lines a wall is drawn with */
      if (c.distinct) { var seenK = {}; hitList.forEach(function (e) { seenK[String(e[c.distinct] != null ? e[c.distinct] : "#" + e.id)] = 1; }); n = Object.keys(seenK).length; }
      var lo = c.min == null ? 1 : c.min, hi = c.max == null ? Infinity : c.max;
      r.pass = n >= lo && n <= hi;
      var what = "Found " + n + (n === 1 && c.noun1 ? " " + c.noun1 : (c.noun ? " " + c.noun : ""));
      r.why = r.pass ? what + "." : (n < lo ? what + ", need " + (hi === lo ? "exactly " : "at least ") + lo + "." : what + (hi === 0 ? ", and there should be none." : ", the most allowed is " + hi + "."));
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
    var plan = PLAN_CHECKS.filter(function (k) { return c[k] != null; })[0];
    if (plan) { var pr = planCheck[plan](o, c[plan], stamp); r.pass = pr.pass; r.why = pr.why; return r; }
    r.why = "Unknown check.";
    return r;
  }

  /* ---------- plan checks (lessons 5 to 12) ---------- */

  function dimsOf(o, stamp) {
    return (o.entities || []).filter(function (e) { return e.type === "dim" && e.kind !== "angular" && e.kind !== "radius" && e.kind !== "diameter" && !(stamp && e.layer === stamp); });
  }
  function dimLen(d) { return Math.hypot(num(d.x2) - num(d.x1), num(d.y2) - num(d.y1)); }
  /* The dimension line: the measured points pushed out by the offset, the
     same geometry Sovereign Draft draws (normal is the direction turned
     a quarter turn counterclockwise). */
  function dimLine(d) {
    var dx = num(d.x2) - num(d.x1), dy = num(d.y2) - num(d.y1), L = Math.hypot(dx, dy) || 1e-4;
    var nx = -dy / L, ny = dx / L, off = num(d.off);
    return [[num(d.x1) + nx * off, num(d.y1) + ny * off], [num(d.x2) + nx * off, num(d.y2) + ny * off]];
  }
  function wallsOf(o, stamp) {
    return (o.entities || []).filter(function (e) { return e.type === "line" && e.kind === "wall" && !(stamp && e.layer === stamp); });
  }
  function wallBox(o, stamp) { return bboxOf(wallsOf(o, stamp)); }
  function listFt(vals) {
    var u = [];
    vals.forEach(function (v) { var t = fmtFt(v); if (u.indexOf(t) < 0) u.push(t); });
    return u.slice(0, 8).join(", ");
  }
  function sheetLabel(L) { return String((L && (L.name || L.sheetNumber)) || "a sheet"); }
  function sheetMatches(L, rx) {
    var t = [L.name, L.sheetNumber, L.kind].concat((L.viewports || []).map(function (v) { return v.name; })).join(" ");
    return rx.test(t);
  }
  /* Vertical faces of a mesh that stand clear of its outer edges: a dormer
     front or cheek. A gable end sits on the edge, so it does not count. */
  function dormerFaces(s) {
    var v = s.verts || [], lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    v.forEach(function (p) { for (var i = 0; i < 3; i++) { if (p[i] < lo[i]) lo[i] = p[i]; if (p[i] > hi[i]) hi[i] = p[i]; } });
    var n = 0;
    (s.faces || []).forEach(function (f) {
      var a = v[f[0]], b = v[f[1]], c = v[f[2]];
      if (!a || !b || !c) return;
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
      var nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx, nl = Math.hypot(nx, ny, nz);
      if (nl < 1e-9 || Math.abs(nz / nl) > 0.05) return;
      var zs = [a[2], b[2], c[2]], span = Math.max.apply(null, zs) - Math.min.apply(null, zs);
      if (span < 1) return;
      if (Math.abs(nx) >= Math.abs(ny)) { var x = (a[0] + b[0] + c[0]) / 3; if (x > lo[0] + 1 && x < hi[0] - 1) n++; }
      else { var y = (a[1] + b[1] + c[1]) / 3; if (y > lo[1] + 1 && y < hi[1] - 1) n++; }
    });
    return n;
  }

  var PLAN_CHECKS = ["dimLen", "chain", "dimsOutside", "footprint", "schedule", "areaNote", "solidNames", "dormer", "sheet3", "sheetsUnique", "views3d", "cut", "coverIndex", "titleBlock"];
  var planCheck = {
    /* a dimension that reads this length, either direction */
    dimLen: function (o, spec, stamp) {
      var ds = dimsOf(o, stamp), tol = spec.tol == null ? 0.042 : spec.tol;
      var hit = ds.filter(function (d) { return Math.abs(dimLen(d) - spec.len) <= tol; });
      if (hit.length) return { pass: true, why: "A dimension reads " + fmtFt(dimLen(hit[0])) + "." };
      return { pass: false, why: ds.length ? "Your dimensions read " + listFt(ds.map(dimLen)) + ". None reads " + fmtFt(spec.len) + "." : "No dimensions in the drawing yet." };
    },
    /* dimensions that continue each other on one dimension line */
    chain: function (o, spec, stamp) {
      var ds = dimsOf(o, stamp), need = spec.min || 2, tol = 0.05, best = 1;
      var near = function (p, q) { return Math.abs(p[0] - q[0]) <= tol && Math.abs(p[1] - q[1]) <= tol; };
      var link = function (a, b) {
        var la = dimLine(a), lb = dimLine(b);
        var ua = [la[1][0] - la[0][0], la[1][1] - la[0][1]], ub = [lb[1][0] - lb[0][0], lb[1][1] - lb[0][1]];
        var cr = ua[0] * ub[1] - ua[1] * ub[0];
        if (Math.abs(cr) > 0.01 * Math.hypot(ua[0], ua[1]) * Math.hypot(ub[0], ub[1])) return false;
        return near(la[0], lb[0]) || near(la[0], lb[1]) || near(la[1], lb[0]) || near(la[1], lb[1]);
      };
      var parent = ds.map(function (_, i) { return i; });
      var find = function (i) { while (parent[i] !== i) i = parent[i] = parent[parent[i]]; return i; };
      for (var i = 0; i < ds.length; i++) for (var j = i + 1; j < ds.length; j++) if (link(ds[i], ds[j])) parent[find(i)] = find(j);
      var size = {};
      ds.forEach(function (_, k) { var r = find(k); size[r] = (size[r] || 0) + 1; if (size[r] > best) best = size[r]; });
      if (best >= need) return { pass: true, why: "A chain of " + best + " dimensions runs end to end on one line." };
      return { pass: false, why: ds.length < 2 ? "A chain needs at least two dimensions; found " + ds.length + "." : "No two dimensions continue each other. In a chain, the next dimension starts where the last one ends, on the same line. DCO (or CONT in the Modify row) chains them with taps." };
    },
    /* dimension lines stay outside the walls */
    dimsOutside: function (o, spec, stamp) {
      var b = wallBox(o, stamp), ds = dimsOf(o, stamp);
      if (!isFinite(b[0])) return { pass: false, why: "No walls in the drawing to measure from." };
      if (!ds.length) return { pass: false, why: "No dimensions in the drawing yet." };
      var m = 0.1;
      var inside = ds.filter(function (d) {
        var L = dimLine(d), mx = (L[0][0] + L[1][0]) / 2, my = (L[0][1] + L[1][1]) / 2;
        return mx > b[0] + m && mx < b[2] - m && my > b[1] + m && my < b[3] - m;
      });
      if (!inside.length) return { pass: true, why: "All " + ds.length + " dimension lines sit outside the walls." };
      return { pass: false, why: inside.length + " dimension line" + (inside.length === 1 ? " runs" : "s run") + " inside the room, reading " + listFt(inside.map(dimLen)) + ". Select it and tap Flip to move it outside." };
    },
    /* the walls' outside faces, or their centerlines, make this rectangle */
    footprint: function (o, spec, stamp) {
      var ws = wallsOf(o, stamp), tol = spec.tol == null ? 0.084 : spec.tol;
      if (!ws.length) return { pass: false, why: "No walls yet. Use the WALL tool; plain lines and rectangles are not walls." };
      var face = bboxOf(ws);
      var cl = bboxOf(ws.map(function (e) { return e.ocl ? { type: "line", x1: e.ocl.x1, y1: e.ocl.y1, x2: e.ocl.x2, y2: e.ocl.y2 } : e; }));
      var fits = function (b) {
        var w = b[2] - b[0], h = b[3] - b[1];
        return (Math.abs(w - spec.w) <= tol && Math.abs(h - spec.h) <= tol) || (Math.abs(w - spec.h) <= tol && Math.abs(h - spec.w) <= tol);
      };
      if (fits(face)) return { pass: true, why: "Outside faces of the walls: " + fmtFt(face[2] - face[0]) + " x " + fmtFt(face[3] - face[1]) + "." };
      if (fits(cl)) return { pass: true, why: "Wall centerlines: " + fmtFt(cl[2] - cl[0]) + " x " + fmtFt(cl[3] - cl[1]) + "." };
      return { pass: false, why: "The walls measure " + fmtFt(face[2] - face[0]) + " x " + fmtFt(face[3] - face[1]) + " outside; the cabin is " + fmtFt(spec.w) + " x " + fmtFt(spec.h) + "." };
    },
    /* a schedule table that lists every door (or window) in the plan */
    schedule: function (o, spec, stamp) {
      var ents = (o.entities || []).filter(function (e) { return !(stamp && e.layer === stamp); });
      var have = ents.filter(function (e) { return e.type === "insert" && e.def === spec.def; }).length;
      var tables = ents.filter(function (e) { return e.type === "table" && new RegExp(spec.title, "i").test(String(e.title || "")); });
      var noun = spec.def + (have === 1 ? "" : "s");
      if (!tables.length) return { pass: false, why: "No " + spec.def + " schedule table yet." };
      var rows = Math.max.apply(null, tables.map(function (t) { return Math.max(0, (t.cells || []).length - 1); }));
      if (have && rows >= have) return { pass: true, why: "The " + spec.def + " schedule lists " + rows + " for " + have + " " + noun + " in the plan." };
      if (!have) return { pass: false, why: "There is a " + spec.def + " schedule, but no " + noun + " in the plan to list." };
      return { pass: false, why: "The " + spec.def + " schedule lists " + rows + ", but the plan has " + have + " " + noun + ". A schedule is a snapshot: erase it and place it again after the last " + spec.def + "." };
    },
    /* a text that states the total area in square feet, in range */
    areaNote: function (o, spec, stamp) {
      var found = [];
      (o.entities || []).forEach(function (e) {
        if ((e.type !== "text" && e.type !== "mtext") || (stamp && e.layer === stamp)) return;
        var m = textOf(e).replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(?:SF|SQ\.?\s*FT|S\.F\.|SQUARE FEET)/i);
        if (m) found.push(Number(m[1]));
      });
      var ok = found.filter(function (v) { return v >= spec.min && v <= spec.max; });
      if (ok.length) return { pass: true, why: "Total area noted: " + ok[0] + " SF." };
      if (found.length) return { pass: false, why: "Area notes found: " + found.join(", ") + " SF. The cabin's total is between " + spec.min + " and " + spec.max + " SF (inside the walls or out)." };
      return { pass: false, why: "No text gives an area in SF yet, for example TOTAL 788 SF." };
    },
    solidNames: function (o, spec) {
      var names = (o.solids || []).map(function (s) { return String(s.name || "").toUpperCase(); });
      var miss = spec.filter(function (n) { return !names.some(function (x) { return x.indexOf(n) === 0; }); });
      if (!miss.length) return { pass: true, why: "Solids: " + names.join(", ") + "." };
      return { pass: false, why: (names.length ? "Solids now: " + names.join(", ") + ". " : "No 3D solids yet. ") + "Missing: " + miss.join(", ") + "." };
    },
    dormer: function (o) {
      var roof = (o.solids || []).filter(function (s) { return /^ROOF/i.test(String(s.name || "")); })[0];
      if (!roof) return { pass: false, why: "No ROOF solid yet, so there is nothing to put a dormer on." };
      var n = dormerFaces(roof);
      if (n) return { pass: true, why: "The roof has a dormer standing up out of the slope." };
      return { pass: false, why: "The roof has no dormer yet. DORMER x y seats one at a point on the slope." };
    },
    /* a sheet whose name, number or view names match */
    sheet3: function (o, spec) {
      var rx = new RegExp(spec.match, "i"), Ls = o.layouts || [];
      var hit = Ls.filter(function (L) { return sheetMatches(L, rx); });
      if (hit.length >= (spec.min || 1)) return { pass: true, why: "Found " + hit.map(sheetLabel).slice(0, 4).join(", ") + (hit.length > 4 ? " and " + (hit.length - 4) + " more" : "") + "." };
      return { pass: false, why: Ls.length ? "Sheets now: " + Ls.map(function (L) { return L.sheetNumber || L.name; }).join(", ") + ". None is " + spec.what + "." : "This drawing has no sheets yet." };
    },
    sheetsUnique: function (o, spec) {
      var Ls = o.layouts || [], nums = Ls.map(function (L) { return String(L.sheetNumber || L.name || ""); });
      var dup = nums.filter(function (n, i) { return nums.indexOf(n) !== i; });
      if (Ls.length < spec.min) return { pass: false, why: "The set has " + Ls.length + " sheet" + (Ls.length === 1 ? "" : "s") + ": " + (nums.join(", ") || "none") + ". A full set here is at least " + spec.min + "." };
      if (dup.length) return { pass: false, why: "Two sheets share the number " + dup[0] + ". Every sheet needs its own number." };
      return { pass: true, why: Ls.length + " sheets, every number different: " + nums.join(", ") + "." };
    },
    views3d: function (o, spec) {
      var v = o.views3d || [];
      if (v.length >= (spec.min || 1)) return { pass: true, why: "Saved view" + (v.length === 1 ? "" : "s") + ": " + v.map(function (x) { return x.name; }).join(", ") + "." };
      return { pass: false, why: "No saved 3D views yet. Open 3D, frame the cabin, then type VIEW SAVE and a name." };
    },
    /* a cutting plane that crosses the whole building */
    cut: function (o, spec, stamp) {
      var b = wallBox(o, stamp);
      var cps = (o.entities || []).filter(function (e) { return e.type === "cutplane"; });
      if (!cps.length) return { pass: false, why: "No section cut yet. Type SE and pick two points on either side of the cabin." };
      if (!isFinite(b[0])) return { pass: true, why: "Found " + cps.length + " cutting plane" + (cps.length === 1 ? "" : "s") + "." };
      var out = function (x, y) { return x < b[0] || x > b[2] || y < b[1] || y > b[3]; };
      var through = cps.filter(function (e) {
        var x1 = num(e.x1), y1 = num(e.y1), x2 = num(e.x2), y2 = num(e.y2);
        if (!out(x1, y1) || !out(x2, y2)) return false;
        var horiz = Math.abs(y2 - y1) <= Math.abs(x2 - x1);
        if (horiz) { var ym = (y1 + y2) / 2; return Math.min(x1, x2) < b[0] && Math.max(x1, x2) > b[2] && ym > b[1] && ym < b[3]; }
        var xm = (x1 + x2) / 2; return Math.min(y1, y2) < b[1] && Math.max(y1, y2) > b[3] && xm > b[0] && xm < b[2];
      });
      if (through.length) return { pass: true, why: "Section " + (through[0].tag || "A") + " cuts all the way across the cabin." };
      return { pass: false, why: "The cut line does not cross the whole cabin. Start it outside one wall and end it outside the opposite wall." };
    },
    /* the cover's drawing index lists every sheet in the set */
    coverIndex: function (o) {
      var Ls = o.layouts || [];
      var cover = Ls.filter(function (L) { return L.kind === "cover" || /^G-/i.test(String(L.sheetNumber || "")); })[0];
      if (!cover) return { pass: false, why: "No cover sheet (G-001) yet. Menu, Sheet set, Generate sheet set makes one." };
      var idx = (cover.annotations || []).map(function (a) { return a && a.table; }).filter(function (t) { return t && /INDEX/i.test(String(t.title || "")); })[0];
      if (!idx) return { pass: false, why: "The cover has no drawing index table." };
      var listed = (idx.cells || []).slice(1).map(function (r) { return String(r[0] || ""); });
      var miss = Ls.map(function (L) { return String(L.sheetNumber || ""); }).filter(function (n) { return n && listed.indexOf(n) < 0; });
      if (!miss.length) return { pass: true, why: "The index on " + (cover.sheetNumber || "the cover") + " lists all " + Ls.length + " sheets." };
      return { pass: false, why: "The cover's index leaves out " + miss.join(", ") + ". Run DRAWINGS SHEETS after Generate sheet set, so the index is rewritten with every sheet." };
    },
    titleBlock: function (o) {
      var Ls = o.layouts || [], off = Ls.filter(function (L) { return L.titleBlock === false; });
      if (!Ls.length) return { pass: false, why: "This drawing has no sheets yet." };
      if (!off.length) return { pass: true, why: "Every sheet has its title block." };
      return { pass: false, why: off.map(sheetLabel).join(", ") + (off.length === 1 ? " has" : " have") + " the title block turned off." };
    }
  };

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
      rooms: ents.filter(function (e) { return e.type === "room"; }).length,
      sheets: (o.layouts || []).length,
      solids: (o.solids || []).length,
      name: String(o.name || "Untitled")
    };
  }

  /* ---------- preview ---------- */

  function inPoly(x, y, pts) {
    var inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = num(pts[i][0]), yi = num(pts[i][1]), xj = num(pts[j][0]), yj = num(pts[j][1]);
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi || 1e-12) + xi) inside = !inside;
    }
    return inside;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  var DASH = { HIDDEN: "0.25 0.15", DASHED: "0.5 0.25", CENTER: "1.2 0.2 0.25 0.2", PHANTOM: "1.2 0.2 0.15 0.2 0.15 0.2", DOT: "0.05 0.2" };

  function previewSVG(o, stampLayer) {
    var hide = (o.layers || []).filter(function (L) { return L && (L.visible === false || L.plot === false); }).map(function (L) { return L.name; });
    var ents = (o.entities || []).filter(function (e) { return e && hide.indexOf(e.layer) < 0 && e.layer !== stampLayer && ["line", "poly", "circle", "arc", "ellipse", "text", "mtext", "dim", "hatch", "room"].indexOf(e.type) >= 0; });
    /* a room already labelled by a text inside it shows just its area */
    var roomTags = {};
    ents.forEach(function (e, k) {
      if (e.type !== "room") return;
      var nm = String(e.name || "").trim().toUpperCase();
      if (ents.some(function (t) { return t.type === "text" && textOf(t).trim().toUpperCase() === nm && inPoly(num(t.x), num(t.y), e.pts || []); })) roomTags[e.id != null ? e.id : k] = 1;
    });
    /* Frame the geometry and the lettering near it (titles, notes). Text
       far from the drawing would shrink it to a dot, so if the lettering
       more than doubles the frame either way, frame the geometry alone. */
    var geo = bboxOf(ents.filter(function (e) { return e.type !== "text" && e.type !== "mtext"; }));
    var b = geo.slice();
    ents.forEach(function (e) {
      if (e.type !== "text" && e.type !== "mtext") return;
      var size = Math.max(num(e.size) || num(e.h) || 0.5, 0.2);
      var ls = textOf(e).split(/\n|\\P/).slice(0, 6);
      var wide = Math.max.apply(null, ls.map(function (t) { return Math.min(t.length, 80); })) * size * 0.62;
      var tx0 = num(e.x), ty1 = num(e.y) + size, ty0 = num(e.y) - (ls.length - 1) * size * 1.3 - size * 0.25;
      b = [Math.min(b[0], tx0), Math.min(b[1], ty0), Math.max(b[2], tx0 + wide), Math.max(b[3], ty1)];
    });
    if (isFinite(geo[0]) && ((b[2] - b[0]) > 2 * Math.max(geo[2] - geo[0], 1) || (b[3] - b[1]) > 2 * Math.max(geo[3] - geo[1], 1))) b = geo;
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
      } else if (e.type === "room") {
        var rs = Math.max(w, h) / 70;
        var tag = roomTags[e.id != null ? e.id : ents.indexOf(e)];
        var rl = (tag ? "" : String(e.name || "ROOM") + " ") + Math.round(num(e.area)) + " SF";
        parts.push('<text x="' + f(num(e.cx)) + '" y="' + Y(num(e.cy)) + '" font-size="' + f(rs) + '" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="ui-monospace, monospace">' + esc(rl.slice(0, 40)) + "</text>");
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
