"""Shared helpers for the subject ladders (Intermediate, Advanced, Expert).

Step and check helpers come from extra_web so every ladder emits exactly
the shapes content.js uses. Added here: numeric (N), output (P), explore
(X), write (WR, with its text checks) and a course factory that wires
gating the same way the web ladder does.
"""
from extra_web import (C, W, M, O, B, K, T, L, NEED, has, count, attr, invisible, rx,
                       csp_ok, style, none, css, html, confirm, url)


def N(prompt, answer, explain, tol=0, gen=None):
    s = {"type": "numeric", "prompt": prompt, "answer": answer, "tolerance": tol, "explain": explain}
    if gen:
        s["gen"] = gen
    return s


def P(code, expect, explain, prompt="What does this print?"):
    return {"type": "output", "prompt": prompt, "code": code, "expect": expect, "explain": explain}


def X(heading, body, expr, variable, lo, hi, step, label, value_label):
    return {"type": "explore", "heading": heading, "body": body, "expr": expr, "variable": variable,
            "min": lo, "max": hi, "stepSize": step, "label": label, "valueLabel": value_label}


# ---------- write steps: free text graded by plain text checks ----------

def WR(prompt, checks, example, explain, starter=""):
    s = {"type": "write", "prompt": prompt, "checks": checks, "example": example, "explain": explain}
    if starter:
        s["starter"] = starter
    return s


def words(lo, hi, label=None):
    return {"words": [lo, hi], "label": label or ("Between %d and %d words" % (lo, hi))}


def must(pattern, label, flags="i", hint=None):
    c = {"has": pattern, "flags": flags, "label": label}
    if hint:
        c["hint"] = hint
    return c


def avoid(pattern, label, flags="i", hint=None):
    c = {"not": pattern, "flags": flags, "label": label}
    if hint:
        c["hint"] = hint
    return c


def max_sentence(n, label=None):
    return {"maxSentence": n, "label": label or ("No sentence longer than %d words" % n)}


def lines(n, label):
    return {"lines": n, "label": label}


def changed(label="You rewrote the draft, not just the same text"):
    return {"changed": True, "label": label}


def self_check(label):
    return {"confirm": True, "label": label}


# ---------- course factory ----------

def course(cid, subject, level, title, prev, prev_skill, mastery, blurb, units, track, rev="2026-10-02"):
    return {
        "id": cid, "subject": subject, "level": level, "title": title, "track": track,
        "prereq": prev, "rev": rev,
        "unlock": {"after": prev, "mastery": mastery, "skill": prev_skill},
        "blurb": blurb,
        "units": [{"title": t, "lessons": ls} for t, ls in units],
    }


# ---------- extra build checks (measured on the rendered preview) ----------

def contrast(sel, ratio, label, hint=None):
    """Every match has text contrast of at least ratio:1 against its background."""
    c = {"sel": sel, "contrastMin": ratio, "label": label}
    if hint:
        c["hint"] = hint
    return c


def at_most(sel, n, label, at_least=1, hint=None):
    c = {"sel": sel, "max": n, "min": at_least, "label": label}
    if hint:
        c["hint"] = hint
    return c


def text_max(sel, n, label, hint=None):
    c = {"sel": sel, "textMax": n, "label": label}
    if hint:
        c["hint"] = hint
    return c


def px(sel, prop, label, lo=None, hi=None, hint=None, every=False):
    c = {"sel": sel, "style": prop, "label": label}
    if every:
        c["every"] = True
    if lo is not None:
        c["minPx"] = lo
    if hi is not None:
        c["maxPx"] = hi
    if hint:
        c["hint"] = hint
    return c
