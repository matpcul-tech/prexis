"""Drafting track: Drafting from scratch (Beginner).

Every lesson teaches with the usual steps and ends in a draft step: the
learner opens a starter drawing in Sovereign Draft (a share link Prexis
builds from the starter below), draws, saves a copy (.sdraft) or copies a
share link, and brings it back. drafting.js grades the drawing data.

Each starter carries a non-plotting layer named for its lesson
(PREXIS-L01...). Sovereign Draft keeps layers through save and share, so
the stamp tells Prexis which lesson a file came from. Task notes for the
learner sit on that layer too: visible in the editor, never printed, never
counted by a check.

Text convention in this file: write inches as two apostrophes ('') and
they become a double quote (") on export, so 12'-0'' reads 12'-0".
Rebuild with: python3 build_library.py
"""
from extra_web import C, W, M, O
from ladder_kit import NQ

SD_LAYERS = [
    {"name": "WALLS", "color": "#d4a843", "aci": 2, "visible": True},
    {"name": "DOORS", "color": "#00d4b8", "aci": 4, "visible": True},
    {"name": "FIXTURES", "color": "#c45a3c", "aci": 1, "visible": True},
    {"name": "DIMS", "color": "#8fa3c0", "aci": 8, "visible": True},
    {"name": "TEXT", "color": "#e8e4dd", "aci": 7, "visible": True},
    {"name": "HATCH", "color": "#6b7c93", "aci": 8, "visible": True},
    {"name": "CENTER", "color": "#c45a3c", "aci": 1, "visible": True, "lt": "CENTER"},
    {"name": "SCHEDULES", "color": "#e8e4dd", "aci": 7, "visible": True},
    {"name": "UNDERLAY", "color": "#4a5a73", "aci": 8, "visible": True, "plot": False},
    {"name": "ROOMS", "color": "#4ade80", "aci": 3, "visible": True},
    {"name": "GRID", "color": "#8fa3c0", "aci": 8, "visible": True, "lt": "CENTER"},
    {"name": "DEFPOINTS", "color": "#6b7c93", "aci": 8, "visible": True, "plot": False},
    {"name": "SECTION", "color": "#00d4b8", "aci": 4, "visible": True},
    {"name": "GDT", "color": "#e8e4dd", "aci": 7, "visible": True},
    {"name": "NOTES", "color": "#e8e4dd", "aci": 7, "visible": True},
]


def base(name):
    """Entities drawn in a real Sovereign Draft (see e2e/make-starters.mjs),
    so walls, doors and rooms carry everything the editor needs."""
    import json, os
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "drafting_starters", name + ".json")) as f:
        return json.load(f)


def starter(name, stamp, entities, note, at, extra_layers=(), gseq=None):
    """A Sovereign Draft project (v7) the editor opens from a share link."""
    layers = [dict(l) for l in SD_LAYERS] + [dict(l) for l in extra_layers]
    layers.append({"name": stamp, "color": "#6b7c93", "aci": 8, "visible": True, "plot": False})
    ents = list(entities)
    for i, line in enumerate(note):
        ents.append({"type": "text", "layer": stamp, "x": at[0], "y": at[1] - i * 0.6, "size": 0.35, "content": line})
    # Sovereign Draft selects, edits and undoes by entity id and passes a
    # file's entities through untouched, so a starter must number them.
    ents = [dict(e, id=i + 1) for i, e in enumerate(ents)]
    out = {"app": "sovereign-draft", "v": 7, "name": name, "layers": layers, "entities": ents,
           "idSeq": len(ents) + 1, "space": "model"}
    if gseq:
        out["gSeq"] = gseq  # new walls get group ids after the starter's own
    return out


def from_base(name, title, stamp, note, at, extra=()):
    b = base(name)
    return starter(title, stamp, b["entities"] + list(extra), note, at, gseq=b.get("gSeq"))


def ln(x1, y1, x2, y2, layer="WALLS", **kw):
    e = {"type": "line", "layer": layer, "x1": x1, "y1": y1, "x2": x2, "y2": y2}
    e.update(kw)
    return e


def D(prompt, body, tasks, howto, start, stamp, checks, explain):
    return {"type": "draft", "prompt": prompt, "body": body, "tasks": tasks, "howto": howto,
            "starter": start, "stamp": stamp, "checks": checks, "explain": explain}


def chk(label, hint=None, **kw):
    c = {"label": label}
    c.update(kw)
    if hint:
        c["hint"] = hint
    return c


SAVE = "Menu (top right), Save a copy. Drop the .sdraft file on this step. Or Menu, Copy share link, and paste it here."

# ---------------------------------------------------------------- L1

L1 = {"title": "Lines that talk", "keywords": ["drafting", "linetype", "line", "types", "hidden", "center", "lineweight", "blueprint", "drawing", "cad"], "steps": [
    C("Every line type means something",
      "A drawing is a language. A thick continuous line is an edge you can see. A thin dashed line is an edge hidden behind or inside something. A long and short chain is a center line: the axis of a hole or a symmetric part, not an edge at all. Read the line type before you read the shape."),
    C("Weight is the second signal",
      "Lineweight ranks the lines. Visible outlines print heaviest, 0.50 to 0.70 mm. Hidden lines are medium or thin, 0.25 to 0.35 mm. Center, dimension and extension lines are thinnest, 0.18 to 0.25 mm. A print where every line has the same weight is hard to read even when every line is in the right place."),
    W("Read a pier cap",
      "A concrete pier cap seen from the front is a 6'-0'' by 3'-0'' rectangle. A 1'-0'' sleeve runs straight down through its middle. What lines does the front view need?",
      ["The outline is an edge you see: four thick continuous lines.",
       "The sleeve is inside the concrete. From the front you cannot see it, so its two sides are thin hidden lines, 1'-0'' apart, top to bottom.",
       "The sleeve has an axis. One center line runs down its middle and a little past the outline at both ends, so it reads as an axis and not as an edge."],
      "Visible, hidden, axis: three meanings, three line types, three weights."),
    M("A thin dashed line on a drawing most likely shows:",
      ["An edge hidden behind or inside something", "An edge you can see", "The axis of a round part", "A dimension"], 0,
      "Dashed means hidden. The edge is real, but something is in front of it from this view."),
    M("Which line should print heaviest?",
      ["Center line", "Hidden line", "Visible outline", "Dimension line"], 2,
      "Visible outlines carry the shape, so they get the most weight. Everything else supports them."),
    O("Rank these from heaviest to lightest on a typical print.",
      ["Visible outline", "Hidden line", "Center line", "Dimension line"],
      "Outline first, hidden next, then the thin family: center and dimension lines, which share the lightest weight.",
      groups=[[2, 3]], note="Center and dimension lines share the lightest weight, so either order counts for those two."),
    M("A center line through a hole should:",
      ["Stop exactly at the edge of the part", "Run a little past the outline of the part", "Be drawn heavy so it stands out", "Be drawn as a hidden line"], 1,
      "Running past the outline is what tells the reader it is an axis, not another edge."),
    D("Draw the pier cap front view with the right line types.",
      "The starter has the pier cap outline and the two sides of the sleeve, all drawn as plain default lines. Make the drawing say what each line means.",
      ["Make the two sleeve lines HIDDEN.",
       "Draw one CENTER line down the middle of the sleeve at X 3'-0'', running past the top and bottom of the block.",
       "Make the four outline lines heavy: 0.50 mm or more.",
       "Keep the hidden and center lines thin: 0.35 mm or less."],
      ["Tap SELECT in the toolbar, tap BOX SELECT in the chip row, then drag a box around the whole block. Tap the LW chip until it reads LW 0.50. Press Esc.",
       "Tap BOX SELECT again and drag a small box inside the block that crosses only the two sleeve lines. Tap LT until it reads LT HID, then tap LW until it reads LW DEF. Press Esc.",
       "Tap LT until it reads LT CTR. Type L and Enter, then 3,-0.75 Enter and 3,3.75 Enter, then Esc. Tap LT until it reads LT CONT again.",
       SAVE],
      starter("Pier cap starter", "PREXIS-L01", [
          ln(0, 0, 6, 0), ln(6, 0, 6, 3), ln(6, 3, 0, 3), ln(0, 3, 0, 0),
          ln(2.5, 0, 2.5, 3), ln(3.5, 0, 3.5, 3),
          {"type": "text", "layer": "NOTES", "x": 0, "y": -1.6, "size": 0.35, "content": "PIER CAP, FRONT VIEW"},
      ], ["PREXIS L01: make the sleeve lines HIDDEN, add a CENTER line at X 3'-0'',",
          "make the outline 0.50 mm or heavier. This note does not print."], (0, 5.2)),
      "PREXIS-L01",
      [chk("Both sleeve lines are HIDDEN", "Tap SELECT, then BOX SELECT, drag a box that crosses only the two sleeve lines, and tap LT until it reads LT HID.",
           count={"type": "line", "lt": "HIDDEN", "inBox": [2.4, -0.1, 3.6, 3.1]}, min=2, noun="hidden lines on the sleeve"),
       chk("A CENTER line runs down the sleeve and past the block", "With the chip on LT CTR, type L, then 3,-0.75 and 3,3.75. The line has to cross the top and bottom edges.",
           count={"type": ["line", "poly"], "lt": "CENTER", "inBox": [2.9, -3, 3.1, 6], "minLength": 3.2}, min=1, noun="center lines at X 3'-0'' that run past both edges"),
       chk("The outline edges are heavy (0.50 mm or more)", "Box select the whole block and tap LW until it reads LW 0.50 or LW 0.70.",
           count={"type": ["line", "poly"], "lt": "CONTINUOUS", "minLw": 0.5, "inBox": [-0.1, -0.1, 6.1, 3.1]}, min=4, noun="heavy continuous outline lines"),
       chk("Hidden and center lines stay thin (0.35 mm or less)", "Select the dashed and chain lines and tap LW until it reads LW DEF (or 0.35 or less).",
           count={"lt": ["HIDDEN", "CENTER"], "minLw": 0.5}, min=0, max=0, noun="hidden or center lines at 0.50 mm or heavier")],
      "Three meanings, three line types, two weights. Anyone who reads prints can now tell the sleeve is inside the concrete and where its axis is, without a word of explanation."),
]}

# ---------------------------------------------------------------- L2

L2 = {"title": "Scale and the architect's ruler", "keywords": ["drafting", "scale", "architect", "ruler", "quarter", "inch", "plot", "blueprint", "sheet"], "steps": [
    C("Full size in the computer, scaled on paper",
      "In CAD you draw everything at its real size: a 12'-0'' wall is 12 feet long in the drawing. Scale only happens when you plot. The sheet's scale says how many feet of building fit in one inch of paper."),
    C("Reading 1/4'' = 1'-0''",
      "Every quarter inch on paper stands for one foot of building, so one inch holds four feet. House plans are usually 1/4''. Larger buildings drop to 1/8'', where one inch holds eight feet. Details go up to 1/2'', 1'' or more so small parts stay readable."),
    W("How big is the room on paper?",
      "A 12'-0'' room is plotted at 1/4'' = 1'-0''. How long is it on the sheet?",
      ["At 1/4'' scale, one foot of building is 1/4 inch of paper.",
       "12 feet x 1/4 inch = 3 inches.",
       "Check it the other way: one inch holds 4 feet, and 12 / 4 = 3 inches."],
      "Paper inches = real feet x the scale fraction."),
    NQ("At 1/4'' = 1'-0'', how many inches of paper does a {L}'-0'' wall take?",
       "Each foot is 1/4 inch at this scale, so {L} feet is {L} / 4 = {A} inches.",
       {"L": [8, 40, 4]}, "L/4", {"L": 24}),
    NQ("At 1/8'' = 1'-0'', a wall measures {p} inches on the print. How long is the real wall, in feet?",
       "One inch holds 8 feet at 1/8'' scale, so {p} inches is {p} x 8 = {A} feet.",
       {"p": [2, 9, 1]}, "p*8", {"p": 4}),
    M("A detail of a stair handrail bracket should be drawn at:",
      ["1/16'' = 1'-0''", "1/8'' = 1'-0''", "1/4'' = 1'-0''", "1 1/2'' = 1'-0'' or larger"], 3,
      "A bracket is inches across. At small scales it would be a dot. Details use large scales."),
    M("You are drawing a 12'-0'' wall in CAD for a 1/4'' plan. What length do you draw?",
      ["3'' (its size at 1/4'' scale)", "12'-0'' (its real size)", "48'-0''", "It depends on the sheet size"], 1,
      "Model at real size, always. The sheet's plot scale does the shrinking, and you can change it later without redrawing."),
    D("Draw a 12'-0'' x 10'-0'' storage room at full size, then plot it at 1/2'' = 1'-0''.",
      "The starter is an empty plan with one sheet, A-1, set to 1/4''. Draw the room at its real size, then change the sheet's plot scale. The drawing does not change; the paper does.",
      ["Draw a closed rectangle 12'-0'' by 10'-0''.",
       "Set the plot scale of sheet A-1 to 1/2''.",
       "Look at sheet A-1 and see the room fill twice as much paper as it did at 1/4''."],
      ["Type RECT and press Enter. Type 0,0 and Enter, then 12,10 and Enter.",
       "Open the Menu (top right) and tap Sheet set. Tap 1/2'' under Plot scale.",
       "To look at the sheet, tap A-1 Floor Plan in the Sheet set list (on a wide screen the A-1 tab at the top works too).",
       SAVE],
      starter("Storage room starter", "PREXIS-L02", [
          {"type": "text", "layer": "NOTES", "x": 0, "y": -2, "size": 0.5, "content": "STORAGE ROOM"},
      ], ["PREXIS L02: draw a 12'-0'' x 10'-0'' rectangle at full size,",
          "then set sheet A-1 to plot at 1/2''. This note does not print."], (0, 14)),
      "PREXIS-L02",
      [chk("A closed rectangle 12'-0'' x 10'-0'' at full size", "Type RECT, then 0,0 and 12,10. Draw the real size, not the paper size.",
           rect={"w": 12, "h": 10, "tol": 0.042}),
       chk("A sheet plots at 1/2'' = 1'-0''", "Open the Menu (top right), tap Sheet set, and tap 1/2'' under Plot scale.",
           scale=36)],
      "Same drawing, twice the paper. That is why you never draw at paper size: the scale is a setting on the sheet, and changing it costs one tap."),
]}

# ---------------------------------------------------------------- L3

L3 = {"title": "Sheets, title blocks and lettering", "keywords": ["drafting", "sheet", "title", "block", "lettering", "notes", "tabloid", "blueprint", "numbering"], "steps": [
    C("The sheet is the product",
      "Nobody builds from your screen. They build from sheets: paper, or a PDF of paper. A sheet has a border, a drawing area, and a title block that says what the drawing is, who issued it, the scale and the sheet number."),
    C("Sheet sizes",
      "Arch D (24'' x 36'') is the standard for building plans in the US. Tabloid (11'' x 17'') is easy to print in any office and suits small jobs and review sets. Letter (8 1/2'' x 11'') is for a single detail or a sketch."),
    C("Sheet numbers tell you where you are",
      "The letter is the discipline: G for general, A for architectural, S for structural. The first digit is the kind of drawing: A-1xx plans, A-2xx elevations, A-3xx sections, A-5xx details. G-001 is usually the cover with the sheet index."),
    W("Fill a title block",
      "You are issuing a plan of a storage room for the Hill family. What goes in the title block?",
      ["Project: what it is and for whom, for example Hill storage room.",
       "Issued by: your name or company. That is who answers questions about the drawing.",
       "Drawing title and scale: FLOOR PLAN, 1/2'' = 1'-0''.",
       "Sheet number: A-101, the first architectural plan sheet."],
      "A sheet that cannot say what, who and which page is not finished."),
    M("A sheet numbered A-201 most likely shows:",
      ["A floor plan", "An elevation", "A section", "The cover and index"], 1,
      "The 2 series is elevations. Plans are 1, sections 3."),
    M("Lettering on a printed plan is usually about:",
      ["1/32'' tall", "3/32'' to 1/8'' tall", "1/2'' tall", "1'' tall"], 1,
      "3/32'' to 1/8'' reads at arm's length on a full size sheet and still fits in the space between lines."),
    O("Order a small set the way its sheets are numbered.",
      ["G-001 Cover and index", "A-101 Floor plan", "A-201 Elevations", "A-301 Sections"],
      "General first, then architectural by series: plans, elevations, sections."),
    M("Why do many drawings letter their notes in capitals?",
      ["Capitals stay readable at small sizes and after copying", "Building codes require it", "It looks more official", "CAD cannot print lowercase"], 0,
      "Small lowercase letters blur together on copies and scans. Capitals hold their shape."),
    D("Turn the storage room into a finished sheet.",
      "The starter has the room drawn and one sheet. Make that sheet answer what, who and which page.",
      ["Give the project a real name (not Untitled and not the starter name).",
       "Fill in Issued by with your name or company.",
       "Add the drawing title FLOOR PLAN as text under the room.",
       "Add a general note of at least four words on the NOTES layer, for example VERIFY ALL DIMENSIONS IN FIELD.",
       "Switch the sheet size to Tabloid (11 x 17)."],
      ["Open the Menu (top right). At the top, type a Project name, and your name or company under Issued by. Tap outside the menu to close it.",
       "Type T and Enter, tap just under the room, type FLOOR PLAN and tap Place text.",
       "Type T and Enter again, tap below the title, type your note and tap Place text.",
       "Tap SELECT, tap your note, tap the Layer chip, then tap NOTES.",
       "Open the Menu, tap Sheet set, and tap Tabloid under Sheet size.",
       SAVE],
      starter("Storage room sheet starter", "PREXIS-L03", [
          {"type": "poly", "layer": "WALLS", "closed": True, "pts": [[0, 0], [12, 0], [12, 10], [0, 10]]},
      ], ["PREXIS L03: name the project, fill in Issued by, title the drawing FLOOR PLAN,",
          "add a general note on NOTES, switch the sheet to Tabloid. This note does not print."], (0, 13)),
      "PREXIS-L03",
      [chk("The project has a real name", "Open the Menu (top right) and type a name in Project name. Untitled and the starter name do not count.",
           field="name", notIn=["Untitled", "Storage room sheet starter"]),
       chk("Issued by is filled in", "Open the Menu (top right) and type your name or company under Issued by.",
           field="firm.company"),
       chk("The drawing is titled FLOOR PLAN", "Type T, tap under the room, type FLOOR PLAN, tap Place text.",
           count={"type": ["text", "mtext"], "text": "floor\\s*plan"}, min=1, noun="texts that read FLOOR PLAN"),
       chk("A general note of four or more words is on the NOTES layer", "New text lands on the TEXT layer. Tap SELECT, tap your note, tap the Layer chip, then NOTES. A note needs at least four words.",
           count={"type": ["text", "mtext"], "layer": "NOTES", "minWords": 4}, min=1, noun="notes of four or more words on NOTES"),
       chk("The sheet is Tabloid (11 x 17)", "Open the Menu (top right), tap Sheet set, and tap Tabloid under Sheet size.",
           sheet="tabloid")],
      "Now the sheet can travel without you: it says what it is, who stands behind it and how big the paper is. That is the difference between a drawing and a print."),
]}

# ---------------------------------------------------------------- L4

BLOCK_VOLUME = 68.87  # 96 - 24 (notch) - 3.13 (CYL 0.5 x 4, faceted as Sovereign Draft builds it); measured 68.867 from a real save

L4 = {"title": "Orthographic projection", "keywords": ["drafting", "orthographic", "projection", "views", "front", "top", "side", "3d", "third", "angle", "model"], "steps": [
    C("The glass box",
      "Put the object inside a glass box and look straight at each face. What you see on each pane, with no perspective, is an orthographic view. Unfold the box flat and the views land in fixed places."),
    C("Third-angle layout",
      "In the US the top view sits directly above the front view, and the right side view sits directly to the right of it. Front and top share their width. Front and right share their height. Top and right share the depth. Those shared sizes are why the views line up."),
    C("Hidden edges and holes",
      "An edge you cannot see from a view is drawn as a hidden line. A hole drilled straight down shows as a circle in the top view and as two hidden lines in the front and side views, with a center line between them."),
    W("Project an L-block",
      "A block is 6'-0'' wide, 4'-0'' deep and 4'-0'' tall. A 2'-0'' x 2'-0'' notch is cut along the top front edge, full width. A 1'-0'' hole runs straight down through the back half.",
      ["Front view: the 6'-0'' x 4'-0'' face. The notch shows as a visible line across it at 2'-0'' up, because you see the step. The hole is inside: two hidden vertical lines.",
       "Top view: straight above the front, 6'-0'' wide and 4'-0'' deep. The notch is a line across it 2'-0'' back from the front edge. The hole is a circle 1'-0'' across.",
       "Right side view: straight to the right of the front, 4'-0'' deep and 4'-0'' tall. The notch turns the outline into an L. The hole is two hidden lines."],
      "Every view borrows two sizes from its neighbors. Draw one, project the others."),
    M("In third-angle projection, the top view goes:",
      ["Directly above the front view", "Directly below the front view", "To the left of the front view", "Anywhere on the sheet, with a label"], 0,
      "Top above, right side to the right. The views line up so sizes can be carried across."),
    M("The front view and the right side view always share their:",
      ["Width", "Height", "Depth", "Nothing; each view has its own sizes"], 1,
      "Both look at the object from the side, so both show its full height."),
    M("A hole drilled straight down shows in the front view as:",
      ["A circle", "Two hidden lines", "A single center mark", "Nothing at all"], 1,
      "From the front you see the hole's sides edge on, through solid material: two hidden lines."),
    NQ("A block's top view is {w}'-0'' wide and {d}'-0'' deep. How wide, in feet, is its right side view?",
       "The right side view shows the depth across its width, so it is {A} feet wide, the same as the top view's depth.",
       {"w": [5, 12, 1], "d": [2, 8, 1]}, "d", {"w": 6, "d": 4}),
    D("Model the L-block in 3D, then draw its three views.",
      "The starter holds only this lesson's notes. Build the block as a solid first so you can orbit it and see every face. Then draw the front, top and right side views in 2D.",
      ["Model the block: a 6 x 4 x 4 box, minus the 2 x 2 notch along the top front edge, minus a 1'-0'' hole straight down through the back half, centered at X 3, Y 3.",
       "Orbit it (type 3D), look at each face, then type 2D to come back.",
       "Front view, lower left corner at 0,0: 6'-0'' wide, 4'-0'' tall, the notch line at 2'-0'' up, the hole as two HIDDEN lines.",
       "Top view straight above, starting at 0,6: the same left and right edges, 4'-0'' deep, the notch line, the hole as a 1'-0'' circle.",
       "Right side view straight to the right, starting at 8,0: 4'-0'' wide, 4'-0'' tall, the L outline, the hole as two HIDDEN lines."],
      ["Type BOX 0 0 0 6 4 4 and Enter (the block), then BOX 0 0 2 6 2 2 and Enter (the notch). Type SUB3D BOX BOX-2 to cut the notch.",
       "Type CYL 3 3 0 0.5 4 and Enter (the hole), then SUB3D BOX CYLINDER to drill it. Type 3D to orbit, 2D to return.",
       "Front: type RECT, 0,0 and 6,4. Then L, 0,2 and 6,2, then Esc. Tap LT until LT HID, then L, 2.5,0 and 2.5,4, Esc, and L, 3.5,0 and 3.5,4, Esc. Tap LT back to LT CONT.",
       "Top: RECT, 0,6 and 6,10. Then L, 0,8 and 6,8, Esc. Then C (circle), 3,9 and 0.5 for the radius.",
       "Right: P (polyline), then 8,0, 12,0, 12,4, 10,4, 10,2 and 8,2, and tap Close shape in the chip row. With LT on LT HID, L, 10.5,0 and 10.5,4, Esc, and L, 11.5,0 and 11.5,4, Esc.",
       SAVE],
      starter("L-block starter", "PREXIS-L04", [], [
          "PREXIS L04: model the L-block (BOX, SUB3D, CYL), then draw three views:",
          "front at 0,0, top above it at 0,6, right side at 8,0. This note does not print."], (0, -2)),
      "PREXIS-L04",
      [chk("A 3D solid of the finished block: 6 x 4 x 4, notch and hole cut", "BOX 0 0 0 6 4 4, BOX 0 0 2 6 2 2, SUB3D BOX BOX-2, CYL 3 3 0 0.5 4, SUB3D BOX CYLINDER.",
           solid={"size": [6, 4, 4], "volume": BLOCK_VOLUME, "volTol": 0.5}),
       chk("Three views in third-angle layout, lined up and to size", "Front at 0,0 (6 x 4), top above it at 0,6 (6 x 4), right side at 8,0 (4 x 4). Leave space between views.",
           views={"front": [6, 4], "top": [6, 4], "right": [4, 4], "tol": 0.1}),
       chk("The hole shows as hidden lines in the front and right views", "Four HIDDEN lines in all: two in the front view, two in the right side view.",
           count={"type": "line", "lt": "HIDDEN"}, min=4, noun="hidden lines"),
       chk("The hole shows as a 1'-0'' circle in the top view", "Type C, then 3,9 and 0.5 for the radius.",
           count={"type": "circle", "r": [0.45, 0.55]}, min=1, noun="circles 1'-0'' across")],
      "One solid, three views, every size carried across. This is the skill under every plan, elevation and section in the rest of the path: they are all views of one thing, lined up."),
]}


# ---------------------------------------------------------------- Unit 2: Plan a room

SAVE_PLAN = "Menu (top right), Save a copy, and drop the .sdraft file here. Or Menu, Copy share link, and paste it."

L5 = {"title": "Dimensioning", "keywords": ["drafting", "dimension", "dimensions", "chain", "overall", "extension", "feet", "inches", "plan"], "steps": [
    C("Dimensions are the instructions",
      "A builder does not measure your drawing with a ruler. They read the numbers. A dimension has three parts: two extension lines that come off the thing being measured, a dimension line between them with a tick or arrow at each end, and the number. On building plans the number is in feet and inches, like 24'-0'' or 6'-6''."),
    C("Overall and chain",
      "An overall dimension gives the full size of something, corner to corner. A chain (or string) breaks the same distance into pieces that follow each other: corner to the door, door to the next corner. The pieces of a chain add up to the overall. Chains sit closest to the plan, overall dimensions farther out, so nothing crosses."),
    C("The house rules",
      "Dimensions go outside the plan where they can, so they do not cover walls and labels. Extension lines start a small gap away from the object and run a little past the dimension line. Dimension to visible edges and faces you can build from, never to a hidden line. And never make the builder add: if they will need a total, give it."),
    W("Read a wall string",
      "The south wall of a room is 24'-0'' long. A 3'-0'' door sits in it, its center 6'-0'' from the west corner. How would you dimension that wall?",
      ["Chain first, close to the wall: west corner to the door center, 6'-0''.",
       "Then door center to the east corner: 24'-0'' minus 6'-0'' is 18'-0''.",
       "Farther out, one overall dimension, 24'-0''. The two chain pieces add up to it, which is how the builder checks your work."],
      "Pieces close in, totals farther out, and the pieces always add up."),
    M("Which belongs farthest from the plan?",
      ["The overall dimension", "The chain of small pieces", "The room name", "The door tag"], 0,
      "Overall dimensions sit outside the chains, so the short dimension lines never cross the long one."),
    NQ("A chain along a wall reads {a}'-0'' and {b}'-0''. What should the overall dimension read, in feet?",
       "The pieces of a chain add up to the overall: {a} + {b} = {A} feet.",
       {"a": [3, 12, 1], "b": [8, 20, 1]}, "a+b", {"a": 6, "b": 18}),
    M("A hidden line shows the edge of a footing under the slab. Should you dimension to it?",
      ["Yes, hidden lines are fine to dimension", "No, dimension to visible edges and faces; show the footing in a view where it is visible",
       "Only if you draw the dimension dashed too", "Only on the cover sheet"], 1,
      "A dimension to a hidden line is hard to read and easy to misread. Dimension the footing where it is seen, in a section or a foundation plan."),
    M("A dimension line runs through the middle of the room, across the room name. What is the usual fix?",
      ["Make the text smaller", "Move it outside the walls", "Delete the room name", "Draw it in red"], 1,
      "Outside the plan, the dimension reads clearly and the room stays readable."),
    D("Dimension the 24'-0'' x 16'-0'' room.",
      "The starter is a room with 6'' walls, measured to the outside faces: 24'-0'' wide, 16'-0'' deep. A 3'-0'' door in the south wall has its center 6'-0'' from the west corner. Give the builder the numbers.",
      ["Put an overall 24'-0'' width dimension along the north side, outside the room.",
       "Put an overall 16'-0'' depth dimension along the east side, outside the room.",
       "Chain the south wall: west corner to the door center (6'-0''), then door center to the east corner (18'-0''), outside the room.",
       "Keep every dimension line outside the walls."],
      ["Width: type D and Enter, then 0,16 Enter and 24,16 Enter. Picked left to right along the top, the dimension lands above the room.",
       "Depth: type D, then 24,16 and 24,0. Top to bottom on the east side puts it outside, to the right.",
       "Chain: type D, then 6,0 and 0,0. Then D again, 24,0 and 6,0. Right to left along the bottom puts both below the room, end to end on one line. (You can also tap DIM, then CONT in the Modify row to keep chaining with taps.)",
       "If a dimension lands inside, tap SELECT, tap the dimension, and tap Flip in the chip row.",
       SAVE_PLAN],
      from_base("room24x16", "Room dimensions starter", "PREXIS-L05",
                ["PREXIS L05: dimension the room. Overall 24'-0'' and 16'-0'', plus a chain",
                 "along the south wall to the door center. This note does not print."], (0, 21)),
      "PREXIS-L05",
      [chk("An overall dimension reads 24'-0''", "Type D, then 0,16 and 24,16.",
           dimLen={"len": 24, "tol": 0.042}),
       chk("An overall dimension reads 16'-0''", "Type D, then 24,16 and 24,0.",
           dimLen={"len": 16, "tol": 0.042}),
       chk("A chain of two or more dimensions runs end to end", "Type D, 6,0 and 0,0, then D, 24,0 and 6,0. The second starts where the first ended, on the same line.",
           chain={"min": 2}),
       chk("Every dimension line is outside the walls", "Select a dimension that sits inside the room and tap Flip.",
           dimsOutside=True),
       chk("Three or more dimensions on the DIMS layer", "The DIM tool puts dimensions on DIMS for you.",
           count={"type": "dim", "layer": "DIMS"}, min=3, noun="dimensions on DIMS")],
      "Overall sizes, a chain that adds up to one of them, and nothing crossing the room. A builder can lay this room out from the numbers alone."),
]}

L6 = {"title": "Walls and the floor plan", "keywords": ["drafting", "walls", "floor", "plan", "cut", "thickness", "ortho", "cabin", "rooms"], "steps": [
    C("A plan is a cut",
      "A floor plan is a horizontal section. Slice the building about 4'-0'' above the floor, lift off the top, and look straight down. Walls the cut passes through are drawn heavy, because you are looking at cut material. Things below the cut, like counters and the floor, are lighter. Things above it, like upper cabinets, are dashed."),
    C("Walls have thickness",
      "A wall is two lines, its two faces, not one. A wood stud wall with finishes is about 6'' thick; this course uses 6'' for every wall. Outside dimensions are measured to the outside faces. In CAD you usually draw a wall along its centerline, and the tool offsets the faces half the thickness each way."),
    C("Draw with numbers",
      "Typing points beats eyeballing them. Sovereign Draft takes absolute points like 12,0, lengths in feet and inches like 12'6'', and relative polar input like @8<45 (8 feet at 45 degrees from the last point). ORTHO locks the cursor to horizontal and vertical so a wall cannot drift a hair off square."),
    W("Centerline or outside face?",
      "The cabin is 36'-0'' x 24'-0'' to the outside faces, with 6'' walls. Where do you put the wall centerlines?",
      ["Half of 6'' is 3'', or 0.25 ft. The centerline sits 3'' inside each outside face.",
       "So the centerlines run from 0'-3'' to 35'-9'' one way and 0'-3'' to 23'-9'' the other: points 0.25,0.25 to 35.75,23.75.",
       "Check it: 35.75 - 0.25 = 35.5 ft of centerline, plus 3'' of wall at each end, is 36'-0'' outside."],
      "Outside size minus one wall thickness gives the centerline size."),
    M("The cut for a floor plan is usually taken about:",
      ["At the floor", "4'-0'' above the floor", "At the ceiling", "Through the roof ridge"], 1,
      "About 4'-0'' cuts through walls, doors and windows, so they all show."),
    NQ("A room's wall centerlines are {c}'-0'' apart and the walls are 6'' thick. How wide is it to the outside faces, in feet?",
       "Add half a wall on each side: {c} + 0.25 + 0.25 = {A} feet.",
       {"c": [10, 30, 1]}, "c+0.5", {"c": 12}),
    M("In a plan, a wall that the cut passes through is drawn:",
      ["Heavy, because it is cut material", "Dashed", "Thin and gray", "It is left out"], 0,
      "Cut walls carry the most weight on a plan. They are what the plan is about."),
    D("Draw the cabin shell and one partition, then find the rooms.",
      "The starter is empty except for this lesson's note. Draw the 36'-0'' x 24'-0'' cabin with 6'' walls and split it with one partition. This cabin carries through the rest of the course.",
      ["Draw the four outside walls, 6'' thick, 36'-0'' x 24'-0'' to the outside faces.",
       "Draw one partition wall from the south wall to the north wall at X 14'-0''.",
       "Run ROOMS so Sovereign Draft finds the rooms the walls enclose."],
      ["Check that the chip row says WALL 6''. Type WALL and Enter, then 0.25,0.25 Enter, 35.75,0.25 Enter, 35.75,23.75 Enter, 0.25,23.75 Enter and 0.25,0.25 Enter. Press Esc.",
       "Type WALL again, then 14,0.25 and 14,23.75, and press Esc.",
       "Type ROOMS and Enter. Two rooms appear with their areas.",
       "Type ZFIT if the cabin is off screen.",
       SAVE_PLAN],
      starter("Cabin walls starter", "PREXIS-L06", [], [
          "PREXIS L06: draw the 36'-0'' x 24'-0'' cabin with 6'' walls (WALL), one partition at",
          "X 14'-0'', then type ROOMS. This note does not print."], (0, 27)),
      "PREXIS-L06",
      [chk("The walls make a 36'-0'' x 24'-0'' cabin", "Use the WALL tool, not lines. Centerline points 0.25,0.25 to 35.75,23.75 give 36'-0'' x 24'-0'' outside.",
           footprint={"w": 36, "h": 24, "tol": 0.084}),
       chk("Five or more walls are 6'' thick", "Four outside walls and a partition, drawn with the chip on WALL 6''.",
           count={"type": "line", "kind": "wall", "th": [0.45, 0.55]}, distinct="g", min=5, noun="6'' walls", noun1="6'' wall"),
       chk("ROOMS found two or more rooms", "Type ROOMS after the walls close. A room needs walls all the way around it.",
           count={"type": "room"}, min=2, noun="rooms", noun1="room")],
      "A closed shell with real wall thickness, split into rooms that know their own area. Everything from here on, doors, schedules, elevations, grows out of these walls."),
]}

L7 = {"title": "Doors, windows and schedules", "keywords": ["drafting", "doors", "windows", "schedule", "swing", "tags", "openings", "cabin"], "steps": [
    C("Openings live in walls",
      "A door or window is not drawn on top of a wall; it cuts a gap in it. In plan a door shows as a leaf drawn open at 90 degrees with an arc for its swing. A window shows as thin lines across the wall: the glass and the sill. Both get a tag, a mark like D01 or W01."),
    C("Swing matters",
      "The swing arc shows which way the door opens and how much floor it needs. Doors usually swing into the room, against a wall, and never into a hallway or over a stair. An exterior door is often 3'-0'' wide; interior doors 2'-6'' to 3'-0''."),
    C("Schedules",
      "A schedule is a table that lists every door or window by its tag with its size and type. The plan says where; the schedule says what. Each tag on the plan must have a row in the schedule, and each row a tag on the plan. A schedule that misses an opening is a wrong order at the lumber yard."),
    W("Check a door schedule",
      "The plan shows tags D01, D02 and D03. The door schedule lists D01 and D02. What is wrong?",
      ["Every tag on the plan needs a row. D03 has none, so nobody will order that door.",
       "This happens when the schedule was made before the last door went in.",
       "Fix it by making the schedule again after the last door. In Sovereign Draft a schedule is a snapshot, so erase the old one and place a new one."],
      "Tags and rows must match one for one."),
    M("On a plan, the arc next to a door shows:",
      ["The door's swing", "A window", "A ceiling light", "The door's height"], 0,
      "The arc is the path of the door's edge as it opens."),
    M("A window schedule tells the builder:",
      ["Where each window goes", "What each tagged window is: size and type", "The roof pitch", "The paint color of every room"], 1,
      "Location comes from the plan; the schedule describes each tagged window."),
    NQ("A plan has {d} doors and {w} windows. How many rows (not counting the header rows) do the door and window schedules have together?",
       "One row per tag: {d} + {w} = {A} rows.",
       {"d": [2, 6, 1], "w": [3, 9, 1]}, "d+w", {"d": 3, "w": 4}),
    D("Put doors and windows in the cabin, then schedule them.",
      "The starter is the cabin from the last lesson with a second partition, so there are three rooms. Give it openings and the tables that describe them.",
      ["Place at least two doors, including the front door in the south wall.",
       "Place at least three windows in the outside walls.",
       "Place a door schedule that lists every door.",
       "Place a window schedule that lists every window."],
      ["Door: tap SELECT, tap a wall, then tap Door in the chip row, then tap the wall where the door goes. Front door: the south wall near X 25. More doors: the partition at X 14.",
       "Window: tap SELECT, tap an outside wall, tap Window in the chip row, and tap the wall where it goes. Try the north wall at X 7 and X 25 and the east wall.",
       "When every opening is in, type SCHEDULE door and Enter, then tap an empty spot right of the cabin. Then SCHEDULE window and tap below the first table.",
       SAVE_PLAN],
      from_base("cabin-walls", "Cabin openings starter", "PREXIS-L07",
                ["PREXIS L07: place 2 or more doors and 3 or more windows, then a door schedule",
                 "and a window schedule (SCHEDULE door, SCHEDULE window). This note does not print."], (0, 28)),
      "PREXIS-L07",
      [chk("Two or more doors", "Select a wall, tap Door, tap the wall.",
           count={"type": "insert", "def": "door"}, min=2, noun="doors", noun1="door"),
       chk("Three or more windows", "Select an outside wall, tap Window, tap the wall.",
           count={"type": "insert", "def": "window"}, min=3, noun="windows", noun1="window"),
       chk("A door schedule lists every door", "Type SCHEDULE door after the last door is in, and tap an empty spot.",
           schedule={"title": "DOOR", "def": "door"}),
       chk("A window schedule lists every window", "Type SCHEDULE window after the last window is in, and tap an empty spot.",
           schedule={"title": "WINDOW", "def": "window"})],
      "Every opening is tagged on the plan and described in a table. The plan and its schedules now agree, which is exactly what a builder checks first."),
]}

L8 = {"title": "Rooms, area and notes", "keywords": ["drafting", "rooms", "area", "square", "feet", "hatch", "notes", "labels", "cabin"], "steps": [
    C("Name every room",
      "A room name tells everyone what the space is for, and that drives everything from outlets to finishes. Names go in the middle of the room in capitals: KITCHEN, BATH, LIVING. Many offices put the area right under the name."),
    C("Net and gross area",
      "Net area is the floor inside the walls, what you can actually furnish. Gross area is measured to the outside faces of the walls, and it is what a building is usually priced and permitted by. The 36'-0'' x 24'-0'' cabin is 864 SF gross; its rooms add up to less, because the walls take up floor."),
    C("Hatch and notes",
      "A hatch is a fill pattern. On plans it marks materials and wet areas, like tile in a bath. Notes say what the drawing cannot show: GROSS AREA 864 SF, or TILE FLOOR, SEE FINISH SCHEDULE. Keep notes short, in capitals, and near what they describe."),
    W("Gross area of the cabin",
      "The cabin is 36'-0'' x 24'-0'' to the outside faces. What is its gross area, and why is the sum of the rooms smaller?",
      ["Gross area: 36 x 24 = 864 SF.",
       "The rooms are measured inside the walls. With 6'' walls the outside walls take a 3'' strip off every edge, and each partition takes another 6''.",
       "So the rooms add up to a little under 800 SF. Both numbers are right; say which one you mean."],
      "Gross to the outside faces, net inside the walls. Label which."),
    NQ("A room is {w}'-0'' x {d}'-0'' inside the walls. What is its area in square feet?",
       "Area is width times depth: {w} x {d} = {A} SF.",
       {"w": [8, 16, 1], "d": [6, 14, 1]}, "w*d", {"w": 12, "d": 10}),
    M("Which area is measured to the outside faces of the walls?",
      ["Net", "Gross", "Room", "Hatched"], 1,
      "Gross area includes the walls themselves."),
    M("A hatch in the bath on a floor plan most likely shows:",
      ["A tile or wet floor", "A hole in the floor", "The ceiling height", "Furniture"], 0,
      "Hatches mark materials. Wet areas like baths often get one so the floor finish stands out."),
    D("Name the rooms, hatch the bath and note the area.",
      "The starter is the cabin with its doors, windows and schedules. The rooms are still called ROOM 1, ROOM 2 and ROOM 3. Finish the plan.",
      ["Label the three rooms: the small southwest room is the BATH, the northwest room the KITCHEN, the big east room LIVING.",
       "Run ROOMS again so the rooms take the names of your labels.",
       "Hatch the bath floor.",
       "Add a note with the total area in SF: the rooms' total (net) or 864 SF (gross)."],
      ["Type T and Enter, tap near the top of the southwest room, type BATH and tap Place text. Do the same for KITCHEN and LIVING.",
       "Type ROOMS and Enter. Each room tag now shows only its area, because your label is its name.",
       "Type HATCH and Enter, tap the empty floor of the bath, then press Esc.",
       "Add the room areas the tags show (or use 864 for gross). Type T, tap below the cabin, and type for example TOTAL 788 SF or GROSS AREA 864 SF.",
       SAVE_PLAN],
      from_base("cabin-openings", "Cabin rooms starter", "PREXIS-L08",
                ["PREXIS L08: label BATH, KITCHEN and LIVING, type ROOMS, hatch the bath,",
                 "and note the total area in SF. This note does not print."], (0, 28)),
      "PREXIS-L08",
      [chk("Three rooms have real names", "Place a label inside each room, then type ROOMS so the rooms take the names.",
           count={"type": "room", "nameNot": "^\\s*ROOM\\s*\\d*\\s*$"}, min=3, noun="named rooms", noun1="named room"),
       chk("A hatch fills a floor inside the cabin", "Type HATCH and tap the empty floor of the bath.",
           count={"type": "hatch", "inBox": [-0.5, -0.5, 36.5, 24.5]}, min=1, noun="hatches inside the cabin", noun1="hatch inside the cabin"),
       chk("A note gives the total area in SF", "Add the room areas, or use 864 SF gross, and write it as text, like TOTAL 788 SF.",
           areaNote={"min": 780, "max": 870})],
      "Rooms with names, the wet area marked, and the area stated. Anyone can now read what this cabin is and how big it is without measuring a thing."),
]}

# ---------------------------------------------------------------- Unit 3: From plan to building

CABIN_NOTE_AT = (0, 28)

L9 = {"title": "Elevations", "keywords": ["drafting", "elevation", "elevations", "roof", "pitch", "plate", "height", "3d", "cabin"], "steps": [
    C("Elevations are views of the outside",
      "An elevation is an orthographic view of one side of the building, straight on, with no perspective. A plan usually gets four: south, east, north and west, named for the way each face looks. Heights you cannot show in plan live here: floor, window heads, plate, ridge."),
    C("Project from the plan",
      "Widths in an elevation come straight down from the plan: a window 7'-0'' from the corner in plan is 7'-0'' from the corner in the elevation. Heights come from the section or the model. That is lesson 4 again: two views share a size and line up."),
    C("Plate height and pitch",
      "The plate is the top of the wall, where the roof sits; 8'-0'' is a common plate height. Roof pitch is written as rise over a run of 12: 6:12 means the roof climbs 6'' for every 12'' it runs in. A hip roof slopes on all four sides; a gable roof slopes on two and leaves triangular gable ends."),
    W("How high is the ridge?",
      "The cabin is 24'-0'' deep. A gable roof at 6:12 runs from both long walls up to a ridge in the middle, on an 8'-0'' plate. Roughly how high is the ridge?",
      ["Each side runs half the depth: 12'-0''.",
       "At 6:12 the roof rises 6'' per foot of run, so 12 x 6'' = 72'' = 6'-0''.",
       "Ridge is about 8'-0'' + 6'-0'' = 14'-0'' above the floor, before the roof's own thickness."],
      "Rise = run x pitch / 12."),
    M("A roof pitch of 6:12 means:",
      ["6'' of rise for every 12'' of run", "6 feet of rise for a 12 foot building", "A 6 degree slope", "6 rafters per 12 feet"], 0,
      "Pitch is rise per 12 of run, in the same units."),
    NQ("A roof at {p}:12 runs {r}'-0'' from the wall to the ridge. How many feet does it rise?",
       "Rise = run x pitch / 12 = {r} x {p} / 12 = {A} feet.",
       {"p": [3, 12, 1], "r": [6, 18, 2]}, "r*p/12", {"p": 6, "r": 12}),
    M("In an elevation, a window's distance from the building corner comes from:",
      ["The plan", "The roof pitch", "The door schedule", "A guess"], 0,
      "Widths project straight down from the plan."),
    D("Model the cabin and generate its elevations.",
      "The starter is the finished cabin plan. Sovereign Draft can turn the walls into solids, put a roof on them, and draw all four elevations onto sheets. Then you label the pitch the way a drafter would.",
      ["Turn the plan into 3D walls.",
       "Add a hip roof at 6:12 (or a gable roof at 8:12).",
       "Generate the drawing set on sheets, which gives the four elevations.",
       "Add a note that states the roof pitch, like ROOF PITCH 6:12."],
      ["Type MODEL and Enter. The walls, doors and windows become solids.",
       "Type ROOF HIP 6 and Enter (or ROOF GABLE 8). Type 3D to look at it, then 2D to come back.",
       "Type DRAWINGS SHEETS and Enter. Elevation sheets A-201 to A-204 appear in the sheet picker (tabs on a wide screen).",
       "Type T, tap beside the cabin, and type ROOF PITCH 6:12 (or the pitch you used).",
       SAVE_PLAN],
      from_base("cabin-plan", "Cabin elevations starter", "PREXIS-L09",
                ["PREXIS L09: MODEL, ROOF HIP 6, DRAWINGS SHEETS, then a note with the pitch,",
                 "like ROOF PITCH 6:12. This note does not print."], CABIN_NOTE_AT),
      "PREXIS-L09",
      [chk("3D walls and a roof", "Type MODEL, then ROOF HIP 6.",
           solidNames=["WALL", "ROOF"]),
       chk("Elevation sheets in the set", "Type DRAWINGS SHEETS. DRAWINGS alone draws the views but makes no sheets.",
           sheet3={"match": "ELEVATION", "min": 1, "what": "an elevation"}),
       chk("A note states the roof pitch", "Type T and write the pitch as rise over 12, like ROOF PITCH 6:12.",
           count={"type": ["text", "mtext"], "text": "\\b\\d{1,2}\\s*:\\s*12\\b"}, min=1, noun="pitch notes", noun1="pitch note")],
      "Walls, a roof and four elevations, all projected from the same plan, so every window lines up with its place in the wall. The pitch note tells the framer how steep to cut."),
]}

L10 = {"title": "Sections", "keywords": ["drafting", "section", "sections", "cutting", "plane", "poche", "cut", "cabin"], "steps": [
    C("A section is a vertical cut",
      "A plan cuts the building horizontally. A section cuts it vertically, top to bottom, and shows what the cut reveals: wall thickness, floor and roof build up, ceiling heights, how the parts stack. It shows inside relationships no plan or elevation can."),
    C("The cutting-plane line",
      "On the plan, a heavy line with arrows at its ends marks where the section is cut and which way you look. A tag at each end, like A, names it, and the section drawing is titled to match: SECTION A-A. The line must cross the whole building, or the section cannot show it."),
    C("Poche",
      "Cut material is filled or hatched so it reads as solid; drafters call this poche. Things beyond the cut, seen but not sliced, are drawn as plain lines. Solid fill for cut, outline for beyond: that contrast is what makes a section readable."),
    W("Where to cut",
      "You want a section that shows the cabin's front door head and a window sill. Where does the cut go?",
      ["Pick a line that passes through the openings you want to explain. The front door is in the south wall near X 25; window W02 is in the north wall at X 25.",
       "A vertical cut at X 25, from below the south wall to above the north wall, slices both.",
       "Look toward the west so the partition shows beyond the cut."],
      "Cut through what needs explaining, all the way across."),
    M("What does a section show that a plan cannot?",
      ["Heights and how floors, walls and roof stack", "Room names", "The door swing", "The north arrow"], 0,
      "A plan is a horizontal slice; heights and build up need a vertical one."),
    M("The arrows on a cutting-plane line show:",
      ["Which way you look at the cut", "The wind direction", "Where the stair goes", "The roof slope"], 0,
      "The arrows point in the direction of view."),
    M("In a section, a wall the cut passes through is drawn:",
      ["Filled or hatched (poche)", "Dashed", "Left out", "As a center line"], 0,
      "Cut material gets poche so it reads as solid."),
    D("Cut a section through the cabin and put it on a sheet.",
      "The starter is the finished cabin plan. Cut it through the front door and the north window, so the section explains both.",
      ["Draw a section cut that starts outside one wall and ends outside the opposite wall, through the living room.",
       "Check that the section has its own sheet."],
      ["Type SE and Enter, then 25,-3 Enter and 25,27 Enter. The cut line, the section drawing and its sheet appear together.",
       "Open the sheet picker at the top (Model) and choose S-A to look at the section sheet. On a wide screen the S-A tab works too.",
       SAVE_PLAN],
      from_base("cabin-plan", "Cabin section starter", "PREXIS-L10",
                ["PREXIS L10: type SE and cut across the whole cabin through the living room,",
                 "like 25,-3 to 25,27. This note does not print."], CABIN_NOTE_AT),
      "PREXIS-L10",
      [chk("A section cut crosses the whole cabin", "Type SE, then a point outside the south wall and one outside the north wall, like 25,-3 and 25,27.",
           cut=True),
       chk("A section sheet is in the set", "SE makes the sheet for you. If you erased it, cut again.",
           sheet3={"match": "SECTION", "min": 1, "what": "a section"})],
      "One cut line on the plan, one section on its own sheet, and they share a name. The builder can now see the wall, floor and roof the plan only hinted at."),
]}

L11 = {"title": "The 3D model", "keywords": ["drafting", "3d", "model", "massing", "dormer", "takeoff", "quantity", "view", "cabin"], "steps": [
    C("Massing first",
      "Before details, architects study the massing: the overall blocks of the building and how they sit together. A 3D model of the walls and roof answers questions a plan cannot, like how a roof meets a wall, or how the cabin looks from the road."),
    C("Dormers and storeys",
      "A dormer is a small roofed box that stands up out of a sloped roof, to bring light and headroom into the attic. Stacking storeys repeats a floor upward. In Sovereign Draft, DORMER seats a dormer on the roof slope at a point you give, and STACK 2 makes a two storey version."),
    C("Takeoff from the model",
      "A takeoff lists quantities: volume of concrete, area of roofing, length of wall. Because the model knows every solid, Sovereign Draft's QTO writes a table of each solid's footprint, surface and volume. A saved view keeps a camera angle with the project so you can come back to the same picture."),
    W("Read a takeoff",
      "A takeoff table lists WALL at 470 CF and ROOF at 1760 CF. A 6'' wall is 0.5 ft thick. About how many square feet of wall face is that?",
      ["Volume = face area x thickness, so face area = volume / thickness.",
       "470 / 0.5 = 940 SF of wall, measured on one face.",
       "That is the kind of number siding and drywall are ordered from."],
      "Volume divided by thickness gives area."),
    M("A dormer is:",
      ["A roofed box standing out of a sloped roof", "A basement window", "A kind of door schedule", "The ridge line"], 0,
      "Dormers bring light and headroom into rooms under a roof."),
    NQ("A slab is {w}'-0'' x {d}'-0'' and 0.5 ft thick. What is its volume in cubic feet?",
       "Volume = {w} x {d} x 0.5 = {A} CF.",
       {"w": [10, 40, 2], "d": [8, 30, 2]}, "w*d*0.5", {"w": 36, "d": 24}),
    M("Why save a named 3D view with the project?",
      ["To come back to the same camera angle for reviews and renders", "It makes the file smaller", "It is required before printing", "It locks the model"], 0,
      "A saved view is a bookmark for the camera."),
    D("Grow the cabin into a 3D model with a dormer, a takeoff and a saved view.",
      "The starter is the finished cabin plan. Build the model, add a dormer on the front slope, list the quantities, and save a view of it.",
      ["Turn the plan into 3D walls and add a hip roof at 6:12.",
       "Put a dormer on the south slope of the roof, above the living room.",
       "Make a takeoff table of the solids.",
       "Open 3D, frame the cabin, and save the view with a name. (Optional: STACK 2 for a second storey.)"],
      ["Type MODEL and Enter, then ROOF HIP 6 and Enter.",
       "Type DORMER 25 3 and Enter. That seats a 6'-0'' dormer on the slope above X 25, Y 3.",
       "Type QTO and Enter. The MODEL TAKEOFF table lands beside the plan.",
       "Type 3D and Enter, drag to orbit until you like the view, then type VIEW SAVE FRONT and Enter. Type 2D to come back.",
       SAVE_PLAN],
      from_base("cabin-plan", "Cabin model starter", "PREXIS-L11",
                ["PREXIS L11: MODEL, ROOF HIP 6, DORMER 25 3, QTO, then in 3D type VIEW SAVE FRONT.",
                 "This note does not print."], CABIN_NOTE_AT),
      "PREXIS-L11",
      [chk("3D walls and a roof", "Type MODEL, then ROOF HIP 6.",
           solidNames=["WALL", "ROOF"]),
       chk("A dormer stands out of the roof", "Type DORMER 25 3. The point has to be on a sloped part of the roof.",
           dormer=True),
       chk("A takeoff table of the model", "Type QTO after the roof and dormer are on.",
           count={"type": "table", "title": "TAKEOFF"}, min=1, noun="takeoff tables", noun1="takeoff table"),
       chk("A saved 3D view", "Type 3D, frame the shot, then VIEW SAVE and a name, like VIEW SAVE FRONT.",
           views3d={"min": 1})],
      "Walls, roof, dormer, quantities and a camera you can return to. The model is now a tool for decisions, not just a picture."),
]}

L12 = {"title": "Capstone: the print set", "keywords": ["drafting", "capstone", "print", "set", "sheets", "index", "cover", "pdf", "issue", "cabin"], "steps": [
    C("A set, not a pile",
      "A print set is every sheet a builder needs, in order, each with its own number and a title block that says the same project and the same issuer. The cover (G-001) carries the project name and a sheet index listing every sheet in the set."),
    C("The usual order",
      "General sheets first (G), then architectural (A): plans in the 100s, elevations in the 200s, sections in the 300s. No two sheets share a number. When a sheet is added, the index on the cover changes too, or the set is wrong."),
    C("Issuing",
      "Issuing means sending the set out, today almost always as one PDF. Before you issue, check that every title block is filled in, the index matches the sheets, and the plan prints at its stated scale. Then name the file after the project and the date."),
    W("Check a sheet index",
      "A cover's index lists G-001, A-101, A-201 and A-301. The set also has A-102 Roof Plan and A-202 East Elevation. Is the set ready to issue?",
      ["No. Two sheets are missing from the index, so a reader would not know to look for them.",
       "Regenerate or edit the index so it lists all six sheets in order.",
       "Then check that no number repeats and every title block names the same project."],
      "The index is the set's table of contents. It has to be complete."),
    O("Put these sheets in print set order.",
      ["G-001 Cover and index", "A-101 Floor plan", "A-201 South elevation", "A-301 Section"],
      "General first, then plans, elevations and sections by series number."),
    M("Two sheets in a set are both numbered A-101. What should you do?",
      ["Renumber one so every sheet has its own number", "Leave it; the titles are different", "Delete the cover", "Print them on different paper"], 0,
      "People order and reference sheets by number. Duplicates cause wrong work in the field."),
    NQ("A set has a cover, {p} plan sheets, 4 elevation sheets and {s} section sheets. How many rows does the cover's sheet index need?",
       "One row per sheet, the cover included: 1 + {p} + 4 + {s} = {A}.",
       {"p": [1, 4, 1], "s": [1, 3, 1]}, "1+p+4+s", {"p": 2, "s": 1}),
    D("Issue the cabin's print set.",
      "The starter is the finished cabin plan with an empty title block. Turn it into a full set of sheets with a cover and index, finish the title block, and export the PDF. This drawing goes into My prints as your portfolio piece.",
      ["Name the project, and fill in Issued by and Drawn by.",
       "Generate the sheet set, which makes the cover G-001 with its index.",
       "Then generate the drawing set on sheets: floor plan, four elevations, a section and a roof plan.",
       "Check that every sheet has its own number and the cover's index lists them all.",
       "Export the set to PDF and open it."],
      ["Open the Menu (top right). Type a Project name, your name or company under Issued by, and your name under Drawn by. Tap outside the menu.",
       "Open the Menu, tap Sheet set, tap Generate sheet set. (It replaces the sheets, so do it first.)",
       "Type DRAWINGS SHEETS and Enter. It adds the plan, elevation and section sheets, gives any taken number the next free one, and rewrites the cover's index.",
       "Open the sheet picker at the top and look through the sheets.",
       "Menu, Sheet set, Export PDF. Open the file and check the plan sheet.",
       SAVE_PLAN],
      from_base("cabin-plan", "Cabin print set starter", "PREXIS-L12",
                ["PREXIS L12: fill the title block, Generate sheet set, then DRAWINGS SHEETS,",
                 "then Export PDF. This note does not print."], CABIN_NOTE_AT),
      "PREXIS-L12",
      [chk("The project has a real name", "Menu, then type a name in Project name. The starter name does not count.",
           field="name", notIn=["Untitled", "Cabin print set starter"]),
       chk("Issued by is filled in", "Menu, then your name or company under Issued by.",
           field="firm.company"),
       chk("Drawn by is filled in", "Menu, then your name under Drawn by.",
           field="firm.drawnBy"),
       chk("Six or more sheets, every number different", "Generate sheet set first, then DRAWINGS SHEETS.",
           sheetsUnique={"min": 6}),
       chk("A cover sheet", "Menu, Sheet set, Generate sheet set makes G-001.",
           sheet3={"match": "^G-|\\bCOVER\\b", "min": 1, "what": "a cover"}),
       chk("A floor plan sheet", "DRAWINGS SHEETS adds the FLOOR PLAN sheet.",
           sheet3={"match": "FLOOR PLAN", "min": 1, "what": "the floor plan"}),
       chk("Elevation sheets", "DRAWINGS SHEETS adds the four elevations, A-201 to A-204.",
           sheet3={"match": "ELEVATION", "min": 1, "what": "an elevation"}),
       chk("A section sheet", "DRAWINGS SHEETS adds A-301 SECTION.",
           sheet3={"match": "SECTION", "min": 1, "what": "a section"}),
       chk("The cover's index lists every sheet", "Run DRAWINGS SHEETS after Generate sheet set, so it rewrites the index.",
           coverIndex=True),
       chk("Every sheet has its title block", "Title blocks are on unless turned off in the Sheet set panel.",
           titleBlock=True),
       chk("My PDF opens and the plan prints at 1/4 inch", "Menu, Sheet set, Export PDF, then open the file.",
           confirm=True)],
      "A numbered, indexed, titled set of sheets, issued as one PDF, from a cabin you drew wall by wall. That is a real print set, and it is the first piece in your portfolio."),
]}


def _inches(v):
    if isinstance(v, str):
        return v.replace("''", '"')
    if isinstance(v, list):
        return [_inches(x) for x in v]
    if isinstance(v, dict):
        return {k: _inches(x) for k, x in v.items()}
    return v


def add(courses, picks):
    courses.append(_inches({
        "id": "drafting", "subject": "Drafting", "level": "Beginner", "title": "Drafting from scratch",
        "track": "drafting", "rev": "2026-10-06",
        "blurb": "Line types, scale, sheets and views, then a 24 x 36 cabin from walls to a full print set. Every lesson ends with a drawing you make in Sovereign Draft.",
        "units": [{"title": "Read the page", "lessons": [L1, L2, L3, L4]},
                  {"title": "Plan a room", "lessons": [L5, L6, L7, L8]},
                  {"title": "From plan to building", "lessons": [L9, L10, L11, L12]}],
    }))
    picks.append({"label": "Drafting", "course": "drafting", "u": 0, "l": 0, "topic": "Drafting"})
