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


def starter(name, stamp, entities, note, at, extra_layers=()):
    """A Sovereign Draft project (v7) the editor opens from a share link."""
    layers = [dict(l) for l in SD_LAYERS] + [dict(l) for l in extra_layers]
    layers.append({"name": stamp, "color": "#6b7c93", "aci": 8, "visible": True, "plot": False})
    ents = list(entities)
    for i, line in enumerate(note):
        ents.append({"type": "text", "layer": stamp, "x": at[0], "y": at[1] - i * 0.6, "size": 0.35, "content": line})
    # Sovereign Draft selects, edits and undoes by entity id and passes a
    # file's entities through untouched, so a starter must number them.
    ents = [dict(e, id=i + 1) for i, e in enumerate(ents)]
    return {"app": "sovereign-draft", "v": 7, "name": name, "layers": layers, "entities": ents,
            "idSeq": len(ents) + 1, "space": "model"}


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


SOON = [
    {"title": "Plan a room", "lessons": ["Dimensioning", "Walls and the floor plan", "Doors, windows and schedules", "Rooms, area and notes"]},
    {"title": "From plan to building", "lessons": ["Elevations", "Sections", "The 3D model", "Capstone: the print set"]},
]


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
        "track": "drafting", "rev": "2026-10-05",
        "blurb": "Line types, scale, sheets, orthographic views. Every lesson ends with a drawing you make in Sovereign Draft.",
        "units": [{"title": "Read the page", "lessons": [L1, L2, L3, L4]}],
        "soon": SOON,
    }))
    picks.append({"label": "Drafting", "course": "drafting", "u": 0, "l": 0, "topic": "Drafting"})
