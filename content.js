/* Prexis built-in curriculum.
   Plain data, no dependencies. Every lesson here works fully offline —
   no API key, no network. Steps use the same shapes the AI generator
   produces: concept, mcq, numeric, order, output, code, explore.
   Rules for authors:
   - output/code steps are JavaScript only (the browser executes them).
   - order `items` are listed in the CORRECT order; the app shuffles them.
   - mcq `answer` is a 0-based index; vary its position between questions.
   - `keywords` are single lowercase words used by the topic matcher. */

window.PREXIS_CONTENT = {
  courses: [

    /* ================= JAVASCRIPT ================= */
    {
      id: "core-js",
      subject: "JavaScript",
      level: "Beginner",
      title: "JavaScript, by hand",
      units: [
        {
          title: "The grain of the language",
          lessons: [
            {
              title: "Values that stay put",
              keywords: ["javascript", "js", "variables", "const", "let", "functions", "basics", "coding", "programming"],
              steps: [
                { type: "concept", heading: "A name for a value", body: "A variable is a labeled box. const means the label will not be moved to a different box. The value inside can still be an object you change later — but the binding itself is fixed.", code: "const city = \"Lisbon\";\nlet visits = 0;\nvisits = visits + 1;" },
                { type: "worked", heading: "Trace it like the machine", problem: "What is b when this finishes?", code: "const a = 2;\nlet b = a + 3;\nb = b * 2;", steps: ["Line 1: the label a is bound to 2, and const means it stays bound.", "Line 2: a + 3 is 5, so b starts at 5.", "Line 3: b is a let, so it CAN be rebound — to 5 × 2 = 10."], takeaway: "Read code one line at a time, tracking each name's current value." },
                { type: "output", prompt: "What does this print?", code: "const n = 3;\nconsole.log(n + n);", expect: "6", explain: "n holds 3. n + n is ordinary arithmetic, then console.log prints the result as text." },
                { type: "concept", heading: "Functions do work", body: "A function is a reusable recipe. Parameters are the ingredients you pass in. return is how the recipe hands a result back to whoever called it.", code: "function greet(name) {\n  return \"Hi, \" + name;\n}" },
                { type: "mcq", prompt: "Which line actually gives you the greeting string to use later?", options: ["greet(\"Ada\")", "console.log(greet)", "function greet(name)", "return greet"], answer: 0, explain: "Calling greet(\"Ada\") runs the body and returns \"Hi, Ada\". Logging the function itself only prints the function object." },
                { type: "code", prompt: "Write double so it returns twice its input.", starter: "function double(n) {\n  \n}", tests: [ { call: "double(2)", expect: 4 }, { call: "double(0)", expect: 0 }, { call: "double(-3)", expect: -6 } ], solution: "function double(n) {\n  return n * 2;\n}", explain: "Multiply and return. No console.log needed — tests read the return value." },
                { type: "order", prompt: "Put these in the order JavaScript actually does them.", items: ["Read the function body", "Bind the parameter n to 4", "Evaluate n * 2", "Hand 8 back to the caller"], explain: "A call first binds arguments, then runs the body, then returns.", codeItems: false },
                { type: "concept", heading: "Print is not return", body: "console.log shows something on screen. return gives a value to other code. Tests in Prexis watch return values, not the console — unless the step is an output question." },
              ],
            },
            {
              title: "Lists you can query",
              keywords: ["javascript", "js", "arrays", "lists", "map", "filter", "methods"],
              steps: [
                { type: "concept", heading: "Arrays keep order", body: "An array is a numbered shelf. Index 0 is the first slot. length is how many slots are filled. Methods like map and filter return new arrays; they do not rewrite the original unless you ask them to.", code: "const nums = [3, 1, 4];\nnums[0];      // 3\nnums.length;  // 3" },
                { type: "output", prompt: "What does this print?", code: "const letters = [\"a\", \"b\", \"c\"];\nconsole.log(letters[letters.length - 1]);", expect: "c", explain: "length is 3, so length - 1 is 2, and that slot holds \"c\"." },
                { type: "mcq", prompt: "What does map return?", code: "const n = [1, 2, 3];\nn.map(x => x * 10);", options: ["[10, 20, 30]", "[1, 2, 3]", "30", "undefined"], answer: 0, explain: "map builds a new array by running the function on every item. n itself stays [1, 2, 3]." },
                { type: "code", prompt: "Return only the even numbers from the list.", starter: "function evens(list) {\n  \n}", tests: [ { call: "evens([1,2,3,4])", expect: [2, 4] }, { call: "evens([7])", expect: [] }, { call: "evens([0, 8])", expect: [0, 8] } ], solution: "function evens(list) {\n  return list.filter(n => n % 2 === 0);\n}", explain: "filter keeps items whose callback returns true. 0 is even." },
                { type: "order", prompt: "Order these lines so the last expression is the doubled list.", items: ["const src = [1, 2, 3];", "const out = src.map(n => n * 2);", "out"], explain: "Create the source, derive a new array, then read it.", codeItems: true },
                { type: "concept", heading: "Prefer new arrays", body: "map, filter, and slice leave the original alone. push, splice, and sort mutate. When you are learning, prefer the first family — bugs stay smaller." },
              ],
            },
            {
              title: "Read the error first",
              keywords: ["javascript", "js", "debugging", "errors", "bugs", "stack", "trace"],
              steps: [
                { type: "concept", heading: "The stack is a map", body: "An error message is not an insult. It names the failure. The stack trace lists the calls that led there, newest first. Read the message, then the first line that is your code.", code: "TypeError: Cannot read properties of undefined (reading 'name')\n    at greet (app.js:4:18)" },
                { type: "mcq", prompt: "user is undefined. Which access blows up?", code: "function greet(user) {\n  return \"Hi \" + user.name;\n}", options: ["user.name", "\"Hi \"", "function greet", "return"], answer: 0, explain: "You can concatenate a string with almost anything. Reading .name on undefined throws." },
                { type: "output", prompt: "What does this print?", code: "const xs = [10, 20];\nconsole.log(xs[2]);", expect: "undefined", explain: "Out-of-range index is undefined, not an exception. That quiet undefined is often the bug one line later." },
                { type: "code", prompt: "Write safeName: return user.name if user exists, otherwise \"guest\".", starter: "function safeName(user) {\n  \n}", tests: [ { call: "safeName({name:\"Ada\"})", expect: "Ada" }, { call: "safeName(undefined)", expect: "guest" }, { call: "safeName(null)", expect: "guest" } ], solution: "function safeName(user) {\n  return (user && user.name) || \"guest\";\n}", explain: "Guard the object before you touch a property. null and undefined are both unsafe." },
                { type: "order", prompt: "A debugging order that usually works.", items: ["Reproduce it once", "Read the exact error", "Find the first bad value", "Change one thing"], explain: "If you change three things at once you will not know which fix worked.", codeItems: false },
                { type: "concept", heading: "Log the shape", body: "When a value looks wrong, print JSON.stringify(value) or inspect keys. Guessing types in your head is slower than looking once." },
              ],
            },
          ],
        },
        {
          title: "Time and trouble",
          lessons: [
            {
              title: "Waiting without freezing",
              keywords: ["javascript", "js", "async", "await", "promises", "fetch"],
              steps: [
                { type: "concept", heading: "A promise is a later value", body: "Some work is not done yet: a network call, a timer. A Promise is an object that will fulfill with a value or reject with an error. await pauses this function until that happens — it does not freeze the whole page.", code: "async function load() {\n  const res = await fetch(\"/api\");\n  return res.json();\n}" },
                { type: "mcq", prompt: "What must be true to use await inside a function?", options: ["The function is marked async", "The function is named wait", "You imported promises", "The file is a module named delay.js"], answer: 0, explain: "await is only legal in async functions (and at the top level of modules)." },
                { type: "output", prompt: "This snippet runs a resolved promise and logs the value. What prints?", code: "Promise.resolve(7).then((n) => {\n  console.log(n + 1);\n});", expect: "8", explain: "Promise.resolve(7) is already fulfilled. then receives 7 and logs 8." },
                { type: "code", prompt: "Write plusLater so it returns a Promise that fulfills with a + b.", starter: "function plusLater(a, b) {\n  \n}", tests: [ { call: "plusLater(2, 3).then(x => x)", expect: 5 }, { call: "plusLater(0, 0).then(x => x)", expect: 0 } ], solution: "function plusLater(a, b) {\n  return Promise.resolve(a + b);\n}", explain: "Return a Promise, not the raw number. Promise.resolve wraps a ready value." },
                { type: "order", prompt: "Order the life of a successful fetch.", items: ["Call fetch", "Await the Response", "Read the body", "Use the data"], explain: "You cannot read the body before the response exists.", codeItems: false },
                { type: "concept", heading: "Errors travel too", body: "If a promise rejects, await throws. wrap the call in try/catch, or attach .catch. Swallowing the error silently is how production bugs hide." },
              ],
            },
            {
              title: "Objects you can trust",
              keywords: ["javascript", "js", "objects", "keys", "properties", "json"],
              steps: [
                { type: "concept", heading: "Keys and values", body: "An object is a set of labeled drawers: each key names one value. Dot notation opens a drawer you know the name of; bracket notation opens one whose name lives in a variable.", code: "const user = { name: \"Ada\", age: 36 };\nuser.name;        // \"Ada\"\nuser[\"age\"];      // 36" },
                { type: "output", prompt: "What does this print?", code: "const user = { name: \"Ada\", age: 36 };\nconsole.log(user.age + 1);", expect: "37", explain: "user.age reads 36 out of the drawer, then ordinary arithmetic adds 1." },
                { type: "mcq", prompt: "user has no email yet. Which line gives it one?", options: ["user.email()", "email in user", "user.email = \"ada@lovelace.dev\"", "delete user.email"], answer: 2, explain: "Assigning to a key that does not exist creates it. The others call, test, or remove — none of them add." },
                { type: "code", prompt: "Write fullName so it joins first and last with a space.", starter: "function fullName(p) {\n  \n}", tests: [ { call: "fullName({first:\"Ada\", last:\"Lovelace\"})", expect: "Ada Lovelace" }, { call: "fullName({first:\"Alan\", last:\"Turing\"})", expect: "Alan Turing" } ], solution: "function fullName(p) {\n  return p.first + \" \" + p.last;\n}", explain: "Read two drawers, concatenate with a space between." },
                { type: "order", prompt: "Order what JavaScript does to evaluate user.pet.name.", items: ["Find the user object", "Open its pet drawer", "Open name inside that", "Hand back the value"], explain: "Chained dots resolve left to right — which is why an undefined middle link throws.", codeItems: false },
                { type: "concept", heading: "Copies share drawers", body: "const b = a copies the label, not the drawers: both names point at the same object, so changing b.x changes a.x. Use { ...a } when you want a genuinely separate copy." },
              ],
            },
            {
              title: "Small programs",
              keywords: ["javascript", "js", "programs", "pipeline", "reduce", "project"],
              steps: [
                { type: "concept", heading: "Programs are pipelines", body: "Almost every small program is the same shape: take data in, transform it in steps, put a result out. Write each step as its own expression and the whole program stays readable.", code: "const words = [\"a\", \"bb\", \"ccc\"];\nwords\n  .filter(w => w.length > 1)\n  .map(w => w.toUpperCase());" },
                { type: "mcq", prompt: "What comes out of the pipeline above?", options: ["[\"BB\", \"CCC\"]", "[\"A\", \"BB\", \"CCC\"]", "[\"bb\", \"ccc\"]", "2"], answer: 0, explain: "filter drops \"a\" (length 1), then map uppercases what is left." },
                { type: "output", prompt: "What does this print?", code: "const total = [5, 10, 20].reduce((sum, n) => sum + n, 0);\nconsole.log(total);", expect: "35", explain: "reduce folds the list into one value: 0+5, then 5+10, then 15+20." },
                { type: "code", prompt: "Write longest so it returns the longest word in the list.", starter: "function longest(list) {\n  \n}", tests: [ { call: "longest([\"hi\",\"hello\",\"hey\"])", expect: "hello" }, { call: "longest([\"a\"])", expect: "a" }, { call: "longest([\"aa\",\"bb\"])", expect: "aa" } ], solution: "function longest(list) {\n  return list.reduce((best, w) => (w.length > best.length ? w : best), list[0] || \"\");\n}", explain: "Keep the best-so-far as you walk the list. Ties keep the earlier word because the comparison is strictly greater." },
                { type: "order", prompt: "Arrange the lines into a working three-step pipeline.", items: ["const names = [\"ada\", \"alan\"];", "const caps = names.map(n => n.toUpperCase());", "console.log(caps.join(\", \"));"], explain: "Source data, then the transformation, then the output.", codeItems: true },
                { type: "concept", heading: "Name the steps", body: "When a pipeline grows past three steps, pull steps out into named functions. A good name is documentation the compiler checks for free." },
              ],
            },
          ],
        },
        {
          title: "Fluency",
          lessons: [
            {
              title: "Closures hold state",
              keywords: ["javascript", "js", "closures", "scope", "state", "counter", "private"],
              steps: [
                { type: "concept", heading: "Functions remember home", body: "An inner function keeps access to the variables of the place it was created — even after that place has finished running. That bundle of function plus remembered variables is a closure.", code: "function makeCounter() {\n  let n = 0;\n  return () => { n = n + 1; return n; };\n}" },
                { type: "worked", heading: "Trace the counter", problem: "const c = makeCounter(); c(); c(); — what does the THIRD call return?", code: "function makeCounter() {\n  let n = 0;\n  return () => { n = n + 1; return n; };\n}", steps: ["makeCounter runs once: n starts at 0, and the arrow function is returned holding a live link to that n.", "c() bumps that n to 1 and returns it; the second call bumps the same n to 2.", "The third call returns 3 — n lives on inside the closure, invisible from outside."], takeaway: "A closure is a function plus the variables it was born next to." },
                { type: "output", prompt: "What does this print?", code: "function makeGreeter(name) {\n  return function () { return \"Hi \" + name; };\n}\nconst g = makeGreeter(\"Ada\");\nconsole.log(g());", expect: "Hi Ada", explain: "g still sees the name it was created with. makeGreeter finished long ago; the closure kept its variable alive." },
                { type: "mcq", prompt: "const a = makeCounter(); const b = makeCounter(); a(); a(); — what does b() now return?", options: ["1", "2", "3", "0"], answer: 0, explain: "Each makeCounter() call creates a FRESH n. a's clicks never touch b's counter — closures are per-creation, not global." },
                { type: "code", prompt: "Write makeAdder so makeAdder(x) returns a function that adds x to its input.", starter: "function makeAdder(x) {\n  \n}", tests: [{"call": "makeAdder(3)(4)", "expect": 7}, {"call": "makeAdder(0)(5)", "expect": 5}, {"call": "makeAdder(-2)(2)", "expect": 0}], solution: "function makeAdder(x) {\n  return (y) => x + y;\n}", explain: "The returned arrow closes over x. Every adder you make remembers its own x." },
                { type: "concept", heading: "Privacy for free", body: "Nothing outside can read or reset the counter's n except through the function you returned. Closures give you private state without classes — most of what modules and hooks do underneath." },
              ],
            },
            {
              title: "Reduce shapes anything",
              keywords: ["javascript", "js", "reduce", "aggregate", "fold", "counting", "data"],
              steps: [
                { type: "concept", heading: "One loop to rule them all", body: "reduce folds a list into anything — a number, an object, a string. You give it a starting value and one rule: how to fold the next item into the running result.", code: "[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6" },
                { type: "worked", heading: "Count the votes", problem: "Turn [\"yes\", \"no\", \"yes\"] into {yes: 2, no: 1}.", code: "votes.reduce((acc, v) => {\n  acc[v] = (acc[v] || 0) + 1;\n  return acc;\n}, {});", steps: ["Start the accumulator as an empty object: {}.", "Each round, bump that vote's key: acc[v] = (acc[v] || 0) + 1 handles the first sighting.", "Return acc every round — after three votes it reads {yes: 2, no: 1}."], takeaway: "reduce = a start value + one rule for folding in each item." },
                { type: "output", prompt: "What does this print?", code: "const total = [\"a\", \"bb\", \"ccc\"].reduce((sum, w) => sum + w.length, 0);\nconsole.log(total);", expect: "6", explain: "Fold in each word's length: 0+1, then 1+2, then 3+3. The list of words became a single number." },
                { type: "code", prompt: "Write maxOf: return the largest number in a non-empty list, using reduce (no Math.max).", starter: "function maxOf(list) {\n  \n}", tests: [{"call": "maxOf([3,9,4])", "expect": 9}, {"call": "maxOf([-5,-2])", "expect": -2}, {"call": "maxOf([7])", "expect": 7}], solution: "function maxOf(list) {\n  return list.reduce((best, n) => (n > best ? n : best), list[0]);\n}", explain: "Carry the best-so-far. Starting from list[0] keeps negative-only lists honest." },
                { type: "mcq", prompt: "[10, 20, 30].reduce((a, n) => a + n, 100) — what is the accumulator at the START of the second round?", options: ["10", "100", "110", "130"], answer: 2, explain: "Round one folds 10 into the start value 100, so round two begins at 110." },
                { type: "concept", heading: "Know when to stop", body: "If map or filter says it more clearly, use them. reduce is the power tool for when the result isn't a list anymore — totals, lookups, grouping." },
              ],
            },
            {
              title: "Spread, don't mutate",
              keywords: ["javascript", "js", "spread", "immutability", "copy", "state", "mutation"],
              steps: [
                { type: "concept", heading: "Mutation at a distance", body: "When two names point at one object, a change through either is seen by both. Most 'impossible' bugs are this. The cure: build changed COPIES with spread instead of editing shared data.", code: "const user = { name: \"Ada\", plan: \"free\" };\nconst upgraded = { ...user, plan: \"pro\" };" },
                { type: "worked", heading: "Add without touching", problem: "Add an item to a cart array without modifying the original.", steps: ["const next = [...cart, item] builds a NEW array: everything old, plus the new item at the end.", "cart itself is untouched — any code holding it is safe from surprises.", "Objects work the same: { ...settings, theme: \"dark\" } changes one key on a copy."], takeaway: "New value out, old value untouched — updates become predictable." },
                { type: "output", prompt: "What does this print?", code: "const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(a.length + \",\" + b.length);", expect: "2,3", explain: "Spread copied a's items into a new array before adding 3. The original never felt a thing." },
                { type: "mcq", prompt: "What is x.n after this runs?", code: "const x = { n: 1 };\nconst y = x;\ny.n = 5;", options: ["1", "5", "undefined", "It throws"], answer: 1, explain: "y = x copies the LABEL, not the object. Both names open the same drawers — that is exactly the trap spread avoids." },
                { type: "code", prompt: "Write withDone: return a copy of task with done set to true, WITHOUT modifying the input.", starter: "function withDone(task) {\n  \n}", tests: [{"call": "withDone({title:\"a\", done:false})", "expect": {"title": "a", "done": true}}, {"call": "(function(){ const t = {title:\"x\", done:false}; withDone(t); return t.done; })()", "expect": false}], solution: "function withDone(task) {\n  return { ...task, done: true };\n}", explain: "The second test proves the original survived. That property is what makes state changes easy to reason about." },
                { type: "concept", heading: "Where mutation is fine", body: "Inside a function, on data only you hold, mutate freely — it's fast and local. The danger begins the moment data is shared. Share copies, keep originals." },
              ],
            },
          ],
        },
      ],
    },

    /* ================= HTML & CSS ================= */
    {
      id: "web-pages",
      subject: "HTML & CSS",
      level: "Beginner",
      title: "Web pages from scratch",
      units: [
        {
          title: "Structure",
          lessons: [
            {
              title: "What a page is made of",
              keywords: ["html", "tags", "elements", "structure", "semantic", "web", "webpage", "page"],
              steps: [
                { type: "concept", heading: "Nested boxes of meaning", body: "An HTML page is boxes inside boxes. Each tag names what its content IS — a heading, a paragraph, a list — not what it looks like. Looks come later, from CSS.", code: "<article>\n  <h2>Fresh bread</h2>\n  <p>Baked every morning.</p>\n</article>" },
                { type: "mcq", prompt: "Which tag marks the single most important heading on the page?", options: ["<header>", "<h1>", "<title>", "<b>"], answer: 1, explain: "<h1> is the page's top heading. <title> names the browser tab, <header> is a layout region, and <b> is just bold text." },
                { type: "order", prompt: "Arrange the lines into one valid article block.", items: ["<article>", "<h2>Fresh bread</h2>", "<p>Baked daily.</p>", "</article>"], explain: "Open the container, put its contents inside, close it. Tags close in the reverse order they opened.", codeItems: true },
                { type: "mcq", prompt: "Where does the <title> tag live?", options: ["Inside <head>", "Inside <body>", "Inside <footer>", "Anywhere"], answer: 0, explain: "<head> holds information ABOUT the page — title, description, links to CSS. Everything visitors see goes in <body>." },
                { type: "concept", heading: "Semantic tags are free power", body: "nav, main, article, footer say what each region is. Search engines rank you better for it, and screen-reader users can jump straight to the content. Same pixels, more meaning." },
                { type: "mcq", prompt: "A screen reader and Google both understand your page mainly through…", options: ["The colors", "The font choices", "The tag structure", "The file name"], answer: 2, explain: "Both read the HTML tree, not the pixels. Meaningful tags are how you talk to them." },
              ],
            },
            {
              title: "Links and images",
              keywords: ["html", "links", "anchor", "href", "images", "img", "alt", "urls"],
              steps: [
                { type: "concept", heading: "The a tag is the web", body: "A link is an <a> tag whose href says where to go. An image is an <img> tag whose src says what to fetch and whose alt says what it shows, in words.", code: "<a href=\"menu.html\">See the menu</a>\n<img src=\"loaf.jpg\" alt=\"Sourdough loaf on a rack\" />" },
                { type: "mcq", prompt: "Which line makes the word Menu open menu.html?", options: ["<link src=\"menu.html\">Menu</link>", "<a name=\"menu.html\">Menu</a>", "<href a=\"menu.html\">Menu</href>", "<a href=\"menu.html\">Menu</a>"], answer: 3, explain: "The tag is a, the destination attribute is href. The others mix the two up." },
                { type: "mcq", prompt: "What is alt text mainly for?", options: ["A caption shown under every image", "Screen readers, broken images, and search engines", "Making the image load faster", "Copyright information"], answer: 1, explain: "alt is the image in words: read aloud by screen readers, shown when the file fails, and indexed by search engines." },
                { type: "order", prompt: "Order what the browser does to show a page with one image.", items: ["Fetch the HTML file", "Read the <img> tag inside it", "Request the image file", "Draw it in place"], explain: "The HTML arrives first; every src it mentions triggers another request.", codeItems: false },
                { type: "concept", heading: "Relative vs absolute", body: "href=\"menu.html\" is relative — it means next to this page, and keeps working when the site moves. href=\"https://example.com/menu.html\" is absolute — it always points at that exact place." },
                { type: "mcq", prompt: "You move your whole site to a new domain. Which links keep working without edits?", options: ["Relative links between your own pages", "Absolute links to your old domain", "Both", "Neither"], answer: 0, explain: "Relative links travel with the site. Absolute links still point at the old address." },
              ],
            },
          ],
        },
        {
          title: "Style",
          lessons: [
            {
              title: "CSS selects and styles",
              keywords: ["css", "selectors", "class", "id", "specificity", "cascade", "styles", "styling"],
              steps: [
                { type: "concept", heading: "Rules find elements", body: "A CSS rule is a selector plus declarations: find these elements, apply these styles. Selectors match by tag name, .class, or #id.", code: ".card {\n  padding: 16px;\n  border: 1px solid #ddd;\n}" },
                { type: "mcq", prompt: "Which selector targets <div class=\"card\">?", options: [".card", "#card", "card", "<card>"], answer: 0, explain: "A leading dot means class. # means id, a bare name means the tag itself." },
                { type: "mcq", prompt: "Three rules set the same property on one element: a tag rule, a class rule, and an id rule. Which wins?", options: ["The tag rule", "The class rule", "The id rule", "Whichever is written first"], answer: 2, explain: "Specificity: id beats class beats tag. Order only breaks ties at equal specificity." },
                { type: "order", prompt: "Order how a style ends up on screen.", items: ["Browser reads the CSS rules", "Finds elements matching each selector", "Resolves conflicts by specificity, then order", "Paints the result"], explain: "The cascade is just a defined tie-break: more specific wins, and later wins among equals.", codeItems: false },
                { type: "numeric", prompt: "Two rules with equal specificity set padding on the same element: the first says 12px, a later one says 20px. How many px of padding apply?", answer: 20, tolerance: 0, explain: "At equal specificity, the later rule wins. That is the cascade working as designed." },
                { type: "concept", heading: "Keep specificity low", body: "Style almost everything with single classes. The moment you reach for ids and !important to win fights, every future change becomes a bigger fight." },
              ],
            },
            {
              title: "The box model",
              keywords: ["css", "box", "model", "padding", "margin", "border", "width", "spacing"],
              steps: [
                { type: "concept", heading: "Every element is four layers", body: "From the inside out: content, padding (space inside the border), border, margin (space outside, between neighbors). Width math depends on which layers count.", code: ".card {\n  width: 200px;\n  padding: 16px;\n  border: 2px solid;\n  margin: 20px;\n}" },
                { type: "worked", heading: "Will it fit?", problem: "A card has width 240px, padding 12px, and a 3px border. Does it fit a 300px column?", steps: ["width sets the content: 240px.", "Padding adds on both sides: + 2 × 12 = 24.", "Border adds on both sides too: + 2 × 3 = 6.", "Total: 240 + 24 + 6 = 270px — it fits with 30px to spare."], takeaway: "Rendered width = content + padding × 2 + border × 2." },
                { type: "numeric", prompt: "Content width 200px, padding 16px per side, border 2px per side. How wide is the rendered box in px (ignore margin)?", answer: 236, tolerance: 0, explain: "200 + 16×2 + 2×2 = 236. By default width sets only the content." },
                { type: "mcq", prompt: "You want more space BETWEEN two cards, not inside them. Which property?", options: ["padding", "border", "margin", "width"], answer: 2, explain: "Margin is outside the border — the gap between neighbors. Padding pushes content inward." },
                { type: "numeric", prompt: "With box-sizing: border-box, width is 300px, padding 20px per side, border 5px per side. How wide is the CONTENT area in px?", answer: 250, tolerance: 0, explain: "border-box makes width include padding and border: 300 − 40 − 10 = 250 for content." },
                { type: "order", prompt: "Order the layers from the inside out.", items: ["Content", "Padding", "Border", "Margin"], explain: "Content sits innermost; margin is pure outside spacing and is always transparent.", codeItems: false },
                { type: "concept", heading: "Set border-box once", body: "* { box-sizing: border-box } makes width mean the visible box, so your arithmetic matches your eyes. Nearly every real project starts with it." },
              ],
            },
            {
              title: "Flexbox in one sitting",
              keywords: ["css", "flexbox", "flex", "layout", "align", "justify", "center", "navbar"],
              steps: [
                { type: "concept", heading: "One parent, one axis", body: "display: flex on a parent lines its children up along an axis. justify-content places them along that main axis; align-items places them across it. That is 90% of everyday layout.", code: ".nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}" },
                { type: "mcq", prompt: "Which pair centers a child both horizontally and vertically in a flex row?", options: ["text-align: center; vertical-align: middle", "justify-content: center; align-items: center", "margin: center; padding: center", "float: center; clear: both"], answer: 1, explain: "justify-content handles the main axis, align-items the cross axis. The others are older tools that do not apply here." },
                { type: "mcq", prompt: "You set flex-direction: column. What does justify-content control now?", options: ["Horizontal placement", "Vertical placement", "Font size", "Nothing — it stops working"], answer: 1, explain: "justify-content always follows the main axis, and column makes that axis vertical." },
                { type: "order", prompt: "Build a navbar, in a sensible order.", items: ["Give the nav display: flex", "Push logo and links apart with justify-content: space-between", "Line them up with align-items: center", "Add gap so links breathe"], explain: "Turn on flex first — none of the other properties do anything without it.", codeItems: false },
                { type: "mcq", prompt: "Three children, parent has justify-content: space-between. Where is the middle child?", options: ["Stuck to the left", "Stuck to the right", "Exactly centered", "Wrapped to a new line"], answer: 2, explain: "space-between pins the outer children to the edges and spreads the rest evenly — with three, the middle lands center." },
                { type: "concept", heading: "Prefer gap", body: "gap: 12px on the flex parent spaces all children at once. Margins on individual children double up and break the moment you reorder them." },
              ],
            },
            {
              title: "Pages that fit every screen",
              keywords: ["css", "responsive", "mobile", "media", "queries", "breakpoints", "viewport"],
              steps: [
                { type: "concept", heading: "Design mobile-first", body: "Style the narrow one-column layout first — it is the hardest to fake. Then add media queries that introduce columns where the design starts to look cramped.", code: ".grid { display: grid; gap: 16px; }\n@media (min-width: 700px) {\n  .grid { grid-template-columns: 1fr 1fr; }\n}" },
                { type: "mcq", prompt: "Which line stops phones from rendering your page zoomed-out like a tiny desktop?", options: ["<meta charset=\"UTF-8\">", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "@media (phone: true)", "width: 100% on the body"], answer: 1, explain: "Without the viewport meta tag, phones assume a ~980px page and shrink it. With it, CSS pixels match the device." },
                { type: "mcq", prompt: "When does @media (min-width: 700px) apply?", options: ["Only at exactly 700px", "At 700px and wider", "Below 700px", "Only on desktops"], answer: 1, explain: "min-width means this wide or wider — the mobile-first direction: base styles for small, additions for large." },
                { type: "numeric", prompt: "A layout is 3 columns at 900px and up, 1 column below. How many columns at 750px?", answer: 1, tolerance: 0, explain: "750 is below the 900px breakpoint, so the base one-column layout applies." },
                { type: "order", prompt: "A mobile-first workflow that actually works.", items: ["Style the one-column phone layout", "Widen the window until it looks cramped", "Add a breakpoint there, not at a device name", "Introduce columns and test again"], explain: "Breakpoints should come from your content breaking, not from a list of popular phones.", codeItems: false },
                { type: "concept", heading: "Two safety rails", body: "img { max-width: 100% } stops images from bursting the layout, and testing on a real phone catches what the resized desktop window hides." },
              ],
            },
          ],
        },
        {
          title: "Craft",
          lessons: [
            {
              title: "Grid for real layouts",
              keywords: ["css", "grid", "layout", "columns", "fr", "tracks", "areas"],
              steps: [
                { type: "concept", heading: "Two axes at once", body: "Flexbox lays things along one axis; Grid places them on rows AND columns together. Define the tracks on the parent, and children snap into the skeleton.", code: ".page {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  gap: 16px;\n}" },
                { type: "worked", heading: "What does 1fr get?", problem: "An 800px container has two columns — 200px and 1fr — with a 20px gap. How wide is the 1fr column?", steps: ["Fixed pieces first: the 200px column plus the 20px gap claim 220px.", "Leftover space: 800 − 220 = 580px.", "1fr means one share of the leftover — the second column is 580px wide."], takeaway: "fr divides what is LEFT after fixed sizes and gaps are paid." },
                { type: "numeric", prompt: "A 900px container has columns 1fr 2fr 1fr and no gaps. How wide is the middle column, in px?", answer: 450, tolerance: 0, explain: "Four shares total; 900 ÷ 4 = 225 per share. The middle takes two shares: 450px." },
                { type: "mcq", prompt: "You want as many 250px-minimum cards per row as fit, growing to fill. Which line?", options: ["grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))", "grid-template-columns: 250px auto", "width: 250px on every card", "column-count: 4"], answer: 0, explain: "auto-fill + minmax is the classic responsive card grid: the browser fits as many 250px+ tracks as the width allows." },
                { type: "order", prompt: "Build a page skeleton with grid, in order.", items: ["Set display: grid on the wrapper", "Define tracks with grid-template-columns", "Space everything at once with gap", "Stretch the odd element with grid-column: span 2"], explain: "Nothing else works until the wrapper is a grid; spans come last, once tracks exist.", codeItems: false },
                { type: "concept", heading: "Grid outside, flex inside", body: "A practical split: Grid for the page skeleton (header, sidebar, content), Flexbox for rows of things inside each region. Each tool where it is strongest." },
              ],
            },
            {
              title: "Design tokens in CSS",
              keywords: ["css", "variables", "custom", "properties", "tokens", "theming", "dark"],
              steps: [
                { type: "concept", heading: "Name your decisions", body: "Custom properties store a decision once: --accent: #4f46e5 on :root, then var(--accent) everywhere. Change the token, restyle the site; swap a token set, get dark mode.", code: ":root { --accent: #4f46e5; }\n.button { background: var(--accent); }" },
                { type: "mcq", prompt: "Where do global tokens usually live?", options: ["Inside every selector that uses them", "On :root, so every element inherits them", "In JavaScript only", "In the page title"], answer: 1, explain: ":root is the top of the tree — declare once, inherit everywhere. Components just read var()." },
                { type: "worked", heading: "Dark mode in three moves", problem: "Give a site a dark theme without touching any component.", steps: ["Define the light palette as tokens on :root — --bg, --ink, --accent.", "Redefine ONLY those tokens inside @media (prefers-color-scheme: dark).", "Components never change: .card reads var(--bg) and gets the right answer in both worlds."], takeaway: "Theme the tokens, not the components." },
                { type: "mcq", prompt: "What padding does .card get?", code: ":root { --pad: 12px; }\n.card { --pad: 20px; padding: var(--pad); }", options: ["12px", "20px", "32px", "0"], answer: 1, explain: "var() reads the nearest definition up the tree — .card's own 20px wins over the root's 12px." },
                { type: "order", prompt: "Roll out tokens on an existing site.", items: ["Name tokens by role, not color (--danger, not --red)", "Declare the full set on :root", "Replace hard-coded values with var() in components", "Add alternate sets for dark mode or brands"], explain: "Role names survive a rebrand; --red-600 becomes a lie the day the brand turns blue.", codeItems: false },
                { type: "concept", heading: "Tokens are a contract", body: "Once components only speak var(), designers can retheme, rebrand, and add modes without touching component code. That separation is what design systems are made of." },
              ],
            },
            {
              title: "Accessibility that ships",
              keywords: ["accessibility", "a11y", "contrast", "alt", "keyboard", "focus", "screen", "reader"],
              steps: [
                { type: "concept", heading: "Built in, not bolted on", body: "Accessibility means your page works by keyboard, by screen reader, and for low vision. Most of it is free when you use real HTML: button for actions, label for inputs, headings in order." },
                { type: "numeric", prompt: "WCAG asks at least 4.5:1 contrast for body text. Your grey-on-white measures 2.8:1. How many ratio points short is it?", answer: 1.7, tolerance: 0.05, explain: "4.5 − 2.8 = 1.7. Light grey body text is the web's most common accessibility failure — and everyone over 40 feels it." },
                { type: "mcq", prompt: "A clickable \"Save\" should be which element?", options: ["<div onclick=\"save()\">", "<span class=\"btn\">", "<button>", "<a href=\"#\">"], answer: 2, explain: "A real button is keyboard-focusable, Enter/Space-activatable, and announced as a button — for free. The div gives you none of that." },
                { type: "worked", heading: "Alt text that works", problem: "An article includes a chart image. What is the right alt text?", steps: ["Ask what the image DOES here: it conveys a finding, so the words must carry the finding.", "alt=\"Sales doubled between January and June\" — the takeaway, not \"chart of sales\".", "Pure decoration is different: alt=\"\" (empty) tells screen readers to skip it silently."], takeaway: "Alt text describes the image's JOB, not its pixels." },
                { type: "order", prompt: "A ten-minute accessibility audit.", items: ["Tab through the page — can you reach and see everything?", "Read the headings alone — do they form an outline?", "Check text contrast in both themes", "Listen to one page in a screen reader"], explain: "Four checks catch the majority of real-world failures. The Tab test alone finds broken menus, traps, and invisible focus.", codeItems: false },
                { type: "mcq", prompt: "Removing focus outlines (outline: none) with no replacement…", options: ["Cleans the design up harmlessly", "Strands keyboard users with no idea where they are", "Improves performance", "Is required by WCAG"], answer: 1, explain: "The outline IS the keyboard user's cursor. Restyle it to fit the brand — never delete it." },
                { type: "concept", heading: "Same craft, wider door", body: "Accessible pages are also more scannable, better ranked, and easier to maintain. It is not extra work on top of the craft; it is the craft." },
              ],
            },
          ],
        },
      ],
    },

    /* ================= WEBSITE DESIGN & MANAGEMENT ================= */
    {
      id: "site-design",
      subject: "Website design",
      level: "Beginner",
      title: "Websites that work",
      units: [
        {
          title: "Design that works",
          lessons: [
            {
              title: "Guide the eye",
              keywords: ["design", "website", "visual", "hierarchy", "layout", "attention", "homepage", "ux"],
              steps: [
                { type: "concept", heading: "Hierarchy is the job", body: "Visitors do not read pages; they scan them. Design's first job is to control the scan: one thing clearly biggest, one action clearly next. If everything shouts, nothing is heard." },
                { type: "mcq", prompt: "What should a first-time visitor's eye land on first?", options: ["The logo", "The single element with the most size and contrast", "The footer links", "The cookie banner"], answer: 1, explain: "Eyes go where size and contrast point them. Good design points them at the message, not the chrome." },
                { type: "order", prompt: "Order a landing page from top to bottom.", items: ["One clear headline saying what this is", "One line on why it matters", "One obvious button", "Supporting detail for the convinced"], explain: "Message, value, action — detail only after the visitor has a reason to care.", codeItems: false },
                { type: "mcq", prompt: "A page has five bold, colored, boxed elements competing. The likely result?", options: ["Visitors read all five", "Visitors pick their favorite", "Visitors register none of them and scroll past", "The page loads slower"], answer: 2, explain: "Emphasis is a budget. Spend it on one element and it works; spread it everywhere and it cancels out." },
                { type: "concept", heading: "Whitespace is a tool", body: "Empty space is not wasted space — it groups related things, separates unrelated things, and makes the important element easy to find. When a page feels cluttered, remove before you rearrange." },
                { type: "mcq", prompt: "Users scan pages in rough patterns (like an F). The practical takeaway?", options: ["Center all text", "Put key words at line starts and front-load headings", "Use longer paragraphs", "Avoid headings entirely"], answer: 1, explain: "Scanners catch the first words of lines and headings. Front-load meaning there and even skimmers get your message." },
              ],
            },
            {
              title: "Type and color",
              keywords: ["design", "typography", "fonts", "color", "palette", "contrast", "readability"],
              steps: [
                { type: "concept", heading: "Two fonts, one accent", body: "A reliable recipe: one typeface for headings, one for body text, and one accent color against calm neutrals. Constraints read as confidence; variety reads as noise." },
                { type: "mcq", prompt: "Comfortable body-text lines run about how many characters?", options: ["25", "65", "120", "As many as fit"], answer: 1, explain: "Around 45–75 characters per line, 65 as the classic target. Longer lines make the eye lose its place on the way back." },
                { type: "mcq", prompt: "Which body text is easiest to read on a white page?", options: ["Light grey, small, for elegance", "Near-black at a comfortable size", "Your brand color for consistency", "Pure black, bold, everywhere"], answer: 1, explain: "Near-black on white has strong contrast without glare. Light grey body text is the most common readability mistake on the web." },
                { type: "order", prompt: "Build a palette in a sane order.", items: ["Pick one brand accent color", "Choose neutrals that flatter it", "Add semantic colors for success and error", "Check every pairing for contrast"], explain: "The accent leads; everything else supports it. Contrast checking is the step everyone skips and regrets.", codeItems: false },
                { type: "concept", heading: "Consistency beats novelty", body: "Reusing the same spacing, corner radius, and button style everywhere makes a site feel professionally built. Users cannot name the difference — they just trust the page more." },
              ],
            },
            {
              title: "Words that work",
              keywords: ["copywriting", "content", "words", "headlines", "buttons", "microcopy", "writing"],
              steps: [
                { type: "concept", heading: "Copy is design material", body: "The words on buttons and headlines do more work than any gradient. Write from the visitor's side: what they get, in their language, not what your system does." },
                { type: "mcq", prompt: "Which headline earns the next line of reading?", options: ["Welcome to our website", "Synergistic solutions for the modern enterprise", "Fresh bread, baked at 6 am, sold out by noon", "Home"], answer: 2, explain: "Specific and concrete beats generic and impressive. It answers what is this? in one breath." },
                { type: "mcq", prompt: "Best label for the button that requests a quote?", options: ["Submit", "Click here", "Get my free quote", "OK"], answer: 2, explain: "A button should say what happens next, in the visitor's words. Submit describes your form, not their outcome." },
                { type: "order", prompt: "Fix an error message, step by step.", items: ["Say plainly what went wrong", "Say how to fix it", "Keep the user's typed data intact", "Drop the blame and the jargon"], explain: "Card declined — check the number or try another card beats Error 402 in every measurable way.", codeItems: false },
                { type: "mcq", prompt: "The strongest page structure for scanners is…", options: ["Long paragraphs of polished prose", "Short sections with meaningful headings and one idea each", "A single bulleted list of everything", "Centered italic text"], answer: 1, explain: "Meaningful headings let a scanner rebuild your argument from the skeleton alone. That is how most visitors actually read." },
                { type: "concept", heading: "Read it aloud", body: "If a sentence sounds strange said to a customer's face, rewrite it. Websites are conversations at a distance, and stiffness reads as either legalese or a scam." },
              ],
            },
          ],
        },
        {
          title: "Run the site",
          lessons: [
            {
              title: "Domains, hosting, going live",
              keywords: ["domain", "hosting", "dns", "https", "deploy", "launch", "live", "server", "management"],
              steps: [
                { type: "concept", heading: "Address, phone book, building", body: "A domain is your address (example.com). DNS is the phone book that maps it to a server. The host is the building where your files actually live. Three separate purchases, often bundled." },
                { type: "order", prompt: "Take a site live, in order.", items: ["Register the domain", "Point its DNS at your host", "Deploy the site files to the host", "Turn on HTTPS with a certificate"], explain: "DNS changes take time to spread, so wiring the address before polishing the deploy saves a day of waiting.", codeItems: false },
                { type: "mcq", prompt: "The padlock (HTTPS) in the browser bar means…", options: ["The site has no bugs", "Traffic between visitor and site is encrypted", "The site owner is verified honest", "The site is fast"], answer: 1, explain: "HTTPS encrypts data in transit — passwords and card numbers cannot be read on the way. It says nothing about who runs the site." },
                { type: "mcq", prompt: "Which DNS record points a name at a server's IP address?", options: ["MX", "TXT", "A", "CNAME"], answer: 2, explain: "A records map name to IP. MX routes email, TXT stores verification text, CNAME aliases one name to another." },
                { type: "numeric", prompt: "Domain: $12/year. Hosting: $5/month. What does the first year cost in dollars?", answer: 72, tolerance: 0, explain: "12 + 5 × 12 = 72. Renewals are where registrars raise prices — check year two before buying." },
                { type: "concept", heading: "Stage before you ship", body: "Keep a staging copy of the site where changes land first. Break staging freely; promote to production only what survived. Editing the live site directly works right up until it very much does not." },
              ],
            },
            {
              title: "Keep it healthy",
              keywords: ["maintenance", "analytics", "backups", "monitoring", "management", "performance", "updates"],
              steps: [
                { type: "concept", heading: "Sites rot by default", body: "Links break, plugins age, content goes stale, and nobody notices from the inside. A small monthly routine beats a panicked yearly rebuild." },
                { type: "mcq", prompt: "The speed number that best predicts whether visitors stay is…", options: ["Server ping from your own office", "Load time on a mid-range phone on mobile data", "Homepage size in megabytes alone", "Your uptime percentage"], answer: 1, explain: "Most of the web is browsed on ordinary phones and networks. Test on that, not on your fiber connection." },
                { type: "order", prompt: "A monthly site checkup worth doing.", items: ["Read analytics: what do people actually visit?", "Click through the key pages yourself", "Update anything stale or broken", "Verify the backup actually restores"], explain: "The order runs from information to action. An untested backup is a hope, not a backup.", codeItems: false },
                { type: "numeric", prompt: "500 visitors this month; bounce rate 60%. How many left after a single page?", answer: 300, tolerance: 0, explain: "60% of 500 is 300. Whether that is bad depends on the page — a phone-number lookup bouncing fast is success." },
                { type: "mcq", prompt: "The real reason for backups is…", options: ["Auditors ask for them", "Hosts require them", "Mistakes, hacks, and failed updates are a when, not an if", "They speed up the site"], answer: 2, explain: "Every long-lived site eventually needs a restore. The only question is whether one exists when it does." },
                { type: "concept", heading: "Small edits, often", body: "Continuous small improvements — a clearer headline here, a fixed link there — compound. Big-bang redesigns reset your SEO, your users' habits, and your bugs, all at once." },
              ],
            },
          ],
        },
        {
          title: "Level up",
          lessons: [
            {
              title: "Pages that convert",
              keywords: ["conversion", "landing", "cta", "trust", "friction", "funnel"],
              steps: [
                { type: "concept", heading: "One page, one job", body: "Conversion is a visitor doing the one thing the page exists for. Every element either helps that or is friction — and friction, not ugliness, is what usually kills the number." },
                { type: "worked", heading: "Do the arithmetic first", problem: "A signup page gets 1,000 visits and converts 2%. The team debates a prettier hero versus cutting the form from 5 fields to 2. Which ships first?", steps: ["Today's number: 2% of 1,000 = 20 signups.", "Field count is proven friction: cutting 5 fields to 2 routinely lifts conversion 30–50%.", "A 40% lift means 28 signups; a hero refresh might be worth a point or two.", "Ship the field cut, measure a week, decorate later."], takeaway: "Reduce friction before adding polish — and always run the numbers." },
                { type: "numeric", prompt: "2,000 visitors convert at 3%. You lift it to 4%. How many EXTRA conversions per month is that?", answer: 20, tolerance: 0, explain: "One percentage point of 2,000 is 20 more people — often worth more than any visual change on the page." },
                { type: "mcq", prompt: "The strongest trust signal next to a buy button is…", options: ["A second, larger buy button", "A concrete testimonial with a real name and photo", "A stock photo of a handshake", "More adjectives in the headline"], answer: 1, explain: "Specific, attributable proof answers the doubt a visitor feels at the moment of commitment. Decoration doesn't." },
                { type: "order", prompt: "A conversion pass on any page.", items: ["State the page's one goal in a sentence", "Remove everything not serving it", "Place proof next to the point of doubt", "Change one thing, measure, repeat"], explain: "One change at a time is what makes the measurement mean something.", codeItems: false },
                { type: "concept", heading: "Trust compounds", body: "Dark patterns convert once and churn forever. Honest pages convert a little less today and keep the customer — the compounding curve you already know from math." },
              ],
            },
            {
              title: "A design system in miniature",
              keywords: ["design", "system", "spacing", "scale", "consistency", "components"],
              steps: [
                { type: "concept", heading: "Decide once", body: "A personal design system is small: one spacing scale, one type scale, two fonts, a handful of colors, and a few reusable components. Its job is to stop you re-deciding solved problems." },
                { type: "numeric", prompt: "Your spacing scale doubles from 4: 4, 8, 16, 32… What is the next step?", answer: 64, tolerance: 0, explain: "Doubling scales stay visibly distinct — 33px vs 32px is a coin flip; 32 vs 64 is a decision." },
                { type: "worked", heading: "Systematize three strays", problem: "A card, a modal, and a form panel each look slightly different. Unify them.", steps: ["Extract what repeats: padding, corner radius, shadow, title style.", "Define it once as the card recipe, built on your tokens.", "Rebuild modal and form ON those bones — remaining differences become intentional.", "The next panel now costs minutes and matches automatically."], takeaway: "Consistency is one decision, reused — not a hundred matching decisions." },
                { type: "mcq", prompt: "Your type scale is 14, 16, 20, 25, 31. A new label wants to be \"a bit smaller than 16\". You use…", options: ["15px — it's close enough", "14 — the next step on the scale", "15.5px", "16px in italics"], answer: 1, explain: "The scale IS the system. One 15px today is three near-misses next month; snap to the step." },
                { type: "order", prompt: "Grow a mini design system out of an existing site.", items: ["Audit the site and list what repeats", "Choose the scales: spacing, type, color", "Rebuild the three most-used components on them", "Delete the one-off styles left behind"], explain: "Start from what exists — a system invented in a vacuum won't survive contact with real pages.", codeItems: false },
                { type: "concept", heading: "Constraints are speed", body: "Blank-canvas freedom is where inconsistency breeds and hours vanish. A tight system makes the next page faster AND better looking — that trade is the whole point." },
              ],
            },
            {
              title: "Speed is design",
              keywords: ["performance", "speed", "loading", "images", "weight", "budget"],
              steps: [
                { type: "concept", heading: "Felt before seen", body: "Users feel load time before any typography. Speed is a design property, and on most sites one thing dominates the scale: images." },
                { type: "numeric", prompt: "A hero image ships at 2,400 KB. Properly resized and compressed it is 150 KB. How many KB saved?", answer: 2250, tolerance: 0, explain: "One image, 2.25 MB — often more than the rest of the page combined. Weigh before you optimize anything else." },
                { type: "worked", heading: "From 6 seconds to 2.5", problem: "Your page takes 6s on a phone. Get under a 2.5s budget.", steps: ["Weigh the page first: images 2.4 MB, fonts 300 KB, scripts 500 KB — images dominate.", "Resize to display size and convert to WebP: 2.4 MB becomes ~250 KB.", "Lazy-load below-the-fold images so the first screen isn't waiting on the tenth.", "Re-measure on a real phone on mobile data — the only verdict that counts."], takeaway: "Fix the heaviest thing first; everything else is rounding error until images are right." },
                { type: "mcq", prompt: "Which usually hurts perceived speed most?", options: ["A 20 KB stylesheet", "Full-resolution photos the browser scales down", "One web font", "Long HTML"], answer: 1, explain: "Shipping 4000px photos into 400px slots wastes megabytes and decode time. Size images for the slot they fill." },
                { type: "order", prompt: "A speed pass that sticks.", items: ["Measure on a mid-range phone", "Resize, compress, and modernize images", "Lazy-load everything off-screen", "Set a weight budget so it stays fast"], explain: "The budget is the part teams skip — and why sites that got fast quietly get slow again.", codeItems: false },
                { type: "concept", heading: "Weight creeps", body: "Every redesign adds a font here, a script there. Treat page weight like a budget line — reviewed whenever the page changes — and speed stops being a rescue project." },
              ],
            },
          ],
        },
      ],
    },

    /* ================= SEO ================= */
    {
      id: "seo",
      subject: "SEO",
      level: "Beginner",
      title: "Found on Google",
      units: [
        {
          title: "How search works",
          lessons: [
            {
              title: "How search engines see you",
              keywords: ["seo", "search", "google", "crawl", "index", "rank", "ranking"],
              steps: [
                { type: "concept", heading: "Crawl, index, rank", body: "A crawler fetches your pages by following links. What it reads goes into an index. When someone searches, ranking decides which indexed pages surface. You can lose at any of the three stages." },
                { type: "order", prompt: "Order the journey from your page to a search result.", items: ["Googlebot fetches your page", "Its text and links are indexed", "A search query matches your content", "Ranking decides your position"], explain: "No crawl means no index; no index means no ranking. Diagnose in that order too.", codeItems: false },
                { type: "mcq", prompt: "What does a crawler actually read?", options: ["Your HTML text, tags, and links", "The page as rendered pixels", "Your intentions", "Only the homepage"], answer: 0, explain: "Crawlers read structure and text. Meaning locked inside images or videos is largely invisible without text alternatives." },
                { type: "mcq", prompt: "Your beautiful headline is baked into a banner image with no alt text. To Google it is…", options: ["Extra convincing", "The same as text", "Effectively invisible", "A ranking bonus"], answer: 2, explain: "Text in images is not text. Real headlines belong in real heading tags, with alt describing the image." },
                { type: "concept", heading: "SEO is mostly honesty at scale", body: "Say clearly what each page is about, in the words searchers use, in places machines can read. Most SEO wins are that — not tricks." },
              ],
            },
            {
              title: "Keywords people type",
              keywords: ["seo", "keywords", "intent", "longtail", "queries", "traffic"],
              steps: [
                { type: "concept", heading: "Match the searcher's words", body: "People search in their own words: fix squeaky door hinge, not lubrication solutions. A page ranks for phrases it actually contains and answers — start from real queries, not your vocabulary." },
                { type: "worked", heading: "Pick the winnable fight", problem: "Your hiking store can chase “shoes” or “waterproof trail shoes women”. Which wins?", steps: ["“shoes” gets millions of searches — and page one is Amazon, Nike, and Zappos. Your realistic share: zero.", "The long phrase gets maybe 700 searches a month against weak competition — top 3 is plausible.", "The person typing it also knows exactly what she wants, so each visit converts far better.", "700 searches × a real position × high intent beats millions × position 60 × window shopping."], takeaway: "Pick fights you can win, from searchers who mean it." },
                { type: "mcq", prompt: "Why do long, specific phrases (long-tail keywords) often beat big generic ones?", options: ["They are trendier", "Less competition and clearer intent, so visitors convert", "Google charges less for them", "They are easier to spell"], answer: 1, explain: "You will not outrank giants for shoes. You can win best trail shoes for flat feet — and that searcher knows what they want." },
                { type: "numeric", prompt: "Keyword A: 1,000 searches/month, you would get 2% of clicks. Keyword B: 100 searches, 30% of clicks. How many monthly visits does B bring?", answer: 30, tolerance: 0, explain: "100 × 0.30 = 30, versus A's 20. Small-but-yours beats big-but-crowded surprisingly often." },
                { type: "order", prompt: "Choose keywords like a professional.", items: ["List phrases real customers say and type", "Check what already ranks for each", "Pick ones you can plausibly win", "Give each its own page"], explain: "One page per intent. A page trying to rank for everything ranks for nothing.", codeItems: false },
                { type: "concept", heading: "Intent over volume", body: "Behind every query is a want: to learn, to compare, or to buy. Match your page to the want — a how-to guide will not rank for a buying query, no matter the keyword count." },
              ],
            },
          ],
        },
        {
          title: "Doing the work",
          lessons: [
            {
              title: "Pages that rank",
              keywords: ["seo", "title", "meta", "description", "onpage", "headings", "content"],
              steps: [
                { type: "concept", heading: "The three tags that matter most", body: "The <title> is your search-result headline. The meta description is the sales pitch under it. The <h1> confirms to readers and robots that they landed in the right place. All three should carry the page's keyword naturally." },
                { type: "mcq", prompt: "A good <title> tag is roughly…", options: ["As long as possible, packed with keywords", "About 50–60 characters, keyword near the front", "Identical on every page for brand consistency", "Unnecessary if you have an h1"], answer: 1, explain: "Google truncates around 60 characters, and duplicate titles waste every page's one headline." },
                { type: "mcq", prompt: "The meta description mainly improves…", options: ["Your ranking position directly", "Whether people click your result once they see it", "Page load speed", "Your crawl budget"], answer: 1, explain: "It is ad copy, not a ranking signal — but a result nobody clicks might as well not rank." },
                { type: "order", prompt: "Structure a page that wants to rank.", items: ["One h1 stating the topic plainly", "An opening paragraph answering the query fast", "Subheadings that cover the follow-up questions", "Internal links to your related pages"], explain: "Answer first, depth second. Pages that make searchers dig get backed out of — and Google notices.", codeItems: false },
                { type: "numeric", prompt: "Your result gets 2,000 impressions this month with a 3% click-through rate. How many clicks?", answer: 60, tolerance: 0, explain: "2000 × 0.03 = 60. A better title and description often lift CTR more easily than rank." },
                { type: "concept", heading: "Write for the reader anyway", body: "Keyword-stuffed pages read like spam to humans and, increasingly, to Google. Cover the topic properly in plain language; the phrases you need appear on their own." },
              ],
            },
            {
              title: "Links are votes",
              keywords: ["seo", "backlinks", "links", "authority", "internal", "linking"],
              steps: [
                { type: "concept", heading: "Backlinks are borrowed trust", body: "When a respected site links to yours, some of its credibility transfers. One link from a real industry site outweighs a hundred from junk directories — quality, not count." },
                { type: "mcq", prompt: "Which backlink helps most?", options: ["A paid link farm placement", "Your own comment on a forum", "A local news article linking your bakery's story", "A link from your other domain"], answer: 2, explain: "Editorial links — someone chose to cite you — are the votes that count. Schemes range from worthless to penalized." },
                { type: "order", prompt: "Earn links without begging.", items: ["Make something genuinely worth citing", "Find who writes about your topic", "Show them, briefly and personally", "Repeat — it compounds"], explain: "Link-worthy first, outreach second. Outreach for mediocre content is just spam with extra steps.", codeItems: false },
                { type: "mcq", prompt: "Internal links (your pages linking each other) matter because…", options: ["They are the same as backlinks", "They guide crawlers and spread authority to deep pages", "Google requires a minimum count", "They reduce hosting costs"], answer: 1, explain: "Your best backlink flows authority onward through internal links. Orphan pages with no internal links barely get crawled." },
                { type: "concept", heading: "Anchor text is a hint", body: "Read our pricing guide tells robots and readers what the destination is. Click here tells them nothing. Describe the destination in the link itself." },
              ],
            },
            {
              title: "Measure and adjust",
              keywords: ["seo", "analytics", "search", "console", "metrics", "impressions", "ctr"],
              steps: [
                { type: "concept", heading: "Search Console is the scoreboard", body: "Google Search Console shows the queries you appeared for, impressions, clicks, and average position — free, from Google itself. SEO without it is guessing." },
                { type: "mcq", prompt: "High impressions but almost no clicks usually means…", options: ["The page should be deleted", "Your title/description are not earning the click", "Google is broken", "You need more keywords on the page"], answer: 1, explain: "People see you and pass. That is a headline problem — rewrite the title and description like ad copy." },
                { type: "numeric", prompt: "A page ranks position 8 with 900 impressions and 1% CTR. You improve it to 2% CTR. How many clicks now?", answer: 18, tolerance: 0, explain: "900 × 0.02 = 18, double the 9 you had — without moving a single position." },
                { type: "order", prompt: "A monthly SEO review that fits in one coffee.", items: ["Open Search Console's query report", "Find pages ranking 5–15 (almost winning)", "Improve exactly those pages", "Note what changed and check next month"], explain: "Pages just off page one are where small edits move real traffic. Position 45 to 40 moves nothing.", codeItems: false },
                { type: "concept", heading: "SEO is a flywheel, not a switch", body: "Changes take weeks to register and months to compound. Steady publishing and improving beats bursts of effort followed by silence — the sites that win are the ones still showing up in month six." },
              ],
            },
          ],
        },
        {
          title: "Compound traffic",
          lessons: [
            {
              title: "Content clusters",
              keywords: ["seo", "cluster", "pillar", "authority", "topical", "strategy"],
              steps: [
                { type: "concept", heading: "Own topics, not keywords", body: "One page rarely wins alone. A pillar page covers a topic broadly; cluster pages each answer one sub-question and link back. Search engines read the linked set as expertise." },
                { type: "worked", heading: "Cluster the bakery", problem: "A bakery wants to own \"sourdough\" searches. Plan the content.", steps: ["Pillar: one thorough guide — \"Sourdough, start to finish\".", "Clusters: starter care, first loaf, common failures, tools — one search intent each.", "Every cluster links to the pillar and to its siblings; the pillar links out to all of them.", "Six months of that beats one \"ultimate guide\" post almost every time."], takeaway: "Cover the topic as a linked system, not a lone page." },
                { type: "mcq", prompt: "The internal links inside a cluster mainly tell Google…", options: ["The site has many pages", "These pages together form one area of expertise", "To crawl more slowly", "Nothing — internal links are ignored"], answer: 1, explain: "Linked, focused pages transfer authority to each other and map the topic. Orphan posts never add up to anything." },
                { type: "order", prompt: "Build a cluster without burning out.", items: ["Pick a topic you can genuinely cover", "Write the pillar overview first", "Publish cluster pages one intent at a time", "Interlink and refresh as rankings arrive"], explain: "Pillar first gives every later post something to plug into on day one.", codeItems: false },
                { type: "numeric", prompt: "Eight cluster pages each bring 40 visits a month and the pillar brings 200. Total monthly visits?", answer: 520, tolerance: 0, explain: "8 × 40 + 200 = 520 — and each new cluster page compounds the whole set, not just itself." },
                { type: "concept", heading: "Readers feel it too", body: "Whichever page a visitor lands on, their next question is one click away. Clusters aren't a trick — they're what genuinely covering a subject looks like." },
              ],
            },
            {
              title: "Technical SEO essentials",
              keywords: ["seo", "technical", "sitemap", "robots", "canonical", "redirect", "crawl"],
              steps: [
                { type: "concept", heading: "Clear the road", body: "Technical SEO removes obstacles between crawler and content: a sitemap (the map), robots.txt (the rules), canonical tags (which copy counts), and redirects (where moved pages went)." },
                { type: "mcq", prompt: "You moved a popular page to a new URL. What preserves its rankings?", options: ["Delete the old page", "A 301 permanent redirect to the new URL", "Keep the content at both URLs", "A note in the footer"], answer: 1, explain: "A 301 hands the old page's earned authority to the new address. Deleting it throws years of links away." },
                { type: "mcq", prompt: "Two URLs show the same product — with and without ?color=blue. Best practice?", options: ["Block one in robots.txt", "A canonical tag pointing at the main URL", "Delete the variant page", "Nothing — Google always guesses right"], answer: 1, explain: "The canonical says \"count these as one\". Blocking hides the page entirely — a different, blunter tool." },
                { type: "worked", heading: "Diagnose the post-redesign drop", problem: "Traffic fell 60% after a site redesign. Find the cause.", steps: ["Open Search Console first: coverage report and crawl errors tell you WHERE it broke.", "Did URLs change without 301 redirects? That is the classic redesign killer.", "Check robots.txt and meta noindex — staging blocks ship to production more often than anyone admits.", "Fix redirects, resubmit the sitemap, and wait out a recrawl before judging."], takeaway: "After any restructure: redirects, robots, sitemap — checked in that order." },
                { type: "order", prompt: "Technical setup for a new site, in order.", items: ["Verify the site in Search Console", "Submit an XML sitemap", "Confirm robots.txt isn't blocking real pages", "Add canonicals wherever duplicates exist"], explain: "Search Console first — every later check reads from it.", codeItems: false },
                { type: "concept", heading: "Set-and-vigil", body: "Technical SEO is mostly one-time setup plus vigilance at every redesign. The disasters are almost always self-inflicted, which means they are also preventable." },
              ],
            },
            {
              title: "Winning nearby searches",
              keywords: ["seo", "local", "maps", "business", "profile", "reviews", "nearby"],
              steps: [
                { type: "concept", heading: "The map is the battlefield", body: "For a physical business, \"near me\" searches route through your business profile — category, hours, photos, reviews — as much as through your website. Both need tending." },
                { type: "mcq", prompt: "The biggest local-ranking lever you control this week is…", options: ["A new logo", "A complete profile plus a steady flow of real reviews", "More hashtags", "A press release"], answer: 1, explain: "Completeness and genuine review activity are the strongest signals a small business can actually move." },
                { type: "worked", heading: "Two bakeries, one winner", problem: "Two bakeries share a street. One dominates local results — why?", steps: ["Its profile is complete: precise category, current hours, forty real photos.", "It replies to reviews — visible engagement reads as an active, cared-for business.", "Its site names the neighborhood in plain text: \"sourdough bakery in Elwood\".", "Its name, address, and phone match exactly everywhere they appear online."], takeaway: "Local SEO = completeness + consistency + reviews." },
                { type: "order", prompt: "A local SEO sprint for one afternoon.", items: ["Claim and complete the business profile", "Make name/address/phone identical everywhere", "Ask three happy customers for reviews, reply to every one", "Put the location into page titles and copy"], explain: "Consistency errors (old address in one directory) quietly cap everything else.", codeItems: false },
                { type: "numeric", prompt: "Your profile gets 1,200 views a month and 6% request directions. How many people is that?", answer: 72, tolerance: 0, explain: "72 people physically heading your way — profile views convert harder than almost any website traffic." },
                { type: "concept", heading: "Reviews are local backlinks", body: "Earned, public, and impossible to fake at scale — reviews are trust the algorithm and the customer both read. Ask honestly, reply always, never buy." },
              ],
            },
          ],
        },
      ],
    },

    /* ================= PRACTICAL MATH ================= */
    {
      id: "math",
      subject: "Practical math",
      level: "Beginner",
      title: "Numbers you can use",
      units: [
        {
          title: "Proportions",
          lessons: [
            {
              title: "Percentages without fear",
              keywords: ["math", "percent", "percentage", "discount", "increase", "fraction"],
              steps: [
                { type: "concept", heading: "Percent means per hundred", body: "x% of something is x hundredths of it: 15% of 80 is 15/100 × 80. Every percentage problem is that one multiplication wearing different clothes." },
                { type: "worked", heading: "Watch one solved", problem: "A $60 jacket is 25% off. What do you pay?", steps: ["25% means 25 per hundred. The discount is 0.25 × 60.", "0.25 × 60 = 15 — fifteen dollars come off.", "60 − 15 = 45. You pay $45.", "Shortcut: you keep 75%, and 0.75 × 60 = 45. Same answer, one multiplication."], takeaway: "Percent off = multiply by what remains." },
                { type: "numeric", prompt: "What is 15% of 80?", answer: 12, tolerance: 0, explain: "0.15 × 80 = 12. Shortcut: 10% is 8, 5% is 4, together 12." },
                { type: "explore", heading: "Slide the percent", body: "Drag the percentage and watch the amount taken from 250. Notice 10% steps move the result in equal jumps — percentages of a fixed base are linear.", expr: "p/100*250", variable: "p", min: 0, max: 100, stepSize: 1, label: "percent", valueLabel: "amount of 250" },
                { type: "mcq", prompt: "A $50 jacket is 30% off. You pay…", options: ["$20", "$30", "$35", "$47"], answer: 2, explain: "30% of 50 is 15 off, leaving 35. Or directly: you pay 70%, and 0.7 × 50 = 35." },
                { type: "numeric", prompt: "A price rises from $40 to $46. What percent increase is that?", answer: 15, tolerance: 0.5, explain: "The change is 6; 6 ÷ 40 = 0.15 = 15%. Always divide by the ORIGINAL value." },
                { type: "concept", heading: "Points are not percent", body: "An interest rate going from 4% to 6% rose two percentage points — but that is a 50% increase in the rate. Headlines mix these up constantly; now you will catch them." },
              ],
            },
            {
              title: "Ratios and scaling",
              keywords: ["math", "ratio", "scaling", "proportion", "rates", "units", "recipe"],
              steps: [
                { type: "concept", heading: "Keep the ratio, change the size", body: "A recipe, a map, a mix — all ratios. Scale every part by the same factor and the thing still works. Find the factor first: new amount ÷ old amount." },
                { type: "worked", heading: "Scale a recipe", problem: "A recipe for 2 people uses 150 g of rice. You are cooking for 5.", steps: ["Find the scaling factor first: 5 ÷ 2 = 2.5.", "Multiply every ingredient by it: 150 × 2.5 = 375 g.", "Sanity check: 5 people is a bit more than double 2, and 375 is a bit more than double 150."], takeaway: "Scale by one factor — new ÷ old — applied to everything." },
                { type: "numeric", prompt: "A recipe for 4 people uses 300 g of flour. How many grams for 6 people?", answer: 450, tolerance: 0, explain: "The factor is 6/4 = 1.5, and 300 × 1.5 = 450." },
                { type: "explore", heading: "Areas scale faster", body: "Drag the side length of a square and watch its area. Double the side and the area quadruples — scaling in two dimensions multiplies twice.", expr: "s^2", variable: "s", min: 0, max: 10, stepSize: 0.1, label: "side length", valueLabel: "area" },
                { type: "mcq", prompt: "A pizza with double the diameter costs 1.5× the price. Per bite of pizza it is…", options: ["A worse deal", "The same deal", "A better deal", "Impossible to compare"], answer: 2, explain: "Double the diameter is 4× the area for 1.5× the money. Area is what you eat." },
                { type: "numeric", prompt: "A car goes 240 km on 15 liters. How many km per liter?", answer: 16, tolerance: 0, explain: "240 ÷ 15 = 16 km/L. Rates are ratios with useful units attached." },
                { type: "concept", heading: "Let the units do the thinking", body: "Write units into your arithmetic: km ÷ (km/L) leaves L. If the units of your answer come out wrong, the calculation is wrong — no double-checking needed." },
              ],
            },
          ],
        },
        {
          title: "Growth and chance",
          lessons: [
            {
              title: "Compound growth",
              keywords: ["math", "compound", "interest", "growth", "exponential", "investing", "savings"],
              steps: [
                { type: "concept", heading: "Growth on growth", body: "Compound growth pays interest on last year's interest. Each step rides a bigger base, so the curve bends upward — modest rates become large numbers, given time." },
                { type: "worked", heading: "Three years, step by step", problem: "You save $500 at 8% per year. What is it worth after 3 years?", steps: ["Year one: 500 × 1.08 = 540.", "Year two grows the NEW total: 540 × 1.08 = 583.20.", "Year three: 583.20 × 1.08 ≈ 629.86.", "Simple interest would add a flat 40 each year and end at 620 — compounding already beat it, and the gap widens every year."], takeaway: "Multiply by (1 + rate) once per year, on the new total each time." },
                { type: "explore", heading: "Bend the curve", body: "Drag the yearly rate applied to 1,000 for ten years. Watch the right side of the curve run away from the left — that bend is compounding.", expr: "1000*(1+r)^10", variable: "r", min: 0, max: 0.2, stepSize: 0.005, label: "yearly rate", valueLabel: "after 10 years" },
                { type: "numeric", prompt: "1,000 grows 10% per year. How much after 2 years?", answer: 1210, tolerance: 1, explain: "Year one: 1,100. Year two grows the NEW total: 1,100 × 1.1 = 1,210 — not 1,200." },
                { type: "mcq", prompt: "The rule of 72 estimates doubling time. At 6% growth, money doubles in about…", options: ["6 years", "12 years", "24 years", "72 years"], answer: 1, explain: "72 ÷ rate ≈ doubling time: 72 ÷ 6 = 12 years. A rough rule, but remarkably good for everyday rates." },
                { type: "numeric", prompt: "Using the rule of 72: at 9% per year, roughly how many years to double?", answer: 8, tolerance: 0.5, explain: "72 ÷ 9 = 8. Now reverse it: a debt at 18% doubles in about 4 — compounding works against you just as hard." },
                { type: "concept", heading: "Time is the big lever", body: "Ten extra years matters more than a slightly better rate. That is why starting early beats starting big, and why old debts grow teeth." },
              ],
            },
            {
              title: "Probability you can use",
              keywords: ["math", "probability", "chance", "odds", "random", "coin", "dice"],
              steps: [
                { type: "concept", heading: "Count the ways", body: "For equally likely outcomes, probability = ways it can happen ÷ ways anything can happen. Two coins have four outcomes: HH, HT, TH, TT — each 1/4." },
                { type: "worked", heading: "Two dice together", problem: "Roll two dice. What is the chance BOTH show a six?", steps: ["One die shows a six with probability 1/6 — one face out of six.", "The dice do not influence each other, so their chances multiply.", "1/6 × 1/6 = 1/36 ≈ 0.028 — about 3 times in a hundred tries."], takeaway: "Independent events: multiply the chances." },
                { type: "numeric", prompt: "Flip two fair coins. What is the probability BOTH are heads, as a decimal?", answer: 0.25, tolerance: 0.01, explain: "One outcome (HH) out of four equally likely ones: 1/4 = 0.25. Independent chances multiply: 0.5 × 0.5." },
                { type: "mcq", prompt: "A fair coin lands heads 5 times running. The chance the NEXT flip is heads is…", options: ["Much less than 50% — tails is due", "Exactly 50%", "More than 50% — heads is hot", "Zero"], answer: 1, explain: "The coin has no memory. Believing streaks must balance out is the gambler's fallacy, and casinos are built on it." },
                { type: "explore", heading: "At least once", body: "Something has a small per-try chance. Drag it and watch the probability of at least one success across 10 tries — small chances become near-certainties with repetition.", expr: "1-(1-p)^10", variable: "p", min: 0, max: 0.5, stepSize: 0.01, label: "chance per try", valueLabel: "chance in 10 tries" },
                { type: "numeric", prompt: "Roll one die. Probability of a 5 or a 6, as a decimal (two places)?", answer: 0.33, tolerance: 0.01, explain: "2 favorable faces out of 6: 2/6 = 1/3 ≈ 0.33." },
                { type: "concept", heading: "Independence is the fine print", body: "Multiplying chances requires the events not to influence each other. Two flights delayed by the same storm are not independent — and pretending otherwise is how planners get surprised." },
              ],
            },
            {
              title: "Averages that lie",
              keywords: ["math", "average", "mean", "median", "statistics", "outliers", "data"],
              steps: [
                { type: "concept", heading: "Mean vs median", body: "The mean adds everything and divides. The median is the middle value when sorted. One billionaire in the room drags the mean to the moon; the median barely moves." },
                { type: "worked", heading: "The million-dollar neighbor", problem: "A street has five houses: four worth $200k and one worth $1M. What is the “average” house?", steps: ["Mean: (4 × 200 + 1,000) ÷ 5 = 1,800 ÷ 5 = $360k.", "But no house on the street costs anywhere near $360k.", "Median: sort and take the middle — $200k, which describes four of the five houses exactly."], takeaway: "One outlier can drag the mean far from every actual value." },
                { type: "numeric", prompt: "Find the MEAN of 2, 4, 6, 8, 100.", answer: 24, tolerance: 0, explain: "Sum 120 ÷ 5 = 24 — bigger than four of the five values, thanks to the outlier." },
                { type: "numeric", prompt: "Same numbers: 2, 4, 6, 8, 100. What is the MEDIAN?", answer: 6, tolerance: 0, explain: "Sorted, the middle value is 6. The 100 counts as just one value up top — the median resists outliers." },
                { type: "mcq", prompt: "For typical household income, which average tells the truer story?", options: ["The mean", "The median", "They always match", "Neither can help"], answer: 1, explain: "Incomes skew: a few huge values inflate the mean. Median answers what does the middle household actually make?" },
                { type: "order", prompt: "Interrogate a statistic before believing it.", items: ["Ask which average was used", "Ask how spread out the values are", "Ask who was included and who was not", "Then decide what it shows"], explain: "Average customer saves $400 can be true while most customers save nothing. The questions expose which.", codeItems: false },
                { type: "concept", heading: "Ask for the spread", body: "Two teams can share an average and live different lives — one steady, one chaotic. Range and percentiles tell you what the average alone hides." },
              ],
            },
          ],
        },
        {
          title: "Sharper tools",
          lessons: [
            {
              title: "Expected value decisions",
              keywords: ["math", "expected", "value", "ev", "decisions", "risk", "bets"],
              steps: [
                { type: "concept", heading: "Price the uncertain", body: "Expected value = each outcome × its probability, summed. It converts an uncertain choice into a number you can compare to a price — the core tool of rational betting, insurance, and business decisions." },
                { type: "worked", heading: "Price the raffle", problem: "A ticket costs $5. One ticket in 200 wins $500. Good deal?", steps: ["EV of the prize: (1/200) × 500 = $2.50.", "You pay $5 for an expected $2.50 — the ticket loses $2.50 in expectation.", "Fun can be worth $2.50. A savings plan built on raffles cannot."], takeaway: "Multiply each outcome by its chance; compare the total to the price." },
                { type: "numeric", prompt: "A game gives a 30% chance to win $40, otherwise nothing. What is its fair price (EV) in dollars?", answer: 12, tolerance: 0, explain: "0.30 × 40 = 12. Paying less than $12 is +EV; paying more is a donation." },
                { type: "explore", heading: "Find the break-even", body: "A bet pays $100 on a win and loses $20 otherwise. Drag the win chance and watch expected profit cross zero — that crossing point is the exact chance that makes the bet fair.", expr: "p*100-(1-p)*20", variable: "p", min: 0, max: 0.5, stepSize: 0.01, label: "win chance", valueLabel: "expected profit" },
                { type: "mcq", prompt: "Insurance has negative EV for you — premiums exceed average payouts. Why buy it anyway?", options: ["You shouldn't, ever", "Because a rare loss you cannot absorb is worse than a small certain cost", "Because EV doesn't apply to money", "Tax reasons only"], answer: 1, explain: "EV assumes you survive to play again. For ruinous outcomes, you pay to remove the tail, not to win on average." },
                { type: "numeric", prompt: "A 1% yearly chance of a $20,000 loss. What is the expected yearly loss (the fair premium) in dollars?", answer: 200, tolerance: 0, explain: "0.01 × 20,000 = 200. Everything an insurer charges above that covers costs, profit — and your peace of mind." },
                { type: "concept", heading: "EV for repeats, survival for one-shots", body: "Use EV freely on repeatable, affordable bets. For rare catastrophic ones, weight staying in the game — a positive-EV bet you can't afford to lose is still a bad bet." },
              ],
            },
            {
              title: "Spread tells the story",
              keywords: ["math", "spread", "variation", "range", "deviation", "percentile", "tail"],
              steps: [
                { type: "concept", heading: "The second number", body: "Two datasets can share an average and be different animals. Spread — range, percentiles, deviation — is the second number to demand before trusting any average." },
                { type: "worked", heading: "Choose a courier", problem: "Two delivery services both average 30 minutes. A ranges 28–33; B ranges 10–70. Which carries your interview documents?", steps: ["Same mean, wildly different spread: A varies by 5 minutes, B by 60.", "Your real cost isn't average lateness — it's the chance of DISASTER lateness.", "B's 70-minute tail is what misses the interview. Choose A.", "When the downside matters, decide on the spread, not the mean."], takeaway: "Averages book the trip; tails miss the flight." },
                { type: "numeric", prompt: "Delivery times: 22, 25, 30, 31, 42. What is the range (max minus min)?", answer: 20, tolerance: 0, explain: "42 − 22 = 20. Crude but honest — one number that already says \"this service varies a lot\"." },
                { type: "numeric", prompt: "Same times — 22, 25, 30, 31, 42. What is the median?", answer: 30, tolerance: 0, explain: "Sorted, the middle value is 30. Pair it with the range and you know more than any single average tells you." },
                { type: "mcq", prompt: "\"Median wait 20 min; 95th percentile 90 min.\" This tells you…", options: ["The system fails everyone", "Half wait ≤20, but 1 in 20 waits 90+ — plan for that tail", "The average must be 55", "Percentiles are just averages"], answer: 1, explain: "Median describes the typical case; p95 describes the bad day. Systems get judged — and sized — on their bad days." },
                { type: "concept", heading: "Report middle AND tail", body: "Whenever you quote a number, give a middle (median) and a tail (p95 or range). That one habit makes your reports honest and your plans robust." },
              ],
            },
            {
              title: "Money math that compounds",
              keywords: ["math", "inflation", "interest", "loans", "debt", "real", "nominal"],
              steps: [
                { type: "concept", heading: "Real beats nominal", body: "Growth minus inflation is what your money actually does. 7% returns during 3% inflation is ~4% real growth — the number that buys bread. Every money decision should be made in real terms." },
                { type: "numeric", prompt: "Savings earn 5% while inflation runs 3%. Approximate real growth rate, in percent?", answer: 2, tolerance: 0.1, explain: "5 − 3 = 2% real. (The exact figure is a touch lower, but the subtraction is right to within rounding for everyday rates.)" },
                { type: "worked", heading: "Which debt first?", problem: "You hold an 18% credit card balance and a 6% car loan. Where does every spare dollar go?", steps: ["Debt compounds exactly like savings — against you.", "Rule of 72 on the card: 72 ÷ 18 = 4 years to double. The car loan doubles in 12.", "Paying the 18% card is a guaranteed 18% return; no safe investment comes close.", "Card first, minimums on the rest, no exceptions until it's dead."], takeaway: "Rank debts by rate and kill the fastest-compounding one first." },
                { type: "explore", heading: "Inflation eats quietly", body: "Drag the inflation rate and watch what 1,000 of today's money is worth in ten years. Even \"low\" inflation compounds into a real bite.", expr: "1000/((1+i)^10)", variable: "i", min: 0, max: 0.1, stepSize: 0.002, label: "inflation rate", valueLabel: "real value in 10 years" },
                { type: "mcq", prompt: "Inflation moves from 4% to 6%. The RATE of inflation just grew by…", options: ["2%", "6%", "50%", "It fell"], answer: 2, explain: "Two percentage points, yes — but 4 → 6 is a 50% jump in the rate itself. Headlines blur this distinction daily." },
                { type: "numeric", prompt: "Rule of 72: at 12% card interest, roughly how many years until an untouched balance doubles?", answer: 6, tolerance: 0, explain: "72 ÷ 12 = 6. The same doubling magic you admired in savings, now working the other side of the table." },
              ],
            },
          ],
        },
      ],
    },

    /* ================= CLEAR THINKING ================= */
    {
      id: "thinking",
      subject: "Critical thinking",
      level: "Beginner",
      title: "Clear thinking",
      units: [
        {
          title: "Defense against nonsense",
          lessons: [
            {
              title: "Spot the bad argument",
              keywords: ["logic", "fallacies", "arguments", "reasoning", "debate", "rhetoric", "critical", "thinking"],
              steps: [
                { type: "concept", heading: "Attack the claim, not the person", body: "An argument stands or falls on its reasoning. The most common fouls: attacking the speaker (ad hominem), attacking a distorted copy of the claim (strawman), and pretending only two options exist (false dilemma)." },
                { type: "mcq", prompt: "“You can't trust her budget plan — she's terrible at parking.” Which foul?", options: ["Strawman", "Ad hominem", "False dilemma", "Perfectly valid"], answer: 1, explain: "Parking skill says nothing about the budget's arithmetic. Attacking the person dodges the plan itself." },
                { type: "mcq", prompt: "“He wants a bike lane, so apparently cars should be banned entirely.” Which foul?", options: ["Ad hominem", "False dilemma", "Strawman", "Appeal to authority"], answer: 2, explain: "The bike-lane claim was swapped for a wilder one that is easier to knock down. That distorted copy is the strawman." },
                { type: "mcq", prompt: "“Either we cut the entire arts budget or the city goes bankrupt.” Which foul?", options: ["False dilemma", "Strawman", "Ad hominem", "Sound reasoning"], answer: 0, explain: "Two options are presented as the only ones when a whole range exists. Real decisions are rarely binary." },
                { type: "order", prompt: "Steel-man instead: respond to the STRONGEST version.", items: ["Restate their claim so they would say yes, exactly", "Strengthen it to its best version", "Test that version against evidence", "Respond to that, not the caricature"], explain: "Beating a weak copy convinces no one. Beating the strong version actually settles something.", codeItems: false },
                { type: "concept", heading: "Fouls are not falsity", body: "A badly argued claim can still be true, and a slick argument can defend nonsense. Spotting the foul tells you the ARGUMENT failed — the claim then needs honest evidence, either way." },
              ],
            },
            {
              title: "Correlation isn't causation",
              keywords: ["causation", "correlation", "confounder", "studies", "science", "evidence"],
              steps: [
                { type: "concept", heading: "Moving together proves little", body: "Ice cream sales and drownings rise together every year. Neither causes the other — summer causes both. A hidden common cause like that is called a confounder." },
                { type: "mcq", prompt: "Cities with more firefighters have more fire damage. Best explanation?", options: ["Firefighters cause damage", "Damage attracts firefighters as residents", "Bigger fires bring both more firefighters and more damage", "Coincidence, always"], answer: 2, explain: "Fire size is the confounder driving both numbers. The correlation is real; the causal story firefighters cause damage is not." },
                { type: "mcq", prompt: "What can separate causation from correlation most convincingly?", options: ["A bigger sample of the same observation", "A controlled experiment where only one thing changes", "A stronger correlation coefficient", "An expert's opinion"], answer: 1, explain: "Randomly assigning the change breaks the link to confounders. More of the same observational data repeats the same blind spot." },
                { type: "order", prompt: "React to a striking correlation like a scientist.", items: ["Notice the two things move together", "List what could cause both", "Check whether the timing even fits", "Look for or run an experiment before claiming cause"], explain: "Could a third thing drive both? dissolves most headline correlations before step four.", codeItems: false },
                { type: "concept", heading: "Beware the arrow's direction", body: "Even a real causal link can point backwards: maybe depression disrupts sleep rather than poor sleep causing depression — or each feeds the other. Direction needs evidence too, not intuition." },
              ],
            },
          ],
        },
        {
          title: "Judgment under uncertainty",
          lessons: [
            {
              title: "Estimate like a physicist",
              keywords: ["estimation", "fermi", "approximation", "sanity", "check", "numbers"],
              steps: [
                { type: "concept", heading: "Rough is powerful", body: "You can estimate almost anything by breaking it into pieces you half-know and multiplying. Being within 2× of the truth is usually enough to make the decision — and to catch numbers that are nonsense." },
                { type: "numeric", prompt: "Warm-up: how many minutes are in a week?", answer: 10080, tolerance: 0, explain: "7 × 24 × 60 = 10,080. Chained multiplications like this are the whole Fermi toolkit." },
                { type: "numeric", prompt: "A 250-page book averages 300 words per page. Estimate its word count.", answer: 75000, tolerance: 0, explain: "250 × 300 = 75,000 — a decent guess for any novel on your shelf, built from two easy numbers." },
                { type: "mcq", prompt: "For rough estimates, the professional move is to…", options: ["Carry every decimal for accuracy", "Round aggressively to easy numbers and track the powers of ten", "Refuse to guess without data", "Always take the average of others' guesses"], answer: 1, explain: "20 × 300 × 50 in your head beats 23 × 312 × 47 abandoned. Getting the number of zeros right is most of the value." },
                { type: "order", prompt: "Sanity-check a suspicious statistic.", items: ["Break it into per-person or per-day pieces", "Estimate each piece roughly", "Multiply back to the total", "Compare — off by 10× means someone is wrong"], explain: "The industry loses a trillion dollars a year often dies at step four. Now you can run the check yourself.", codeItems: false },
                { type: "concept", heading: "Estimate before you compute", body: "Guess the answer before the calculator touches it. When the two disagree wildly, you have caught either a typo or a broken assumption — both worth catching." },
              ],
            },
            {
              title: "Risk and randomness",
              keywords: ["risk", "base", "rates", "bayes", "randomness", "clusters", "probability"],
              steps: [
                { type: "concept", heading: "Base rates come first", body: "How common something is to begin with — the base rate — dominates rare-event reasoning. A very accurate test for a very rare condition still produces mostly false alarms, because almost everyone tested is healthy." },
                { type: "worked", heading: "The flagged bag", problem: "1 bag in 1,000 carries contraband. The scanner catches every real one but also flags 2% of innocent bags. A bag just got flagged — how worried should we be?", steps: ["Picture 1,000 bags. Exactly 1 is a real hit, and the scanner flags it.", "Of the 999 innocent bags, 2% get flagged too — about 20 false alarms.", "So roughly 21 bags get flagged, and only 1 of them is real: about 5%."], takeaway: "When the thing is rare, most alarms are false — draw the 1,000-people picture." },
                { type: "numeric", prompt: "A condition affects 1 in 1,000 people. A test is 99% accurate both ways. You test positive. Roughly what PERCENT chance do you actually have it?", answer: 9, tolerance: 3, explain: "Per 1,000 people: about 1 true positive and about 10 false alarms from the 999 healthy. 1 real out of ~11 positives ≈ 9% — not 99%." },
                { type: "mcq", prompt: "Why is the intuitive 99% answer so wrong there?", options: ["The test is worse than claimed", "The tiny base rate means false alarms outnumber true cases", "Percentages cannot exceed 50%", "It isn't wrong"], answer: 1, explain: "999 healthy people generating 1% false alarms is ~10 alarms; 1 sick person generates ~1 real. The healthy crowd dominates." },
                { type: "mcq", prompt: "Four heart attacks in one small town in a month. Before suspecting the water, remember…", options: ["Clusters prove a local cause", "Randomness naturally makes clusters — evenly-spread is what would be weird", "Small towns are safer", "Four is statistically impossible"], answer: 1, explain: "Sprinkle events randomly on a map and clumps appear. Real clusters exist, but clumpiness alone is what chance looks like." },
                { type: "order", prompt: "Judge a scary risk headline calmly.", items: ["Find the base rate — how common to start with?", "Ask: doubled from what? Relative or absolute?", "Translate to real people: X per 10,000", "Compare against risks you already accept"], explain: "Doubles your risk can mean 1-in-a-million became 2-in-a-million. The absolute numbers carry the meaning.", codeItems: false },
                { type: "concept", heading: "Expected value, not vividness", body: "Weigh outcomes by probability × impact, not by how easily you can picture them. Plane crashes are vivid; the drive to the airport is the dangerous part." },
              ],
            },
          ],
        },
        {
          title: "Better decisions",
          lessons: [
            {
              title: "Biases in the wild",
              keywords: ["bias", "anchoring", "sunk", "cost", "confirmation", "psychology"],
              steps: [
                { type: "concept", heading: "Shortcuts misfiring", body: "Biases aren't stupidity — they're fast mental shortcuts firing in the wrong situation. You can't delete them, but you can learn their shapes and design decisions around them." },
                { type: "mcq", prompt: "\"We've already spent $80k on this project — we can't stop now.\" Which trap?", options: ["Anchoring", "The sunk cost fallacy", "Survivorship bias", "None — that's prudence"], answer: 1, explain: "The $80k is gone whether you continue or not. Only future costs and future benefits belong in the decision." },
                { type: "mcq", prompt: "The first price you saw was $400, so $250 feels cheap — even though it's above market. That pull is…", options: ["Anchoring", "Sunk cost", "Confirmation bias", "Altruism"], answer: 0, explain: "The first number sets the scale everything after is judged against. Sellers know this; now you do too." },
                { type: "worked", heading: "De-bias your own claim", problem: "You believe your redesign improved sales, and you keep finding supporting evidence. Check it honestly.", steps: ["Name the pull: confirmation bias — you're only searching where agreement lives.", "Flip the question: what evidence WOULD show the redesign hurt? Go look for that, specifically.", "Compare like with like: this season versus the same season last year, not launch week versus a slow week.", "Decide in advance what result would change your mind — then look."], takeaway: "Hunt for the evidence that would prove you wrong; it's the only search that counts." },
                { type: "order", prompt: "A repeatable de-biasing move.", items: ["Notice the itch of fast, convenient certainty", "Name the bias that would produce exactly that feeling", "Construct the strongest opposite case", "Decide with both cases on the table"], explain: "The feeling of obviousness is data — usually about you, not about the world.", codeItems: false },
                { type: "concept", heading: "Rules beat willpower", body: "The strongest de-biaser is a rule set before emotions arrive: a budget, a checklist, a pre-committed exit price. Ulysses tied himself to the mast BEFORE the sirens." },
              ],
            },
            {
              title: "Incentives explain the world",
              keywords: ["incentives", "goodhart", "metrics", "systems", "behavior"],
              steps: [
                { type: "concept", heading: "Follow the reward", body: "When behavior looks irrational, look at what's actually rewarded. People respond to incentives far more reliably than to intentions, speeches, or mission statements." },
                { type: "worked", heading: "The gamed metric", problem: "A support team judged on tickets-closed-per-day starts closing tickets… badly. Explain it, then fix it.", steps: ["The measure became the target: closes are rewarded, so closes happen — quality was never in the formula (Goodhart's law).", "Agents close early; customers reopen; the dashboard shines while service rots.", "Fix by measuring closer to the real goal: reopen rate, customer rating.", "Any single metric gets gamed eventually — pair it with a counter-metric watching its blind side."], takeaway: "When a measure becomes a target, it stops measuring." },
                { type: "mcq", prompt: "Paying programmers per line of code reliably gets you…", options: ["Better code", "More lines", "Fewer bugs", "Shorter programs"], answer: 1, explain: "You get exactly what you pay for — in the most literal, least useful sense. Choose metrics as if they'll be maximized, because they will." },
                { type: "order", prompt: "Read any puzzling system through incentives.", items: ["Ask who benefits from the current behavior, and how", "Trace the actual reward, not the stated goal", "Change the reward, not the speech", "Watch for the new metric being gamed next"], explain: "Step three is where most fixes fail: exhortation is free and changes nothing.", codeItems: false },
                { type: "mcq", prompt: "January gym crowds vanish by March, yet gyms keep selling annual passes hard. Their incentive is to…", options: ["Cancel unused memberships", "Sell to people who won't show up", "Charge per visit", "Close in winter"], answer: 1, explain: "An absent member is pure margin. The business model prices your optimism — knowing that changes how you buy." },
                { type: "concept", heading: "Design your own", body: "The lens points inward too: what do your own habits reward? Make the good path the lazy path — incentives you design beat discipline you summon." },
              ],
            },
            {
              title: "Changing your mind well",
              keywords: ["bayes", "updating", "beliefs", "calibration", "evidence", "forecasting"],
              steps: [
                { type: "concept", heading: "Beliefs with dials", body: "Treat beliefs as probabilities you'd bet on, not flags you defend. New evidence should turn the dial — not snap it to 0 or 100, and never leave it rusted in place." },
                { type: "worked", heading: "Update on weak evidence", problem: "You're 70% sure the café opens Sundays. You find one photo of it closed on a Sunday — posted a year ago. What now?", steps: ["The photo is real evidence, but weak: one Sunday, a year old — holidays and renovations exist.", "Move meaningfully, not totally: 70% drops to maybe 45%.", "Stronger evidence — this week's posted hours — would move you much further.", "Scale every update to the evidence's strength and recency, not to how it feels."], takeaway: "Strong evidence moves you far; weak evidence a little; no evidence, not at all." },
                { type: "mcq", prompt: "A forecaster's \"80% sure\" predictions come true about 80% of the time. That forecaster is…", options: ["Lucky", "Well calibrated", "Overconfident", "Vague"], answer: 1, explain: "Calibration means your confidence numbers mean something. It's trainable — and rarer than expertise." },
                { type: "numeric", prompt: "You held ten separate beliefs at \"90% sure\" this year. If you're well calibrated, about how many should have come true?", answer: 9, tolerance: 0, explain: "Nine. If all ten always come true, you were underconfident; if seven, your \"90%\" is really 70% — now you know your exchange rate." },
                { type: "order", prompt: "An update you can do out loud.", items: ["State the belief as a number", "Name what evidence would move it, and by how much", "Look at the evidence when it arrives", "Move the number — and say that you moved it"], explain: "Pre-naming the evidence is the anti-goalpost device: you can't dismiss what you already agreed would count.", codeItems: false },
                { type: "concept", heading: "Updating is strength", body: "\"I changed my mind\" is what winning looks like from inside. Teams that punish it don't get fewer mistakes — they get confident ones." },
              ],
            },
          ],
        },
      ],
    },
  ],

  /* Home-screen quick picks: label + direct pointer into the courses above. */
  quickPicks: [
    { label: "JavaScript basics", course: "core-js", u: 0, l: 0, topic: "JavaScript basics" },
    { label: "HTML & CSS", course: "web-pages", u: 0, l: 0, topic: "HTML basics" },
    { label: "Flexbox", course: "web-pages", u: 1, l: 2, topic: "Flexbox" },
    { label: "Website design", course: "site-design", u: 0, l: 0, topic: "Website design" },
    { label: "Going live", course: "site-design", u: 1, l: 0, topic: "Domains and hosting" },
    { label: "SEO", course: "seo", u: 0, l: 0, topic: "SEO" },
    { label: "Percentages", course: "math", u: 0, l: 0, topic: "Percentages" },
    { label: "Probability", course: "math", u: 1, l: 1, topic: "Probability" },
    { label: "Bad arguments", course: "thinking", u: 0, l: 0, topic: "Critical thinking" },
  ],
};
