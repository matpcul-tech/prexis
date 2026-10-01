"""Web track ladder: Intermediate, Advanced and Expert courses.

Every Build step grows the same Workshop site the learner started in
"Web pages from scratch". The Workshop holds one HTML page and one
stylesheet, and its preview never runs scripts, so:
  - DOM and CSS checks measure the rendered page (sel / cssContains),
  - htmlContains reads the page source (scripts included),
  - JavaScript logic is graded by code steps that really run,
  - work done outside Prexis (deploys, Git, DNS, config files) uses
    confirm checks (a self check) and url checks (paste a link).
Source plan: web_track_ladder.md. Rebuild with: python3 build_library.py
"""

# ---------- step helpers (match content.js shapes exactly) ----------

def C(heading, body, code=None):
    s = {"type": "concept", "heading": heading, "body": body}
    if code:
        s["code"] = code
    return s


def W(heading, problem, steps, takeaway, code=None):
    s = {"type": "worked", "heading": heading, "problem": problem, "steps": steps, "takeaway": takeaway}
    if code:
        s["code"] = code
    return s


def M(prompt, options, answer, explain, code=None):
    s = {"type": "mcq", "prompt": prompt, "options": options, "answer": answer, "explain": explain}
    if code:
        s["code"] = code
    return s


def O(prompt, items, explain, code_items=False, groups=None, note=None):
    s = {"type": "order", "prompt": prompt, "items": items, "explain": explain, "codeItems": code_items}
    if groups:
        s["groups"] = groups
    if note:
        s["orderNote"] = note
    return s


def B(prompt, example, explain, checks):
    return {"type": "build", "prompt": prompt, "example": example, "explain": explain, "checks": checks}


def K(prompt, starter, solution, tests, explain):
    return {"type": "code", "prompt": prompt, "starter": starter, "tests": tests, "solution": solution, "explain": explain}


# ---------- check helpers ----------

def has(sel, label):
    return {"sel": sel, "exists": True, "label": label}


def count(sel, n, label):
    return {"sel": sel, "count": n, "label": label}


def attr(sel, a, label, contains=None):
    c = {"sel": sel, "attr": a, "label": label}
    if contains:
        c["contains"] = contains
    return c


def style(sel, prop, label, **kw):
    c = {"sel": sel, "style": prop, "label": label}
    c.update(kw)
    return c


def none(sel, label):
    return {"sel": sel, "none": True, "label": label}


def css(text, label, negate=False):
    c = {"cssContains": text, "label": label}
    if negate:
        c["negate"] = True
    return c


def html(text, label, negate=False):
    c = {"htmlContains": text, "label": label}
    if negate:
        c["negate"] = True
    return c


def confirm(label):
    return {"confirm": True, "label": label}


def url(key, label, optional=False):
    c = {"url": key, "label": label}
    if optional:
        c["optional"] = True
    return c


def T(call, expect):
    return {"call": call, "expect": expect}


def L(title, keywords, steps):
    return {"title": title, "keywords": keywords, "steps": steps}


FAVICON = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>%F0%9F%8C%BF</text></svg>'

# =====================================================================
# Level 2: Intermediate
# =====================================================================

I1 = L("Put your site online", ["ship", "deploy", "hosting", "netlify", "github", "pages", "vercel", "export", "live", "publish", "favicon"], [
    C("A static site is just files",
      "Hosting is a computer that is always on and hands your files to anyone who asks. Your Workshop site is HTML and CSS with no server code, so any static host can serve it. GitHub Pages, Netlify and Vercel all have free plans with HTTPS built in."),
    M("Which files does a static host need to serve your Workshop site?",
      ["A database and a server program", "An index.html with your page and styles", "Only the CSS file", "A copy of Prexis itself"], 1,
      "Static hosting serves files as they are. index.html is the file a host sends when someone opens your address."),
    C("Export my site",
      "Open the Workshop and press Export my site. Prexis downloads one file, index.html. Your CSS is inlined in a style tag and your title, meta and icon tags move into the head. That single file is a complete website you can upload anywhere."),
    O("Put your site on Netlify Drop.",
      ["Press Export my site in the Workshop", "Put index.html alone in a new folder", "Open app.netlify.com/drop and sign in", "Drag the folder onto the page", "Open the URL Netlify gives you"],
      "Export, package, upload, verify. The folder matters: Netlify publishes whatever folder you drop, and serves index.html at the root.",
      note="Each step needs the one before it."),
    W("GitHub Pages without a terminal", "Publish the exported index.html from a GitHub repository using only the website.",
      ["Create a free account at github.com, then New repository. Name it yourname.github.io and make it public.",
       "On the repo page choose Add file, then Upload files. Drop index.html and press Commit changes.",
       "Open Settings, then Pages. Under Build and deployment pick Deploy from a branch, branch main, folder / (root). Save.",
       "Wait a minute, then open https://yourname.github.io. On Vercel the same file works: Add New, Project, import the repo, no build command, Deploy."],
      "Every free host follows the same shape: put index.html at the root, point the host at it, open the URL."),
    B("Get your page ready to ship: give it a title, a meta description and a favicon. Put them at the top of your HTML; Export moves them into the head for you. Then deploy it and paste your live URL.",
      "<title>Casa Verde</title>\n<meta name=\"description\" content=\"Weeknight recipes that actually work.\">\n<link rel=\"icon\" href=\"" + FAVICON + "\">",
      "A title for the tab, a description for search results, an icon for bookmarks. Your site now exists on the real internet.",
      [has("title", "A title element"),
       attr("meta[name=\"description\"]", "content", "A meta description with content"),
       attr("link[rel~=\"icon\"]", "href", "A favicon link with an href"),
       url("liveUrl", "Your live URL (starts with https://)")]),
    M("You uploaded your site but the root URL shows a 404 page. What is the most likely cause?",
      ["DNS is broken", "The CSS is too long", "The file is not named index.html, or it sits inside a subfolder", "HTTPS is off"], 2,
      "Hosts look for index.html at the root of what you published. A file named mysite.html, or one tucked inside a folder, never gets served at /."),
])

I2 = L("Multi page sites and navigation", ["pages", "navigation", "nav", "links", "relative", "paths", "aria-current", "multi"], [
    C("Paths are directions",
      "href=\"about.html\" means: a file next to this one. href=\"../index.html\" means: up one folder, then index.html. href=\"/\" means: the root of the site. Relative links keep working on any host, any domain, and on your own computer.",
      "<a href=\"about.html\">About</a>\n<a href=\"../index.html\">Home</a>"),
    M("You are on /blog/post.html. Which href reaches the home page at /index.html?",
      ["index.html", "../index.html", "./blog/index.html", "post.html"], 1,
      "index.html alone would look inside /blog/. ../ climbs one folder to the root first."),
    C("Mark where you are",
      "aria-current=\"page\" on the link to the current page tells screen readers you are here, and gives you a styling hook. Every page has the same nav; only the aria-current link changes."),
    B("Give your site a shared nav: a nav element with links to index.html, about.html and contact.html, and aria-current=\"page\" on the Home link. The Workshop holds one page; after you export, copy it to make about.html and contact.html and move aria-current in each copy.",
      "<nav aria-label=\"Main\">\n  <a href=\"index.html\" aria-current=\"page\">Home</a>\n  <a href=\"about.html\">About</a>\n  <a href=\"contact.html\">Contact</a>\n</nav>",
      "One nav, copied to every page, with the current page marked. Visitors and screen readers both know where they are.",
      [count("nav a", 3, "A nav with at least 3 links"),
       has("nav a[href$=\"about.html\"]", "A link to about.html"),
       has("nav a[href$=\"contact.html\"]", "A link to contact.html"),
       has("nav [aria-current=\"page\"]", "One link marked aria-current=\"page\"")]),
    B("Style the current link so sighted visitors see it too: make nav links with aria-current=\"page\" bold (font-weight 600 or more).",
      "nav [aria-current=\"page\"] {\n  font-weight: 700;\n  text-decoration: underline;\n}",
      "The attribute does double duty: meaning for assistive tech, a selector for your CSS.",
      [css("[aria-current", "A rule targets [aria-current]"),
       style("nav [aria-current=\"page\"]", "fontWeight", "The current link renders at weight 600 or more", minPx=600)]),
    O("Add a new page without breaking links.",
      ["Export your current page as the template", "Copy it and rename the copy about.html", "Change the title, h1 and aria-current in the copy", "Add the about.html link to the nav on every page", "Click every nav link on the live site"],
      "Copy, change, link, verify. Skipping the last step is how broken links reach visitors.",
      note="Each step needs the one before it: you cannot edit a copy before it exists, or test links before they are added."),
    M("Why use relative links like about.html instead of https://mysite.com/about.html for your own pages?",
      ["Browsers require it", "They keep working on any host, preview URL or domain", "Search engines rank them higher", "They hide your domain name"], 1,
      "Relative links survive moving the site. Absolute links to your own domain break on preview deploys and on your laptop."),
])

I3 = L("Forms that work", ["forms", "form", "input", "label", "validation", "contact", "email", "netlify", "formspree", "required"], [
    C("The parts of a form",
      "A form wraps inputs. Every input gets a label whose for matches the input's id. type=\"email\" and type=\"tel\" bring up the right phone keyboard. A button with type=\"submit\" sends it.",
      "<form>\n  <label for=\"email\">Email</label>\n  <input id=\"email\" name=\"email\" type=\"email\" required>\n  <button type=\"submit\">Send</button>\n</form>"),
    M("Why should every input have a label whose for matches the input's id?",
      ["It makes the field required", "It sends the label text to the server", "Screen readers announce it, and clicking the label focuses the input", "It styles the input automatically"], 2,
      "The pairing is meaning, not decoration. It also makes small checkboxes easier to hit, since the label becomes part of the target."),
    C("Validation you get for free",
      "required, type=\"email\", minlength and pattern make the browser block a bad submit and explain why, with no JavaScript. Style the problem with :user-invalid so errors show after someone has typed, not on page load."),
    B("Add a contact form: an email input with id=\"email\" that is required, a label for it, a textarea for the message, and a submit button.",
      "<form>\n  <label for=\"name\">Name</label>\n  <input id=\"name\" name=\"name\" required>\n  <label for=\"email\">Email</label>\n  <input id=\"email\" name=\"email\" type=\"email\" required>\n  <label for=\"message\">Message</label>\n  <textarea id=\"message\" name=\"message\" minlength=\"10\" required></textarea>\n  <button type=\"submit\">Send</button>\n</form>",
      "Labeled, typed and required. The browser now refuses an empty or malformed email before it leaves the page.",
      [has("form", "A form element"),
       has("form input#email[type=\"email\"][required]", "A required email input with id=\"email\""),
       has("form label[for=\"email\"]", "A label whose for is \"email\""),
       has("form textarea", "A textarea for the message"),
       has("form button[type=\"submit\"]", "A submit button")]),
    C("Sending without a server",
      "A static host cannot run code, so a form service receives the submission. Netlify Forms: add data-netlify=\"true\" and a name to the form. Formspree: set action to your Formspree URL. Both want method=\"post\". A hidden honeypot field catches bots, because people never fill in a field they cannot see."),
    B("Wire the form up: method=\"post\", either data-netlify=\"true\" or an action URL, and a hidden honeypot input named bot-field.",
      "<form name=\"contact\" method=\"post\" data-netlify=\"true\" netlify-honeypot=\"bot-field\">\n  <p hidden><label>Skip this <input name=\"bot-field\"></label></p>\n  ...\n</form>",
      "Posted, routed to a service, and guarded against the laziest bots. Submit it once on the live site to confirm it arrives.",
      [has("form[method=\"post\" i]", "The form uses method=\"post\""),
       has("form[data-netlify], form[action]", "The form has data-netlify or an action"),
       has("form input[name=\"bot-field\"], form input[name=\"_gotcha\"]", "A honeypot input (bot-field or _gotcha)")]),
    K("Browsers validate, but your code should too. Write formErrors(fields) that returns an array of the field names that are invalid, in this order: \"name\" if empty after trimming, \"email\" if it lacks an @ or a dot after the @, \"message\" if shorter than 10 characters after trimming.",
      "function formErrors(fields) {\n  const errors = [];\n  \n  return errors;\n}",
      "function formErrors(fields) {\n  const errors = [];\n  if (!String(fields.name || \"\").trim()) errors.push(\"name\");\n  const email = String(fields.email || \"\");\n  const at = email.indexOf(\"@\");\n  if (at < 1 || email.indexOf(\".\", at) < 0) errors.push(\"email\");\n  if (String(fields.message || \"\").trim().length < 10) errors.push(\"message\");\n  return errors;\n}",
      [T("formErrors({ name: \"Ada\", email: \"ada@example.com\", message: \"Hello there, friend\" })", []),
       T("formErrors({ name: \"  \", email: \"ada@example.com\", message: \"Hello there, friend\" })", ["name"]),
       T("formErrors({ name: \"Ada\", email: \"ada.example.com\", message: \"Hi\" })", ["email", "message"]),
       T("formErrors({ name: \"Ada\", email: \"ada@example\", message: \"Long enough message\" })", ["email"])],
      "Trim before testing, and return every problem at once so the person fixes them in one pass."),
])

I4 = L("Semantic HTML, SEO, and sharing", ["seo", "meta", "description", "open", "graph", "sharing", "semantic", "article", "section", "time", "search"], [
    C("What search results show",
      "The title element becomes the blue link. The meta description often becomes the text under it. One clear h1 tells search engines and screen readers what the page is about.",
      "<title>Casa Verde: weeknight recipes</title>\n<meta name=\"description\" content=\"Thirty-minute dinners that actually work.\">"),
    M("Which tag usually sets the text under your link in a search result?",
      ["<meta name=\"keywords\">", "<meta name=\"description\">", "<h2>", "<meta charset=\"utf-8\">"], 1,
      "Search engines ignore the keywords tag today. The description is your pitch in the results page."),
    C("Previews when people share",
      "Open Graph tags control the card you see when a link is pasted into a chat or social app: og:title, og:description and og:image. The image must be an absolute https URL, ideally 1200 by 630 pixels."),
    B("Add sharing tags: a meta description, og:title, and an og:image whose content is an absolute https URL.",
      "<meta name=\"description\" content=\"Weeknight recipes that actually work.\">\n<meta property=\"og:title\" content=\"Casa Verde\">\n<meta property=\"og:description\" content=\"Weeknight recipes that actually work.\">\n<meta property=\"og:image\" content=\"https://example.com/share.png\">",
      "Paste your live URL into a chat after you redeploy. The card you see is these tags.",
      [attr("meta[name=\"description\"]", "content", "A meta description"),
       attr("meta[property=\"og:title\"]", "content", "An og:title tag"),
       attr("meta[property=\"og:image\"]", "content", "og:image uses an https URL", contains="https://")]),
    C("Elements that say what they are",
      "article: a piece that makes sense alone, like a post or recipe. section: a themed group with its own heading. aside: related but not essential. time with a datetime attribute: a date machines can read."),
    B("Add a semantic content block: an article, a section with its own heading, and a time element with a datetime attribute.",
      "<section>\n  <h2>Latest</h2>\n  <article class=\"card\">\n    <h3>Lemon pasta</h3>\n    <p>Posted <time datetime=\"2026-09-30\">30 September</time></p>\n  </article>\n</section>",
      "The page looks the same, but now it describes itself to search engines and assistive tech.",
      [has("article", "An article element"),
       has("section h2, section h3", "A section with a heading inside"),
       attr("time", "datetime", "A time element with datetime")]),
    O("Order what a crawler does with your page, in the model from this lesson.",
      ["Fetch the HTML", "Read the title and meta description", "Read the headings and main content", "Follow the links to more pages"],
      "It has to fetch before it reads, and it finds new pages through the links it reads. That is why internal links matter for SEO.",
      groups=[[1, 2]], note="Fetch comes first and following links comes last. The two reading steps can swap."),
])

I5 = L("The cascade, specificity, and states", ["cascade", "specificity", "hover", "focus", "pseudo", "states", "before", "after", "important"], [
    C("Who wins",
      "When two rules set the same property, the browser compares specificity: inline style, then ids, then classes, attributes and pseudo-classes, then elements. On a tie, the later rule wins.",
      "#menu a { color: red; }   /* 1 id, 1 element */\n.nav a { color: blue; }   /* 1 class, 1 element */"),
    M("Both rules match the same link. Which color wins?",
      ["blue, because .nav a comes later", "red, because one id outweighs any number of classes", "They tie, so the browser picks", "Neither, links ignore color"], 1,
      "Source order only breaks ties. An id beats classes no matter where it sits."),
    C("States and pseudo-elements",
      ":hover and :focus-visible react to the visitor. ::before and ::after add decoration without new HTML, and they need a content property to appear.",
      ".card:hover { transform: translateY(-2px); }\na:focus-visible { outline: 3px solid; }\n.card h3::before { content: \"# \"; }"),
    B("Add interactive states: a .card:hover rule, a :focus-visible rule, and a ::before or ::after with content. Do it without !important.",
      ".card:hover {\n  box-shadow: 0 4px 12px rgba(0,0,0,.15);\n}\na:focus-visible {\n  outline: 3px solid #4f46e5;\n  outline-offset: 2px;\n}\n.card h3::after {\n  content: \" >\";\n}",
      "Hover for mice, focus-visible for keyboards, and decoration that stays out of your HTML.",
      [css(".card:hover", "A .card:hover rule"),
       css(":focus-visible", "A :focus-visible rule"),
       css("content:", "A pseudo-element with content"),
       css("!important", "No !important in your stylesheet", negate=True)]),
    M("A style refuses to apply. What is the best first move?",
      ["Inspect the element in DevTools and see which rule wins", "Add !important", "Rewrite the stylesheet", "Clear the browser cache"], 0,
      "DevTools shows every matching rule, crossed out or not. Guessing with !important hides the cause."),
    O("Order these from lowest to highest specificity.",
      ["p", ".card", ".card p", "#main", "style=\"\" (inline)"],
      "Elements, then classes, then a class plus element, then an id, then inline style.",
      code_items=True),
])

I6 = L("Motion with care", ["animation", "transition", "keyframes", "motion", "reduced", "transform", "opacity"], [
    C("Two kinds of motion",
      "A transition animates between two states when something changes, like a hover. @keyframes defines a sequence that runs on its own, like an entrance.",
      ".card { transition: transform 200ms ease; }\n@keyframes rise { from { opacity: 0; transform: translateY(8px); } }"),
    M("Which properties are cheapest to animate?",
      ["width and height", "top and left", "transform and opacity", "margin and padding"], 2,
      "The browser can move and fade a layer without redoing layout. Animating size or position forces layout on every frame."),
    C("Respect the setting",
      "Some people get dizzy or sick from motion. Operating systems let them ask for less, and CSS reads it as prefers-reduced-motion. Honor it by removing or shortening animations."),
    B("Add motion: a transition on .card, a hover rule that uses transform, an @keyframes animation, and a prefers-reduced-motion rule that turns motion down.",
      ".card { transition: transform 200ms ease; }\n.card:hover { transform: translateY(-3px); }\n@keyframes rise {\n  from { opacity: 0; transform: translateY(8px); }\n}\nh1 { animation: rise 400ms ease both; }\n@media (prefers-reduced-motion: reduce) {\n  .card, h1 { animation: none; transition: none; }\n}",
      "Motion that helps, and an off switch for the people it hurts.",
      [style(".card", "transitionDuration", ".card has a transition", **{"not": "0s"}),
       css("transform", "A rule uses transform"),
       css("@keyframes", "An @keyframes animation"),
       css("prefers-reduced-motion", "A prefers-reduced-motion rule")]),
    M("A visitor says your page animation makes them dizzy. What should the site do?",
      ["Make the animation faster", "Honor prefers-reduced-motion and stop or tone down the motion", "Add a warning banner", "Nothing, it is their device"], 1,
      "They already told their device. The media query is how your site listens."),
    O("Add a safe animation.",
      ["Pick one element where motion helps", "Animate only transform or opacity", "Keep UI feedback short, about 200 to 300ms", "Add a reduced-motion override", "Test with reduced motion turned on"],
      "Choose with purpose, animate cheaply, keep it brief, give an off switch, then test.",
      groups=[[1, 2]], note="Steps 2 and 3 can swap; the check accepts either."),
])

I7 = L("Images done right", ["images", "srcset", "picture", "webp", "avif", "lazy", "responsive", "formats"], [
    C("Pick the right format",
      "JPEG for photos, PNG for screenshots with sharp edges, SVG for logos and icons, WebP or AVIF for smaller photos with the same quality. A 4000 pixel photo shown 800 pixels wide wastes most of its bytes."),
    M("Which format fits a logo best?",
      ["JPEG", "SVG", "GIF", "BMP"], 1,
      "SVG is drawn from shapes, so it stays sharp at every size and is usually tiny."),
    C("Let the browser choose",
      "srcset lists the same image at several widths. sizes says how wide it displays. The browser downloads the smallest file that looks sharp. picture with source elements offers new formats with a fallback.",
      "<picture>\n  <source type=\"image/webp\" srcset=\"hero-800.webp 800w, hero-1600.webp 1600w\">\n  <img src=\"hero-800.jpg\" srcset=\"hero-800.jpg 800w, hero-1600.jpg 1600w\" sizes=\"100vw\" width=\"1600\" height=\"900\" alt=\"Lemon pasta in a blue bowl\">\n</picture>"),
    B("Make one image responsive: wrap it in picture with a source element, give the img a srcset, width and height, and lazy-load an image that sits further down the page.",
      "<picture>\n  <source type=\"image/webp\" srcset=\"https://picsum.photos/id/292/800/450.webp 800w\">\n  <img src=\"https://picsum.photos/id/292/800/450\" srcset=\"https://picsum.photos/id/292/800/450 800w, https://picsum.photos/id/292/1600/900 1600w\" sizes=\"100vw\" width=\"800\" height=\"450\" alt=\"Ingredients on a table\">\n</picture>\n<img src=\"https://picsum.photos/id/429/600/400\" loading=\"lazy\" width=\"600\" height=\"400\" alt=\"A finished dish\">",
      "Phones get small files, big screens get sharp ones, and images below the fold wait until someone scrolls.",
      [has("picture source", "A picture element with a source"),
       attr("img[srcset]", "srcset", "An img with srcset"),
       has("img[width][height]", "An img with width and height"),
       has("img[loading=\"lazy\"]", "An img with loading=\"lazy\"")]),
    M("Why set width and height on images?",
      ["They make the file smaller", "The browser reserves the space, so text does not jump when the image arrives", "They are required for alt text to work", "They turn on lazy loading"], 1,
      "Without dimensions the page reflows when each image loads. That jump is layout shift, and it is measured."),
    O("Add a new photo to the site properly.",
      ["Resize the original to the largest size you show", "Export WebP plus a JPEG fallback", "Add width, height and alt", "Add srcset and sizes", "Lazy-load it if it sits below the fold"],
      "Prepare the files first, then describe them in HTML.",
      groups=[[2, 3, 4]], note="The HTML attributes in steps 3 to 5 can go in any order; the check accepts them."),
])

I8 = L("A little JavaScript on your page", ["javascript", "dom", "events", "menu", "dark", "mode", "theme", "localstorage", "toggle", "script"], [
    C("Three moves cover most page scripts",
      "Find an element with querySelector, listen with addEventListener, change something with classList or setAttribute. Put the script at the end of body, or use defer on an external file. The Prexis preview never runs scripts, for your safety; checks read your code, the code step below runs your logic, and your exported site runs it for real.",
      "const btn = document.querySelector(\".menu-toggle\");\nbtn.addEventListener(\"click\", () => {\n  const open = btn.getAttribute(\"aria-expanded\") === \"true\";\n  btn.setAttribute(\"aria-expanded\", String(!open));\n  document.querySelector(\"nav\").classList.toggle(\"open\");\n});"),
    M("Why use a button element for the menu toggle instead of a div?",
      ["Divs cannot have click handlers", "A button is focusable and works with Enter and Space for free", "Buttons load faster", "Divs break CSS"], 1,
      "Keyboard support and the correct role come built in. A clickable div needs all of that rebuilt by hand."),
    B("Add a mobile menu: a button with class menu-toggle and aria-expanded=\"false\", and a script that toggles a class with classList.toggle.",
      "<button class=\"menu-toggle\" aria-expanded=\"false\">Menu</button>\n<script>\n  const btn = document.querySelector(\".menu-toggle\");\n  btn.addEventListener(\"click\", () => {\n    const open = btn.getAttribute(\"aria-expanded\") === \"true\";\n    btn.setAttribute(\"aria-expanded\", String(!open));\n    document.querySelector(\"nav\").classList.toggle(\"open\");\n  });\n</script>",
      "aria-expanded tells screen readers the menu state; the class tells your CSS.",
      [has("button.menu-toggle", "A button with class menu-toggle"),
       attr("button.menu-toggle", "aria-expanded", "The button has aria-expanded"),
       has("script", "A script element"),
       html("classList.toggle", "The script uses classList.toggle")]),
    C("Dark mode from your tokens",
      "You already keep colors in custom properties. Redefine them under [data-theme=\"dark\"] on the html element, flip that attribute with a button, and save the choice in localStorage so it sticks.",
      "[data-theme=\"dark\"] {\n  --paper: #1d1f24;\n  --ink: #f1efe8;\n}"),
    K("Write pickTheme(saved, prefersDark). Return saved when it is \"light\" or \"dark\". Otherwise return \"dark\" if prefersDark is true, else \"light\".",
      "function pickTheme(saved, prefersDark) {\n  \n}",
      "function pickTheme(saved, prefersDark) {\n  if (saved === \"light\" || saved === \"dark\") return saved;\n  return prefersDark ? \"dark\" : \"light\";\n}",
      [T("pickTheme(\"dark\", false)", "dark"), T("pickTheme(\"light\", true)", "light"),
       T("pickTheme(null, true)", "dark"), T("pickTheme(\"purple\", false)", "light")],
      "A saved choice beats the system setting; the system setting beats your default."),
    B("Wire dark mode: a [data-theme=\"dark\"] rule in your CSS that changes your tokens, a button with class theme-toggle, and a script that saves the choice with localStorage.",
      "<button class=\"theme-toggle\">Dark mode</button>\n<script>\n  const root = document.documentElement;\n  root.dataset.theme = localStorage.getItem(\"theme\") || \"light\";\n  document.querySelector(\".theme-toggle\").addEventListener(\"click\", () => {\n    root.dataset.theme = root.dataset.theme === \"dark\" ? \"light\" : \"dark\";\n    localStorage.setItem(\"theme\", root.dataset.theme);\n  });\n</script>\n\n/* CSS */\n[data-theme=\"dark\"] { --paper: #1d1f24; --ink: #f1efe8; }",
      "Export and open it in a browser: the toggle works and remembers your choice after a reload.",
      [css("[data-theme=\"dark\"]", "A [data-theme=\"dark\"] rule in your CSS"),
       has("button.theme-toggle", "A button with class theme-toggle"),
       html("localStorage", "The script saves the choice in localStorage")]),
    M("The page flashes light for a moment before going dark. What is the fix?",
      ["Add a transition to body", "Set data-theme in a tiny script in the head, before the page paints", "Load the script with async", "Use a darker light theme"], 1,
      "A script at the end of body runs after the first paint. Reading the saved theme in the head sets it before anything shows."),
])

I9 = L("Git and GitHub for real", ["git", "github", "commit", "push", "repository", "repo", "version", "control", "pages", "capstone"], [
    C("Snapshots with a story",
      "Git saves snapshots of your files called commits, each with a message saying why. GitHub stores your repository online, shows the history, and can publish it with GitHub Pages. If a change breaks the site, you can go back to any commit."),
    O("Order the everyday Git loop.",
      ["Edit your files", "git add index.html", "git commit -m \"Add contact form\"", "git push"],
      "Change, stage, snapshot, upload. Nothing reaches GitHub until you push.",
      code_items=True, note="Each command works on the result of the one before it."),
    W("From a folder to a published repo", "Your exported index.html sits in a folder called my-site. Put it on GitHub from a terminal.",
      ["cd my-site, then git init to start a repository.",
       "git add index.html, then git commit -m \"First version\".",
       "Create an empty repo on github.com, then git remote add origin https://github.com/you/my-site.git",
       "git branch -M main, then git push -u origin main. In the repo, Settings, Pages, deploy from main. Each future push updates the site."],
      "Once the remote is set, publishing is git push.",
      code="git init\ngit add index.html\ngit commit -m \"First version\"\ngit branch -M main\ngit remote add origin https://github.com/you/my-site.git\ngit push -u origin main"),
    M("Which commit message helps you most six months from now?",
      ["stuff", "fix", "Add contact form with email validation", "asdfgh"], 2,
      "Say what changed and why in a short line. History is only searchable if the messages mean something."),
    M("You pushed a change but the live site still shows the old version. What do you check first?",
      ["Delete the repository", "The Pages or Actions tab, to see if the deploy finished or failed", "Buy a new domain", "Rewrite the commit"], 1,
      "Publishing takes a minute and can fail. The deploy status tells you which one happened."),
    B("Intermediate capstone. Your site should have everything from this level: a nav with 3 links and aria-current, a contact form, a meta description and og:image, a favicon, a responsive image, a theme toggle, and a footer link to your GitHub repo. Commit it, push it, and paste your repo URL.",
      "<footer>\n  <p>Source on <a href=\"https://github.com/you/my-site\">GitHub</a></p>\n</footer>",
      "A real multi page site, live, in Git, with a form and dark mode. You run a website now.",
      [count("nav a", 3, "Nav with at least 3 links"),
       has("nav [aria-current=\"page\"]", "Current page marked with aria-current"),
       has("form input[type=\"email\"]", "A contact form with an email input"),
       attr("meta[name=\"description\"]", "content", "A meta description"),
       attr("meta[property=\"og:image\"]", "content", "An og:image tag"),
       attr("link[rel~=\"icon\"]", "href", "A favicon link"),
       has("img[srcset]", "A responsive image with srcset"),
       has("button.theme-toggle", "A theme toggle button"),
       has("footer a[href*=\"github.com\"]", "A footer link to your GitHub repo"),
       confirm("I committed and pushed this version to GitHub"),
       url("repoUrl", "Your GitHub repo URL")]),
])

# =====================================================================
# Level 3: Advanced
# =====================================================================

A1 = L("Modern CSS architecture", ["css", "architecture", "layer", "container", "queries", "has", "where", "bem"], [
    C("Names that scale",
      "Pick one naming pattern and keep it. BEM names a block, its elements and variants: .card, .card__title, .card--featured. Anyone reading the HTML knows which CSS owns it."),
    C("Newer tools that remove hacks",
      "@layer sets the order your CSS groups win in, so a utility class beats a component without specificity fights. Container queries style a component by the width of its container, not the window. :has() styles a parent based on what it contains.",
      "@layer reset, base, components, utilities;\n.cards { container-type: inline-size; }\n@container (min-width: 500px) { .card { display: flex; } }\n.card:has(img) { padding-top: 0; }"),
    M("When is a container query better than a media query?",
      ["When the whole page changes at a phone width", "When the same component appears in a wide main area and a narrow sidebar", "When printing", "Never, they do the same thing"], 1,
      "Media queries know the window. A card does not care about the window; it cares about the space it was given."),
    B("Refactor your CSS: declare layers with @layer, rename a card heading to class card__title, and make your card wrapper a container with an @container rule.",
      "@layer reset, base, components;\n@layer components {\n  .cards { container-type: inline-size; }\n  @container (min-width: 500px) {\n    .card { display: flex; gap: 12px; }\n  }\n}\n\n<h3 class=\"card__title\">Lemon pasta</h3>",
      "Your styles now have an explicit order and your cards adapt to wherever you put them.",
      [css("@layer", "An @layer rule"),
       has(".card__title", "An element with class card__title"),
       css("container-type", "A container-type declaration"),
       css("@container", "An @container rule")]),
    B("Use smarter selectors: make sure at least one card contains an image so .card:has(img) matches, and write a :where( rule.",
      ".card:has(img) { padding-top: 0; }\n:where(.card, .panel) h3 { margin-top: 0; }",
      ":has() replaces the extra class you used to add by hand. :where() groups selectors with zero specificity, so it never fights your components.",
      [has(".card:has(img)", "A card that contains an image"),
       css(":has(", "A rule that uses :has("),
       css(":where(", "A rule that uses :where(")]),
    O("Order the layers from first (weakest) to last (strongest).",
      ["reset", "base", "components", "utilities"],
      "Later layers win. Utilities sit last so a single class can override a component on purpose.",
      code_items=True, note="Order matters here: in @layer, the order you declare is the order that wins."),
])

A2 = L("JavaScript modules and components", ["modules", "import", "export", "components", "template", "literals", "render", "textcontent", "innerhtml"], [
    C("Modules keep code apart",
      "type=\"module\" scripts have their own scope, run after the HTML is parsed, and can import from other files. Each file exports what others may use.",
      "// projects.js\nexport const projects = [{ title: \"Lemon pasta\", summary: \"Ten minutes\" }];\n\n// main.js\nimport { projects } from \"./projects.js\";"),
    M("What does type=\"module\" change about a script?",
      ["Nothing, it is only a label", "It gets its own scope, is deferred, and can use import", "It runs before the HTML loads", "It can only contain JSON"], 1,
      "Module scripts behave like defer by default and never leak variables onto window."),
    C("Data in, markup out",
      "Keep repeated content as an array of objects. A small function turns one object into markup, and map turns the array into a page section. Change the data, the page follows.",
      "const html = projects.map(renderCard).join(\"\");"),
    K("Write renderCard(p) so it returns exactly: <article class=\"card\"><h3 class=\"card__title\">TITLE</h3><p>SUMMARY</p></article> using p.title and p.summary. Use a template literal.",
      "function renderCard(p) {\n  return ``;\n}",
      "function renderCard(p) {\n  return `<article class=\"card\"><h3 class=\"card__title\">${p.title}</h3><p>${p.summary}</p></article>`;\n}",
      [T("renderCard({ title: \"Lemon pasta\", summary: \"Ten minutes\" })", "<article class=\"card\"><h3 class=\"card__title\">Lemon pasta</h3><p>Ten minutes</p></article>"),
       T("[{ title: \"A\", summary: \"1\" }, { title: \"B\", summary: \"2\" }].map(renderCard).join(\"\")", "<article class=\"card\"><h3 class=\"card__title\">A</h3><p>1</p></article><article class=\"card\"><h3 class=\"card__title\">B</h3><p>2</p></article>")],
      "One function, any number of cards. This is the core idea behind every component framework."),
    B("Make your cards data-driven: add a module script that defines renderCard and maps over an array into .grid. Keep three static .card elements inside .grid as the fallback; the preview does not run scripts, and your exported site replaces them.",
      "<div class=\"grid\">\n  <article class=\"card\">...</article>\n  <article class=\"card\">...</article>\n  <article class=\"card\">...</article>\n</div>\n<script type=\"module\">\n  const projects = [{ title: \"Lemon pasta\", summary: \"Ten minutes\" }];\n  const renderCard = (p) => `<article class=\"card\"><h3 class=\"card__title\">${p.title}</h3><p>${p.summary}</p></article>`;\n  document.querySelector(\".grid\").innerHTML = projects.map(renderCard).join(\"\");\n</script>",
      "The markup now comes from data. Adding a project is one line in an array, not a copy and paste.",
      [has("script[type=\"module\"]", "A script with type=\"module\""),
       html("renderCard", "A renderCard function"),
       html(".map(", "The data is rendered with map"),
       count(".grid .card", 3, "Three fallback cards inside .grid")]),
    C("textContent for anything a person typed",
      "innerHTML parses its string as HTML. If that string came from a visitor, they can inject a script. textContent inserts plain text and can never become markup. Use template literals for your own trusted data, and textContent for theirs."),
    M("Which is safest for putting a visitor's name on the page?",
      ["el.innerHTML = name", "el.textContent = name", "document.write(name)", "el.outerHTML = name"], 1,
      "textContent never parses HTML, so a name like <img onerror=...> shows as text instead of running."),
    O("Order the render flow.",
      ["Load the data", "Build markup or elements from it", "Append them to the page", "Attach event listeners"],
      "Listeners need elements to attach to, and elements need data to be built from.",
      note="Each step depends on the one before it."),
])

A3 = L("Fetching data", ["fetch", "json", "async", "await", "promise", "loading", "error", "search", "filter", "api"], [
    C("fetch, await, JSON",
      "fetch requests a URL and returns a promise for the response. await pauses an async function until it settles. response.ok is true for status 200 to 299; response.json() parses the body.",
      "async function load() {\n  const res = await fetch(\"data.json\");\n  if (!res.ok) throw new Error(\"HTTP \" + res.status);\n  return res.json();\n}"),
    M("What does response.ok tell you?",
      ["The network is online", "The status code is in the 200 to 299 range", "The JSON is valid", "The request was cached"], 1,
      "fetch only rejects on network failure. A 404 still resolves, so you must check ok yourself."),
    K("Write async loadProjects(fetchFn). Call fetchFn(\"data.json\"). If the response is ok, return { status: \"ok\", items: <parsed json> }. If it is not ok, or anything throws, return { status: \"error\", items: [] }.",
      "async function loadProjects(fetchFn) {\n  \n}",
      "async function loadProjects(fetchFn) {\n  try {\n    const res = await fetchFn(\"data.json\");\n    if (!res.ok) return { status: \"error\", items: [] };\n    return { status: \"ok\", items: await res.json() };\n  } catch (e) {\n    return { status: \"error\", items: [] };\n  }\n}",
      [T("loadProjects(async () => ({ ok: true, json: async () => [{ title: \"A\" }] }))", {"status": "ok", "items": [{"title": "A"}]}),
       T("loadProjects(async () => ({ ok: false, status: 404, json: async () => ({}) }))", {"status": "error", "items": []}),
       T("loadProjects(async () => { throw new Error(\"offline\"); })", {"status": "error", "items": []})],
      "Every fetch has three outcomes: data, a bad status, or no answer at all. Handle all three."),
    B("Add loading and error states to the page: an element with class loading, an element with class error and role=\"alert\", and a script that calls fetch( inside try and catch.",
      "<p class=\"loading\">Loading projects...</p>\n<p class=\"error\" role=\"alert\" hidden>Could not load projects. Try again.</p>\n<script type=\"module\">\n  try {\n    const res = await fetch(\"data.json\");\n  } catch (e) {\n    document.querySelector(\".error\").hidden = false;\n  }\n</script>",
      "Visitors now know when the page is waiting and when something failed, instead of staring at an empty grid.",
      [has(".loading", "An element with class loading"),
       has(".error[role=\"alert\"]", "An .error element with role=\"alert\""),
       html("fetch(", "The script calls fetch("),
       html("catch", "The script handles failure with catch")]),
    K("Write filterProjects(list, query). Return the items whose title, or any of their tags, contains query, ignoring case and surrounding spaces. An empty query returns the whole list.",
      "function filterProjects(list, query) {\n  \n}",
      "function filterProjects(list, query) {\n  const q = String(query || \"\").trim().toLowerCase();\n  if (!q) return list;\n  return list.filter((p) => p.title.toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q)));\n}",
      [T("filterProjects([{ title: \"Lemon pasta\", tags: [\"quick\"] }, { title: \"Stew\", tags: [\"slow\"] }], \"PASTA\").length", 1),
       T("filterProjects([{ title: \"Lemon pasta\", tags: [\"quick\"] }, { title: \"Stew\", tags: [\"slow\"] }], \" slow \")[0].title", "Stew"),
       T("filterProjects([{ title: \"A\", tags: [] }, { title: \"B\", tags: [] }], \"\").length", 2)],
      "Normalize once, compare everywhere. Search that ignores case and stray spaces feels correct."),
    B("Add a search box: an input with type=\"search\" and id=\"search\", and a label for it.",
      "<label for=\"search\">Search projects</label>\n<input id=\"search\" type=\"search\" placeholder=\"pasta, quick...\">",
      "Hook it to filterProjects on the input event in your exported site, and the grid filters as people type.",
      [has("input#search[type=\"search\"]", "A search input with id=\"search\""),
       has("label[for=\"search\"]", "A label for the search input")]),
    O("Order what happens from a keystroke to new results.",
      ["The visitor types in the search box", "The input event fires", "Filter the array by the query", "Render the matching cards"],
      "The event carries the new value, the data is filtered, and the page re-renders from the result.",
      note="Each step uses the result of the one before it."),
])

A4 = L("Build tools: npm and Vite", ["npm", "vite", "package", "json", "build", "bundler", "node", "dev", "server", "tooling"], [
    C("What the tools do",
      "npm installs packages listed in package.json. Vite runs a dev server that reloads as you save, and npm run build bundles and minifies everything into a dist folder ready to deploy."),
    M("What is in the dist folder after npm run build?",
      ["Your original source files", "Optimized files ready to upload to a host", "The node_modules packages", "Your Git history"], 1,
      "dist is the output. You deploy dist; you edit src."),
    W("Move your site into Vite", "Your exported index.html and a terminal with Node installed.",
      ["npm create vite@latest my-site -- --template vanilla, then cd my-site and npm install.",
       "Replace the generated index.html body with yours. Move the CSS from the style tag into src/style.css.",
       "In src/main.js add import \"./style.css\"; and keep a script tag: <script type=\"module\" src=\"/src/main.js\"></script>",
       "npm run dev to work locally, npm run build to produce dist."],
      "Same HTML and CSS, now with a dev server, imports, and an optimized build.",
      code="npm create vite@latest my-site -- --template vanilla\ncd my-site\nnpm install\nnpm run dev"),
    O("Order the commands for a fresh clone of a Vite project.",
      ["npm install", "npm run dev", "npm run build", "npm run preview"],
      "Install dependencies, develop, build the output, then preview the built output before deploying.",
      code_items=True, note="Order matters: preview serves what build produced, and nothing runs before install."),
    M("Why should node_modules stay out of Git?",
      ["It is secret", "npm install rebuilds it from package.json and the lockfile, and it is huge", "Git cannot store JavaScript", "Vite deletes it"], 1,
      "Commit package.json and package-lock.json; anyone can recreate node_modules exactly from those."),
    B("Point your page at a Vite entry: add <script type=\"module\" src=\"/src/main.js\"></script> to your HTML, then set up the project outside Prexis and confirm each part.",
      "<script type=\"module\" src=\"/src/main.js\"></script>\n\n// package.json\n\"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\", \"preview\": \"vite preview\" }\n\n# .gitignore\nnode_modules\ndist",
      "Your site has a real toolchain. The same page, now built the way production sites are built.",
      [has("script[type=\"module\"][src*=\"main\"]", "A module script pointing at your main.js entry"),
       confirm("package.json has dev and build scripts"),
       confirm(".gitignore lists node_modules and dist"),
       confirm("npm run build produced a dist folder")]),
])

A5 = L("Deploy from Git", ["deploy", "continuous", "netlify", "vercel", "preview", "build", "ship", "pull", "request"], [
    C("Push to deploy",
      "Connect your GitHub repo to Netlify or Vercel once. After that, every push to main builds and publishes the site, and every pull request gets its own preview URL. No more dragging folders."),
    W("Connect the repo", "Your Vite site is on GitHub. Make Netlify or Vercel build it on every push.",
      ["Netlify: Add new site, Import an existing project, pick GitHub and your repo.",
       "Build command: npm run build. Publish directory: dist. Deploy.",
       "Vercel: Add New, Project, import the repo. It detects Vite and fills in npm run build and dist.",
       "Commit the settings as a file so they live with the code: netlify.toml or vercel.json."],
      "Settings in a file are reviewed, versioned, and survive changing hosts.",
      code="# netlify.toml\n[build]\n  command = \"npm run build\"\n  publish = \"dist\""),
    M("For a Vite site, which folder should the host publish?",
      ["src", "public", "dist", "node_modules"], 2,
      "Vite builds into dist. Publishing src would serve unbuilt files."),
    B("Link your live site from the page footer over https, then connect the repo to your host and confirm the setup.",
      "<footer>\n  <p>Live at <a href=\"https://my-site.netlify.app\">my-site.netlify.app</a></p>\n</footer>\n\n# netlify.toml\n[build]\n  command = \"npm run build\"\n  publish = \"dist\"",
      "Every push now ships itself. Your job becomes writing the change; the host does the rest.",
      [has("footer a[href^=\"https://\"]", "A footer link to your live site over https"),
       confirm("netlify.toml or vercel.json sets npm run build and dist"),
       confirm("A push to main triggered a deploy that succeeded"),
       url("liveUrl", "Your live URL")]),
    C("Preview deploys",
      "Open a pull request and the host comments with a preview URL built from that branch. Click through it before merging. Problems show up on the preview, not on your real site."),
    O("Order a change from branch to live.",
      ["Create a branch", "Commit and push it", "Open a pull request", "Check the preview deploy", "Merge into main", "Watch the production deploy finish"],
      "The preview is the safety net between a branch and your visitors.",
      note="Order matters: the preview only exists after the pull request, and production only updates after the merge."),
    M("A deploy failed. Where do you look first?",
      ["The build log on the host", "Your DNS settings", "The browser cache", "The domain registrar"], 0,
      "The log shows the exact command and error. Most failures are a missing package or a typo the build caught."),
])

A6 = L("Custom domain and HTTPS", ["domain", "dns", "https", "certificate", "cname", "records", "canonical", "registrar", "ssl"], [
    C("Domains in one minute",
      "A registrar rents you a name like casaverde.com for about 10 to 20 dollars a year. DNS is the phone book that maps the name to your host. The theory is in Websites that work, lesson Domains, hosting, going live. Here you do it."),
    C("The records you will add",
      "A record: points the bare domain (casaverde.com) at an IP address. CNAME: points a name like www at another name, such as your-site.netlify.app. TXT: proves to the host that you own the domain. Your host's domain settings page tells you exactly which values to enter."),
    M("Which record usually points www.casaverde.com at your host?",
      ["TXT", "MX", "CNAME", "AAAA"], 2,
      "CNAME aliases one name to another. MX is for email, TXT is for verification."),
    O("Put a custom domain live.",
      ["Buy the domain at a registrar", "Add the domain in your host's settings", "Add the DNS records the host shows you", "Wait for DNS to spread (minutes to hours)", "Confirm the certificate and force HTTPS"],
      "The host has to know the domain before it can tell you the records, and the certificate can only be issued once DNS points at the host.",
      note="Order matters: each step needs the one before it."),
    C("HTTPS is free now",
      "GitHub Pages, Netlify and Vercel issue certificates automatically once DNS points at them. Turn on Force HTTPS, pick one main address (with or without www), and redirect the other to it so search engines see one site."),
    B("Make the page domain-ready: add a canonical link with an https URL, make sure og:image uses https, and remove any http:// links or images. Paste your domain if you set one up.",
      "<link rel=\"canonical\" href=\"https://casaverde.com/\">\n<meta property=\"og:image\" content=\"https://casaverde.com/share.png\">",
      "One canonical https address, no insecure leftovers. Browsers show the lock and search engines index one site.",
      [attr("link[rel=\"canonical\"]", "href", "A canonical link using https", contains="https://"),
       attr("meta[property=\"og:image\"]", "content", "og:image uses https", contains="https://"),
       none("a[href^=\"http:\"], img[src^=\"http:\"], link[href^=\"http:\"]", "No http:// links, images or stylesheets"),
       url("domainUrl", "Your custom domain (optional)", optional=True)]),
    M("After setup, the browser says Not secure on your domain. What is the likely cause?",
      ["The domain is too long", "Mixed content (an http:// image or script), or the certificate is still being issued", "You used a CNAME", "Your CSS has errors"], 1,
      "One insecure resource drops the lock. If there is none, wait for the certificate and reload."),
])

A7 = L("Performance", ["performance", "speed", "lighthouse", "web", "vitals", "lcp", "cls", "inp", "preload", "lazy", "fonts"], [
    C("What gets measured",
      "Lighthouse in Chrome DevTools scores a page. Core Web Vitals are the three numbers Google uses: LCP, how fast the main content appears; CLS, how much the layout jumps; INP, how fast the page responds to a tap or click."),
    M("Which change most often fixes a slow LCP?",
      ["Minifying the HTML", "A smaller, properly sized hero image that loads first", "Adding more fonts", "Moving the footer"], 1,
      "The largest element is usually the hero image. Shrink it and tell the browser it matters."),
    C("Tell the browser what matters",
      "fetchpriority=\"high\" on the hero image moves it to the front of the queue. link rel=\"preload\" starts a key font or image early. font-display: swap shows text in a fallback font instead of hiding it. loading=\"lazy\" defers images below the fold."),
    B("Speed up the page: give your hero img fetchpriority=\"high\", lazy-load an image lower down, add a link rel=\"preload\", and use font-display: swap in an @font-face rule.",
      "<link rel=\"preload\" as=\"image\" href=\"https://picsum.photos/id/292/800/450\">\n<img src=\"https://picsum.photos/id/292/800/450\" fetchpriority=\"high\" width=\"800\" height=\"450\" alt=\"Ingredients on a table\">\n<img src=\"https://picsum.photos/id/429/600/400\" loading=\"lazy\" width=\"600\" height=\"400\" alt=\"A finished dish\">\n\n@font-face {\n  font-family: \"Body\";\n  src: local(\"Georgia\");\n  font-display: swap;\n}",
      "The important image arrives first, text never hides, and the rest waits its turn.",
      [has("img[fetchpriority=\"high\"]", "A hero img with fetchpriority=\"high\""),
       has("img[loading=\"lazy\"]", "A lazy-loaded image"),
       has("link[rel=\"preload\"]", "A link rel=\"preload\""),
       css("font-display", "An @font-face with font-display")]),
    K("Write overBudget(assets, limitKb). assets is an array of { name, kb }. Return the total kb when it is over limitKb, otherwise return 0.",
      "function overBudget(assets, limitKb) {\n  \n}",
      "function overBudget(assets, limitKb) {\n  const total = assets.reduce((s, a) => s + a.kb, 0);\n  return total > limitKb ? total : 0;\n}",
      [T("overBudget([{ name: \"hero.jpg\", kb: 300 }, { name: \"app.js\", kb: 120 }], 400)", 420),
       T("overBudget([{ name: \"hero.webp\", kb: 90 }, { name: \"app.js\", kb: 120 }], 400)", 0),
       T("overBudget([], 100)", 0)],
      "A weight budget turns speed into a number a build can check, so the site stays fast after the first cleanup."),
    O("Run a performance pass.",
      ["Run Lighthouse on a mobile profile", "Find the biggest issue it reports", "Fix that one thing", "Run Lighthouse again and compare"],
      "Measure, fix one thing, measure again. Fixing many things at once hides which one helped.",
      note="Order matters: you cannot compare without a first measurement."),
    M("Which metric measures the layout jumping around while the page loads?",
      ["LCP", "INP", "CLS", "TTFB"], 2,
      "Cumulative Layout Shift. Width and height on images and reserved space for ads keep it low."),
])

A8 = L("Accessibility deep dive", ["accessibility", "aria", "dialog", "modal", "focus", "skip", "link", "keyboard", "screen", "reader"], [
    C("The first rule of ARIA",
      "If a native element does the job, use it. button, a, dialog, details and select come with keyboard support and the right roles. ARIA adds meaning to custom widgets, but it never adds behavior; you would have to write that yourself."),
    C("dialog does the hard parts",
      "dialog.showModal() opens a modal that traps focus, makes the rest of the page inert, and closes on Escape. Your job: a close button inside, and focus back on the button that opened it.",
      "const dlg = document.querySelector(\"dialog\");\nopenBtn.addEventListener(\"click\", () => dlg.showModal());\ndlg.addEventListener(\"close\", () => openBtn.focus());"),
    B("Add an accessible project modal: a dialog element with a close button inside, and a script that opens it with showModal and returns focus with .focus() when it closes.",
      "<button class=\"open-details\">Details</button>\n<dialog aria-labelledby=\"dlg-title\">\n  <h2 id=\"dlg-title\">Lemon pasta</h2>\n  <p>Ten minutes, one pan.</p>\n  <form method=\"dialog\"><button>Close</button></form>\n</dialog>\n<script>\n  const dlg = document.querySelector(\"dialog\");\n  const open = document.querySelector(\".open-details\");\n  open.addEventListener(\"click\", () => dlg.showModal());\n  dlg.addEventListener(\"close\", () => open.focus());\n</script>",
      "Keyboard users can open, use and close it, and they land back where they started.",
      [has("dialog", "A dialog element"),
       has("dialog button", "A close button inside the dialog"),
       html("showModal", "The script opens it with showModal"),
       html(".focus()", "Focus returns with .focus()")]),
    M("Which element gives you keyboard support for free?",
      ["<div onclick>", "<span role=\"button\">", "<button>", "<a> without href"], 2,
      "button is focusable and fires click on Enter and Space. An a without href is not even focusable."),
    B("Add a skip link: an a with class skip-link and href=\"#main\" at the very top of your HTML, a main element with id=\"main\", and CSS that shows the link on :focus.",
      "<a class=\"skip-link\" href=\"#main\">Skip to content</a>\n...\n<main id=\"main\">...</main>\n\n.skip-link { position: absolute; left: -999px; }\n.skip-link:focus { left: 8px; top: 8px; }",
      "Keyboard users skip the nav in one keystroke instead of tabbing through every link on every page.",
      [has("a.skip-link[href=\"#main\"]", "A skip link pointing at #main"),
       has("main#main", "A main element with id=\"main\""),
       css(".skip-link:focus", "The skip link appears on :focus")]),
    O("Run a quick screen reader test.",
      ["Turn on the screen reader (VoiceOver or NVDA)", "Jump through the headings", "Jump through the landmarks", "Tab through every control and listen to its name", "Open and close the modal"],
      "Start it, then check structure, then interaction.",
      groups=[[1, 2], [3, 4]], note="Headings and landmarks can go in either order, and so can the last two checks."),
    M("A custom dropdown cannot be opened with the keyboard. What is the best fix?",
      ["Add aria-label", "Add tabindex=\"5\"", "Use a native select, or rebuild it on a button with proper keyboard handling", "Hide it from screen readers"], 2,
      "Native elements first. A custom widget needs focus, keys and roles all done by hand."),
])

A9 = L("Checks that run themselves: linting and CI", ["ci", "github", "actions", "lint", "eslint", "prettier", "workflow", "pipeline", "branch", "protection", "capstone"], [
    C("Machines catch the boring mistakes",
      "A linter (ESLint) flags likely bugs. A formatter (Prettier) settles style arguments. Continuous integration runs them, plus your build, on every pull request, so a broken change cannot slip in."),
    W("A GitHub Actions workflow", "Run lint and build on every pull request.",
      ["Create .github/workflows/ci.yml in your repo.",
       "on: pull_request means it runs for every PR; push to main covers direct pushes.",
       "Steps check out the code, set up Node, install with npm ci, then run lint and build.",
       "A red X on the PR means a step failed. Click it to read the log."],
      "If it would break the build, it breaks the PR first.",
      code="name: ci\non: [pull_request]\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run build"),
    O("Order the pipeline.",
      ["Check out the code", "Install with npm ci", "Lint", "Build", "Deploy"],
      "Nothing runs without the code, nothing builds without packages, and nothing should deploy that failed a check.",
      groups=[[2, 3]], note="Lint and build can swap; deploy always goes last."),
    M("CI fails on your pull request, but the change looks fine to you. Should you merge?",
      ["Yes, CI is often wrong", "No. Read the log, fix the cause, and push again", "Yes, then fix it on main", "Delete the workflow"], 1,
      "A red check is information. Merging past it trains everyone to ignore it."),
    C("Branch protection",
      "In Settings, Branches, add a rule for main: require a pull request and require the ci check to pass. Now nobody, including you, can push broken code straight to production."),
    B("Advanced capstone. Your page should show everything from this level: a module script, loading and error states, a search input, an accessible dialog, a skip link, @layer and @container in your CSS, and a canonical https link. Confirm the tooling outside Prexis and paste a passing CI run.",
      "Use your work from lessons 1 to 8. Nothing new to write here; this step checks it all at once.",
      "A data-driven site on a real toolchain, deployed from Git, on your domain, guarded by CI. That is how professional sites run.",
      [has("script[type=\"module\"]", "A module script"),
       has(".loading", "A loading state"),
       has(".error[role=\"alert\"]", "An error state with role=\"alert\""),
       has("input[type=\"search\"]", "A search input"),
       has("dialog button", "An accessible dialog with a close button"),
       has("a[href=\"#main\"]", "A skip link"),
       css("@layer", "@layer in your CSS"),
       css("@container", "@container in your CSS"),
       attr("link[rel=\"canonical\"]", "href", "A canonical https link", contains="https://"),
       confirm("package.json has dev, build and lint scripts"),
       confirm(".github/workflows/ci.yml runs lint and build on pull_request"),
       url("ciUrl", "A link to a passing CI run")]),
])

# =====================================================================
# Level 4: Expert
# =====================================================================

E1 = L("TypeScript for the web", ["typescript", "types", "interface", "jsdoc", "ts-check", "tsconfig", "strict", "type"], [
    C("Types catch bugs before the browser does",
      "TypeScript is JavaScript plus type annotations. The compiler checks them and then strips them, so the browser still runs plain JavaScript. You can start without a build step: add // @ts-check to a JS file and describe types in JSDoc comments; VS Code checks them as you type.",
      "// @ts-check\n/** @typedef {{ title: string, tags: string[] }} Project */\n/** @param {Project} p */\nfunction renderCard(p) { return p.title; }"),
    M("A type error at build time saves you from what?",
      ["Slower page loads", "A crash in a visitor's browser, like reading .length of undefined", "Bad SEO", "Merge conflicts"], 1,
      "The same mistake either shows up on your screen during the build, or on a visitor's screen in production."),
    C("Unknown data needs a guard",
      "Data from fetch has no guaranteed shape. Type it as unknown, then write a type guard: a function that checks the shape at runtime and tells the compiler what it proved.",
      "function isProject(x: unknown): x is Project {\n  return typeof x === \"object\" && x !== null && typeof (x as any).title === \"string\";\n}"),
    K("Write isProject(x). Return true only when x is a non-null object with a string title and an array tags whose items are all strings.",
      "function isProject(x) {\n  \n}",
      "function isProject(x) {\n  return typeof x === \"object\" && x !== null && typeof x.title === \"string\" && Array.isArray(x.tags) && x.tags.every((t) => typeof t === \"string\");\n}",
      [T("isProject({ title: \"Stew\", tags: [\"slow\"] })", True), T("isProject({ title: \"Stew\" })", False),
       T("isProject(null)", False), T("isProject({ title: 7, tags: [] })", False), T("isProject({ title: \"A\", tags: [1] })", False)],
      "Check at the boundary once, then the rest of your code can trust the type."),
    B("Type your page script without a build: in a module script, add // @ts-check, a @typedef for Project, and a @param on renderCard.",
      "<script type=\"module\">\n  // @ts-check\n  /** @typedef {{ title: string, summary: string }} Project */\n  /** @param {Project} p */\n  const renderCard = (p) => `<article class=\"card\"><h3 class=\"card__title\">${p.title}</h3><p>${p.summary}</p></article>`;\n</script>",
      "Your editor now flags a typo like p.tittle before you ever load the page. The next step is real .ts files with tsconfig strict.",
      [has("script[type=\"module\"]", "A module script"),
       html("@ts-check", "The script opts in with // @ts-check"),
       html("@typedef", "A @typedef describes Project"),
       html("@param", "renderCard has a typed @param")]),
    M("Data from fetch has an unknown shape. What is the safe approach?",
      ["Cast it with as Project and move on", "Validate it with a type guard or schema, then use the typed value", "Turn off strict mode", "Use any everywhere"], 1,
      "A cast is a promise you cannot keep. A guard is a check you actually run."),
    O("Migrate one file to TypeScript.",
      ["Add tsconfig.json with strict set to true", "Rename one file from .js to .ts", "Fix the errors the compiler reports", "Run tsc --noEmit in CI so it stays fixed"],
      "Config first so the rules apply, then one file at a time, then lock it in with CI.",
      note="Order matters: the compiler needs its config before it can report errors."),
])

E2 = L("A component framework", ["react", "framework", "components", "props", "state", "usestate", "keys", "reducer", "jsx"], [
    C("Components are functions",
      "A component takes props and returns UI. React, Vue and Svelte all share the idea; React is the most common, so the examples use it. Your renderCard was already a component without the name.",
      "function Card({ title, summary }) {\n  return <article className=\"card\"><h3>{title}</h3><p>{summary}</p></article>;\n}"),
    C("State and keys",
      "State is data that changes while the page is open, like a search query. When it changes, React re-runs the component and updates only what differs. In lists, each item needs a stable key so React can tell which one moved.",
      "const [query, setQuery] = useState(\"\");\nprojects.filter(match(query)).map((p) => <Card key={p.id} {...p} />)"),
    M("Why does each item in a rendered list need a key?",
      ["It sets the CSS class", "React uses it to match items between renders, so state and focus stay with the right item", "It sorts the list", "It is only needed on servers"], 1,
      "Without stable keys, deleting the first item can shift every input's state to the wrong card."),
    K("State updates should not mutate. Write reducer(state, action) for { query, tags }. On { type: \"query\", value } return a new state with query set. On { type: \"toggleTag\", tag } add the tag if missing or remove it if present. Return state unchanged for anything else.",
      "function reducer(state, action) {\n  \n}",
      "function reducer(state, action) {\n  if (action.type === \"query\") return { ...state, query: action.value };\n  if (action.type === \"toggleTag\") {\n    const has = state.tags.includes(action.tag);\n    return { ...state, tags: has ? state.tags.filter((t) => t !== action.tag) : [...state.tags, action.tag] };\n  }\n  return state;\n}",
      [T("reducer({ query: \"\", tags: [] }, { type: \"query\", value: \"pasta\" })", {"query": "pasta", "tags": []}),
       T("reducer({ query: \"\", tags: [\"quick\"] }, { type: \"toggleTag\", tag: \"vegan\" })", {"query": "", "tags": ["quick", "vegan"]}),
       T("reducer({ query: \"\", tags: [\"quick\", \"vegan\"] }, { type: \"toggleTag\", tag: \"quick\" })", {"query": "", "tags": ["vegan"]}),
       T("(() => { const s = { query: \"a\", tags: [] }; reducer(s, { type: \"query\", value: \"b\" }); return s.query; })()", "a")],
      "Return new objects instead of editing old ones. That is how React notices a change."),
    B("Mark the island your framework will own: a div with id=\"cards-root\" holding three static .card fallbacks, and a module script that uses useState and renders cards with a key.",
      "<div id=\"cards-root\">\n  <article class=\"card\">...</article>\n  <article class=\"card\">...</article>\n  <article class=\"card\">...</article>\n</div>\n<script type=\"module\">\n  // In your Vite + React project this lives in src/CardGrid.jsx\n  // const [query, setQuery] = useState(\"\");\n  // projects.map((p) => <Card key={p.id} {...p} />)\n</script>",
      "The static cards keep the page useful before JavaScript loads; React takes over #cards-root when it does.",
      [has("#cards-root", "A mount point with id=\"cards-root\""),
       count("#cards-root .card", 3, "Three fallback cards inside it"),
       html("useState", "The component keeps state with useState"),
       html("key=", "List items get a key")]),
    O("Order what happens when state changes.",
      ["The visitor types in the search box", "onChange calls setQuery", "React re-runs the component with the new state", "React compares the new output to the old", "Only the changed DOM nodes update"],
      "Event, state update, re-render, diff, patch. You write the first two; React does the rest.",
      note="Each step triggers the next."),
    M("When is plain HTML and CSS a better choice than a framework?",
      ["Never", "A mostly static content site with a little interactivity", "Any site with a form", "Any site with more than one page"], 1,
      "Frameworks pay off with lots of changing state. For a brochure site they add weight and nothing else."),
])

E3 = L("Routing and app structure", ["routing", "router", "spa", "routes", "history", "hash", "404", "layout", "next"], [
    C("Pages or routes",
      "Separate HTML files are the simplest router there is. A single page app swaps views in JavaScript and updates the URL with history.pushState or the hash. Meta frameworks like Next.js or Astro generate routes from folders and can render on the server."),
    M("What does a 404 route handle?",
      ["Server crashes", "Any URL that matches no other route", "Slow pages", "Signed out users"], 1,
      "Every router needs a catch-all, or unknown URLs show a blank screen instead of a helpful page."),
    K("Write matchRoute(path) for the routes \"/\", \"/projects\" and \"/projects/:id\". Return { name, params }: names are \"home\", \"projects\", \"project\" (with params.id), and \"notFound\" with empty params for anything else. Ignore one trailing slash.",
      "function matchRoute(path) {\n  \n}",
      "function matchRoute(path) {\n  const p = path.length > 1 && path.endsWith(\"/\") ? path.slice(0, -1) : path;\n  if (p === \"/\") return { name: \"home\", params: {} };\n  if (p === \"/projects\") return { name: \"projects\", params: {} };\n  const m = /^\\/projects\\/([^/]+)$/.exec(p);\n  if (m) return { name: \"project\", params: { id: m[1] } };\n  return { name: \"notFound\", params: {} };\n}",
      [T("matchRoute(\"/\")", {"name": "home", "params": {}}),
       T("matchRoute(\"/projects/\")", {"name": "projects", "params": {}}),
       T("matchRoute(\"/projects/lemon-pasta\")", {"name": "project", "params": {"id": "lemon-pasta"}}),
       T("matchRoute(\"/nope\")", {"name": "notFound", "params": {}})],
      "Every router, from a dozen lines to Next.js, is this: turn a URL into a name and some parameters."),
    B("Add hash routes to your page: at least two links whose href starts with #/, a section with data-route=\"not-found\" for unknown URLs, and a script that listens for hashchange.",
      "<nav>\n  <a href=\"#/\">Home</a>\n  <a href=\"#/projects\">Projects</a>\n</nav>\n<section data-route=\"not-found\" hidden>\n  <h2>Page not found</h2>\n  <p><a href=\"#/\">Back home</a></p>\n</section>\n<script>\n  window.addEventListener(\"hashchange\", render);\n</script>",
      "Hash routes work on any static host with no server setup, which makes them a safe first router.",
      [count("a[href^=\"#/\"]", 2, "At least two #/ route links"),
       has("[data-route=\"not-found\"]", "A not-found view"),
       html("hashchange", "The script listens for hashchange")]),
    C("A shared layout",
      "Header, nav and footer render once in a layout; only the inner view changes per route. After each route change, set document.title and move focus to the new heading so screen reader users know the page changed."),
    O("Order what a client router does when a link is clicked.",
      ["Intercept the click", "Update the URL with history.pushState", "Match the URL to a route", "Render that view inside the layout", "Update document.title and move focus to the new heading"],
      "The URL changes first so back and forward work, then the view, then the announcements.",
      note="Order matters: rendering needs the matched route, and focus needs the rendered heading."),
    M("After a client route change, screen reader users hear nothing. What fixes it?",
      ["Reload the page", "Move focus to the new view's heading and update document.title", "Add more ARIA labels to the nav", "Use a slower transition"], 1,
      "A full page load announces itself. A JavaScript view swap has to announce itself on purpose."),
])

E4 = L("Your own API", ["api", "serverless", "functions", "http", "status", "codes", "rest", "env", "secrets", "backend"], [
    C("An API is a URL that returns data",
      "GET reads, POST creates, PUT or PATCH updates, DELETE removes. Status codes report the result: 200 OK, 201 Created, 400 bad input, 401 not signed in, 404 not found, 405 wrong method, 500 server error."),
    M("Which status code means a new item was created?",
      ["200", "201", "204", "302"], 1,
      "201 Created. 200 is a general success, 204 is success with no body."),
    C("Serverless functions",
      "Netlify and Vercel run a function file when its URL is requested. No server to manage, and small sites stay on the free tier. On Vercel, api/projects.js answers /api/projects.",
      "export default function handler(req, res) {\n  if (req.method !== \"GET\") return res.status(405).json({ error: \"Method not allowed\" });\n  res.status(200).json(projects);\n}"),
    K("Write handle(req, projects). For method \"GET\" return { status: 200, body: projects }. For any other method return { status: 405, body: { error: \"Method not allowed\" } }.",
      "function handle(req, projects) {\n  \n}",
      "function handle(req, projects) {\n  if (req.method === \"GET\") return { status: 200, body: projects };\n  return { status: 405, body: { error: \"Method not allowed\" } };\n}",
      [T("handle({ method: \"GET\" }, [{ id: 1 }])", {"status": 200, "body": [{"id": 1}]}),
       T("handle({ method: \"DELETE\" }, [])", {"status": 405, "body": {"error": "Method not allowed"}}),
       T("handle({ method: \"POST\" }, []).status", 405)],
      "Pure request in, response out. Keeping the logic in a plain function also makes it easy to test."),
    C("Secrets stay on the server",
      "API keys go in environment variables on the host, read with process.env.NAME inside the function. Anything in your page's JavaScript is public. Commit a .env.example with empty values, and list .env in .gitignore."),
    B("Point the front end at your API: the page script fetches \"/api/projects\" and keeps an error state with role=\"alert\". Then build the function outside Prexis and confirm it.",
      "<p class=\"error\" role=\"alert\" hidden>Could not load projects.</p>\n<script type=\"module\">\n  const res = await fetch(\"/api/projects\");\n</script>\n\n# .gitignore\n.env",
      "Your site now has a backend. The data can change without redeploying the page.",
      [html("/api/projects", "The page fetches /api/projects"),
       has("[role=\"alert\"]", "An error state with role=\"alert\""),
       confirm("api/projects returns 200 for GET and 405 for other methods"),
       confirm(".env is in .gitignore and the function reads process.env")]),
    O("Order a request from click to cards.",
      ["The visitor clicks Load projects", "The browser sends GET /api/projects", "The host runs your function", "The function returns JSON with status 200", "The page renders the cards"],
      "Browser to host to function and back. Every step is a place a log line can tell you what went wrong.",
      note="Each step waits on the one before it."),
])

E5 = L("Databases and sign in", ["database", "sql", "postgres", "supabase", "auth", "sign", "login", "session", "authorization", "tables"], [
    C("Tables, rows, and when hosted is enough",
      "A table is a list of rows with fixed columns: projects(id, title, owner_id). Hosted Postgres from Supabase or Neon gives you a real database with a free tier and nothing to maintain. Your API function reads from it instead of data.json."),
    C("Sign in without storing passwords",
      "Use an auth provider (Supabase Auth, Clerk, Auth.js) instead of storing passwords yourself. After sign in, the server sets a session cookie. Every protected API call checks that session and answers 401 without one."),
    M("Where must the check \"can this user edit this project?\" happen?",
      ["In the button's onclick", "On the server, in the API or the database rules", "In CSS", "In localStorage"], 1,
      "Anything in the browser can be edited by the visitor. Only the server's answer counts."),
    K("Write canEdit(user, project). Return true when user exists and either user.id equals project.ownerId or user.role is \"admin\". Return false otherwise.",
      "function canEdit(user, project) {\n  \n}",
      "function canEdit(user, project) {\n  if (!user) return false;\n  return user.id === project.ownerId || user.role === \"admin\";\n}",
      [T("canEdit({ id: 1, role: \"user\" }, { ownerId: 1 })", True),
       T("canEdit({ id: 2, role: \"user\" }, { ownerId: 1 })", False),
       T("canEdit({ id: 3, role: \"admin\" }, { ownerId: 1 })", True),
       T("canEdit(null, { ownerId: 1 })", False)],
      "Signed out is false first. Then ownership, then roles. Run it on the server for every write."),
    B("Add sign in to the page: a button with class sign-in, an element marked data-requires-auth for content only signed-in users see, and code that handles a 401 response.",
      "<button class=\"sign-in\">Sign in</button>\n<section data-requires-auth hidden>\n  <h2>Your drafts</h2>\n</section>\n<script type=\"module\">\n  const res = await fetch(\"/api/drafts\");\n  if (res.status === 401) showSignIn();\n</script>",
      "The page shows what a visitor may see, and the server enforces it.",
      [has("button.sign-in", "A sign-in button"),
       has("[data-requires-auth]", "A section marked data-requires-auth"),
       html("401", "The script handles a 401 response")]),
    O("Order the sign in flow.",
      ["The visitor presses Sign in", "The app redirects to the auth provider", "The visitor proves who they are", "The provider redirects back with a code", "The server swaps the code for a session cookie", "API calls now carry the session"],
      "This is the OAuth shape almost every sign in button uses.",
      note="Each step needs the result of the one before it."),
    M("A signed-in user can see another user's drafts. What is missing?",
      ["A prettier login page", "A server-side check that filters by owner, such as row level security", "A longer session", "HTTPS"], 1,
      "Authentication says who you are. Authorization says what you may see, and it has to run on the server."),
])

E6 = L("Security for web developers", ["security", "xss", "csrf", "injection", "csp", "headers", "escape", "secrets", "dependabot"], [
    C("The three classics",
      "XSS: attacker text becomes script on your page. CSRF: another site makes a visitor's browser send a request to yours. Injection: input changes the meaning of a database query. Escaping output, SameSite cookies, and parameterized queries stop most of it."),
    M("Which line has an XSS risk when comment comes from a visitor?",
      ["el.textContent = comment", "el.innerHTML = comment", "el.setAttribute(\"title\", comment)", "console.log(comment)"], 1,
      "innerHTML parses the string as HTML, so a crafted comment can run script."),
    K("Write escapeHtml(s). Replace & with &amp;, < with &lt;, > with &gt;, \" with &quot; and ' with &#39;. Do & first.",
      "function escapeHtml(s) {\n  \n}",
      "function escapeHtml(s) {\n  return String(s).replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#39;\");\n}",
      [T("escapeHtml(\"<b>hi</b>\")", "&lt;b&gt;hi&lt;/b&gt;"),
       T("escapeHtml(\"Tom & Jerry\")", "Tom &amp; Jerry"),
       T("escapeHtml(\"say \\\"hi\\\" it's\")", "say &quot;hi&quot; it&#39;s")],
      "Ampersand first, or you would double-escape the entities you just made."),
    C("Headers that defend you",
      "Content-Security-Policy lists where scripts, styles and images may come from, so injected script is blocked. X-Content-Type-Options: nosniff and a Referrer-Policy close smaller holes. Set them in netlify.toml or vercel.json; a meta tag can carry CSP too."),
    B("Harden the page: a meta Content-Security-Policy with a default-src, a meta referrer policy, and no innerHTML anywhere in your page code (switch to textContent or escapeHtml). Then set the headers on your host.",
      "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'\">\n<meta name=\"referrer\" content=\"strict-origin-when-cross-origin\">",
      "Export puts these meta tags in the head where browsers enforce them. The policy allows your inline style and scripts; tighten script-src with nonces once you have a build.",
      [attr("meta[http-equiv=\"Content-Security-Policy\"]", "content", "A CSP meta tag with default-src", contains="default-src"),
       attr("meta[name=\"referrer\"]", "content", "A referrer policy"),
       html("innerHTML", "No innerHTML in your page code", negate=True),
       confirm("My host config sends X-Content-Type-Options: nosniff")]),
    O("Respond to a leaked API key.",
      ["Revoke the key at the provider", "Create a new key", "Update the environment variable on the host", "Redeploy", "Review the provider's logs for misuse"],
      "Kill it first; every minute it works is a minute it can be used. Deleting the commit does not help, the key is already copied.",
      note="Revoke comes first, always."),
    C("Keep dependencies patched",
      "Turn on Dependabot alerts and security updates in your repo's Settings. It opens pull requests when a package you use has a known hole, and your CI tells you if the update breaks anything."),
])

E7 = L("Testing at depth", ["testing", "tests", "unit", "e2e", "playwright", "vitest", "flaky", "tdd", "ci"], [
    C("Three kinds of tests",
      "Unit tests check one function, fast. Integration tests check pieces together, like an API with its database. End to end tests drive a real browser through a real flow, like signing in. Many unit tests, a few end to end tests."),
    M("Which test type catches a broken sign in flow?",
      ["A unit test of a helper", "An end to end test that signs in through the browser", "A lint rule", "A type check"], 1,
      "Sign in crosses the page, the provider and your API. Only a test that drives the whole path sees it break."),
    K("Red, green: these tests already exist. Write slugify(title) so they pass: lowercase, trim, turn every run of non letters or digits into one hyphen, and drop hyphens at the ends.",
      "function slugify(title) {\n  \n}",
      "function slugify(title) {\n  return String(title).toLowerCase().trim().replace(/[^a-z0-9]+/g, \"-\").replace(/^-+|-+$/g, \"\");\n}",
      [T("slugify(\"Lemon Pasta\")", "lemon-pasta"), T("slugify(\"  Fast & Easy!  \")", "fast-easy"), T("slugify(\"10 minute meals\")", "10-minute-meals")],
      "The tests defined done before the code existed. That is test driven development in one step."),
    W("An end to end test with Playwright", "Check that search filters the cards on the real page.",
      ["npm init playwright@latest adds the runner and an example.",
       "page.goto opens your local build. getByTestId finds elements by data-testid.",
       "fill types into the search box; expect waits until the visible card count matches.",
       "npx playwright test runs it locally; the same command runs in CI."],
      "Stable test ids make tests survive redesigns.",
      code="test(\"search filters cards\", async ({ page }) => {\n  await page.goto(\"/\");\n  await page.getByTestId(\"search\").fill(\"pasta\");\n  await expect(page.getByTestId(\"card\")).toHaveCount(1);\n});"),
    B("Make the page testable: data-testid=\"search\" on your search input, data-testid=\"card\" on at least three cards, and an email error message with id=\"email-error\" and aria-live. Then add the tests to CI.",
      "<input id=\"search\" type=\"search\" data-testid=\"search\">\n<article class=\"card\" data-testid=\"card\">...</article>\n<p id=\"email-error\" aria-live=\"polite\"></p>",
      "Tests can now find what they need without depending on your class names or layout.",
      [has("[data-testid=\"search\"]", "A search input with data-testid=\"search\""),
       count("[data-testid=\"card\"]", 3, "At least three cards with data-testid=\"card\""),
       has("#email-error[aria-live]", "An email error region with aria-live"),
       confirm("ci.yml runs npm test on every pull request")]),
    O("Order the red, green, refactor loop.",
      ["Write a failing test", "Run it and watch it fail", "Write the least code that passes", "Run it and watch it pass", "Refactor with the test still green"],
      "Watching it fail proves the test can fail. Refactoring last means you change shape with a safety net.",
      note="Order matters: that is the whole method."),
    M("A test fails only sometimes. What is it called, and what do you do?",
      ["A smoke test; delete it", "A flaky test; find the race or shared state and fix it, quarantining it meanwhile", "A unit test; rerun until green", "A regression; revert everything"], 1,
      "Flaky tests teach a team to ignore red. Fix the timing or isolation problem, do not just retry."),
])

E8 = L("Running in production", ["production", "monitoring", "logs", "errors", "uptime", "health", "rollback", "incident", "analytics"], [
    C("Know before your users tell you",
      "Logs show what your functions did. Error tracking (Sentry and similar) collects browser and server errors with stack traces. An uptime check hits a URL every minute. Privacy friendly analytics (Plausible, Fathom) show traffic without tracking people."),
    M("Users report a blank page. Which tool tells you the actual error?",
      ["Uptime monitoring", "Browser error tracking with stack traces", "Analytics page views", "The DNS dashboard"], 1,
      "Uptime only says the server answered. The blank page is a script error in their browser, which error tracking captures."),
    K("Write health(checks). checks is an object like { db: true, auth: false }. Return { status: 200, body: { ok: true } } when every value is true, otherwise { status: 503, body: { ok: false, failing: [names of false checks] } }.",
      "function health(checks) {\n  \n}",
      "function health(checks) {\n  const failing = Object.keys(checks).filter((k) => !checks[k]);\n  if (!failing.length) return { status: 200, body: { ok: true } };\n  return { status: 503, body: { ok: false, failing } };\n}",
      [T("health({ db: true, auth: true })", {"status": 200, "body": {"ok": True}}),
       T("health({ db: true, auth: false })", {"status": 503, "body": {"ok": False, "failing": ["auth"]}}),
       T("health({})", {"status": 200, "body": {"ok": True}})],
      "An uptime check pointed at /api/health now tells you which dependency broke, not just that something did."),
    B("Catch errors on the page: an element with id=\"app-error\" and role=\"alert\" as a friendly fallback, and a script that listens for unhandledrejection and sends errors to a reportError( function.",
      "<div id=\"app-error\" role=\"alert\" hidden>Something broke. Reload, or try again in a minute.</div>\n<script>\n  function reportError(e) { navigator.sendBeacon(\"/api/log\", JSON.stringify({ message: String(e) })); }\n  window.addEventListener(\"error\", (e) => reportError(e.message));\n  window.addEventListener(\"unhandledrejection\", (e) => reportError(e.reason));\n</script>",
      "Visitors see a calm message instead of a blank page, and you get the error.",
      [has("#app-error[role=\"alert\"]", "A friendly error region with role=\"alert\""),
       html("unhandledrejection", "The script catches unhandled promise rejections"),
       html("reportError(", "Errors go to a reportError( function")]),
    C("Rollbacks and flags",
      "Netlify and Vercel keep every deploy. Rolling back is one click on an older one, and it takes seconds. Feature flags let you ship code turned off, then turn it on for a few users first."),
    O("Order an incident.",
      ["Notice: an alert or a user report", "Roll back to the last good deploy", "Find the cause in logs and error reports", "Fix it with a test that would have caught it", "Write a short note on what happened"],
      "Stop the damage before you investigate. Investigating a live outage costs users every minute.",
      note="Order matters: roll back first, debug second."),
    M("A deploy broke checkout late at night. What is the fastest safe move?",
      ["Debug it live on production", "Roll back to the previous deploy, then debug in the morning", "Turn off the whole site", "Push a guess and hope"], 1,
      "A rollback is tested, instant and reversible. A midnight hotfix is none of those."),
])

E9 = L("Working like a pro: reviews, docs, and open source", ["review", "pull", "request", "docs", "readme", "contributing", "open", "source", "semver", "changelog", "capstone"], [
    C("Pull request habits",
      "Small changes, one idea each. A title that says what changed, a description that says why, and screenshots for anything visual. A reviewer should understand it in five minutes."),
    C("Giving and getting review",
      "Comment on the code, not the person. Ask questions when unsure, say which comments block the merge, and suggest a fix when you can. When receiving, answer every comment, even with \"done\"."),
    M("Which review comment is most useful?",
      ["This is wrong.", "Why not do it differently?", "This fetch has no catch, so a network error leaves the spinner forever. Wrap it and show .error?", "LGTM"], 2,
      "Specific problem, specific consequence, suggested fix."),
    O("Contribute to an open source project.",
      ["Find an issue labeled good first issue", "Fork the repo", "Create a branch", "Make the change and run the tests", "Open a pull request that links the issue"],
      "Fork, branch, change, test, propose. Comment on the issue first so nobody duplicates the work.",
      note="Each step needs the one before it."),
    C("Versions that mean something",
      "Semantic versioning: MAJOR.MINOR.PATCH. Breaking change bumps major, new feature bumps minor, fix bumps patch. A CHANGELOG lists what changed in each version in plain words."),
    M("What belongs in a good bug report?",
      ["Just \"it is broken\"", "Steps to reproduce, what you expected, what happened, and your browser and device", "A screenshot of the whole desktop", "The fix only"], 1,
      "If the maintainer can reproduce it in a minute, it gets fixed."),
    B("Expert capstone. Your page should carry the whole app: components in #cards-root, testable search, a not-found route, a CSP, an error fallback, a health check link, and a footer link to the repo. Confirm the rest of the stack outside Prexis and paste your live app URL.",
      "Use your work from lessons 1 to 8. Add a status link, for example <a href=\"/api/health\">Status</a> in the footer.",
      "Typed, componentized, routed, backed by an API and a database, secured, tested, monitored and documented. You build and run real web apps.",
      [count("#cards-root .card", 3, "Cards rendered in #cards-root"),
       has("[data-testid=\"search\"]", "A testable search input"),
       has("[data-route=\"not-found\"]", "A not-found route"),
       has("meta[http-equiv=\"Content-Security-Policy\"]", "A Content-Security-Policy"),
       has("#app-error[role=\"alert\"]", "An error fallback"),
       html("/api/health", "A link to /api/health"),
       has("footer a[href*=\"github.com\"]", "A footer link to the repo"),
       confirm("TypeScript strict, unit tests and end to end tests run in CI"),
       confirm("README covers setup, deploy and rollback; CONTRIBUTING.md, a PR template and a LICENSE exist"),
       url("appUrl", "Your live app URL")]),
])

COURSES = [
    {
        "id": "web-intermediate", "subject": "Web development", "level": "Intermediate",
        "title": "Websites you run", "track": "web", "prereq": "web-pages",
        "unlock": {"after": "web-pages", "mastery": 55, "skill": "HTML & CSS"},
        "blurb": "Ship it live, multi page sites, forms, SEO, motion, images, JavaScript, Git.",
        "units": [
            {"title": "Go live", "lessons": [I1, I2, I3]},
            {"title": "Polish", "lessons": [I4, I5, I6]},
            {"title": "Run it", "lessons": [I7, I8, I9]},
        ],
    },
    {
        "id": "web-advanced", "subject": "Web apps", "level": "Advanced",
        "title": "Web apps with real tools", "track": "web", "prereq": "web-intermediate",
        "unlock": {"after": "web-intermediate", "mastery": 85, "skill": "Web development"},
        "blurb": "Modern CSS, modules, fetch, Vite, deploy from Git, your own domain, speed, accessibility, CI.",
        "units": [
            {"title": "Modern front end", "lessons": [A1, A2, A3]},
            {"title": "Real tooling", "lessons": [A4, A5, A6]},
            {"title": "Professional quality", "lessons": [A7, A8, A9]},
        ],
    },
    {
        "id": "web-expert", "subject": "Web engineering", "level": "Expert",
        "title": "Shipping real web apps", "track": "web", "prereq": "web-advanced",
        "unlock": {"after": "web-advanced", "mastery": 85, "skill": "Web apps"},
        "blurb": "TypeScript, components, routing, APIs, databases and sign in, security, testing, production.",
        "units": [
            {"title": "Typed components", "lessons": [E1, E2, E3]},
            {"title": "Backend", "lessons": [E4, E5, E6]},
            {"title": "Production", "lessons": [E7, E8, E9]},
        ],
    },
]

QUICK_PICKS = []


def add(courses, picks):
    courses.extend(COURSES)
    picks.extend(QUICK_PICKS)
