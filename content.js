/* Prexis built-in curriculum.
   Plain data, no dependencies. Every lesson here works fully offline:
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
                { type: "concept", heading: "A name for a value", body: "A variable is a labeled box. const means the label will not be moved to a different box. The value inside can still be an object you change later, but the binding itself is fixed.", code: "const city = \"Lisbon\";\nlet visits = 0;\nvisits = visits + 1;" },
                { type: "worked", heading: "Trace it like the machine", problem: "What is b when this finishes?", code: "const a = 2;\nlet b = a + 3;\nb = b * 2;", steps: ["Line 1: the label a is bound to 2, and const means it stays bound.", "Line 2: a + 3 is 5, so b starts at 5.", "Line 3: b is a let, so it CAN be rebound, to 5 × 2 = 10."], takeaway: "Read code one line at a time, tracking each name's current value." },
                { type: "output", prompt: "What does this print?", code: "const n = 3;\nconsole.log(n + n);", expect: "6", explain: "n holds 3. n + n is ordinary arithmetic, then console.log prints the result as text.", gen: { vars: { x: [2, 9, 1] }, show: { s: "2*x" }, code: "const n = {x};\nconsole.log(n + n);", expect: "{s}", explain: "n holds {x}. n + n is ordinary arithmetic, then console.log prints the result as text." } },
                { type: "concept", heading: "Functions do work", body: "A function is a reusable recipe. Parameters are the ingredients you pass in. return is how the recipe hands a result back to whoever called it.", code: "function greet(name) {\n  return \"Hi, \" + name;\n}" },
                { type: "mcq", prompt: "Which line actually gives you the greeting string to use later?", options: ["greet(\"Ada\")", "console.log(greet)", "function greet(name)", "return greet"], answer: 0, explain: "Calling greet(\"Ada\") runs the body and returns \"Hi, Ada\". Logging the function itself only prints the function object.", gen: { variants: [{ prompt: "You need the returned string stored in a variable. Which line does it?", options: ["const s = greet(\"Ada\")", "const s = greet", "const s = console.log(greet(\"Ada\"))", "const s = \"greet(Ada)\""], answer: 0, explain: "Only calling the function produces its return value; the call's result lands in s. console.log itself returns undefined, and the last option is just a string." }] } },
                { type: "code", prompt: "Write double so it returns twice its input.", starter: "function double(n) {\n  \n}", tests: [ { call: "double(2)", expect: 4 }, { call: "double(0)", expect: 0 }, { call: "double(-3)", expect: -6 } ], solution: "function double(n) {\n  return n * 2;\n}", explain: "Multiply and return. No console.log needed, tests read the return value.", gen: { variants: [{ prompt: "Write triple so it returns three times its input.", starter: "function triple(n) {\n  \n}", tests: [{ call: "triple(2)", expect: 6 }, { call: "triple(0)", expect: 0 }, { call: "triple(-2)", expect: -6 }], solution: "function triple(n) {\n  return n * 3;\n}", explain: "Return the result. Printing it is not the same as returning it." }] } },
                { type: "order", prompt: "Put these in the order JavaScript actually does them.", items: ["Read the function body", "Bind the parameter n to 4", "Evaluate n * 2", "Hand 8 back to the caller"], explain: "A call first binds arguments, then runs the body, then returns.", codeItems: false },
                { type: "concept", heading: "Print is not return", body: "console.log shows something on screen. return gives a value to other code. Tests in Prexis watch return values, not the console, unless the step is an output question." },
              ],
            },
            {
              title: "Lists you can query",
              keywords: ["javascript", "js", "arrays", "lists", "map", "filter", "methods"],
              steps: [
                { type: "concept", heading: "Arrays keep order", body: "An array is a numbered shelf. Index 0 is the first slot. length is how many slots are filled. Methods like map and filter return new arrays; they do not rewrite the original unless you ask them to.", code: "const nums = [3, 1, 4];\nnums[0];      // 3\nnums.length;  // 3" },
                { type: "output", prompt: "What does this print?", code: "const letters = [\"a\", \"b\", \"c\"];\nconsole.log(letters[letters.length - 1]);", expect: "c", explain: "length is 3, so length - 1 is 2, and that slot holds \"c\".", gen: { pick: { last: ["c", "z", "q", "m"] }, code: "const letters = [\"a\", \"b\", \"{last}\"];\nconsole.log(letters[letters.length - 1]);", expect: "{last}", explain: "length is 3, so length - 1 is 2, and that slot holds \"{last}\"." } },
                { type: "mcq", prompt: "What does map return?", code: "const n = [1, 2, 3];\nn.map(x => x * 10);", options: ["[10, 20, 30]", "[1, 2, 3]", "30", "undefined"], answer: 0, explain: "map builds a new array by running the function on every item. n itself stays [1, 2, 3].", gen: { variants: [{ prompt: "What does map return?", code: "const n = [2, 4];\nn.map(x => x + 1);", options: ["[3, 5]", "[2, 4]", "5", "undefined"], answer: 0, explain: "map builds a new array by running the function on every item. n itself stays [2, 4]." }] } },
                { type: "code", prompt: "Return only the even numbers from the list.", starter: "function evens(list) {\n  \n}", tests: [ { call: "evens([1,2,3,4])", expect: [2, 4] }, { call: "evens([7])", expect: [] }, { call: "evens([0, 8])", expect: [0, 8] } ], solution: "function evens(list) {\n  return list.filter(n => n % 2 === 0);\n}", explain: "filter keeps items whose callback returns true. 0 is even.", gen: { variants: [{ prompt: "Return only the numbers greater than zero from the list.", starter: "function positives(list) {\n  \n}", tests: [{ call: "positives([-2, 5, 0, 9])", expect: [5, 9] }, { call: "positives([-1, -3])", expect: [] }, { call: "positives([1])", expect: [1] }], solution: "function positives(list) {\n  return list.filter((n) => n > 0);\n}", explain: "filter keeps the items the test says yes to and builds a new list from them." }] } },
                { type: "order", prompt: "Order these lines so the last expression is the doubled list.", items: ["const src = [1, 2, 3];", "const out = src.map(n => n * 2);", "out"], explain: "Create the source, derive a new array, then read it.", codeItems: true },
                { type: "concept", heading: "Prefer new arrays", body: "map, filter, and slice leave the original alone. push, splice, and sort mutate. When you are learning, prefer the first family, bugs stay smaller." },
              ],
            },
            {
              title: "Read the error first",
              keywords: ["javascript", "js", "debugging", "errors", "bugs", "stack", "trace"],
              steps: [
                { type: "concept", heading: "The stack is a map", body: "An error message is not an insult. It names the failure. The stack trace lists the calls that led there, newest first. Read the message, then the first line that is your code.", code: "TypeError: Cannot read properties of undefined (reading 'name')\n    at greet (app.js:4:18)" },
                { type: "mcq", prompt: "user is undefined. Which access blows up?", code: "function greet(user) {\n  return \"Hi \" + user.name;\n}", options: ["user.name", "\"Hi \"", "function greet", "return"], answer: 0, explain: "You can concatenate a string with almost anything. Reading .name on undefined throws.", gen: { variants: [{ prompt: "order is undefined. Which access blows up?", code: "function total(order) {\n  return \"Sum: \" + order.items;\n}", options: ["order.items", "\"Sum: \"", "function total", "return"], answer: 0, explain: "Concatenation tolerates almost anything. Reading .items on undefined throws first." }] } },
                { type: "output", prompt: "What does this print?", code: "const xs = [10, 20];\nconsole.log(xs[2]);", expect: "undefined", explain: "Out-of-range index is undefined, not an exception. That quiet undefined is often the bug one line later.", gen: { vars: { a: [10, 90, 10], i: [2, 5, 1] }, code: "const xs = [{a}, 20];\nconsole.log(xs[{i}]);", expect: "undefined", explain: "The array has slots 0 and 1 only. Any out-of-range index is undefined, not an exception. That quiet undefined is often the bug one line later." } },
                { type: "code", prompt: "Write safeName: return user.name if user exists, otherwise \"guest\".", starter: "function safeName(user) {\n  \n}", tests: [ { call: "safeName({name:\"Ada\"})", expect: "Ada" }, { call: "safeName(undefined)", expect: "guest" }, { call: "safeName(null)", expect: "guest" } ], solution: "function safeName(user) {\n  return (user && user.name) || \"guest\";\n}", explain: "Guard the object before you touch a property. null and undefined are both unsafe.", gen: { variants: [{ prompt: "Write safeCity: return user.city if user exists, otherwise \"unknown\".", starter: "function safeCity(user) {\n  \n}", tests: [{ call: "safeCity({city:\"Oslo\"})", expect: "Oslo" }, { call: "safeCity(undefined)", expect: "unknown" }, { call: "safeCity(null)", expect: "unknown" }], solution: "function safeCity(user) {\n  return (user && user.city) || \"unknown\";\n}", explain: "Guard before you reach: only read .city once you know user is really there." }] } },
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
                { type: "concept", heading: "A promise is a later value", body: "Some work is not done yet: a network call, a timer. A Promise is an object that will fulfill with a value or reject with an error. await pauses this function until that happens. It does not freeze the whole page.", code: "async function load() {\n  const res = await fetch(\"/api\");\n  return res.json();\n}" },
                { type: "mcq", prompt: "What must be true to use await inside a function?", options: ["The function is marked async", "The function is named wait", "You imported promises", "The file is a module named delay.js"], answer: 0, explain: "await is only legal in async functions (and at the top level of modules).", gen: { variants: [{ prompt: "Where is await legal?", options: ["Inside an async function, or at a module's top level", "Inside any loop", "Only inside then()", "Anywhere, once promises are imported"], answer: 0, explain: "await needs an async context: a function marked async, or the top level of a module." }] } },
                { type: "output", prompt: "This snippet runs a resolved promise and logs the value. What prints?", code: "Promise.resolve(7).then((n) => {\n  console.log(n + 1);\n});", expect: "8", explain: "Promise.resolve(7) is already fulfilled. then receives 7 and logs 8.", gen: { vars: { p: [3, 9, 1] }, show: { s: "p+1" }, code: "Promise.resolve({p}).then((n) => {\n  console.log(n + 1);\n});", expect: "{s}", explain: "Promise.resolve({p}) is already fulfilled. then receives {p} and logs {s}." } },
                { type: "code", prompt: "Write plusLater so it returns a Promise that fulfills with a + b.", starter: "function plusLater(a, b) {\n  \n}", tests: [ { call: "plusLater(2, 3).then(x => x)", expect: 5 }, { call: "plusLater(0, 0).then(x => x)", expect: 0 } ], solution: "function plusLater(a, b) {\n  return Promise.resolve(a + b);\n}", explain: "Return a Promise, not the raw number. Promise.resolve wraps a ready value.", gen: { variants: [{ prompt: "Write timesLater so it returns a Promise that fulfills with a times b.", starter: "function timesLater(a, b) {\n  \n}", tests: [{ call: "timesLater(2, 3).then(x => x)", expect: 6 }, { call: "timesLater(5, 0).then(x => x)", expect: 0 }], solution: "function timesLater(a, b) {\n  return Promise.resolve(a * b);\n}", explain: "Promise.resolve wraps a plain value in an already fulfilled promise." }] } },
                { type: "order", prompt: "Order the life of a successful fetch.", items: ["Call fetch", "Await the Response", "Read the body", "Use the data"], explain: "You cannot read the body before the response exists.", codeItems: false },
                { type: "concept", heading: "Errors travel too", body: "If a promise rejects, await throws. wrap the call in try/catch, or attach .catch. Swallowing the error silently is how production bugs hide." },
              ],
            },
            {
              title: "Objects you can trust",
              keywords: ["javascript", "js", "objects", "keys", "properties", "json"],
              steps: [
                { type: "concept", heading: "Keys and values", body: "An object is a set of labeled drawers: each key names one value. Dot notation opens a drawer you know the name of; bracket notation opens one whose name lives in a variable.", code: "const user = { name: \"Ada\", age: 36 };\nuser.name;        // \"Ada\"\nuser[\"age\"];      // 36" },
                { type: "output", prompt: "What does this print?", code: "const user = { name: \"Ada\", age: 36 };\nconsole.log(user.age + 1);", expect: "37", explain: "user.age reads 36 out of the drawer, then ordinary arithmetic adds 1.", gen: { vars: { a: [21, 79, 2] }, pick: { who: ["Ada", "Grace", "Alan", "Mary"] }, show: { s: "a+1" }, code: "const user = { name: \"{who}\", age: {a} };\nconsole.log(user.age + 1);", expect: "{s}", explain: "user.age reads {a} out of the drawer, then ordinary arithmetic adds 1." } },
                { type: "mcq", prompt: "user has no email yet. Which line gives it one?", options: ["user.email()", "email in user", "user.email = \"ada@lovelace.dev\"", "delete user.email"], answer: 2, explain: "Assigning to a key that does not exist creates it. The others call, test, or remove, none of them add.", gen: { variants: [{ prompt: "cart has no total yet. Which line creates it?", options: ["cart.total = 149", "cart.total()", "total in cart", "delete cart.total"], answer: 0, explain: "Assigning to a key that does not exist creates it. Calling, testing, and deleting never add." }] } },
                { type: "code", prompt: "Write fullName so it joins first and last with a space.", starter: "function fullName(p) {\n  \n}", tests: [ { call: "fullName({first:\"Ada\", last:\"Lovelace\"})", expect: "Ada Lovelace" }, { call: "fullName({first:\"Alan\", last:\"Turing\"})", expect: "Alan Turing" } ], solution: "function fullName(p) {\n  return p.first + \" \" + p.last;\n}", explain: "Read two drawers, concatenate with a space between.", gen: { variants: [{ prompt: "Write signature so it joins name and title with a comma and a space.", starter: "function signature(p) {\n  \n}", tests: [{ call: "signature({name:\"Ada\", title:\"Countess\"})", expect: "Ada, Countess" }, { call: "signature({name:\"Alan\", title:\"Dr\"})", expect: "Alan, Dr" }], solution: "function signature(p) {\n  return p.name + \", \" + p.title;\n}", explain: "Read both drawers, glue them with the separator you want." }] } },
                { type: "order", prompt: "Order what JavaScript does to evaluate user.pet.name.", items: ["Find the user object", "Open its pet drawer", "Open name inside that", "Hand back the value"], explain: "Chained dots resolve left to right, which is why an undefined middle link throws.", codeItems: false },
                { type: "concept", heading: "Copies share drawers", body: "const b = a copies the label, not the drawers: both names point at the same object, so changing b.x changes a.x. Use { ...a } when you want a genuinely separate copy." },
              ],
            },
            {
              title: "Small programs",
              keywords: ["javascript", "js", "programs", "pipeline", "reduce", "project"],
              steps: [
                { type: "concept", heading: "Programs are pipelines", body: "Almost every small program is the same shape: take data in, transform it in steps, put a result out. Write each step as its own expression and the whole program stays readable.", code: "const words = [\"a\", \"bb\", \"ccc\"];\nwords\n  .filter(w => w.length > 1)\n  .map(w => w.toUpperCase());" },
                { type: "mcq", prompt: "What comes out of the pipeline above?", options: ["[\"BB\", \"CCC\"]", "[\"A\", \"BB\", \"CCC\"]", "[\"bb\", \"ccc\"]", "2"], answer: 0, explain: "filter drops \"a\" (length 1), then map uppercases what is left." },
                { type: "output", prompt: "What does this print?", code: "const total = [5, 10, 20].reduce((sum, n) => sum + n, 0);\nconsole.log(total);", expect: "35", explain: "reduce folds the list into one value: 0+5, then 5+10, then 15+20.", gen: { vars: { x: [3, 9, 1], y: [10, 30, 10], z: [20, 60, 20] }, show: { xy: "x+y", s: "x+y+z" }, code: "const total = [{x}, {y}, {z}].reduce((sum, n) => sum + n, 0);\nconsole.log(total);", expect: "{s}", explain: "reduce folds the list into one value: 0+{x}, then {x}+{y}, then {xy}+{z}." } },
                { type: "code", prompt: "Write longest so it returns the longest word in the list.", starter: "function longest(list) {\n  \n}", tests: [ { call: "longest([\"hi\",\"hello\",\"hey\"])", expect: "hello" }, { call: "longest([\"a\"])", expect: "a" }, { call: "longest([\"aa\",\"bb\"])", expect: "aa" } ], solution: "function longest(list) {\n  return list.reduce((best, w) => (w.length > best.length ? w : best), list[0] || \"\");\n}", explain: "Keep the best-so-far as you walk the list. Ties keep the earlier word because the comparison is strictly greater.", gen: { variants: [{ prompt: "Write shortest so it returns the shortest word in the list.", starter: "function shortest(words) {\n  \n}", tests: [{ call: "shortest([\"banana\", \"fig\", \"apple\"])", expect: "fig" }, { call: "shortest([\"aa\", \"b\"])", expect: "b" }], solution: "function shortest(words) {\n  return words.reduce((best, w) => (w.length < best.length ? w : best));\n}", explain: "Carry the current winner through the list, swapping whenever a shorter word appears." }] } },
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
                { type: "concept", heading: "Functions remember home", body: "An inner function keeps access to the variables of the place it was created, even after that place has finished running. That bundle of function plus remembered variables is a closure.", code: "function makeCounter() {\n  let n = 0;\n  return () => { n = n + 1; return n; };\n}" },
                { type: "worked", heading: "Trace the counter", problem: "const c = makeCounter(); c(); c();, what does the THIRD call return?", code: "function makeCounter() {\n  let n = 0;\n  return () => { n = n + 1; return n; };\n}", steps: ["makeCounter runs once: n starts at 0, and the arrow function is returned holding a live link to that n.", "c() bumps that n to 1 and returns it; the second call bumps the same n to 2.", "The third call returns 3, n lives on inside the closure, invisible from outside."], takeaway: "A closure is a function plus the variables it was born next to." },
                { type: "output", prompt: "What does this print?", code: "function makeGreeter(name) {\n  return function () { return \"Hi \" + name; };\n}\nconst g = makeGreeter(\"Ada\");\nconsole.log(g());", expect: "Hi Ada", explain: "g still sees the name it was created with. makeGreeter finished long ago; the closure kept its variable alive.", gen: { pick: { who: ["Ada", "Grace", "Alan", "Mary"] }, code: "function makeGreeter(name) {\n  return function () { return \"Hi \" + name; };\n}\nconst g = makeGreeter(\"{who}\");\nconsole.log(g());", expect: "Hi {who}", explain: "The inner function remembers the name it was created with, so the greeter for {who} says Hi {who}." } },
                { type: "mcq", prompt: "const a = makeCounter(); const b = makeCounter(); a(); a();, what does b() now return?", options: ["1", "2", "3", "0"], answer: 0, explain: "Each makeCounter() call creates a FRESH n. a's clicks never touch b's counter, closures are per-creation, not global.", gen: { variants: [{ prompt: "const a = makeCounter(); a(); a(); a();, what does the NEXT a() return?", options: ["4", "1", "3", "0"], answer: 0, explain: "a's private n has climbed to 3, so the next call returns 4. The count lives inside a's closure." }] } },
                { type: "code", prompt: "Write makeAdder so makeAdder(x) returns a function that adds x to its input.", starter: "function makeAdder(x) {\n  \n}", tests: [{"call": "makeAdder(3)(4)", "expect": 7}, {"call": "makeAdder(0)(5)", "expect": 5}, {"call": "makeAdder(-2)(2)", "expect": 0}], solution: "function makeAdder(x) {\n  return (y) => x + y;\n}", explain: "The returned arrow closes over x. Every adder you make remembers its own x.", gen: { variants: [{ prompt: "Write makeMultiplier so makeMultiplier(x) returns a function that multiplies its input by x.", starter: "function makeMultiplier(x) {\n  \n}", tests: [{ call: "makeMultiplier(3)(4)", expect: 12 }, { call: "makeMultiplier(0)(5)", expect: 0 }, { call: "makeMultiplier(-2)(2)", expect: -4 }], solution: "function makeMultiplier(x) {\n  return (y) => x * y;\n}", explain: "The returned function closes over x, so every call remembers its multiplier." }] } },
                { type: "concept", heading: "Privacy for free", body: "Nothing outside can read or reset the counter's n except through the function you returned. Closures give you private state without classes. Most of what modules and hooks do underneath." },
              ],
            },
            {
              title: "Reduce shapes anything",
              keywords: ["javascript", "js", "reduce", "aggregate", "fold", "counting", "data"],
              steps: [
                { type: "concept", heading: "One loop to rule them all", body: "reduce folds a list into anything, a number, an object, a string. You give it a starting value and one rule: how to fold the next item into the running result.", code: "[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6" },
                { type: "worked", heading: "Count the votes", problem: "Turn [\"yes\", \"no\", \"yes\"] into {yes: 2, no: 1}.", code: "votes.reduce((acc, v) => {\n  acc[v] = (acc[v] || 0) + 1;\n  return acc;\n}, {});", steps: ["Start the accumulator as an empty object: {}.", "Each round, bump that vote's key: acc[v] = (acc[v] || 0) + 1 handles the first sighting.", "Return acc every round, after three votes it reads {yes: 2, no: 1}."], takeaway: "reduce = a start value + one rule for folding in each item." },
                { type: "output", prompt: "What does this print?", code: "const total = [\"a\", \"bb\", \"ccc\"].reduce((sum, w) => sum + w.length, 0);\nconsole.log(total);", expect: "6", explain: "Fold in each word's length: 0+1, then 1+2, then 3+3. The list of words became a single number." },
                { type: "code", prompt: "Write maxOf: return the largest number in a non-empty list, using reduce (no Math.max).", starter: "function maxOf(list) {\n  \n}", tests: [{"call": "maxOf([3,9,4])", "expect": 9}, {"call": "maxOf([-5,-2])", "expect": -2}, {"call": "maxOf([7])", "expect": 7}], solution: "function maxOf(list) {\n  return list.reduce((best, n) => (n > best ? n : best), list[0]);\n}", explain: "Carry the best-so-far. Starting from list[0] keeps negative-only lists honest.", gen: { variants: [{ prompt: "Write minOf: return the smallest number in a non-empty list, using reduce (no Math.min).", starter: "function minOf(nums) {\n  \n}", tests: [{ call: "minOf([4, 2, 9])", expect: 2 }, { call: "minOf([7])", expect: 7 }, { call: "minOf([-1, 5])", expect: -1 }], solution: "function minOf(nums) {\n  return nums.reduce((m, n) => (n < m ? n : m));\n}", explain: "With no start value, reduce seeds itself with the first item and folds in the rest." }] } },
                { type: "mcq", prompt: "[10, 20, 30].reduce((a, n) => a + n, 100), what is the accumulator at the START of the second round?", options: ["10", "100", "110", "130"], answer: 2, explain: "Round one folds 10 into the start value 100, so round two begins at 110.", gen: { variants: [{ prompt: "[5, 5, 5].reduce((a, n) => a + n, 50), what is the accumulator at the START of the third round?", options: ["60", "55", "50", "65"], answer: 0, explain: "Round one: 50+5 is 55. Round two: 55+5 is 60. Round three begins at 60." }] } },
                { type: "concept", heading: "Know when to stop", body: "If map or filter says it more clearly, use them. reduce is the power tool for when the result isn't a list anymore, totals, lookups, grouping." },
              ],
            },
            {
              title: "Spread, don't mutate",
              keywords: ["javascript", "js", "spread", "immutability", "copy", "state", "mutation"],
              steps: [
                { type: "concept", heading: "Mutation at a distance", body: "When two names point at one object, a change through either is seen by both. Most 'impossible' bugs are this. The cure: build changed COPIES with spread instead of editing shared data.", code: "const user = { name: \"Ada\", plan: \"free\" };\nconst upgraded = { ...user, plan: \"pro\" };" },
                { type: "worked", heading: "Add without touching", problem: "Add an item to a cart array without modifying the original.", steps: ["const next = [...cart, item] builds a NEW array: everything old, plus the new item at the end.", "cart itself is untouched, any code holding it is safe from surprises.", "Objects work the same: { ...settings, theme: \"dark\" } changes one key on a copy."], takeaway: "New value out, old value untouched, updates become predictable." },
                { type: "output", prompt: "What does this print?", code: "const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(a.length + \",\" + b.length);", expect: "2,3", explain: "Spread copied a's items into a new array before adding 3. The original never felt a thing.", gen: { vars: { x: [1, 9, 1], y: [1, 9, 1], z: [3, 9, 1] }, code: "const a = [{x}, {y}];\nconst b = [...a, {z}];\nconsole.log(a.length + \",\" + b.length);", expect: "2,3", explain: "Spread copied a's items into a new array before adding {z}. The original never felt a thing." } },
                { type: "mcq", prompt: "What is x.n after this runs?", code: "const x = { n: 1 };\nconst y = x;\ny.n = 5;", options: ["1", "5", "undefined", "It throws"], answer: 1, explain: "y = x copies the LABEL, not the object. Both names open the same drawers. That is exactly the trap spread avoids.", gen: { variants: [{ prompt: "What is p.k after this runs?", code: "const p = { k: 2 };\nconst q = p;\nq.k = 9;", options: ["9", "2", "undefined", "It throws"], answer: 0, explain: "q copied the LABEL, not the object. Both names open the same drawers, so the write through q is visible through p." }] } },
                { type: "code", prompt: "Write withDone: return a copy of task with done set to true, WITHOUT modifying the input.", starter: "function withDone(task) {\n  \n}", tests: [{"call": "withDone({title:\"a\", done:false})", "expect": {"title": "a", "done": true}}, {"call": "(function(){ const t = {title:\"x\", done:false}; withDone(t); return t.done; })()", "expect": false}], solution: "function withDone(task) {\n  return { ...task, done: true };\n}", explain: "The second test proves the original survived. That property is what makes state changes easy to reason about.", gen: { variants: [{ prompt: "Write withArchived: return a copy of note with archived set to true, WITHOUT modifying the input.", starter: "function withArchived(note) {\n  \n}", tests: [{ call: "withArchived({text:\"a\", archived:false})", expect: { text: "a", archived: true } }, { call: "(function(){ const t = {text:\"x\", archived:false}; withArchived(t); return t.archived; })()", expect: false }], solution: "function withArchived(note) {\n  return { ...note, archived: true };\n}", explain: "Spread copies the old drawers into a fresh object, then the override lands on the copy only." }] } },
                { type: "concept", heading: "Where mutation is fine", body: "Inside a function, on data only you hold, mutate freely. It's fast and local. The danger begins the moment data is shared. Share copies, keep originals." },
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
                { type: "concept", heading: "Nested boxes of meaning", body: "An HTML page is boxes inside boxes. Each tag names what its content IS (a heading, a paragraph, a list) not what it looks like. Looks come later, from CSS.", code: "<article>\n  <h2>Fresh bread</h2>\n  <p>Baked every morning.</p>\n</article>" },
                { type: "mcq", prompt: "Which tag marks the single most important heading on the page?", options: ["<header>", "<h1>", "<title>", "<b>"], answer: 1, explain: "<h1> is the page's top heading. <title> names the browser tab, <header> is a layout region, and <b> is just bold text.", gen: { variants: [{ prompt: "A blog post's main headline should be marked with…", options: ["<h1>", "<title>", "<strong>", "<div class=\"big\">"], answer: 0, explain: "One h1 names what the page IS. Styling a div big changes looks, not meaning." }] } },
                { type: "order", prompt: "Arrange the lines into one valid article block.", items: ["<article>", "<h2>Fresh bread</h2>", "<p>Baked daily.</p>", "</article>"], explain: "Open the container, put its contents inside, close it. Tags close in the reverse order they opened.", codeItems: true },
                { type: "mcq", prompt: "Where does the <title> tag live?", options: ["Inside <head>", "Inside <body>", "Inside <footer>", "Anywhere"], answer: 0, explain: "<head> holds information ABOUT the page: title, description, links to CSS. Everything visitors see goes in <body>.", gen: { variants: [{ prompt: "Where does information ABOUT the page (its title, its description) live?", options: ["Inside <head>", "Inside <body>", "In the footer", "In the URL"], answer: 0, explain: "The head holds metadata. Everything visitors see belongs in the body." }] } },
                { type: "concept", heading: "Semantic tags are free power", body: "nav, main, article, footer say what each region is. Search engines rank you better for it, and screen-reader users can jump straight to the content. Same pixels, more meaning." },
                { type: "mcq", prompt: "A screen reader and Google both understand your page mainly through…", options: ["The colors", "The font choices", "The tag structure", "The file name"], answer: 2, explain: "Both read the HTML tree, not the pixels. Meaningful tags are how you talk to them.", gen: { variants: [{ prompt: "You restyle the whole site with new fonts and colors. What Google and screen readers understand changes…", options: ["Not at all, they read the tag structure", "Completely", "Only the color part", "Only if the fonts are custom"], answer: 0, explain: "Meaning lives in the markup, not the paint." }] } },
              ],
            },
            {
              title: "Links and images",
              keywords: ["html", "links", "anchor", "href", "images", "img", "alt", "urls"],
              steps: [
                { type: "concept", heading: "The a tag is the web", body: "A link is an <a> tag whose href says where to go. An image is an <img> tag whose src says what to fetch and whose alt says what it shows, in words.", code: "<a href=\"menu.html\">See the menu</a>\n<img src=\"loaf.jpg\" alt=\"Sourdough loaf on a rack\" />" },
                { type: "mcq", prompt: "Which line makes the word Menu open menu.html?", options: ["<link src=\"menu.html\">Menu</link>", "<a name=\"menu.html\">Menu</a>", "<href a=\"menu.html\">Menu</href>", "<a href=\"menu.html\">Menu</a>"], answer: 3, explain: "The tag is a, the destination attribute is href. The others mix the two up.", gen: { variants: [{ prompt: "Which line makes the word Prices open prices.html?", options: ["<a href=\"prices.html\">Prices</a>", "<a src=\"prices.html\">Prices</a>", "<link href=\"prices.html\">Prices</link>", "<button url=\"prices.html\">Prices</button>"], answer: 0, explain: "a plus href is the whole recipe. src loads resources, it does not link words." }] } },
                { type: "mcq", prompt: "What is alt text mainly for?", options: ["A caption shown under every image", "Screen readers, broken images, and search engines", "Making the image load faster", "Copyright information"], answer: 1, explain: "alt is the image in words: read aloud by screen readers, shown when the file fails, and indexed by search engines.", gen: { variants: [{ prompt: "The alt text for a photo of your storefront should be…", options: ["A short description like \"Bakery storefront on Main Street\"", "Empty, alt is decoration", "The image file name", "A list of keywords"], answer: 0, explain: "Describe what the image shows. Screen readers speak it, Google reads it, and it appears if the image breaks." }] } },
                { type: "order", prompt: "Order what the browser does to show a page with one image.", items: ["Fetch the HTML file", "Read the <img> tag inside it", "Request the image file", "Draw it in place"], explain: "The HTML arrives first; every src it mentions triggers another request.", codeItems: false },
                { type: "concept", heading: "Relative vs absolute", body: "href=\"menu.html\" is relative. It means next to this page, and keeps working when the site moves. href=\"https://example.com/menu.html\" is absolute. It always points at that exact place." },
                { type: "mcq", prompt: "You move your whole site to a new domain. Which links keep working without edits?", options: ["Relative links between your own pages", "Absolute links to your old domain", "Both", "Neither"], answer: 0, explain: "Relative links travel with the site. Absolute links still point at the old address.", gen: { variants: [{ prompt: "href=\"/menu.html\" versus href=\"https://oldsite.com/menu.html\": which survives a move to a new domain?", options: ["The first, it stays relative to wherever the site lives", "The second, absolute is safer", "Both", "Neither"], answer: 0, explain: "Relative paths travel with the site. Absolute URLs keep pointing at the old address." }] } },
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
                { type: "mcq", prompt: "Which selector targets <div class=\"card\">?", options: [".card", "#card", "card", "<card>"], answer: 0, explain: "A leading dot means class. # means id, a bare name means the tag itself.", gen: { variants: [{ prompt: "Which selector targets <p id=\"intro\">?", options: ["#intro", ".intro", "p only", "<intro>"], answer: 0, explain: "# selects by id, . selects by class." }] } },
                { type: "mcq", prompt: "Three rules set the same property on one element: a tag rule, a class rule, and an id rule. Which wins?", options: ["The tag rule", "The class rule", "The id rule", "Whichever is written first"], answer: 2, explain: "Specificity: id beats class beats tag. Order only breaks ties at equal specificity.", gen: { variants: [{ prompt: "A class rule and an id rule both set color on one element. Which applies?", options: ["The id rule, ids outrank classes", "The class rule", "Whichever comes last in the file", "Neither, it errors"], answer: 0, explain: "Specificity ranks id above class above tag. Order only breaks ties at equal specificity." }] } },
                { type: "order", prompt: "Order how a style ends up on screen.", items: ["Browser reads the CSS rules", "Finds elements matching each selector", "Resolves conflicts by specificity, then order", "Paints the result"], explain: "The cascade is just a defined tie-break: more specific wins, and later wins among equals.", codeItems: false },
                { type: "numeric", prompt: "Two rules with equal specificity set padding on the same element: the first says 12px, a later one says 20px. How many px of padding apply?", answer: 20, tolerance: 0, explain: "At equal specificity, the later rule wins. That is the cascade working as designed.", gen: { vars: { a: [8, 16, 2], b: [18, 28, 2] }, answer: "b", round: 0, prompt: "Two rules with equal specificity set padding on the same element: the first says {a}px, a later one says {b}px. How many px of padding apply?", explain: "At equal specificity, the later rule wins. That is the cascade working as designed." } },
                { type: "concept", heading: "Keep specificity low", body: "Style almost everything with single classes. The moment you reach for ids and !important to win fights, every future change becomes a bigger fight." },
              ],
            },
            {
              title: "The box model",
              keywords: ["css", "box", "model", "padding", "margin", "border", "width", "spacing"],
              steps: [
                { type: "concept", heading: "Every element is four layers", body: "From the inside out: content, padding (space inside the border), border, margin (space outside, between neighbors). Width math depends on which layers count.", code: ".card {\n  width: 200px;\n  padding: 16px;\n  border: 2px solid;\n  margin: 20px;\n}" },
                { type: "worked", heading: "Will it fit?", problem: "A card has width 240px, padding 12px, and a 3px border. Does it fit a 300px column?", steps: ["width sets the content: 240px.", "Padding adds on both sides: + 2 × 12 = 24.", "Border adds on both sides too: + 2 × 3 = 6.", "Total: 240 + 24 + 6 = 270px. It fits with 30px to spare."], takeaway: "Rendered width = content + padding × 2 + border × 2." },
                { type: "numeric", prompt: "Content width 200px, padding 16px per side, border 2px per side. How wide is the rendered box in px (ignore margin)?", answer: 236, tolerance: 0, explain: "200 + 16×2 + 2×2 = 236. By default width sets only the content.", gen: { vars: { w: [120, 320, 20], p: [8, 24, 4], b: [1, 5, 1] }, answer: "w + 2*p + 2*b", round: 0, prompt: "Content width {w}px, padding {p}px per side, border {b}px per side. How wide is the rendered box in px (ignore margin)?", explain: "{w} + {p}×2 + {b}×2 = {A}. By default width sets only the content." } },
                { type: "mcq", prompt: "You want more space BETWEEN two cards, not inside them. Which property?", options: ["padding", "border", "margin", "width"], answer: 2, explain: "Margin is outside the border, the gap between neighbors. Padding pushes content inward.", gen: { variants: [{ prompt: "You want more space INSIDE a card, between its border and its text. Which property?", options: ["padding", "margin", "gap", "outline"], answer: 0, explain: "Padding pushes content inward from the border. Margin is the gap outside." }] } },
                { type: "numeric", prompt: "With box-sizing: border-box, width is 300px, padding 20px per side, border 5px per side. How wide is the CONTENT area in px?", answer: 250, tolerance: 0, explain: "border-box makes width include padding and border: 300 − 40 − 10 = 250 for content.", gen: { vars: { W: [240, 360, 20], p: [10, 30, 5], b: [2, 8, 1] }, answer: "W - 2*p - 2*b", round: 0, show: { p2: "2*p", b2: "2*b" }, prompt: "With box-sizing: border-box, width is {W}px, padding {p}px per side, border {b}px per side. How wide is the CONTENT area in px?", explain: "border-box makes width include padding and border: {W} − {p2} − {b2} = {A} for content." } },
                { type: "order", prompt: "Order the layers from the inside out.", items: ["Content", "Padding", "Border", "Margin"], explain: "Content sits innermost; margin is pure outside spacing and is always transparent.", codeItems: false },
                { type: "concept", heading: "Set border-box once", body: "* { box-sizing: border-box } makes width mean the visible box, so your arithmetic matches your eyes. Nearly every real project starts with it." },
              ],
            },
            {
              title: "Flexbox in one sitting",
              keywords: ["css", "flexbox", "flex", "layout", "align", "justify", "center", "navbar"],
              steps: [
                { type: "concept", heading: "One parent, one axis", body: "display: flex on a parent lines its children up along an axis. justify-content places them along that main axis; align-items places them across it. That is 90% of everyday layout.", code: ".nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}" },
                { type: "mcq", prompt: "Which pair centers a child both horizontally and vertically in a flex row?", options: ["text-align: center; vertical-align: middle", "justify-content: center; align-items: center", "margin: center; padding: center", "float: center; clear: both"], answer: 1, explain: "justify-content handles the main axis, align-items the cross axis. The others are older tools that do not apply here.", gen: { variants: [{ prompt: "In a flex row, align-items: center centers children…", options: ["Vertically, on the cross axis", "Horizontally, on the main axis", "Both at once", "Only text"], answer: 0, explain: "justify-content works along the row, align-items across it." }] } },
                { type: "mcq", prompt: "You set flex-direction: column. What does justify-content control now?", options: ["Horizontal placement", "Vertical placement", "Font size", "Nothing. It stops working"], answer: 1, explain: "justify-content always follows the main axis, and column makes that axis vertical.", gen: { variants: [{ prompt: "flex-direction: column. Which property now controls HORIZONTAL placement?", options: ["align-items", "justify-content", "text-align", "float"], answer: 0, explain: "The axes swap: justify-content follows the column, align-items takes the horizontal." }] } },
                { type: "order", prompt: "Build a navbar, in a sensible order.", items: ["Give the nav display: flex", "Push logo and links apart with justify-content: space-between", "Line them up with align-items: center", "Add gap so links breathe"], explain: "Turn on flex first, none of the other properties do anything without it.", codeItems: false },
                { type: "mcq", prompt: "Three children, parent has justify-content: space-between. Where is the middle child?", options: ["Stuck to the left", "Stuck to the right", "Exactly centered", "Wrapped to a new line"], answer: 2, explain: "space-between pins the outer children to the edges and spreads the rest evenly, with three, the middle lands center.", gen: { variants: [{ prompt: "Three children, parent has justify-content: space-between. Where is the FIRST child?", options: ["Against the left edge", "Centered", "Against the right edge", "Wrapped down"], answer: 0, explain: "space-between pins the ends to the edges and spreads the leftover space between." }] } },
                { type: "concept", heading: "Prefer gap", body: "gap: 12px on the flex parent spaces all children at once. Margins on individual children double up and break the moment you reorder them." },
              ],
            },
            {
              title: "Pages that fit every screen",
              keywords: ["css", "responsive", "mobile", "media", "queries", "breakpoints", "viewport"],
              steps: [
                { type: "concept", heading: "Design mobile-first", body: "Style the narrow one-column layout first. It is the hardest to fake. Then add media queries that introduce columns where the design starts to look cramped.", code: ".grid { display: grid; gap: 16px; }\n@media (min-width: 700px) {\n  .grid { grid-template-columns: 1fr 1fr; }\n}" },
                { type: "mcq", prompt: "Which line stops phones from rendering your page zoomed-out like a tiny desktop?", options: ["<meta charset=\"UTF-8\">", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "@media (phone: true)", "width: 100% on the body"], answer: 1, explain: "Without the viewport meta tag, phones assume a ~980px page and shrink it. With it, CSS pixels match the device.", gen: { variants: [{ prompt: "You forgot the viewport meta tag. On a phone the page will…", options: ["Render zoomed out like a tiny desktop", "Refuse to load", "Look identical", "Load slower"], answer: 0, explain: "Without it, phones assume a desktop width and shrink everything." }] } },
                { type: "mcq", prompt: "When does @media (min-width: 700px) apply?", options: ["Only at exactly 700px", "At 700px and wider", "Below 700px", "Only on desktops"], answer: 1, explain: "min-width means this wide or wider, the mobile-first direction: base styles for small, additions for large.", gen: { variants: [{ prompt: "When does @media (max-width: 600px) apply?", options: ["At 600px and narrower", "At 600px and wider", "Only at exactly 600px", "Only on tablets"], answer: 0, explain: "max-width means up to that width. min-width means from it upward." }] } },
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
                { type: "worked", heading: "What does 1fr get?", problem: "An 800px container has two columns (200px and 1fr) with a 20px gap. How wide is the 1fr column?", steps: ["Fixed pieces first: the 200px column plus the 20px gap claim 220px.", "Leftover space: 800 − 220 = 580px.", "1fr means one share of the leftover, the second column is 580px wide."], takeaway: "fr divides what is LEFT after fixed sizes and gaps are paid." },
                { type: "numeric", prompt: "A 900px container has columns 1fr 2fr 1fr and no gaps. How wide is the middle column, in px?", answer: 450, tolerance: 0, explain: "Four shares total; 900 ÷ 4 = 225 per share. The middle takes two shares: 450px.", gen: { vars: { C: [600, 1200, 100], m: [2, 3, 1] }, answer: "C*m/(m+2)", round: 0, show: { t: "m+2", S: "C/(m+2)" }, prompt: "A {C}px container has columns 1fr {m}fr 1fr and no gaps. How wide is the middle column, in px?", explain: "{t} shares total; {C} ÷ {t} = {S} per share. The middle takes {m} shares: {A}px." } },
                { type: "mcq", prompt: "You want as many 250px-minimum cards per row as fit, growing to fill. Which line?", options: ["grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))", "grid-template-columns: 250px auto", "width: 250px on every card", "column-count: 4"], answer: 0, explain: "auto-fill + minmax is the classic responsive card grid: the browser fits as many 250px+ tracks as the width allows.", gen: { variants: [{ prompt: "grid-template-columns: repeat(3, 1fr) gives you…", options: ["Three equal columns sharing the width", "Three 1px columns", "One column, three rows", "As many columns as fit"], answer: 0, explain: "Each 1fr takes one equal share of the free space." }] } },
                { type: "order", prompt: "Build a page skeleton with grid, in order.", items: ["Set display: grid on the wrapper", "Define tracks with grid-template-columns", "Space everything at once with gap", "Stretch the odd element with grid-column: span 2"], explain: "Nothing else works until the wrapper is a grid; spans come last, once tracks exist.", codeItems: false },
                { type: "concept", heading: "Grid outside, flex inside", body: "A practical split: Grid for the page skeleton (header, sidebar, content), Flexbox for rows of things inside each region. Each tool where it is strongest." },
              ],
            },
            {
              title: "Design tokens in CSS",
              keywords: ["css", "variables", "custom", "properties", "tokens", "theming", "dark"],
              steps: [
                { type: "concept", heading: "Name your decisions", body: "Custom properties store a decision once: --accent: #4f46e5 on :root, then var(--accent) everywhere. Change the token, restyle the site; swap a token set, get dark mode.", code: ":root { --accent: #4f46e5; }\n.button { background: var(--accent); }" },
                { type: "mcq", prompt: "Where do global tokens usually live?", options: ["Inside every selector that uses them", "On :root, so every element inherits them", "In JavaScript only", "In the page title"], answer: 1, explain: ":root is the top of the tree, declare once, inherit everywhere. Components just read var().", gen: { variants: [{ prompt: "You change the value of --brand on :root. What updates?", options: ["Every rule that uses var(--brand)", "Only the first rule", "Nothing until you rename it", "Only text colors"], answer: 0, explain: "One token, one edit, sitewide change. That is the point of custom properties." }] } },
                { type: "worked", heading: "Dark mode in three moves", problem: "Give a site a dark theme without touching any component.", steps: ["Define the light palette as tokens on :root, --bg, --ink, --accent.", "Redefine ONLY those tokens inside @media (prefers-color-scheme: dark).", "Components never change: .card reads var(--bg) and gets the right answer in both worlds."], takeaway: "Theme the tokens, not the components." },
                { type: "mcq", prompt: "What padding does .card get?", code: ":root { --pad: 12px; }\n.card { --pad: 20px; padding: var(--pad); }", options: ["12px", "20px", "32px", "0"], answer: 1, explain: "var() reads the nearest definition up the tree, .card's own 20px wins over the root's 12px." },
                { type: "order", prompt: "Roll out tokens on an existing site.", items: ["Name tokens by role, not color (--danger, not --red)", "Declare the full set on :root", "Replace hard-coded values with var() in components", "Add alternate sets for dark mode or brands"], explain: "Role names survive a rebrand; --red-600 becomes a lie the day the brand turns blue.", codeItems: false },
                { type: "concept", heading: "Tokens are a contract", body: "Once components only speak var(), designers can retheme, rebrand, and add modes without touching component code. That separation is what design systems are made of." },
              ],
            },
            {
              title: "Accessibility that ships",
              keywords: ["accessibility", "a11y", "contrast", "alt", "keyboard", "focus", "screen", "reader"],
              steps: [
                { type: "concept", heading: "Built in, not bolted on", body: "Accessibility means your page works by keyboard, by screen reader, and for low vision. Most of it is free when you use real HTML: button for actions, label for inputs, headings in order." },
                { type: "numeric", prompt: "WCAG asks at least 4.5:1 contrast for body text. Your grey-on-white measures 2.8:1. How many ratio points short is it?", answer: 1.7, tolerance: 0.05, explain: "4.5 − 2.8 = 1.7. Light grey body text is the web's most common accessibility failure, and everyone over 40 feels it.", gen: { vars: { x: [1.6, 3.8, 0.2] }, answer: "4.5 - x", round: 1, tolerance: 0.05, prompt: "WCAG asks at least 4.5:1 contrast for body text. Your grey-on-white measures {x}:1. How many ratio points short is it?", explain: "4.5 − {x} = {A}. Light grey body text is the web's most common accessibility failure, and everyone over 40 feels it." } },
                { type: "mcq", prompt: "A clickable \"Save\" should be which element?", options: ["<div onclick=\"save()\">", "<span class=\"btn\">", "<button>", "<a href=\"#\">"], answer: 2, explain: "A real button is keyboard-focusable, Enter/Space-activatable, and announced as a button, for free. The div gives you none of that.", gen: { variants: [{ prompt: "A control that submits the signup form should be…", options: ["<button>", "<div onclick>", "<a href=\"#\">", "<span role=\"clickable\">"], answer: 0, explain: "Buttons come with keyboard and screen reader behavior for free. Faking one means rebuilding all of it." }] } },
                { type: "worked", heading: "Alt text that works", problem: "An article includes a chart image. What is the right alt text?", steps: ["Ask what the image DOES here: it conveys a finding, so the words must carry the finding.", "alt=\"Sales doubled between January and June\", the takeaway, not \"chart of sales\".", "Pure decoration is different: alt=\"\" (empty) tells screen readers to skip it silently."], takeaway: "Alt text describes the image's JOB, not its pixels." },
                { type: "order", prompt: "A ten-minute accessibility audit.", items: ["Tab through the page: can you reach and see everything?", "Read the headings alone: do they form an outline?", "Check text contrast in both themes", "Listen to one page in a screen reader"], explain: "Four checks catch the majority of real-world failures. The Tab test alone finds broken menus, traps, and invisible focus.", codeItems: false },
                { type: "mcq", prompt: "Removing focus outlines (outline: none) with no replacement…", options: ["Cleans the design up harmlessly", "Strands keyboard users with no idea where they are", "Improves performance", "Is required by WCAG"], answer: 1, explain: "The outline IS the keyboard user's cursor. Restyle it to fit the brand, never delete it.", gen: { variants: [{ prompt: "A keyboard user tabs through your page. What shows them where they are?", options: ["The focus outline", "The mouse cursor", "The page title", "Hover effects"], answer: 0, explain: "The focus ring is their cursor. Remove it without a replacement and they navigate blind." }] } },
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
                { type: "mcq", prompt: "What should a first-time visitor's eye land on first?", options: ["The logo", "The single element with the most size and contrast", "The footer links", "The cookie banner"], answer: 1, explain: "Eyes go where size and contrast point them. Good design points them at the message, not the chrome.", gen: { variants: [{ prompt: "You want visitors to see the signup button first. Give it…", options: ["The most size and contrast on the page", "The same weight as everything else", "A place in the footer", "A subtle grey tone"], answer: 0, explain: "Attention follows size and contrast. One clear winner per screen." }] } },
                { type: "order", prompt: "Order a landing page from top to bottom.", items: ["One clear headline saying what this is", "One line on why it matters", "One obvious button", "Supporting detail for the convinced"], explain: "Message, value, action, detail only after the visitor has a reason to care.", codeItems: false },
                { type: "mcq", prompt: "A page has five bold, colored, boxed elements competing. The likely result?", options: ["Visitors read all five", "Visitors pick their favorite", "Visitors register none of them and scroll past", "The page loads slower"], answer: 2, explain: "Emphasis is a budget. Spend it on one element and it works; spread it everywhere and it cancels out.", gen: { variants: [{ prompt: "Everything on the poster is bold and red. What did the designer emphasize?", options: ["Nothing", "Everything", "The headline", "The logo"], answer: 0, explain: "Emphasis is relative. When everything shouts, nothing is heard." }] } },
                { type: "concept", heading: "Whitespace is a tool", body: "Empty space is not wasted space. It groups related things, separates unrelated things, and makes the important element easy to find. When a page feels cluttered, remove before you rearrange." },
                { type: "mcq", prompt: "Users scan pages in rough patterns (like an F). The practical takeaway?", options: ["Center all text", "Put key words at line starts and front-load headings", "Use longer paragraphs", "Avoid headings entirely"], answer: 1, explain: "Scanners catch the first words of lines and headings. Front-load meaning there and even skimmers get your message.", gen: { variants: [{ prompt: "Knowing people scan in an F pattern, your most important words belong…", options: ["At the starts of lines and headings", "At the ends of paragraphs", "In the center of blocks", "In the sidebar"], answer: 0, explain: "Front-load. Scanners read the left edge and the first words." }] } },
              ],
            },
            {
              title: "Type and color",
              keywords: ["design", "typography", "fonts", "color", "palette", "contrast", "readability"],
              steps: [
                { type: "concept", heading: "Two fonts, one accent", body: "A reliable recipe: one typeface for headings, one for body text, and one accent color against calm neutrals. Constraints read as confidence; variety reads as noise." },
                { type: "mcq", prompt: "Comfortable body-text lines run about how many characters?", options: ["25", "65", "120", "As many as fit"], answer: 1, explain: "Around 45-75 characters per line, 65 as the classic target. Longer lines make the eye lose its place on the way back.", gen: { variants: [{ prompt: "A text column runs 130 characters per line. Readers will…", options: ["Lose their place returning to the next line", "Read faster", "Prefer it on phones", "Notice nothing"], answer: 0, explain: "Long lines make the return trip hard. Aim near 65 characters." }] } },
                { type: "mcq", prompt: "Which body text is easiest to read on a white page?", options: ["Light grey, small, for elegance", "Near-black at a comfortable size", "Your brand color for consistency", "Pure black, bold, everywhere"], answer: 1, explain: "Near-black on white has strong contrast without glare. Light grey body text is the most common readability mistake on the web.", gen: { variants: [{ prompt: "Grey #999 body text on white looks elegant in the mockup. In real use it is…", options: ["Hard to read for almost everyone, especially over 40", "Perfectly fine", "Better than black", "Required by modern style"], answer: 0, explain: "Contrast is kindness. Near-black at a comfortable size wins." }] } },
                { type: "order", prompt: "Build a palette in a sane order.", items: ["Pick one brand accent color", "Choose neutrals that flatter it", "Add semantic colors for success and error", "Check every pairing for contrast"], explain: "The accent leads; everything else supports it. Contrast checking is the step everyone skips and regrets.", codeItems: false },
                { type: "concept", heading: "Consistency beats novelty", body: "Reusing the same spacing, corner radius, and button style everywhere makes a site feel professionally built. Users cannot name the difference. They just trust the page more." },
              ],
            },
            {
              title: "Words that work",
              keywords: ["copywriting", "content", "words", "headlines", "buttons", "microcopy", "writing"],
              steps: [
                { type: "concept", heading: "Copy is design material", body: "The words on buttons and headlines do more work than any gradient. Write from the visitor's side: what they get, in their language, not what your system does." },
                { type: "mcq", prompt: "Which headline earns the next line of reading?", options: ["Welcome to our website", "Synergistic solutions for the modern enterprise", "Fresh bread, baked at 6 am, sold out by noon", "Home"], answer: 2, explain: "Specific and concrete beats generic and impressive. It answers what is this? in one breath.", gen: { variants: [{ prompt: "Which headline earns the next line for a plumber's site?", options: ["Burst pipe? We arrive within the hour, day or night", "Welcome to our homepage", "Excellence in fluid solutions", "Plumbing"], answer: 0, explain: "Concrete beats abstract. Say the thing the visitor came hoping to hear." }] } },
                { type: "mcq", prompt: "Best label for the button that requests a quote?", options: ["Submit", "Click here", "Get my free quote", "OK"], answer: 2, explain: "A button should say what happens next, in the visitor's words. Submit describes your form, not their outcome.", gen: { variants: [{ prompt: "Best label for the button that books a table?", options: ["Book my table", "Submit", "Click here", "Proceed"], answer: 0, explain: "Label the outcome, in the visitor's words." }] } },
                { type: "order", prompt: "Fix an error message, step by step.", items: ["Say plainly what went wrong", "Say how to fix it", "Keep the user's typed data intact", "Drop the blame and the jargon"], explain: "Card declined, check the number or try another card beats Error 402 in every measurable way.", codeItems: false },
                { type: "mcq", prompt: "The strongest page structure for scanners is…", options: ["Long paragraphs of polished prose", "Short sections with meaningful headings and one idea each", "A single bulleted list of everything", "Centered italic text"], answer: 1, explain: "Meaningful headings let a scanner rebuild your argument from the skeleton alone. That is how most visitors actually read.", gen: { variants: [{ prompt: "A visitor gives your services page eight seconds. What earns more of them?", options: ["Short sections with meaningful headings", "A denser opening paragraph", "Italic emphasis throughout", "A longer page"], answer: 0, explain: "Headings let a scanner rebuild the page's argument at a glance." }] } },
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
                { type: "mcq", prompt: "The padlock (HTTPS) in the browser bar means…", options: ["The site has no bugs", "Traffic between visitor and site is encrypted", "The site owner is verified honest", "The site is fast"], answer: 1, explain: "HTTPS encrypts data in transit, passwords and card numbers cannot be read on the way. It says nothing about who runs the site.", gen: { variants: [{ prompt: "A site without HTTPS shows \"Not secure\". What does adding HTTPS actually do?", options: ["Encrypts traffic between the visitor and the site", "Verifies the owner is trustworthy", "Removes all bugs", "Doubles the speed"], answer: 0, explain: "The padlock is about the connection, not the character of the site." }] } },
                { type: "mcq", prompt: "Which DNS record points a name at a server's IP address?", options: ["MX", "TXT", "A", "CNAME"], answer: 2, explain: "A records map name to IP. MX routes email, TXT stores verification text, CNAME aliases one name to another.", gen: { variants: [{ prompt: "Which DNS record routes your email, not your website?", options: ["MX", "A", "CNAME", "TXT"], answer: 0, explain: "MX is mail exchange. A points names at server addresses." }] } },
                { type: "numeric", prompt: "Domain: $12/year. Hosting: $5/month. What does the first year cost in dollars?", answer: 72, tolerance: 0, explain: "12 + 5 × 12 = 72. Renewals are where registrars raise prices, check year two before buying.", gen: { vars: { d: [10, 20, 2], h: [4, 9, 1] }, answer: "d + 12*h", round: 0, prompt: "Domain: ${d}/year. Hosting: ${h}/month. What does the first year cost in dollars?", explain: "{d} + {h} × 12 = {A}. Renewals are where registrars raise prices, check year two before buying." } },
                { type: "concept", heading: "Stage before you ship", body: "Keep a staging copy of the site where changes land first. Break staging freely; promote to production only what survived. Editing the live site directly works right up until it very much does not." },
              ],
            },
            {
              title: "Keep it healthy",
              keywords: ["maintenance", "analytics", "backups", "monitoring", "management", "performance", "updates"],
              steps: [
                { type: "concept", heading: "Sites rot by default", body: "Links break, plugins age, content goes stale, and nobody notices from the inside. A small monthly routine beats a panicked yearly rebuild." },
                { type: "mcq", prompt: "The speed number that best predicts whether visitors stay is…", options: ["Server ping from your own office", "Load time on a mid-range phone on mobile data", "Homepage size in megabytes alone", "Your uptime percentage"], answer: 1, explain: "Most of the web is browsed on ordinary phones and networks. Test on that, not on your fiber connection.", gen: { variants: [{ prompt: "Your site feels instant on office fiber. The number that actually matters is…", options: ["Load time on a mid-range phone on mobile data", "Your ping to the server", "A desktop test only", "Server uptime"], answer: 0, explain: "Test where your visitors actually are, not where you are." }] } },
                { type: "order", prompt: "A monthly site checkup worth doing.", items: ["Read analytics: what do people actually visit?", "Click through the key pages yourself", "Update anything stale or broken", "Verify the backup actually restores"], explain: "The order runs from information to action. An untested backup is a hope, not a backup.", codeItems: false },
                { type: "numeric", prompt: "500 visitors this month; bounce rate 60%. How many left after a single page?", answer: 300, tolerance: 0, explain: "60% of 500 is 300. Whether that is bad depends on the page, a phone-number lookup bouncing fast is success.", gen: { vars: { v: [200, 900, 100], r: [40, 80, 10] }, answer: "v*r/100", round: 0, prompt: "{v} visitors this month; bounce rate {r}%. How many left after a single page?", explain: "{r}% of {v} is {A}. Whether that is bad depends on the page, a phone-number lookup bouncing fast is success." } },
                { type: "mcq", prompt: "The real reason for backups is…", options: ["Auditors ask for them", "Hosts require them", "Mistakes, hacks, and failed updates are a when, not an if", "They speed up the site"], answer: 2, explain: "Every long-lived site eventually needs a restore. The only question is whether one exists when it does.", gen: { variants: [{ prompt: "The best time to test restoring a backup is…", options: ["Before you need it", "During the outage", "Never, backups always work", "After a redesign only"], answer: 0, explain: "An untested backup is a hope, not a plan." }] } },
                { type: "concept", heading: "Small edits, often", body: "Continuous small improvements (a clearer headline here, a fixed link there) compound. Big-bang redesigns reset your SEO, your users' habits, and your bugs, all at once." },
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
                { type: "concept", heading: "One page, one job", body: "Conversion is a visitor doing the one thing the page exists for. Every element either helps that or is friction, and friction, not ugliness, is what usually kills the number." },
                { type: "worked", heading: "Do the arithmetic first", problem: "A signup page gets 1,000 visits and converts 2%. The team debates a prettier hero versus cutting the form from 5 fields to 2. Which ships first?", steps: ["Today's number: 2% of 1,000 = 20 signups.", "Field count is proven friction: cutting 5 fields to 2 routinely lifts conversion 30-50%.", "A 40% lift means 28 signups; a hero refresh might be worth a point or two.", "Ship the field cut, measure a week, decorate later."], takeaway: "Reduce friction before adding polish, and always run the numbers." },
                { type: "numeric", prompt: "2,000 visitors convert at 3%. You lift it to 4%. How many EXTRA conversions per month is that?", answer: 20, tolerance: 0, explain: "One percentage point of 2,000 is 20 more people, often worth more than any visual change on the page.", gen: { vars: { v: [1000, 4000, 500], a: [2, 5, 1] }, answer: "v/100", round: 0, show: { b: "a+1" }, prompt: "{v} visitors convert at {a}%. You lift it to {b}%. How many EXTRA conversions per month is that?", explain: "One percentage point of {v} is {A} more people, often worth more than any visual change on the page." } },
                { type: "mcq", prompt: "The strongest trust signal next to a buy button is…", options: ["A second, larger buy button", "A concrete testimonial with a real name and photo", "A stock photo of a handshake", "More adjectives in the headline"], answer: 1, explain: "Specific, attributable proof answers the doubt a visitor feels at the moment of commitment. Decoration doesn't.", gen: { variants: [{ prompt: "Which line next to the buy button raises trust most?", options: ["\"Maria R.: cut our invoicing time in half\" with her photo", "\"World class solutions\"", "A second, bigger buy button", "Ten exclamation marks"], answer: 0, explain: "Specific, named, human. Generic praise reads as noise." }] } },
                { type: "order", prompt: "A conversion pass on any page.", items: ["State the page's one goal in a sentence", "Remove everything not serving it", "Place proof next to the point of doubt", "Change one thing, measure, repeat"], explain: "One change at a time is what makes the measurement mean something.", codeItems: false },
                { type: "concept", heading: "Trust compounds", body: "Dark patterns convert once and churn forever. Honest pages convert a little less today and keep the customer, the compounding curve you already know from math." },
              ],
            },
            {
              title: "A design system in miniature",
              keywords: ["design", "system", "spacing", "scale", "consistency", "components"],
              steps: [
                { type: "concept", heading: "Decide once", body: "A personal design system is small: one spacing scale, one type scale, two fonts, a handful of colors, and a few reusable components. Its job is to stop you re-deciding solved problems." },
                { type: "numeric", prompt: "Your spacing scale doubles from 4: 4, 8, 16, 32… What is the next step?", answer: 64, tolerance: 0, explain: "Doubling scales stay visibly distinct. 33px vs 32px is a coin flip; 32 vs 64 is a decision.", gen: { vars: { b: [2, 6, 1] }, answer: "16*b", round: 0, show: { s2: "2*b", s3: "4*b", s4: "8*b" }, prompt: "Your spacing scale doubles from {b}: {b}, {s2}, {s3}, {s4}… What is the next step?", explain: "Doubling scales stay visibly distinct. Each step is twice the last, so after {s4} comes {A}." } },
                { type: "worked", heading: "Systematize three strays", problem: "A card, a modal, and a form panel each look slightly different. Unify them.", steps: ["Extract what repeats: padding, corner radius, shadow, title style.", "Define it once as the card recipe, built on your tokens.", "Rebuild modal and form ON those bones, remaining differences become intentional.", "The next panel now costs minutes and matches automatically."], takeaway: "Consistency is one decision, reused, not a hundred matching decisions." },
                { type: "mcq", prompt: "Your type scale is 14, 16, 20, 25, 31. A new label wants to be \"a bit smaller than 16\". You use…", options: ["15px, it's close enough", "14, the next step on the scale", "15.5px", "16px in italics"], answer: 1, explain: "The scale IS the system. One 15px today is three near-misses next month; snap to the step.", gen: { variants: [{ prompt: "Your spacing scale is 4, 8, 16, 32. A gap wants to be \"about 12\". You use…", options: ["8 or 16, the nearest steps", "12, just this once", "10 as a compromise", "A new scale"], answer: 0, explain: "The scale IS the system. One exception today is three next month." }] } },
                { type: "order", prompt: "Grow a mini design system out of an existing site.", items: ["Audit the site and list what repeats", "Choose the scales: spacing, type, color", "Rebuild the three most-used components on them", "Delete the one-off styles left behind"], explain: "Start from what exists, a system invented in a vacuum won't survive contact with real pages.", codeItems: false },
                { type: "concept", heading: "Constraints are speed", body: "Blank-canvas freedom is where inconsistency breeds and hours vanish. A tight system makes the next page faster AND better looking. That trade is the whole point." },
              ],
            },
            {
              title: "Speed is design",
              keywords: ["performance", "speed", "loading", "images", "weight", "budget"],
              steps: [
                { type: "concept", heading: "Felt before seen", body: "Users feel load time before any typography. Speed is a design property, and on most sites one thing dominates the scale: images." },
                { type: "numeric", prompt: "A hero image ships at 2,400 KB. Properly resized and compressed it is 150 KB. How many KB saved?", answer: 2250, tolerance: 0, explain: "One image, 2.25 MB, often more than the rest of the page combined. Weigh before you optimize anything else.", gen: { vars: { B: [1200, 3600, 200], s: [100, 300, 50] }, answer: "B - s", round: 0, prompt: "A hero image ships at {B} KB. Properly resized and compressed it is {s} KB. How many KB saved?", explain: "{A} KB from one file, often more than the rest of the page combined. Weigh before you optimize anything else." } },
                { type: "worked", heading: "From 6 seconds to 2.5", problem: "Your page takes 6s on a phone. Get under a 2.5s budget.", steps: ["Weigh the page first: images 2.4 MB, fonts 300 KB, scripts 500 KB, images dominate.", "Resize to display size and convert to WebP: 2.4 MB becomes ~250 KB.", "Lazy-load below-the-fold images so the first screen isn't waiting on the tenth.", "Re-measure on a real phone on mobile data, the only verdict that counts."], takeaway: "Fix the heaviest thing first; everything else is rounding error until images are right." },
                { type: "mcq", prompt: "Which usually hurts perceived speed most?", options: ["A 20 KB stylesheet", "Full-resolution photos the browser scales down", "One web font", "Long HTML"], answer: 1, explain: "Shipping 4000px photos into 400px slots wastes megabytes and decode time. Size images for the slot they fill.", gen: { variants: [{ prompt: "Your 4 MB hero photo displays at 400px wide. The fix is…", options: ["Resize and compress it to roughly its display size", "A faster font", "More servers", "Removing the stylesheet"], answer: 0, explain: "Ship the pixels you show. One oversized photo outweighs everything else." }] } },
                { type: "order", prompt: "A speed pass that sticks.", items: ["Measure on a mid-range phone", "Resize, compress, and modernize images", "Lazy-load everything off-screen", "Set a weight budget so it stays fast"], explain: "The budget is the part teams skip, and why sites that got fast quietly get slow again.", codeItems: false },
                { type: "concept", heading: "Weight creeps", body: "Every redesign adds a font here, a script there. Treat page weight like a budget line (reviewed whenever the page changes) and speed stops being a rescue project." },
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
                { type: "mcq", prompt: "What does a crawler actually read?", options: ["Your HTML text, tags, and links", "The page as rendered pixels", "Your intentions", "Only the homepage"], answer: 0, explain: "Crawlers read structure and text. Meaning locked inside images or videos is largely invisible without text alternatives.", gen: { variants: [{ prompt: "Your key selling point exists only inside a podcast embed. To the crawler it is…", options: ["Invisible", "Fully indexed", "A ranking bonus", "Automatically transcribed"], answer: 0, explain: "Crawlers read text, tags, and links. Say it in text too." }] } },
                { type: "mcq", prompt: "Your beautiful headline is baked into a banner image with no alt text. To Google it is…", options: ["Extra convincing", "The same as text", "Effectively invisible", "A ranking bonus"], answer: 2, explain: "Text in images is not text. Real headlines belong in real heading tags, with alt describing the image.", gen: { variants: [{ prompt: "Your services list is a screenshot of a slide. Google sees…", options: ["An image with whatever alt text you gave it", "The full list", "A table", "Nothing wrong"], answer: 0, explain: "Text inside images is not text. Use real HTML text, or at least thorough alt." }] } },
                { type: "concept", heading: "SEO is mostly honesty at scale", body: "Say clearly what each page is about, in the words searchers use, in places machines can read. Most SEO wins are that, not tricks." },
              ],
            },
            {
              title: "Keywords people type",
              keywords: ["seo", "keywords", "intent", "longtail", "queries", "traffic"],
              steps: [
                { type: "concept", heading: "Match the searcher's words", body: "People search in their own words: fix squeaky door hinge, not lubrication solutions. A page ranks for phrases it actually contains and answers, start from real queries, not your vocabulary." },
                { type: "worked", heading: "Pick the winnable fight", problem: "Your hiking store can chase “shoes” or “waterproof trail shoes women”. Which wins?", steps: ["“shoes” gets millions of searches, and page one is Amazon, Nike, and Zappos. Your realistic share: zero.", "The long phrase gets maybe 700 searches a month against weak competition, top 3 is plausible.", "The person typing it also knows exactly what she wants, so each visit converts far better.", "700 searches × a real position × high intent beats millions × position 60 × window shopping."], takeaway: "Pick fights you can win, from searchers who mean it." },
                { type: "mcq", prompt: "Why do long, specific phrases (long-tail keywords) often beat big generic ones?", options: ["They are trendier", "Less competition and clearer intent, so visitors convert", "Google charges less for them", "They are easier to spell"], answer: 1, explain: "You will not outrank giants for shoes. You can win best trail shoes for flat feet, and that searcher knows what they want.", gen: { variants: [{ prompt: "\"emergency plumber camden open now\" beats \"plumber\" for a small firm because…", options: ["Intent is clear and competition thinner, so visits convert", "It is cheaper to host", "Google prefers long pages", "It sounds more professional"], answer: 0, explain: "Own the specific phrases where you can win and the searcher is ready to act." }] } },
                { type: "numeric", prompt: "Keyword A: 1,000 searches/month, you would get 2% of clicks. Keyword B: 100 searches, 30% of clicks. How many monthly visits does B bring?", answer: 30, tolerance: 0, explain: "100 × 0.30 = 30, versus A's 20. Small-but-yours beats big-but-crowded surprisingly often.", gen: { vars: { s: [80, 200, 20], c: [20, 40, 5] }, answer: "s*c/100", round: 0, show: { cd: "c/100" }, prompt: "Keyword A: 1,000 searches/month, you would get 2% of clicks. Keyword B: {s} searches, {c}% of clicks. How many monthly visits does B bring?", explain: "{s} × {cd} = {A}, versus A's 20. Small-but-yours beats big-but-crowded surprisingly often." } },
                { type: "order", prompt: "Choose keywords like a professional.", items: ["List phrases real customers say and type", "Check what already ranks for each", "Pick ones you can plausibly win", "Give each its own page"], explain: "One page per intent. A page trying to rank for everything ranks for nothing.", codeItems: false },
                { type: "concept", heading: "Intent over volume", body: "Behind every query is a want: to learn, to compare, or to buy. Match your page to the want, a how-to guide will not rank for a buying query, no matter the keyword count." },
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
                { type: "mcq", prompt: "A good <title> tag is roughly…", options: ["As long as possible, packed with keywords", "About 50-60 characters, keyword near the front", "Identical on every page for brand consistency", "Unnecessary if you have an h1"], answer: 1, explain: "Google truncates around 60 characters, and duplicate titles waste every page's one headline.", gen: { variants: [{ prompt: "Two pages share the exact same <title>. The cost is…", options: ["Google struggles to tell them apart and clicks suffer", "Nothing, titles repeat fine", "Faster indexing", "A fine"], answer: 0, explain: "Each page earns its own front-loaded, 50-60 character name." }] } },
                { type: "mcq", prompt: "The meta description mainly improves…", options: ["Your ranking position directly", "Whether people click your result once they see it", "Page load speed", "Your crawl budget"], answer: 1, explain: "It is ad copy, not a ranking signal, but a result nobody clicks might as well not rank.", gen: { variants: [{ prompt: "Rankings held steady but clicks doubled after you rewrote…", options: ["The title and meta description", "The server config", "robots.txt", "The sitemap"], answer: 0, explain: "The snippet is your ad inside the results. Earning the click is its whole job." }] } },
                { type: "order", prompt: "Structure a page that wants to rank.", items: ["One h1 stating the topic plainly", "An opening paragraph answering the query fast", "Subheadings that cover the follow-up questions", "Internal links to your related pages"], explain: "Answer first, depth second. Pages that make searchers dig get backed out of, and Google notices.", codeItems: false },
                { type: "numeric", prompt: "Your result gets 2,000 impressions this month with a 3% click-through rate. How many clicks?", answer: 60, tolerance: 0, explain: "2000 × 0.03 = 60. A better title and description often lift CTR more easily than rank.", gen: { vars: { i: [1000, 5000, 500], c: [2, 6, 1] }, answer: "i*c/100", round: 0, show: { cd: "c/100" }, prompt: "Your result gets {i} impressions this month with a {c}% click-through rate. How many clicks?", explain: "{i} × {cd} = {A}. A better title and description often lift CTR more easily than rank." } },
                { type: "concept", heading: "Write for the reader anyway", body: "Keyword-stuffed pages read like spam to humans and, increasingly, to Google. Cover the topic properly in plain language; the phrases you need appear on their own." },
              ],
            },
            {
              title: "Links are votes",
              keywords: ["seo", "backlinks", "links", "authority", "internal", "linking"],
              steps: [
                { type: "concept", heading: "Backlinks are borrowed trust", body: "When a respected site links to yours, some of its credibility transfers. One link from a real industry site outweighs a hundred from junk directories, quality, not count." },
                { type: "mcq", prompt: "Which backlink helps most?", options: ["A paid link farm placement", "Your own comment on a forum", "A local news article linking your bakery's story", "A link from your other domain"], answer: 2, explain: "Editorial links (someone chose to cite you) are the votes that count. Schemes range from worthless to penalized.", gen: { variants: [{ prompt: "Which single link would move a small shop most?", options: ["A feature on the regional paper's site", "500 directory listings", "A link exchange ring", "A link from your own second domain"], answer: 0, explain: "One trusted, relevant, editorial link beats a pile of manufactured ones." }] } },
                { type: "order", prompt: "Earn links without begging.", items: ["Make something genuinely worth citing", "Find who writes about your topic", "Show them, briefly and personally", "Repeat. It compounds"], explain: "Link-worthy first, outreach second. Outreach for mediocre content is just spam with extra steps.", codeItems: false },
                { type: "mcq", prompt: "Internal links (your pages linking each other) matter because…", options: ["They are the same as backlinks", "They guide crawlers and spread authority to deep pages", "Google requires a minimum count", "They reduce hosting costs"], answer: 1, explain: "Your best backlink flows authority onward through internal links. Orphan pages with no internal links barely get crawled.", gen: { variants: [{ prompt: "A great article sits three clicks deep with nothing linking to it. Expect…", options: ["Crawlers and authority rarely reach it", "Top rankings anyway", "Faster indexing", "A duplicate content flag"], answer: 0, explain: "Internal links are the site's hallways. Orphan pages get missed." }] } },
                { type: "concept", heading: "Anchor text is a hint", body: "Read our pricing guide tells robots and readers what the destination is. Click here tells them nothing. Describe the destination in the link itself." },
              ],
            },
            {
              title: "Measure and adjust",
              keywords: ["seo", "analytics", "search", "console", "metrics", "impressions", "ctr"],
              steps: [
                { type: "concept", heading: "Search Console is the scoreboard", body: "Google Search Console shows the queries you appeared for, impressions, clicks, and average position, free, from Google itself. SEO without it is guessing." },
                { type: "mcq", prompt: "High impressions but almost no clicks usually means…", options: ["The page should be deleted", "Your title/description are not earning the click", "Google is broken", "You need more keywords on the page"], answer: 1, explain: "People see you and pass. That is a headline problem, rewrite the title and description like ad copy.", gen: { variants: [{ prompt: "Position 6, thousands of impressions, 0.5% CTR. First move?", options: ["Rewrite the title and description to earn the click", "Delete the page", "Buy ads instead", "Hide extra keywords on the page"], answer: 0, explain: "You are already being seen. Win the glance." }] } },
                { type: "numeric", prompt: "A page ranks position 8 with 900 impressions and 1% CTR. You improve it to 2% CTR. How many clicks now?", answer: 18, tolerance: 0, explain: "900 × 0.02 = 18, double the 9 you had, without moving a single position.", gen: { vars: { i: [600, 1200, 100], c: [2, 3, 1] }, answer: "i*c/100", round: 0, show: { cd: "c/100", old: "i/100" }, prompt: "A page ranks position 8 with {i} impressions and 1% CTR. You improve it to {c}% CTR. How many clicks now?", explain: "{i} × {cd} = {A}, up from the {old} you had, without moving a single position." } },
                { type: "order", prompt: "A monthly SEO review that fits in one coffee.", items: ["Open Search Console's query report", "Find pages ranking 5-15 (almost winning)", "Improve exactly those pages", "Note what changed and check next month"], explain: "Pages just off page one are where small edits move real traffic. Position 45 to 40 moves nothing.", codeItems: false },
                { type: "concept", heading: "SEO is a flywheel, not a switch", body: "Changes take weeks to register and months to compound. Steady publishing and improving beats bursts of effort followed by silence, the sites that win are the ones still showing up in month six." },
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
                { type: "worked", heading: "Cluster the bakery", problem: "A bakery wants to own \"sourdough\" searches. Plan the content.", steps: ["Pillar: one thorough guide, \"Sourdough, start to finish\".", "Clusters: starter care, first loaf, common failures, tools, one search intent each.", "Every cluster links to the pillar and to its siblings; the pillar links out to all of them.", "Six months of that beats one \"ultimate guide\" post almost every time."], takeaway: "Cover the topic as a linked system, not a lone page." },
                { type: "mcq", prompt: "The internal links inside a cluster mainly tell Google…", options: ["The site has many pages", "These pages together form one area of expertise", "To crawl more slowly", "Nothing, internal links are ignored"], answer: 1, explain: "Linked, focused pages transfer authority to each other and map the topic. Orphan posts never add up to anything.", gen: { variants: [{ prompt: "Five posts all link to your main guide and to each other. Google reads that as…", options: ["One connected area of expertise", "Spam", "Duplicate content", "Nothing at all"], answer: 0, explain: "Clusters concentrate topical authority on the pillar page." }] } },
                { type: "order", prompt: "Build a cluster without burning out.", items: ["Pick a topic you can genuinely cover", "Write the pillar overview first", "Publish cluster pages one intent at a time", "Interlink and refresh as rankings arrive"], explain: "Pillar first gives every later post something to plug into on day one.", codeItems: false },
                { type: "numeric", prompt: "Eight cluster pages each bring 40 visits a month and the pillar brings 200. Total monthly visits?", answer: 520, tolerance: 0, explain: "8 × 40 + 200 = 520, and each new cluster page compounds the whole set, not just itself.", gen: { vars: { n: [5, 12, 1], v: [20, 60, 10], p: [100, 400, 50] }, answer: "n*v + p", round: 0, prompt: "{n} cluster pages each bring {v} visits a month and the pillar brings {p}. Total monthly visits?", explain: "{n} × {v} + {p} = {A}, and each new cluster page compounds the whole set, not just itself." } },
                { type: "concept", heading: "Readers feel it too", body: "Whichever page a visitor lands on, their next question is one click away. Clusters aren't a trick, they're what genuinely covering a subject looks like." },
              ],
            },
            {
              title: "Technical SEO essentials",
              keywords: ["seo", "technical", "sitemap", "robots", "canonical", "redirect", "crawl"],
              steps: [
                { type: "concept", heading: "Clear the road", body: "Technical SEO removes obstacles between crawler and content: a sitemap (the map), robots.txt (the rules), canonical tags (which copy counts), and redirects (where moved pages went)." },
                { type: "mcq", prompt: "You moved a popular page to a new URL. What preserves its rankings?", options: ["Delete the old page", "A 301 permanent redirect to the new URL", "Keep the content at both URLs", "A note in the footer"], answer: 1, explain: "A 301 hands the old page's earned authority to the new address. Deleting it throws years of links away.", gen: { variants: [{ prompt: "You retire an old URL that has backlinks. Without a 301 redirect, those links…", options: ["Dead-end into a 404 and their value evaporates", "Transfer automatically", "Boost the homepage instead", "Turn into social signals"], answer: 0, explain: "A 301 is the web's change of address form." }] } },
                { type: "mcq", prompt: "Two URLs show the same product, with and without ?color=blue. Best practice?", options: ["Block one in robots.txt", "A canonical tag pointing at the main URL", "Delete the variant page", "Nothing. Google always guesses right"], answer: 1, explain: "The canonical says \"count these as one\". Blocking hides the page entirely, a different, blunter tool.", gen: { variants: [{ prompt: "Print view and normal view of the same article both get indexed. The fix is…", options: ["A canonical tag on the print view pointing at the original", "Deleting the article", "Blocking Google entirely", "Adding more content to the print view"], answer: 0, explain: "Canonical says: this is the copy that counts." }] } },
                { type: "worked", heading: "Diagnose the post-redesign drop", problem: "Traffic fell 60% after a site redesign. Find the cause.", steps: ["Open Search Console first: coverage report and crawl errors tell you WHERE it broke.", "Did URLs change without 301 redirects? That is the classic redesign killer.", "Check robots.txt and meta noindex, staging blocks ship to production more often than anyone admits.", "Fix redirects, resubmit the sitemap, and wait out a recrawl before judging."], takeaway: "After any restructure: redirects, robots, sitemap, checked in that order." },
                { type: "order", prompt: "Technical setup for a new site, in order.", items: ["Verify the site in Search Console", "Submit an XML sitemap", "Confirm robots.txt isn't blocking real pages", "Add canonicals wherever duplicates exist"], explain: "Search Console first, every later check reads from it.", codeItems: false },
                { type: "concept", heading: "Set-and-vigil", body: "Technical SEO is mostly one-time setup plus vigilance at every redesign. The disasters are almost always self-inflicted, which means they are also preventable." },
              ],
            },
            {
              title: "Winning nearby searches",
              keywords: ["seo", "local", "maps", "business", "profile", "reviews", "nearby"],
              steps: [
                { type: "concept", heading: "The map is the battlefield", body: "For a physical business, \"near me\" searches route through your business profile (category, hours, photos, reviews) as much as through your website. Both need tending." },
                { type: "mcq", prompt: "The biggest local-ranking lever you control this week is…", options: ["A new logo", "A complete profile plus a steady flow of real reviews", "More hashtags", "A press release"], answer: 1, explain: "Completeness and genuine review activity are the strongest signals a small business can actually move.", gen: { variants: [{ prompt: "For \"dentist near me\" searches, the lever you control most directly is…", options: ["Your business profile completeness and steady real reviews", "A national TV ad", "Meta keywords", "Emoji in the site title"], answer: 0, explain: "Local rank runs on profile, proximity, and reviews. Feed the parts you own." }] } },
                { type: "worked", heading: "Two bakeries, one winner", problem: "Two bakeries share a street. One dominates local results, why?", steps: ["Its profile is complete: precise category, current hours, forty real photos.", "It replies to reviews, visible engagement reads as an active, cared-for business.", "Its site names the neighborhood in plain text: \"sourdough bakery in Elwood\".", "Its name, address, and phone match exactly everywhere they appear online."], takeaway: "Local SEO = completeness + consistency + reviews." },
                { type: "order", prompt: "A local SEO sprint for one afternoon.", items: ["Claim and complete the business profile", "Make name/address/phone identical everywhere", "Ask three happy customers for reviews, reply to every one", "Put the location into page titles and copy"], explain: "Consistency errors (old address in one directory) quietly cap everything else.", codeItems: false },
                { type: "numeric", prompt: "Your profile gets 1,200 views a month and 6% request directions. How many people is that?", answer: 72, tolerance: 0, explain: "72 people physically heading your way, profile views convert harder than almost any website traffic.", gen: { vars: { V: [600, 2400, 200], r: [4, 10, 2] }, answer: "V*r/100", round: 0, prompt: "Your profile gets {V} views a month and {r}% request directions. How many people is that?", explain: "{A} people physically heading your way, profile views convert harder than almost any website traffic." } },
                { type: "concept", heading: "Reviews are local backlinks", body: "Earned, public, and impossible to fake at scale, reviews are trust the algorithm and the customer both read. Ask honestly, reply always, never buy." },
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
                { type: "worked", heading: "Watch one solved", problem: "A $60 jacket is 25% off. What do you pay?", steps: ["25% means 25 per hundred. The discount is 0.25 × 60.", "0.25 × 60 = 15, fifteen dollars come off.", "60 − 15 = 45. You pay $45.", "Shortcut: you keep 75%, and 0.75 × 60 = 45. Same answer, one multiplication."], takeaway: "Percent off = multiply by what remains." },
                { type: "numeric", prompt: "What is 15% of 80?", answer: 12, tolerance: 0, explain: "0.15 × 80 = 12. Shortcut: 10% is 8, 5% is 4, together 12.", gen: { vars: { p: [5, 35, 5], b: [40, 240, 20] }, answer: "b*p/100", round: 0, show: { pd: "p/100", t: "b/10" }, prompt: "What is {p}% of {b}?", explain: "{pd} × {b} = {A}. Shortcut: 10% of {b} is {t}, then scale and stack from there." } },
                { type: "explore", heading: "Slide the percent", body: "Drag the percentage and watch the amount taken from 250. Notice 10% steps move the result in equal jumps, percentages of a fixed base are linear.", expr: "p/100*250", variable: "p", min: 0, max: 100, stepSize: 1, label: "percent", valueLabel: "amount of 250" },
                { type: "mcq", prompt: "A $50 jacket is 30% off. You pay…", options: ["$20", "$30", "$35", "$47"], answer: 2, explain: "30% of 50 is 15 off, leaving 35. Or directly: you pay 70%, and 0.7 × 50 = 35.", gen: { variants: [{ prompt: "An $80 pair of boots is 25% off. You pay…", options: ["$60", "$55", "$20", "$75"], answer: 0, explain: "25% of 80 is 20 off, so 60. The discount subtracts from the original." }] } },
                { type: "numeric", prompt: "A price rises from $40 to $46. What percent increase is that?", answer: 15, tolerance: 0.5, explain: "The change is 6; 6 ÷ 40 = 0.15 = 15%. Always divide by the ORIGINAL value.", gen: { vars: { a: [20, 80, 20], k: [5, 30, 5] }, answer: "k", round: 0, tolerance: 0.5, show: { n: "a + a*k/100", d: "a*k/100", pd: "k/100" }, prompt: "A price rises from ${a} to ${n}. What percent increase is that?", explain: "The change is {d}; {d} ÷ {a} = {pd} = {A}%. Always divide by the ORIGINAL value." } },
                { type: "concept", heading: "Points are not percent", body: "An interest rate going from 4% to 6% rose two percentage points, but that is a 50% increase in the rate. Headlines mix these up constantly; now you will catch them." },
              ],
            },
            {
              title: "Ratios and scaling",
              keywords: ["math", "ratio", "scaling", "proportion", "rates", "units", "recipe"],
              steps: [
                { type: "concept", heading: "Keep the ratio, change the size", body: "A recipe, a map, a mix. All ratios. Scale every part by the same factor and the thing still works. Find the factor first: new amount ÷ old amount." },
                { type: "worked", heading: "Scale a recipe", problem: "A recipe for 2 people uses 150 g of rice. You are cooking for 5.", steps: ["Find the scaling factor first: 5 ÷ 2 = 2.5.", "Multiply every ingredient by it: 150 × 2.5 = 375 g.", "Sanity check: 5 people is a bit more than double 2, and 375 is a bit more than double 150."], takeaway: "Scale by one factor (new ÷ old) applied to everything." },
                { type: "numeric", prompt: "A recipe for 4 people uses 300 g of flour. How many grams for 6 people?", answer: 450, tolerance: 0, explain: "The factor is 6/4 = 1.5, and 300 × 1.5 = 450.", gen: { vars: { f: [200, 500, 50], n: [6, 10, 2] }, answer: "f*n/4", round: 0, show: { k: "n/4" }, prompt: "A recipe for 4 people uses {f} g of flour. How many grams for {n} people?", explain: "The factor is {n}/4 = {k}, and {f} × {k} = {A}." } },
                { type: "explore", heading: "Areas scale faster", body: "Drag the side length of a square and watch its area. Double the side and the area quadruples, scaling in two dimensions multiplies twice.", expr: "s^2", variable: "s", min: 0, max: 10, stepSize: 0.1, label: "side length", valueLabel: "area" },
                { type: "mcq", prompt: "A pizza with double the diameter costs 1.5× the price. Per bite of pizza it is…", options: ["A worse deal", "The same deal", "A better deal", "Impossible to compare"], answer: 2, explain: "Double the diameter is 4× the area for 1.5× the money. Area is what you eat.", gen: { variants: [{ prompt: "A pizza with double the diameter holds how much more pizza?", options: ["Four times as much", "Twice as much", "The same", "Half as much"], answer: 0, explain: "Area grows with the square of the width. Double the diameter means four times the pizza." }] } },
                { type: "numeric", prompt: "A car goes 240 km on 15 liters. How many km per liter?", answer: 16, tolerance: 0, explain: "240 ÷ 15 = 16 km/L. Rates are ratios with useful units attached.", gen: { vars: { kpl: [8, 18, 2], L: [10, 20, 5] }, answer: "kpl", round: 0, show: { km: "kpl*L" }, prompt: "A car goes {km} km on {L} liters. How many km per liter?", explain: "{km} ÷ {L} = {A} km/L. Rates are ratios with useful units attached." } },
                { type: "concept", heading: "Let the units do the thinking", body: "Write units into your arithmetic: km ÷ (km/L) leaves L. If the units of your answer come out wrong, the calculation is wrong. No double-checking needed." },
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
                { type: "concept", heading: "Growth on growth", body: "Compound growth pays interest on last year's interest. Each step rides a bigger base, so the curve bends upward, modest rates become large numbers, given time." },
                { type: "worked", heading: "Three years, step by step", problem: "You save $500 at 8% per year. What is it worth after 3 years?", steps: ["Year one: 500 × 1.08 = 540.", "Year two grows the NEW total: 540 × 1.08 = 583.20.", "Year three: 583.20 × 1.08 ≈ 629.86.", "Simple interest would add a flat 40 each year and end at 620, compounding already beat it, and the gap widens every year."], takeaway: "Multiply by (1 + rate) once per year, on the new total each time." },
                { type: "explore", heading: "Bend the curve", body: "Drag the yearly rate applied to 1,000 for ten years. Watch the right side of the curve run away from the left. That bend is compounding.", expr: "1000*(1+r)^10", variable: "r", min: 0, max: 0.2, stepSize: 0.005, label: "yearly rate", valueLabel: "after 10 years" },
                { type: "numeric", prompt: "1,000 grows 10% per year. How much after 2 years?", answer: 1210, tolerance: 1, explain: "Year one: 1,100. Year two grows the NEW total: 1,100 × 1.1 = 1,210, not 1,200.", gen: { vars: { r: [5, 20, 5] }, answer: "1000*(1+r/100)^2", round: 0, tolerance: 1, show: { y1: "1000*(1+r/100)", g: "1+r/100" }, prompt: "1,000 grows {r}% per year. How much after 2 years?", explain: "Year one: {y1}. Year two grows the NEW total: {y1} × {g} = {A}, not simple addition." } },
                { type: "mcq", prompt: "The rule of 72 estimates doubling time. At 6% growth, money doubles in about…", options: ["6 years", "12 years", "24 years", "72 years"], answer: 1, explain: "72 ÷ rate ≈ doubling time: 72 ÷ 6 = 12 years. A rough rule, but remarkably good for everyday rates.", gen: { variants: [{ prompt: "At 8% growth, the rule of 72 says money doubles in about…", options: ["9 years", "8 years", "72 years", "18 years"], answer: 0, explain: "72 divided by 8. The rule turns rates into time." }] } },
                { type: "numeric", prompt: "Using the rule of 72: at 9% per year, roughly how many years to double?", answer: 8, tolerance: 0.5, explain: "72 ÷ 9 = 8. Now reverse it: a debt at 18% doubles in about 4, compounding works against you just as hard.", gen: { vars: { r: [6, 12, 3] }, answer: "72/r", round: 0, tolerance: 0.5, prompt: "Using the rule of 72: at {r}% per year, roughly how many years to double?", explain: "72 ÷ {r} = {A}. Now reverse it: a debt at twice the rate doubles in half the time, compounding works against you just as hard." } },
                { type: "concept", heading: "Time is the big lever", body: "Ten extra years matters more than a slightly better rate. That is why starting early beats starting big, and why old debts grow teeth." },
              ],
            },
            {
              title: "Probability you can use",
              keywords: ["math", "probability", "chance", "odds", "random", "coin", "dice"],
              steps: [
                { type: "concept", heading: "Count the ways", body: "For equally likely outcomes, probability = ways it can happen ÷ ways anything can happen. Two coins have four outcomes: HH, HT, TH, TT. Each 1/4." },
                { type: "worked", heading: "Two dice together", problem: "Roll two dice. What is the chance BOTH show a six?", steps: ["One die shows a six with probability 1/6, one face out of six.", "The dice do not influence each other, so their chances multiply.", "1/6 × 1/6 = 1/36 ≈ 0.028, about 3 times in a hundred tries."], takeaway: "Independent events: multiply the chances." },
                { type: "numeric", prompt: "Flip two fair coins. What is the probability BOTH are heads, as a decimal?", answer: 0.25, tolerance: 0.01, explain: "One outcome (HH) out of four equally likely ones: 1/4 = 0.25. Independent chances multiply: 0.5 × 0.5." },
                { type: "mcq", prompt: "A fair coin lands heads 5 times running. The chance the NEXT flip is heads is…", options: ["Much less than 50% (tails is due)", "Exactly 50%", "More than 50% (heads is hot)", "Zero"], answer: 1, explain: "The coin has no memory. Believing streaks must balance out is the gambler's fallacy, and casinos are built on it.", gen: { variants: [{ prompt: "A roulette wheel lands red 6 times running. The next spin is…", options: ["The same odds as always", "Due for black", "Hot for red", "Impossible to say"], answer: 0, explain: "The wheel has no memory. Streak logic is the gambler's fallacy." }] } },
                { type: "explore", heading: "At least once", body: "Something has a small per-try chance. Drag it and watch the probability of at least one success across 10 tries, small chances become near-certainties with repetition.", expr: "1-(1-p)^10", variable: "p", min: 0, max: 0.5, stepSize: 0.01, label: "chance per try", valueLabel: "chance in 10 tries" },
                { type: "numeric", prompt: "Roll one die. Probability of a 5 or a 6, as a decimal (two places)?", answer: 0.33, tolerance: 0.01, explain: "2 favorable faces out of 6: 2/6 = 1/3 ≈ 0.33." },
                { type: "concept", heading: "Independence is the fine print", body: "Multiplying chances requires the events not to influence each other. Two flights delayed by the same storm are not independent, and pretending otherwise is how planners get surprised." },
              ],
            },
            {
              title: "Averages that lie",
              keywords: ["math", "average", "mean", "median", "statistics", "outliers", "data"],
              steps: [
                { type: "concept", heading: "Mean vs median", body: "The mean adds everything and divides. The median is the middle value when sorted. One billionaire in the room drags the mean to the moon; the median barely moves." },
                { type: "worked", heading: "The million-dollar neighbor", problem: "A street has five houses: four worth $200k and one worth $1M. What is the “average” house?", steps: ["Mean: (4 × 200 + 1,000) ÷ 5 = 1,800 ÷ 5 = $360k.", "But no house on the street costs anywhere near $360k.", "Median: sort and take the middle, $200k, which describes four of the five houses exactly."], takeaway: "One outlier can drag the mean far from every actual value." },
                { type: "numeric", prompt: "Find the MEAN of 2, 4, 6, 8, 100.", answer: 24, tolerance: 0, explain: "Sum 120 ÷ 5 = 24, bigger than four of the five values, thanks to the outlier." },
                { type: "numeric", prompt: "Same numbers: 2, 4, 6, 8, 100. What is the MEDIAN?", answer: 6, tolerance: 0, explain: "Sorted, the middle value is 6. The 100 counts as just one value up top, the median resists outliers." },
                { type: "mcq", prompt: "For typical household income, which average tells the truer story?", options: ["The mean", "The median", "They always match", "Neither can help"], answer: 1, explain: "Incomes skew: a few huge values inflate the mean. Median answers what does the middle household actually make?", gen: { variants: [{ prompt: "Nine houses sell near $300k and one castle sells for $30 million. Which average moves most?", options: ["The mean", "The median", "Both equally", "Neither"], answer: 0, explain: "One extreme value drags the mean far. The median barely notices." }] } },
                { type: "order", prompt: "Interrogate a statistic before believing it.", items: ["Ask which average was used", "Ask how spread out the values are", "Ask who was included and who was not", "Then decide what it shows"], explain: "Average customer saves $400 can be true while most customers save nothing. The questions expose which.", codeItems: false },
                { type: "concept", heading: "Ask for the spread", body: "Two teams can share an average and live different lives, one steady, one chaotic. Range and percentiles tell you what the average alone hides." },
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
                { type: "concept", heading: "Price the uncertain", body: "Expected value = each outcome × its probability, summed. It converts an uncertain choice into a number you can compare to a price, the core tool of rational betting, insurance, and business decisions." },
                { type: "worked", heading: "Price the raffle", problem: "A ticket costs $5. One ticket in 200 wins $500. Good deal?", steps: ["EV of the prize: (1/200) × 500 = $2.50.", "You pay $5 for an expected $2.50, the ticket loses $2.50 in expectation.", "Fun can be worth $2.50. A savings plan built on raffles cannot."], takeaway: "Multiply each outcome by its chance; compare the total to the price." },
                { type: "numeric", prompt: "A game gives a 30% chance to win $40, otherwise nothing. What is its fair price (EV) in dollars?", answer: 12, tolerance: 0, explain: "0.30 × 40 = 12. Paying less than $12 is +EV; paying more is a donation.", gen: { vars: { p: [10, 50, 10], W: [20, 120, 20] }, answer: "p*W/100", round: 0, show: { pd: "p/100" }, prompt: "A game gives a {p}% chance to win ${W}, otherwise nothing. What is its fair price (EV) in dollars?", explain: "{pd} × {W} = {A}. Paying less than ${A} is +EV; paying more is a donation." } },
                { type: "explore", heading: "Find the break-even", body: "A bet pays $100 on a win and loses $20 otherwise. Drag the win chance and watch expected profit cross zero. That crossing point is the exact chance that makes the bet fair.", expr: "p*100-(1-p)*20", variable: "p", min: 0, max: 0.5, stepSize: 0.01, label: "win chance", valueLabel: "expected profit" },
                { type: "mcq", prompt: "Insurance has negative EV for you, premiums exceed average payouts. Why buy it anyway?", options: ["You shouldn't, ever", "Because a rare loss you cannot absorb is worse than a small certain cost", "Because EV doesn't apply to money", "Tax reasons only"], answer: 1, explain: "EV assumes you survive to play again. For ruinous outcomes, you pay to remove the tail, not to win on average.", gen: { variants: [{ prompt: "A $30 warranty on a $60 toaster has negative EV and covers a loss you could shrug off. Buy it?", options: ["No. Self-insure the small stuff", "Yes, always insure", "Only with a coupon", "EV says yes"], answer: 0, explain: "Insure catastrophes, not annoyances. You can absorb a toaster." }] } },
                { type: "numeric", prompt: "A 1% yearly chance of a $20,000 loss. What is the expected yearly loss (the fair premium) in dollars?", answer: 200, tolerance: 0, explain: "0.01 × 20,000 = 200. Everything an insurer charges above that covers costs, profit, and your peace of mind.", gen: { vars: { p: [1, 5, 1], L: [10000, 40000, 5000] }, answer: "p*L/100", round: 0, show: { pd: "p/100" }, prompt: "A {p}% yearly chance of a ${L} loss. What is the expected yearly loss (the fair premium) in dollars?", explain: "{pd} × {L} = {A}. Everything an insurer charges above that covers costs, profit, and your peace of mind." } },
                { type: "concept", heading: "EV for repeats, survival for one-shots", body: "Use EV freely on repeatable, affordable bets. For rare catastrophic ones, weight staying in the game, a positive-EV bet you can't afford to lose is still a bad bet." },
              ],
            },
            {
              title: "Spread tells the story",
              keywords: ["math", "spread", "variation", "range", "deviation", "percentile", "tail"],
              steps: [
                { type: "concept", heading: "The second number", body: "Two datasets can share an average and be different animals. Spread (range, percentiles, deviation) is the second number to demand before trusting any average." },
                { type: "worked", heading: "Choose a courier", problem: "Two delivery services both average 30 minutes. A ranges 28-33; B ranges 10-70. Which carries your interview documents?", steps: ["Same mean, wildly different spread: A varies by 5 minutes, B by 60.", "Your real cost isn't average lateness. It's the chance of DISASTER lateness.", "B's 70-minute tail is what misses the interview. Choose A.", "When the downside matters, decide on the spread, not the mean."], takeaway: "Averages book the trip; tails miss the flight." },
                { type: "numeric", prompt: "Delivery times: 22, 25, 30, 31, 42. What is the range (max minus min)?", answer: 20, tolerance: 0, explain: "42 − 22 = 20. Crude but honest, one number that already says \"this service varies a lot\"." },
                { type: "numeric", prompt: "Same times. 22, 25, 30, 31, 42. What is the median?", answer: 30, tolerance: 0, explain: "Sorted, the middle value is 30. Pair it with the range and you know more than any single average tells you." },
                { type: "mcq", prompt: "\"Median wait 20 min; 95th percentile 90 min.\" This tells you…", options: ["The system fails everyone", "Half wait ≤20, but 1 in 20 waits 90+, plan for that tail", "The average must be 55", "Percentiles are just averages"], answer: 1, explain: "Median describes the typical case; p95 describes the bad day. Systems get judged, and sized, on their bad days.", gen: { variants: [{ prompt: "\"Median delivery 2 days; 95th percentile 9 days.\" Promise customers…", options: ["\"Usually 2 days, occasionally up to 9\"", "\"Always 2 days\"", "\"9 days\"", "\"5.5 days on average\""], answer: 0, explain: "Plan and promise with the tail in view, not just the middle." }] } },
                { type: "concept", heading: "Report middle AND tail", body: "Whenever you quote a number, give a middle (median) and a tail (p95 or range). That one habit makes your reports honest and your plans robust." },
              ],
            },
            {
              title: "Money math that compounds",
              keywords: ["math", "inflation", "interest", "loans", "debt", "real", "nominal"],
              steps: [
                { type: "concept", heading: "Real beats nominal", body: "Growth minus inflation is what your money actually does. 7% returns during 3% inflation is ~4% real growth, the number that buys bread. Every money decision should be made in real terms." },
                { type: "numeric", prompt: "Savings earn 5% while inflation runs 3%. Approximate real growth rate, in percent?", answer: 2, tolerance: 0.1, explain: "5 − 3 = 2% real. (The exact figure is a touch lower, but the subtraction is right to within rounding for everyday rates.)", gen: { vars: { n: [4, 9, 1], i: [1, 3, 1] }, answer: "n - i", round: 0, tolerance: 0.1, prompt: "Savings earn {n}% while inflation runs {i}%. Approximate real growth rate, in percent?", explain: "{n} − {i} = {A}% real. (The exact figure is a touch lower, but the subtraction is right to within rounding for everyday rates.)" } },
                { type: "worked", heading: "Which debt first?", problem: "You hold an 18% credit card balance and a 6% car loan. Where does every spare dollar go?", steps: ["Debt compounds exactly like savings, against you.", "Rule of 72 on the card: 72 ÷ 18 = 4 years to double. The car loan doubles in 12.", "Paying the 18% card is a guaranteed 18% return; no safe investment comes close.", "Card first, minimums on the rest, no exceptions until it's dead."], takeaway: "Rank debts by rate and kill the fastest-compounding one first." },
                { type: "explore", heading: "Inflation eats quietly", body: "Drag the inflation rate and watch what 1,000 of today's money is worth in ten years. Even \"low\" inflation compounds into a real bite.", expr: "1000/((1+i)^10)", variable: "i", min: 0, max: 0.1, stepSize: 0.002, label: "inflation rate", valueLabel: "real value in 10 years" },
                { type: "mcq", prompt: "Inflation moves from 4% to 6%. The RATE of inflation just grew by…", options: ["2%", "6%", "50%", "It fell"], answer: 2, explain: "Two percentage points, yes, but 4 → 6 is a 50% jump in the rate itself. Headlines blur this distinction daily.", gen: { variants: [{ prompt: "Your conversion rate moves from 2% to 3%. The rate itself grew by…", options: ["50%", "1%", "3%", "It fell"], answer: 0, explain: "A 1 point rise on a base of 2 is a 50% jump in the rate. Points and percents are different animals." }] } },
                { type: "numeric", prompt: "Rule of 72: at 12% card interest, roughly how many years until an untouched balance doubles?", answer: 6, tolerance: 0, explain: "72 ÷ 12 = 6. The same doubling magic you admired in savings, now working the other side of the table.", gen: { vars: { r: [12, 24, 6] }, answer: "72/r", round: 0, prompt: "Rule of 72: at {r}% card interest, roughly how many years until an untouched balance doubles?", explain: "72 ÷ {r} = {A}. The same doubling magic you admired in savings, now working the other side of the table." } },
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
                { type: "mcq", prompt: "“You can't trust her budget plan, she's terrible at parking.” Which foul?", options: ["Strawman", "Ad hominem", "False dilemma", "Perfectly valid"], answer: 1, explain: "Parking skill says nothing about the budget's arithmetic. Attacking the person dodges the plan itself.", gen: { variants: [{ prompt: "\"Ignore his traffic study, he wears socks with sandals.\" Which foul?", options: ["Ad hominem", "Strawman", "False dilemma", "Sound reasoning"], answer: 0, explain: "Attacking the person's style says nothing about the study." }] } },
                { type: "mcq", prompt: "“He wants a bike lane, so apparently cars should be banned entirely.” Which foul?", options: ["Ad hominem", "False dilemma", "Strawman", "Appeal to authority"], answer: 2, explain: "The bike-lane claim was swapped for a wilder one that is easier to knock down. That distorted copy is the strawman.", gen: { variants: [{ prompt: "\"She suggested smaller portions, so she thinks we should all starve.\" Which foul?", options: ["Strawman", "Ad hominem", "False dilemma", "Appeal to tradition"], answer: 0, explain: "Inflate the claim into something absurd, then knock over the inflatable." }] } },
                { type: "mcq", prompt: "“Either we cut the entire arts budget or the city goes bankrupt.” Which foul?", options: ["False dilemma", "Strawman", "Ad hominem", "Sound reasoning"], answer: 0, explain: "Two options are presented as the only ones when a whole range exists. Real decisions are rarely binary.", gen: { variants: [{ prompt: "\"Either we work weekends forever or the company dies.\" Which foul?", options: ["False dilemma", "Strawman", "Ad hominem", "Valid deduction"], answer: 0, explain: "Two options presented where many exist." }] } },
                { type: "order", prompt: "Steel-man instead: respond to the STRONGEST version.", items: ["Restate their claim so they would say yes, exactly", "Strengthen it to its best version", "Test that version against evidence", "Respond to that, not the caricature"], explain: "Beating a weak copy convinces no one. Beating the strong version actually settles something.", codeItems: false },
                { type: "concept", heading: "Fouls are not falsity", body: "A badly argued claim can still be true, and a slick argument can defend nonsense. Spotting the foul tells you the ARGUMENT failed, the claim then needs honest evidence, either way." },
              ],
            },
            {
              title: "Correlation isn't causation",
              keywords: ["causation", "correlation", "confounder", "studies", "science", "evidence"],
              steps: [
                { type: "concept", heading: "Moving together proves little", body: "Ice cream sales and drownings rise together every year. Neither causes the other, summer causes both. A hidden common cause like that is called a confounder." },
                { type: "mcq", prompt: "Cities with more firefighters have more fire damage. Best explanation?", options: ["Firefighters cause damage", "Damage attracts firefighters as residents", "Bigger fires bring both more firefighters and more damage", "Coincidence, always"], answer: 2, explain: "Fire size is the confounder driving both numbers. The correlation is real; the causal story firefighters cause damage is not.", gen: { variants: [{ prompt: "Ice cream sales and drownings rise together. Best explanation?", options: ["Hot weather drives both", "Ice cream causes drowning", "Drowning causes cravings", "Coincidence, always"], answer: 0, explain: "Hunt for the third factor before crowning a cause." }] } },
                { type: "mcq", prompt: "What can separate causation from correlation most convincingly?", options: ["A bigger sample of the same observation", "A controlled experiment where only one thing changes", "A stronger correlation coefficient", "An expert's opinion"], answer: 1, explain: "Randomly assigning the change breaks the link to confounders. More of the same observational data repeats the same blind spot.", gen: { variants: [{ prompt: "To know whether the new headline sells more, the convincing test is…", options: ["Show both versions at random and compare results", "Ask the team's opinion", "Switch and eyeball one week of sales", "A survey about preferences"], answer: 0, explain: "Change one thing, randomize who sees which, compare. That is an experiment." }] } },
                { type: "order", prompt: "React to a striking correlation like a scientist.", items: ["Notice the two things move together", "List what could cause both", "Check whether the timing even fits", "Look for or run an experiment before claiming cause"], explain: "Could a third thing drive both? dissolves most headline correlations before step four.", codeItems: false },
                { type: "concept", heading: "Beware the arrow's direction", body: "Even a real causal link can point backwards: maybe depression disrupts sleep rather than poor sleep causing depression, or each feeds the other. Direction needs evidence too, not intuition." },
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
                { type: "concept", heading: "Rough is powerful", body: "You can estimate almost anything by breaking it into pieces you half-know and multiplying. Being within 2× of the truth is usually enough to make the decision, and to catch numbers that are nonsense." },
                { type: "numeric", prompt: "Warm-up: how many minutes are in a week?", answer: 10080, tolerance: 0, explain: "7 × 24 × 60 = 10,080. Chained multiplications like this are the whole Fermi toolkit." },
                { type: "numeric", prompt: "A 250-page book averages 300 words per page. Estimate its word count.", answer: 75000, tolerance: 0, explain: "250 × 300 = 75,000, a decent guess for any novel on your shelf, built from two easy numbers.", gen: { vars: { P: [150, 450, 50], w: [250, 350, 50] }, answer: "P*w", round: 0, prompt: "A {P}-page book averages {w} words per page. Estimate its word count.", explain: "{P} × {w} = {A}, a decent guess for any novel on your shelf, built from two easy numbers." } },
                { type: "mcq", prompt: "For rough estimates, the professional move is to…", options: ["Carry every decimal for accuracy", "Round aggressively to easy numbers and track the powers of ten", "Refuse to guess without data", "Always take the average of others' guesses"], answer: 1, explain: "20 × 300 × 50 in your head beats 23 × 312 × 47 abandoned. Getting the number of zeros right is most of the value.", gen: { variants: [{ prompt: "Estimating piano tuners in a city, the professional move is…", options: ["Easy round numbers and careful powers of ten", "Exact census data or nothing", "Three decimal places", "Averaging random guesses"], answer: 0, explain: "Rough inputs, honest structure. The power of ten is what matters." }] } },
                { type: "order", prompt: "Sanity-check a suspicious statistic.", items: ["Break it into per-person or per-day pieces", "Estimate each piece roughly", "Multiply back to the total", "Compare, off by 10× means someone is wrong"], explain: "The industry loses a trillion dollars a year often dies at step four. Now you can run the check yourself.", codeItems: false },
                { type: "concept", heading: "Estimate before you compute", body: "Guess the answer before the calculator touches it. When the two disagree wildly, you have caught either a typo or a broken assumption, both worth catching." },
              ],
            },
            {
              title: "Risk and randomness",
              keywords: ["risk", "base", "rates", "bayes", "randomness", "clusters", "probability"],
              steps: [
                { type: "concept", heading: "Base rates come first", body: "How common something is to begin with (the base rate) dominates rare-event reasoning. A very accurate test for a very rare condition still produces mostly false alarms, because almost everyone tested is healthy." },
                { type: "worked", heading: "The flagged bag", problem: "1 bag in 1,000 carries contraband. The scanner catches every real one but also flags 2% of innocent bags. A bag just got flagged, how worried should we be?", steps: ["Picture 1,000 bags. Exactly 1 is a real hit, and the scanner flags it.", "Of the 999 innocent bags, 2% get flagged too, about 20 false alarms.", "So roughly 21 bags get flagged, and only 1 of them is real: about 5%."], takeaway: "When the thing is rare, most alarms are false, draw the 1,000-people picture." },
                { type: "numeric", prompt: "A condition affects 1 in 1,000 people. A test is 99% accurate both ways. You test positive. Roughly what PERCENT chance do you actually have it?", answer: 9, tolerance: 3, explain: "Per 1,000 people: about 1 true positive and about 10 false alarms from the 999 healthy. 1 real out of ~11 positives ≈ 9%, not 99%." },
                { type: "mcq", prompt: "Why is the intuitive 99% answer so wrong there?", options: ["The test is worse than claimed", "The tiny base rate means false alarms outnumber true cases", "Percentages cannot exceed 50%", "It isn't wrong"], answer: 1, explain: "999 healthy people generating 1% false alarms is ~10 alarms; 1 sick person generates ~1 real. The healthy crowd dominates." },
                { type: "mcq", prompt: "Four heart attacks in one small town in a month. Before suspecting the water, remember…", options: ["Clusters prove a local cause", "Randomness naturally makes clusters, evenly-spread is what would be weird", "Small towns are safer", "Four is statistically impossible"], answer: 1, explain: "Sprinkle events randomly on a map and clumps appear. Real clusters exist, but clumpiness alone is what chance looks like.", gen: { variants: [{ prompt: "Three colleagues catch colds the same week. Before blaming the vents, remember…", options: ["Random events naturally clump", "Clusters prove a cause", "Colds are never random", "Three at once is impossible"], answer: 0, explain: "Even spacing is the rare thing. Clumps are what randomness looks like." }] } },
                { type: "order", prompt: "Judge a scary risk headline calmly.", items: ["Find the base rate, how common to start with?", "Ask: doubled from what? Relative or absolute?", "Translate to real people: X per 10,000", "Compare against risks you already accept"], explain: "Doubles your risk can mean 1-in-a-million became 2-in-a-million. The absolute numbers carry the meaning.", codeItems: false },
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
                { type: "concept", heading: "Shortcuts misfiring", body: "Biases aren't stupidity, they're fast mental shortcuts firing in the wrong situation. You can't delete them, but you can learn their shapes and design decisions around them." },
                { type: "mcq", prompt: "\"We've already spent $80k on this project. We can't stop now.\" Which trap?", options: ["Anchoring", "The sunk cost fallacy", "Survivorship bias", "None. That's prudence"], answer: 1, explain: "The $80k is gone whether you continue or not. Only future costs and future benefits belong in the decision.", gen: { variants: [{ prompt: "\"We've watched 90 minutes of this awful movie, we have to finish it.\" Which trap?", options: ["The sunk cost fallacy", "Anchoring", "Survivorship bias", "Prudence"], answer: 0, explain: "The 90 minutes are gone either way. Only the next hour is on the table." }] } },
                { type: "mcq", prompt: "The first price you saw was $400, so $250 feels cheap, even though it's above market. That pull is…", options: ["Anchoring", "Sunk cost", "Confirmation bias", "Altruism"], answer: 0, explain: "The first number sets the scale everything after is judged against. Sellers know this; now you do too.", gen: { variants: [{ prompt: "The menu lists a $95 steak nobody orders. Its real job is…", options: ["Anchoring: making the $40 steak feel reasonable", "Feeding large parties", "A printing error", "Clearing inventory"], answer: 0, explain: "The first big number drags your sense of normal upward." }] } },
                { type: "worked", heading: "De-bias your own claim", problem: "You believe your redesign improved sales, and you keep finding supporting evidence. Check it honestly.", steps: ["Name the pull: confirmation bias, you're only searching where agreement lives.", "Flip the question: what evidence WOULD show the redesign hurt? Go look for that, specifically.", "Compare like with like: this season versus the same season last year, not launch week versus a slow week.", "Decide in advance what result would change your mind. Then look."], takeaway: "Hunt for the evidence that would prove you wrong; it's the only search that counts." },
                { type: "order", prompt: "A repeatable de-biasing move.", items: ["Notice the itch of fast, convenient certainty", "Name the bias that would produce exactly that feeling", "Construct the strongest opposite case", "Decide with both cases on the table"], explain: "The feeling of obviousness is data, usually about you, not about the world.", codeItems: false },
                { type: "concept", heading: "Rules beat willpower", body: "The strongest de-biaser is a rule set before emotions arrive: a budget, a checklist, a pre-committed exit price. Ulysses tied himself to the mast BEFORE the sirens." },
              ],
            },
            {
              title: "Incentives explain the world",
              keywords: ["incentives", "goodhart", "metrics", "systems", "behavior"],
              steps: [
                { type: "concept", heading: "Follow the reward", body: "When behavior looks irrational, look at what's actually rewarded. People respond to incentives far more reliably than to intentions, speeches, or mission statements." },
                { type: "worked", heading: "The gamed metric", problem: "A support team judged on tickets-closed-per-day starts closing tickets… badly. Explain it, then fix it.", steps: ["The measure became the target: closes are rewarded, so closes happen, quality was never in the formula (Goodhart's law).", "Agents close early; customers reopen; the dashboard shines while service rots.", "Fix by measuring closer to the real goal: reopen rate, customer rating.", "Any single metric gets gamed eventually, pair it with a counter-metric watching its blind side."], takeaway: "When a measure becomes a target, it stops measuring." },
                { type: "mcq", prompt: "Paying programmers per line of code reliably gets you…", options: ["Better code", "More lines", "Fewer bugs", "Shorter programs"], answer: 1, explain: "You get exactly what you pay for, in the most literal, least useful sense. Choose metrics as if they'll be maximized, because they will.", gen: { variants: [{ prompt: "Paying support staff per closed ticket reliably gets you…", options: ["Tickets closed fast, solved or not", "Happier customers", "Fewer tickets", "Better documentation"], answer: 0, explain: "People deliver the metric, not the intention behind it." }] } },
                { type: "order", prompt: "Read any puzzling system through incentives.", items: ["Ask who benefits from the current behavior, and how", "Trace the actual reward, not the stated goal", "Change the reward, not the speech", "Watch for the new metric being gamed next"], explain: "Step three is where most fixes fail: exhortation is free and changes nothing.", codeItems: false },
                { type: "mcq", prompt: "January gym crowds vanish by March, yet gyms keep selling annual passes hard. Their incentive is to…", options: ["Cancel unused memberships", "Sell to people who won't show up", "Charge per visit", "Close in winter"], answer: 1, explain: "An absent member is pure margin. The business model prices your optimism, knowing that changes how you buy.", gen: { variants: [{ prompt: "A free mobile game's designers are mainly paid when you…", options: ["Keep scrolling and buying, not when you thrive", "Finish it and delete it", "Play less", "Recommend books instead"], answer: 0, explain: "Read the incentive and the design explains itself." }] } },
                { type: "concept", heading: "Design your own", body: "The lens points inward too: what do your own habits reward? Make the good path the lazy path, incentives you design beat discipline you summon." },
              ],
            },
            {
              title: "Changing your mind well",
              keywords: ["bayes", "updating", "beliefs", "calibration", "evidence", "forecasting"],
              steps: [
                { type: "concept", heading: "Beliefs with dials", body: "Treat beliefs as probabilities you'd bet on, not flags you defend. New evidence should turn the dial, not snap it to 0 or 100, and never leave it rusted in place." },
                { type: "worked", heading: "Update on weak evidence", problem: "You're 70% sure the café opens Sundays. You find one photo of it closed on a Sunday, posted a year ago. What now?", steps: ["The photo is real evidence, but weak: one Sunday, a year old, holidays and renovations exist.", "Move meaningfully, not totally: 70% drops to maybe 45%.", "Stronger evidence (this week's posted hours) would move you much further.", "Scale every update to the evidence's strength and recency, not to how it feels."], takeaway: "Strong evidence moves you far; weak evidence a little; no evidence, not at all." },
                { type: "mcq", prompt: "A forecaster's \"80% sure\" predictions come true about 80% of the time. That forecaster is…", options: ["Lucky", "Well calibrated", "Overconfident", "Vague"], answer: 1, explain: "Calibration means your confidence numbers mean something. It's trainable, and rarer than expertise.", gen: { variants: [{ prompt: "A pundit is \"certain\" daily and never scores their own record. Their track record is…", options: ["Unknown, and that is the problem", "Excellent", "Well calibrated", "Irrelevant"], answer: 0, explain: "Calibration needs scoring. Confidence without a score is theater." }] } },
                { type: "numeric", prompt: "You held ten separate beliefs at \"90% sure\" this year. If you're well calibrated, about how many should have come true?", answer: 9, tolerance: 0, explain: "Nine. If all ten always come true, you were underconfident; if seven, your \"90%\" is really 70%, now you know your exchange rate." },
                { type: "order", prompt: "An update you can do out loud.", items: ["State the belief as a number", "Name what evidence would move it, and by how much", "Look at the evidence when it arrives", "Move the number, and say that you moved it"], explain: "Pre-naming the evidence is the anti-goalpost device: you can't dismiss what you already agreed would count.", codeItems: false },
                { type: "concept", heading: "Updating is strength", body: "\"I changed my mind\" is what winning looks like from inside. Teams that punish it don't get fewer mistakes. They get confident ones." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "money",
      subject: "Personal finance",
      level: "Beginner",
      title: "Money that behaves",
      units: [
        {
          title: "Foundations",
          lessons: [
            {
              title: "Pay yourself first",
              keywords: ["finance", "money", "budget", "budgeting", "saving", "savings", "spending"],
              steps: [
                { type: "concept", heading: "Allocation beats restriction", body: "Budgets built as punishment lists get abandoned by February. The ones that work run backwards: savings leaves your account first, automatically, and whatever remains is guilt-free to spend. The 50/30/20 split (needs, wants, saving) is a fine place to start." },
                { type: "worked", heading: "Make $3,000 behave", problem: "Monthly take-home is $3,000. Set it up so saving happens without willpower.", steps: ["Split it 50/30/20: $1,500 needs, $900 wants, $600 saving.", "Automate the $600 out on payday, money you never see is money you never argue with.", "Rent eats $1,400 of the needs budget? Adjust the split by trimming wants first, the savings line moves last.", "Review once a month. A budget is a thermostat, not a cage."], takeaway: "Save first, automatically; spend what remains, never the reverse." },
                { type: "numeric", prompt: "Income is $3,000 and you save 20% first. How many dollars are left to live on?", answer: 2400, tolerance: 0, explain: "3,000 − 600 = 2,400. That number is now guilt-free by design.", gen: { vars: { I: [2000, 5000, 500], s: [10, 30, 5] }, answer: "I*(100-s)/100", round: 0, show: { sv: "I*s/100" }, prompt: "Income is ${I} and you save {s}% first. How many dollars are left to live on?", explain: "{I} − {sv} = {A}. That number is now guilt-free by design." } },
                { type: "mcq", prompt: "Budgets usually fail because…", options: ["The math is too hard", "They're built as punishment lists instead of automatic allocation", "Income is unpredictable", "The apps are bad"], answer: 1, explain: "Willpower loses to friction every month. Automation removes the decision entirely, the system does the discipline.", gen: { variants: [{ prompt: "The version of saving that survives contact with a busy month is…", options: ["An automatic transfer on payday", "Willpower at the register", "Saving whatever is left over", "A stricter spreadsheet"], answer: 0, explain: "Pay yourself first. Systems beat intentions." }] } },
                { type: "numeric", prompt: "You cut a $6-a-day habit for 30 days. Monthly savings in dollars?", answer: 180, tolerance: 0, explain: "6 × 30 = 180, real money, but notice it's less than one automated $600 transfer. Big flows beat small sacrifices.", gen: { vars: { d: [3, 9, 1] }, answer: "d*30", round: 0, prompt: "You cut a ${d}-a-day habit for 30 days. Monthly savings in dollars?", explain: "{d} × 30 = {A}, real money, but notice it's less than one automated pay-yourself-first transfer. Big flows beat small sacrifices." } },
                { type: "concept", heading: "Systems over sacrifice", body: "One automated transfer outworks a hundred small daily denials. Set the flow once, then spend your attention on earning more, not on skipping coffee." },
              ],
            },
            {
              title: "The emergency fund",
              keywords: ["finance", "emergency", "fund", "savings", "buffer", "cushion", "crisis"],
              steps: [
                { type: "concept", heading: "Crises become inconveniences", body: "An emergency fund converts a broken transmission from a debt spiral into an annoying Tuesday. Target three to six months of ESSENTIAL expenses, parked somewhere boring you can reach tomorrow." },
                { type: "worked", heading: "Size yours in two minutes", problem: "Rent $1,200, food $400, utilities $150, transport $250. What's the target?", steps: ["Essentials only: 1,200 + 400 + 150 + 250 = $2,000 a month. Streaming and restaurants don't count, you'd cut those in a crisis.", "Three-month floor: $6,000. Six-month comfort: $12,000.", "Building at $300 a month, the floor takes 20 months, fine. The fund is a marathon with a finish line.", "Until it's funded, it outranks investing: the fund is what keeps a crisis from forcing you to sell investments at the worst moment."], takeaway: "Essentials × months, not income × months." },
                { type: "numeric", prompt: "Essential expenses are $2,000 a month. What's a three-month emergency fund in dollars?", answer: 6000, tolerance: 0, explain: "2,000 × 3 = 6,000. Six months doubles it for shakier income.", gen: { vars: { e: [1500, 3500, 500], m: [3, 6, 3] }, answer: "e*m", round: 0, prompt: "Essential expenses are ${e} a month. What's a {m}-month emergency fund in dollars?", explain: "{e} × {m} = {A}. More months for shakier income." } },
                { type: "mcq", prompt: "Where should the emergency fund live?", options: ["Stocks, so it grows", "A savings account you can reach tomorrow", "Cash under the mattress", "A 5-year locked certificate"], answer: 1, explain: "Its job is availability, not growth. Stocks can be down 30% the week the transmission dies. That's the exact scenario the fund exists for.", gen: { variants: [{ prompt: "Your emergency fund's job is to be…", options: ["Reachable within a day and boring", "Growing fast in stocks", "Locked for five years", "Invisible to you"], answer: 0, explain: "It is insurance, not an investment. Liquidity is the feature." }] } },
                { type: "numeric", prompt: "Saving $250 a month toward a $6,000 fund, how many months to get there?", answer: 24, tolerance: 0, explain: "6,000 ÷ 250 = 24. Slow is fine; the direction is what matters.", gen: { vars: { s: [200, 500, 50], m: [12, 30, 6] }, answer: "m", round: 0, show: { g: "s*m" }, prompt: "Saving ${s} a month toward a ${g} fund, how many months to get there?", explain: "{g} ÷ {s} = {A}. Slow is fine; the direction is what matters." } },
                { type: "concept", heading: "Refill before extras", body: "When you use the fund (and someday you will) refilling it comes before vacations and upgrades. It only protects you at full strength." },
              ],
            },
            {
              title: "Good debt, bad debt",
              keywords: ["finance", "debt", "credit", "card", "interest", "loan", "score"],
              steps: [
                { type: "concept", heading: "Debt is rented money", body: "The interest rate is the rent. A 5% loan that buys an education or a home can be a tool; a 20% card balance renting last month's dinners is a leak. Judge debt by its rate and what it bought." },
                { type: "mcq", prompt: "You hold an 18% card balance and a 5% student loan. A spare $200 a month goes to…", options: ["Split evenly, it's fairer", "The card (highest rate first)", "The student loan (it's bigger)", "Savings instead"], answer: 1, explain: "Paying an 18% debt is a guaranteed 18% return. Nothing safe comes close, and 'fair' costs you real money.", gen: { variants: [{ prompt: "Card at 22%, car loan at 7%. Extra payments go to…", options: ["The 22% card first", "The car, it is newer", "Split evenly", "Neither, invest and hope for 8%"], answer: 0, explain: "Paying 22% debt is a guaranteed 22% return. Nothing safe competes." }] } },
                { type: "worked", heading: "The minimum-payment trap", problem: "A $3,000 card balance at 20% APR asks for a $60 minimum. What actually happens if you pay it?", steps: ["One month's interest: 3,000 × 20% ÷ 12 = $50.", "Of your $60 payment, $50 is rent on the debt, only $10 touches the balance.", "At that rate the balance barely moves for years; minimums are designed to keep you, not free you.", "Pay $150 instead and $100 hits the principal every month, the debt dies in about two years."], takeaway: "Minimums rent the debt; real principal payments kill it." },
                { type: "numeric", prompt: "A $3,000 balance at 20% APR: roughly how many dollars of interest accrue in ONE month?", answer: 50, tolerance: 1, explain: "3,000 × 0.20 ÷ 12 = 50. Seeing the monthly rent in dollars is what makes the rate real.", gen: { vars: { B: [1000, 6000, 1000], a: [12, 32, 4] }, answer: "B*a/1200", round: 0, tolerance: 1, show: { ad: "a/100" }, prompt: "A ${B} balance at {a}% APR: roughly how many dollars of interest accrue in ONE month?", explain: "{B} × {ad} ÷ 12 = {A}. Seeing the monthly rent in dollars is what makes the rate real." } },
                { type: "order", prompt: "Attack multiple debts in the order that saves the most.", items: ["List every debt with its interest rate", "Pay minimums on all of them", "Throw every spare dollar at the highest rate", "When it dies, roll its payment into the next one"], explain: "The avalanche: each killed debt makes the next one die faster. The rolling payment is the engine.", codeItems: false },
                { type: "concept", heading: "Credit scores are boring on purpose", body: "On-time payments plus low utilization, repeated for years. That's the whole trick. No hacks required, and nothing exotic beats simply being reliably dull." },
              ],
            },
          ],
        },
        {
          title: "Growing it",
          lessons: [
            {
              title: "Investing without drama",
              keywords: ["finance", "investing", "index", "funds", "stocks", "market", "compound", "retirement"],
              steps: [
                { type: "concept", heading: "Own the average, cheaply", body: "Nobody reliably picks winning stocks, but anyone can own a slice of the whole market through an index fund and let decades of compounding work. The two enemies are fees and panic, and both are under your control." },
                { type: "explore", heading: "Fees eat quietly", body: "Drag the annual fee on a $10,000 investment growing 7% for 30 years. A 'small' 2% fee isn't small, watch it consume decades of compounding.", expr: "10000*(1.07-f)^30", variable: "f", min: 0, max: 0.03, stepSize: 0.001, label: "annual fee", valueLabel: "value after 30 years" },
                { type: "numeric", prompt: "Rule of 72: at 8% average growth, roughly how many years for money to double?", answer: 9, tolerance: 0.5, explain: "72 ÷ 8 = 9. Thirty-six years is four doublings. 1× becomes 16×. That's the case for starting now.", gen: { vars: { r: [6, 12, 2] }, answer: "72/r", round: 1, tolerance: 0.5, prompt: "Rule of 72: at {r}% average growth, roughly how many years for money to double?", explain: "72 ÷ {r} = {A}. Every doubling stacks: four doublings turn 1× into 16×. That's the case for starting now." } },
                { type: "worked", heading: "What panic costs", problem: "Your $10,000 drops 30% in a crash. Sell or sit?", steps: ["Markets fall hard roughly once a decade. That risk IS why they pay better than savings accounts.", "Selling turns a paper loss into a real one: your 10,000 is now genuinely 7,000, and you're out of the game for the recovery.", "Historically, broad markets that crashed went on to new highs within a few years, but only for the people still in them.", "The investor who does nothing usually beats the investor who reacts."], takeaway: "Time in the market beats timing the market." },
                { type: "mcq", prompt: "The biggest predictor of an ordinary investor's long-run outcome is…", options: ["Picking hot stocks", "Starting early and never stopping", "Following financial news closely", "Trading at the right moments"], answer: 1, explain: "Contribution years compound. The habit (automatic monthly buying, decade after decade) swamps every clever move.", gen: { variants: [{ prompt: "Two investors: one starts at 25 with boring index funds, one starts at 40 picking winners. Usually richer at 65?", options: ["The early boring one", "The stock picker", "Identical", "Impossible to say"], answer: 0, explain: "Time in the market compounds. Starting early is the superpower." }] } },
                { type: "concept", heading: "Automate the buying too", body: "A fixed amount invested every month (dollar-cost averaging) buys more shares when prices are low and fewer when high, and removes the temptation to guess. Boring, again, wins." },
              ],
            },
            {
              title: "Big purchases, clear eyes",
              keywords: ["finance", "rent", "buy", "house", "car", "mortgage", "purchase", "ownership"],
              steps: [
                { type: "concept", heading: "The sticker lies", body: "Big purchases drag hidden costs behind them: interest, insurance, maintenance, and the returns the money could have earned elsewhere. Compare total monthly cost of ownership, never price tags." },
                { type: "worked", heading: "What the car really costs", problem: "A $28,000 car on a 5-year loan at 7%. What's the honest monthly number?", steps: ["The loan payment alone: about $554 a month.", "Now the passengers: insurance ~$120, fuel ~$150, maintenance ~$80.", "Honest total: roughly $904 a month. 63% more than the payment the dealer quoted.", "Run this BEFORE falling in love with the car; the loan officer won't run it for you."], takeaway: "The purchase costs the payment plus everything it drags along." },
                { type: "numeric", prompt: "Payment $554, insurance $120, fuel $150, upkeep $80. Total monthly cost in dollars?", answer: 904, tolerance: 0, explain: "The all-in number is the one your budget actually feels.", gen: { vars: { p: [354, 654, 50], i: [80, 160, 20], f: [100, 200, 25], u: [50, 120, 10] }, answer: "p + i + f + u", round: 0, prompt: "Payment ${p}, insurance ${i}, fuel ${f}, upkeep ${u}. Total monthly cost in dollars?", explain: "The all-in number, {A}, is the one your budget actually feels." } },
                { type: "mcq", prompt: "“Renting is throwing money away.” That framing is…", options: ["Always true", "Never true", "False as stated, rent buys flexibility and skips ownership costs; compare total costs to total costs", "True only in big cities"], answer: 2, explain: "Owners 'throw away' interest, taxes, insurance and repairs. Sometimes buying wins, sometimes renting does, only the full comparison tells you which.", gen: { variants: [{ prompt: "\"A house is always a better investment than renting.\" That claim…", options: ["Ignores ownership costs and flexibility. Compare totals to totals", "Is simply true", "Is true outside cities", "Is a law of economics"], answer: 0, explain: "Maintenance, taxes, interest, and mobility all belong in the comparison." }] } },
                { type: "numeric", prompt: "Houses need roughly 1% of their value in yearly maintenance. On a $300,000 home, that's how many dollars a year?", answer: 3000, tolerance: 0, explain: "$250 a month, forever, that renters never see, one of several lines the mortgage payment doesn't mention.", gen: { vars: { V: [200000, 500000, 50000] }, answer: "V/100", round: 0, show: { m: "V/1200" }, prompt: "Houses need roughly 1% of their value in yearly maintenance. On a ${V} home, that's how many dollars a year?", explain: "About ${m} a month, forever, that renters never see, one of several lines the mortgage payment doesn't mention." } },
                { type: "concept", heading: "The scare test", body: "If the honest all-in monthly number makes you flinch, the purchase is too big. No matter what the lender approved. Lenders approve maximums; budgets approve purchases." },
              ],
            },
            {
              title: "Insurance and taxes, calmly",
              keywords: ["finance", "insurance", "taxes", "tax", "brackets", "deductible", "premium"],
              steps: [
                { type: "concept", heading: "Two subjects, one idea each", body: "Insurance: pay a small certain cost to delete a ruinous one, insure catastrophes, never annoyances. Taxes: brackets are marginal, so a raise can never make you take home less. Most money fear dissolves with those two sentences." },
                { type: "worked", heading: "The bracket myth, killed", problem: "Your raise 'pushes you into the 30% bracket.' Did the raise backfire?", steps: ["Brackets tax slices, not your whole income. Say 20% applies below $50,000 and 30% above.", "On a $52,000 income, the first $50,000 is still taxed at 20%, so $10,000.", "Only the $2,000 slice above the line pays 30%, so $600.", "Total $10,600, not $15,600. The raise put money in your pocket, as raises always do."], takeaway: "Brackets tax the slice above the line, never the whole pie." },
                { type: "numeric", prompt: "20% below $50,000 and 30% above. Total tax on $52,000, in dollars?", answer: 10600, tolerance: 0, explain: "50,000 × 0.20 + 2,000 × 0.30 = 10,000 + 600.", gen: { vars: { I: [51000, 58000, 1000] }, answer: "10000 + (I-50000)*0.3", round: 0, show: { ex: "I-50000", t: "(I-50000)*0.3" }, prompt: "20% below $50,000 and 30% above. Total tax on ${I}, in dollars?", explain: "50,000 × 0.20 + {ex} × 0.30 = 10,000 + {t}." } },
                { type: "mcq", prompt: "Which of these deserves full insurance coverage?", options: ["A cracked phone screen", "Concert tickets", "The liability if your car injures someone", "A late package"], answer: 2, explain: "Liability can be ruin. That's what insurance is FOR. The small stuff you self-insure with the emergency fund and come out ahead on average.", gen: { variants: [{ prompt: "Which risk is worth real insurance money?", options: ["Your house burning down", "A scratched bumper", "A lost umbrella", "Concert tickets"], answer: 0, explain: "Insure what would ruin you. Absorb what would merely annoy you." }] } },
                { type: "mcq", prompt: "Raising your deductible generally…", options: ["Raises your premium", "Lowers your premium. You keep the small risks yourself", "Is not allowed", "Changes nothing"], answer: 1, explain: "You're telling the insurer 'I'll handle the annoyances, you handle the catastrophes', the correct division of labor, priced accordingly.", gen: { variants: [{ prompt: "Choosing a higher deductible means…", options: ["Lower premiums. You self-insure the small stuff", "Higher premiums", "No claims allowed", "More paperwork only"], answer: 0, explain: "You keep the small risks yourself and pay less for covering the big one." }] } },
                { type: "concept", heading: "The annual half hour", body: "Once a year: check tax withholding, deductibles, and coverage against your actual life. Thirty minutes, and it routinely finds real money." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sheets",
      subject: "Spreadsheets",
      level: "Beginner",
      title: "Spreadsheet thinking",
      units: [
        {
          title: "Cells and formulas",
          lessons: [
            {
              title: "A grid of little machines",
              keywords: ["spreadsheet", "spreadsheets", "excel", "sheets", "cells", "formulas", "grid", "basics"],
              steps: [
                { type: "concept", heading: "Cells compute", body: "A cell holds either a value or a formula. Formulas start with = and reference other cells by address: =A1*A2. Change an input and everything downstream recomputes instantly. That recomputation is the entire superpower." },
                { type: "worked", heading: "Your first living model", problem: "Price in A1 is 20, quantity in A2 is 3. Build a total that stays correct.", steps: ["In A3, type =A1*A2, not 60. The formula shows 60, but it STORES the relationship.", "Change A2 to 5: A3 becomes 100 by itself. No re-typing, no stale numbers.", "That's the discipline: type inputs once, compute everything else.", "A spreadsheet where results are typed by hand is just graph paper with extra steps."], takeaway: "Never type a number you could compute, reference it." },
                { type: "numeric", prompt: "A1 holds 20, A2 holds 3, and A3 holds =A1*A2. What does A3 display?", answer: 60, tolerance: 0, explain: "The formula multiplies whatever those cells hold right now, change either and A3 follows.", gen: { vars: { a: [3, 20, 1], b: [2, 9, 1] }, answer: "a*b", round: 0, prompt: "A1 holds {a}, A2 holds {b}, and A3 holds =A1*A2. What does A3 display?", explain: "The formula multiplies whatever those cells hold right now, change either and A3 follows." } },
                { type: "mcq", prompt: "What makes a cell's content a formula instead of text?", options: ["Making it bold", "Starting it with =", "Ending it with a semicolon", "Coloring the cell"], answer: 1, explain: "The leading = is the switch. Without it, A1*A2 is just nine characters of text.", gen: { variants: [{ prompt: "Typing 5+3 into a cell, with no equals sign, shows…", options: ["The text 5+3", "8", "An error", "0"], answer: 0, explain: "Without = the cell is just text. The equals sign starts computation." }] } },
                { type: "numeric", prompt: "B1 = 100, B2 = =B1*0.2, B3 = =B1-B2. What does B3 show?", answer: 80, tolerance: 0, explain: "B2 computes 20, then B3 computes 100 − 20. Chains of small formulas beat one giant one.", gen: { vars: { B: [100, 400, 100], p: [10, 30, 10] }, answer: "B - B*p/100", round: 0, show: { pd: "p/100", b2: "B*p/100" }, prompt: "B1 = {B}, B2 = =B1*{pd}, B3 = =B1-B2. What does B3 show?", explain: "B2 computes {b2}, then B3 computes {B} − {b2}. Chains of small formulas beat one giant one." } },
                { type: "concept", heading: "Label your inputs", body: "Put 'Tax rate' next to the cell that holds it. Future-you, opening this sheet in six months, is the most important user you'll ever design for." },
              ],
            },
            {
              title: "References that copy right",
              keywords: ["spreadsheet", "excel", "sheets", "references", "absolute", "relative", "dollar", "copy", "fill"],
              steps: [
                { type: "concept", heading: "References move, unless you pin them", body: "Copy =A2*B2 down one row and it becomes =A3*B3: references are relative by default, which is what lets one formula fill a thousand rows. A dollar sign pins a part in place: $E$1 never moves." },
                { type: "worked", heading: "The tax column", problem: "Column B holds prices; E1 holds the tax rate. Fill column C with the tax for every row.", steps: ["In C2, write =B2*$E$1. B2 relative, the rate pinned.", "Copy it down: row by row it becomes =B3*$E$1, =B4*$E$1… each row's price, one shared rate.", "Without the $s, row 3 would grab E2, an empty cell, and the errors would march quietly down the column.", "Change E1 once and every row's tax updates. One input, one truth."], takeaway: "Pin what's shared, let the row data float." },
                { type: "mcq", prompt: "=B2*E1 copied from row 2 down to row 3 becomes…", options: ["=B3*E2", "=B2*E1", "=B3*E1", "=B2*E2"], answer: 0, explain: "Everything unpinned shifts with the copy. BOTH references moved down one row. That's the bug the $ exists to prevent.", gen: { variants: [{ prompt: "=A2+C2 copied from row 2 to row 5 becomes…", options: ["=A5+C5", "=A2+C2", "=A5+C2", "=E5+G5"], answer: 0, explain: "Relative references slide with the copy. That is fill-down's whole magic." }] } },
                { type: "mcq", prompt: "To keep the rate in E1 fixed while filling down, write…", options: ["=B2*$E$1", "=$B$2*E1", "=B2*E1, then paste twice", "=B$2*$E1"], answer: 0, explain: "Pin the shared cell, leave the per-row cell free. Pinning B2 instead would multiply every row by row 2's price.", gen: { variants: [{ prompt: "In $E$1, the dollar signs mean…", options: ["Neither the column nor the row moves when copied", "Currency formatting", "The cell is locked from editing", "A named range"], answer: 0, explain: "The dollars pin the reference. Copy it anywhere and it still points at E1." }] } },
                { type: "order", prompt: "Fill a computed column the professional way.", items: ["Write the formula once in the top data row", "Pin the shared cells with $", "Drag or copy it down the column", "Spot-check the last row's references"], explain: "The last-row check takes five seconds and catches every misplaced pin.", codeItems: false },
                { type: "concept", heading: "Broken copies tell you why", body: "When a filled formula misbehaves, click it and read where its references landed. The grid always shows you exactly what it did, spreadsheet debugging is mostly just looking." },
              ],
            },
            {
              title: "Functions do the heavy lifting",
              keywords: ["spreadsheet", "excel", "sheets", "functions", "sum", "average", "count", "min", "max", "range"],
              steps: [
                { type: "concept", heading: "Ranges answer questions", body: "A1:A10 names ten cells at once, and functions consume ranges whole: =SUM(A1:A10), =AVERAGE(...), =MAX(...), =COUNT(...). One range, many questions." },
                { type: "numeric", prompt: "Four cells hold 4, 8, 6, 2. What does =AVERAGE of that range return?", answer: 5, tolerance: 0, explain: "(4+8+6+2) ÷ 4 = 5." },
                { type: "worked", heading: "A report in four formulas", problem: "Daily sales live in B2:B31. Build the monthly summary.", steps: ["Total: =SUM(B2:B31).", "Typical day: =AVERAGE(B2:B31).", "Best day: =MAX(B2:B31).", "Days recorded: =COUNT(B2:B31), and if that says 27 in a 30-day month, you've just found three missing entries. Summaries audit the data for free."], takeaway: "Point functions at the range; let them do the arithmetic AND the auditing." },
                { type: "mcq", prompt: "=COUNT over cells holding 3, “dog”, 7, a blank, 5 returns…", options: ["5", "4", "3", "2"], answer: 2, explain: "COUNT counts numbers only: 3, 7, 5. (COUNTA would count the text too, different tool, different question.)", gen: { variants: [{ prompt: "=COUNTA over cells holding 3, “dog”, 7, a blank, 5 returns…", options: ["4", "3", "5", "2"], answer: 0, explain: "COUNTA counts everything non-blank. COUNT counts only the numbers." }] } },
                { type: "numeric", prompt: "=SUM over cells holding 10, 20, 30, 40?", answer: 100, tolerance: 0, explain: "Ranges grow with your data, insert rows inside the range and the SUM stretches to keep them." },
                { type: "concept", heading: "Functions compose", body: "=SUM(A:A)/COUNT(A:A) rebuilds AVERAGE from parts. Knowing the pieces means you can construct answers no single function offers." },
              ],
            },
          ],
        },
        {
          title: "Thinking in tables",
          lessons: [
            {
              title: "IF makes it decide",
              keywords: ["spreadsheet", "excel", "sheets", "if", "logic", "conditional", "countif", "sumif"],
              steps: [
                { type: "concept", heading: "Formulas with opinions", body: "=IF(test, then, else) lets a cell decide: =IF(B2>100, “big”, “small”). Their cousins COUNTIF and SUMIF aggregate only the rows matching a condition, decisions at column scale." },
                { type: "worked", heading: "Flag the late invoices", problem: "Column C holds days outstanding. Flag the late ones and count them.", steps: ["In D2: =IF(C2>30, “LATE”, “OK”). Then fill it down the column.", "Every row now labels itself, and relabels itself the moment C changes.", "Count the damage in one cell: =COUNTIF(D:D, “LATE”).", "Sum what's owed on them: =SUMIF(D:D, “LATE”, B:B) adds column B only where D says LATE."], takeaway: "IF labels the rows; COUNTIF and SUMIF read the labels." },
                { type: "mcq", prompt: "=IF(B2>=50, “PASS”, “FAIL”) with B2 holding exactly 50 shows…", options: ["PASS", "FAIL", "50", "An error"], answer: 0, explain: ">= includes the boundary. Off-by-one conditions are the classic spreadsheet bug, read the operator like a lawyer.", gen: { variants: [{ prompt: "=IF(B2>50, “HIGH”, “LOW”) with B2 holding exactly 50 shows…", options: ["LOW", "HIGH", "50", "An error"], answer: 0, explain: "Greater-than excludes the boundary. Use >= to include it." }] } },
                { type: "numeric", prompt: "A label column holds “LATE” 12 times among 40 rows. What does =COUNTIF(range, “LATE”) return?", answer: 12, tolerance: 0, explain: "It counts matches only, the other 28 rows simply don't qualify.", gen: { vars: { n: [7, 19, 1], R: [30, 60, 10] }, answer: "n", round: 0, show: { rest: "R-n" }, prompt: "A label column holds “LATE” {n} times among {R} rows. What does =COUNTIF(range, “LATE”) return?", explain: "It counts matches only, the other {rest} rows simply don't qualify." } },
                { type: "numeric", prompt: "SUMIF adds amounts where status is “paid”. The paid amounts are 200, 450 and 350. Result?", answer: 1000, tolerance: 0, explain: "Conditional sums answer real business questions: how much of the money is actually in?", gen: { vars: { x: [100, 400, 50], y: [150, 450, 50], z: [200, 500, 50] }, answer: "x + y + z", round: 0, prompt: "SUMIF adds amounts where status is “paid”. The paid amounts are {x}, {y} and {z}. Result?", explain: "{x} + {y} + {z} = {A}. Conditional sums answer real business questions: how much of the money is actually in?" } },
                { type: "concept", heading: "Know when IF has lost", body: "An IF inside an IF inside an IF is unreadable by Thursday. Three levels deep means you want a lookup table instead, one column of cases, one of answers." },
              ],
            },
            {
              title: "Sort, filter, one clean table",
              keywords: ["spreadsheet", "excel", "sheets", "sort", "filter", "table", "data", "rows", "columns"],
              steps: [
                { type: "concept", heading: "The one-table rule", body: "One row = one record. One column = one attribute. No merged cells, no blank rows, no totals living inside the data. Keep that rectangle clean and sorting, filtering and pivots all just work, break it and every tool misbehaves." },
                { type: "mcq", prompt: "Which of these quietly breaks sorting?", options: ["Bold column headers", "Merged title cells and blank rows inside the data", "Having many rows", "Lowercase text"], answer: 1, explain: "Sort treats blank rows as table boundaries and refuses to move merged cells. The damage appears later, as scrambled rows nobody can explain.", gen: { variants: [{ prompt: "Before sorting, the safest table has…", options: ["One header row, no merged cells, no blank rows inside", "Merged title banners", "Blank spacer rows for looks", "Totals mixed into the data"], answer: 0, explain: "Sorting trusts the rectangle. Decorations break the rectangle." }] } },
                { type: "worked", heading: "Untangle a messy sheet", problem: "You inherit a sheet with a merged title, gaps between sections, and a totals row in the middle. Make it usable.", steps: ["Unmerge everything; move the title above the table or into the tab name.", "One header row, then pure data, delete the decorative blank rows.", "Evict the totals: summaries live BELOW the rectangle or on their own sheet.", "Now sort, filter and pivot all work, the mess wasn't the data, it was the formatting living inside it."], takeaway: "Data lives in a clean rectangle; presentation lives somewhere else." },
                { type: "order", prompt: "Answer “who are our top five customers?” fast.", items: ["Confirm the table is one clean rectangle", "Sort by amount, largest first", "Read the top five rows", "Filter by region when they ask the follow-up"], explain: "On a clean table this is a ten-second question. On a messy one it's an afternoon.", codeItems: false },
                { type: "mcq", prompt: "Filters hide rows or delete them?", options: ["Delete them", "Hide them, the data is all still there", "Move them to another sheet", "Depends on the app"], answer: 1, explain: "A filter is a lens, not a knife. Clear it and everything returns, which also means a SUM may include rows you've filtered out of sight.", gen: { variants: [{ prompt: "You filter to Region = North and print. The other rows are…", options: ["Still in the file, just hidden", "Deleted", "Moved to a backup sheet", "Corrupted"], answer: 0, explain: "A filter is a view, not surgery." }] } },
                { type: "concept", heading: "Totals are parasites", body: "A totals row inside the data gets sorted into the middle, double-counted by SUMs, and swallowed by pivots. Keep summaries outside the rectangle, always." },
              ],
            },
            {
              title: "Pivot thinking",
              keywords: ["spreadsheet", "excel", "sheets", "pivot", "tables", "summarize", "group", "report"],
              steps: [
                { type: "concept", heading: "“X by Y” is a pivot", body: "Total sales BY region. Average ticket BY month. Any question with 'by' in it is a pivot table: drag the grouping field to Rows, the number to Values, done. It's GROUP BY for people who don't write SQL." },
                { type: "worked", heading: "Sales by region in four drags", problem: "A thousand rows of raw sales: date, region, amount. The boss wants totals by region, by month.", steps: ["Insert a pivot from the clean rectangle.", "Drag Region to Rows, and one line per region appears.", "Drag Amount to Values as Sum, and the totals fill in.", "Drag Month to Columns and the report becomes a region × month matrix. Four drags, zero formulas."], takeaway: "Say the sentence (“amount by region by month”) and you've said the pivot layout." },
                { type: "mcq", prompt: "Which question is pivot-shaped?", options: ["What's in cell F13?", "What are total sales by month, by region?", "Is this cell bold?", "How do I merge two cells?"], answer: 1, explain: "Grouping + aggregating across many rows is exactly what pivots exist for. Single-cell questions never are.", gen: { variants: [{ prompt: "\"Average order size per salesperson per quarter\" is a job for…", options: ["A pivot table", "Retyping into a new sheet", "Bold formatting", "One giant formula"], answer: 0, explain: "Two categories plus an aggregate is exactly the pivot shape." }] } },
                { type: "numeric", prompt: "The North region's rows hold 120, 80 and 200. What does the pivot's Sum show for North?", answer: 400, tolerance: 0, explain: "The pivot did =SUMIF for you, for every region at once, with none of the formulas.", gen: { vars: { x: [60, 180, 20], y: [40, 160, 20], z: [100, 300, 50] }, answer: "x + y + z", round: 0, prompt: "The North region's rows hold {x}, {y} and {z}. What does the pivot's Sum show for North?", explain: "The pivot did =SUMIF for you, for every region at once, with none of the formulas." } },
                { type: "order", prompt: "From raw rows to an answer.", items: ["Clean the source into one rectangle", "Insert a pivot table from it", "Drag the grouping field to Rows", "Drag the number to Values as Sum"], explain: "Step one is where pivots are won or lost, a pivot on a messy table confidently reports nonsense.", codeItems: false },
                { type: "concept", heading: "Refresh, don't rebuild", body: "New rows in the source? Refresh the pivot and the report updates. People who recompute summaries by hand every week are doing the machine's job on the machine's behalf." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "writing",
      subject: "Writing",
      level: "Beginner",
      title: "Writing that works",
      units: [
        {
          title: "Sentences and paragraphs",
          lessons: [
            {
              title: "Cut the fog",
              keywords: ["writing", "clarity", "concise", "editing", "plain", "words", "sentences"],
              steps: [
                { type: "concept", heading: "Fog has a recipe", body: "Foggy writing buries the actor and the action: verbs become nouns (“made a decision”), padding creeps in (“in order to”), and the doer hides behind passive voice. Clear writing is the reverse: someone does something, in as few words as that takes." },
                { type: "worked", heading: "Defog one sentence", problem: "“It is important to note that a decision was made by the team to implement a delay to the launch.” Fix it.", steps: ["Cut the throat-clearing: “It is important to note that” says nothing, delete.", "Find the actor hiding in the passive: the team.", "Un-noun the verbs: “made a decision to implement a delay” is just “delayed”.", "Result: “The team delayed the launch.” Eighteen words became five, and got stronger."], takeaway: "Who did what. Then stop." },
                { type: "mcq", prompt: "Pick the strongest sentence.", options: ["A delay was implemented by us", "We delayed the launch", "It was decided that launching later was optimal", "The launch experienced a delay"], answer: 1, explain: "Actor, verb, object. The others hide who decided, which readers notice, and quietly distrust.", gen: { variants: [{ prompt: "Pick the strongest sentence.", options: ["The committee rejected the proposal", "The proposal was not moved forward by the committee", "A rejection of the proposal occurred", "It was determined the proposal would not proceed"], answer: 0, explain: "Actor, verb, object. The others bury the doer." }] } },
                { type: "mcq", prompt: "“In order to” should almost always become…", options: ["“so as to”", "“to”", "“for the purpose of”", "“with a view to”"], answer: 1, explain: "Two free words in every sentence that carries the phrase. Padding compounds like interest, in the wrong direction.", gen: { variants: [{ prompt: "“At this point in time” should almost always become…", options: ["“now”", "“currently ongoing”", "“at the present time”", "“in the current timeframe”"], answer: 0, explain: "Say now. Fog phrases add syllables, not meaning." }] } },
                { type: "order", prompt: "An editing pass that works.", items: ["Write the ugly first draft fast", "Cut every word that adds nothing", "Swap weak verb phrases for strong verbs", "Read it aloud once"], explain: "Drafting and editing are different mental modes, doing them simultaneously does both badly.", codeItems: false },
                { type: "concept", heading: "Short is generous", body: "Concise writing isn't dumbed down. It's the writer doing the work so the reader doesn't have to. Every deleted word is a small gift." },
              ],
            },
            {
              title: "One idea per paragraph",
              keywords: ["writing", "paragraphs", "structure", "topic", "sentences", "flow"],
              steps: [
                { type: "concept", heading: "Paragraphs are units of thought", body: "One paragraph, one idea. The first sentence states it; the rest support it. Readers skim first sentences, so read yours in sequence, alone: if they don't carry the argument, the piece has no skeleton." },
                { type: "order", prompt: "The anatomy of a strong paragraph.", items: ["State the point", "Give the evidence or example", "Handle the obvious objection", "Hand off to the next point"], explain: "Not every paragraph needs all four, but the point always comes first, because skimmers only get that far.", codeItems: false },
                { type: "worked", heading: "Fix a wandering paragraph", problem: "One paragraph discusses the budget, then the timeline, then hiring. Repair it.", steps: ["Name what's crammed in: three separate ideas sharing one paragraph.", "Give each its own paragraph, a wandering paragraph is several paragraphs in a trench coat.", "Write each one's topic sentence so it can stand alone.", "Reorder them so each 'so what?' is answered by what follows."], takeaway: "When a paragraph wanders, split it, don't polish it." },
                { type: "mcq", prompt: "Readers of workplace writing mostly read…", options: ["Every word, carefully", "First sentences, headings, and anything bold", "The middle paragraphs", "The attachments"], answer: 1, explain: "Write for how people actually read: front-load every paragraph, and make the skeleton carry the message.", gen: { variants: [{ prompt: "You have one sentence you NEED read. Put it…", options: ["First in its paragraph, ideally bold or as a heading", "In the middle where it flows", "In a footnote", "In the attachment"], answer: 0, explain: "Skimmers hit first sentences and anything that stands out." }] } },
                { type: "mcq", prompt: "Pick the best topic sentence.", options: ["There are several considerations.", "This section discusses timing.", "Shipping in March costs us the holiday season.", "As mentioned above…"], answer: 2, explain: "It makes a claim someone could disagree with, which is exactly what earns the reader's next thirty seconds.", gen: { variants: [{ prompt: "Pick the best topic sentence.", options: ["Hiring two engineers now saves us $200k in contractors next year.", "This paragraph is about hiring.", "There are many factors to consider.", "As previously noted…"], answer: 0, explain: "Lead with the claim, then support it." }] } },
                { type: "concept", heading: "The “so what” test", body: "After each paragraph, ask “so what?”, the next paragraph should be the answer. Where it isn't, you've found the reorder your draft needs." },
              ],
            },
            {
              title: "Emails people answer",
              keywords: ["writing", "email", "emails", "subject", "request", "reply", "work", "inbox"],
              steps: [
                { type: "concept", heading: "An email is one request", body: "The subject line names the ask and the deadline. The first line makes the request. Everything below is supporting detail for whoever wants it. Bury the ask in paragraph three and you've written a mystery, not a message." },
                { type: "worked", heading: "Rewrite the ramble", problem: "A four-paragraph update that eventually wonders about the venue decision. Make it answerable.", steps: ["Subject: “Decision needed by Fri: venue A or B?”, the whole email in one line.", "First line: “Can you pick a venue by Friday? Details below.”", "Bullets: A, $2,000, holds 80. B, $2,600, holds 120.", "Close with a default: “If I don't hear by Friday, I'll book A.” Now even silence produces progress."], takeaway: "Ask in line one; details below; deadline and default explicit." },
                { type: "mcq", prompt: "Best subject line?", options: ["Hello", "Quick question", "Approve venue budget by Friday?", "Following up"], answer: 2, explain: "It carries the ask AND the deadline before the email is even opened, the recipient can triage it from the inbox list.", gen: { variants: [{ prompt: "Best subject line?", options: ["Sign contract by Thursday 5pm?", "Touching base", "Important", "Re: re: re: stuff"], answer: 0, explain: "The ask and the deadline, visible before the email is even opened." }] } },
                { type: "mcq", prompt: "How many asks per email?", options: ["As many as needed", "One, or a numbered list announced up front", "Zero; meetings are better", "At least three for efficiency"], answer: 1, explain: "Multiple buried asks get one answered and the rest forgotten. If you truly need three, number them and say 'three requests' in line one.", gen: { variants: [{ prompt: "Your email needs three approvals. Structure it as…", options: ["A numbered list of the three asks, announced in the first line", "Three subtle paragraphs", "Three separate threads, always", "One request to \"review everything\""], answer: 0, explain: "Number them and say there are three. Unnumbered asks get half-answered." }] } },
                { type: "order", prompt: "Assemble a reply-friendly email.", items: ["Subject states the ask and the deadline", "First line makes the request", "Bullets carry the supporting details", "Close with the default if no reply comes"], explain: "The default is the secret weapon: it converts non-responses from blockers into decisions.", codeItems: false },
                { type: "concept", heading: "Make yes cheap", body: "The easier the yes, the faster it arrives. Propose, don't open-endedly inquire: “Shall I book A?” beats “thoughts on venues?” every single time." },
              ],
            },
          ],
        },
        {
          title: "Bigger pieces",
          lessons: [
            {
              title: "Structure before sentences",
              keywords: ["writing", "outline", "structure", "argument", "document", "memo", "bluf"],
              steps: [
                { type: "concept", heading: "Documents fail at the skeleton", body: "Weak documents aren't weak because of their sentences, the order is wrong. Lead with the conclusion (BLUF: bottom line up front), then the reasons, then the detail. Readers decide how deep to go; every depth gets a complete story." },
                { type: "order", prompt: "Build a memo in the order pros do.", items: ["Write the one-sentence conclusion first", "List the three reasons that support it", "Attach evidence under each reason", "Only then polish the sentences"], explain: "Polishing sentences on a broken skeleton is repainting a house with no foundation.", codeItems: false },
                { type: "mcq", prompt: "Where does the recommendation go in a business memo?", options: ["Last (build to the reveal)", "First (readers choose their own depth)", "In the middle, cushioned", "In a separate email"], answer: 1, explain: "The mystery-novel structure serves detective fiction, not decisions. Executives read the first paragraph and skim the rest, put the answer where they'll be.", gen: { variants: [{ prompt: "Your report's key finding belongs…", options: ["In the first paragraph, then the detail", "At the end, as a reveal", "In an appendix", "Wherever it fits"], answer: 0, explain: "Bottom line up front. Readers choose their own depth." }] } },
                { type: "worked", heading: "A proposal in six lines", problem: "You need a one-page proposal by lunch. Outline it.", steps: ["Line 1, the conclusion: “We should switch supplier to X, saving $40k a year.”", "Lines 2-4, three reasons, one line each: cost, reliability, terms.", "Line 5, the risk and its mitigation, honestly: “Switching costs ~$5k; paid back in two months.”", "Line 6, the ask: “Approve by Friday to hit the Q4 window.” The document is now 80% done and 100% structured."], takeaway: "A finished outline is a draft wearing bullet points." },
                { type: "mcq", prompt: "“Context, context, context… conclusion at the very end” best suits…", options: ["Busy executives", "Detective novels", "Status updates", "All memos"], answer: 1, explain: "Suspense is a feature in fiction and a bug in business writing.", gen: { variants: [{ prompt: "The mystery-novel structure, evidence first and verdict last, is right for…", options: ["Fiction, not business memos", "Executive briefings", "Status updates", "Everything"], answer: 0, explain: "Executives read paragraph one and skim. Give the verdict first." }] } },
                { type: "concept", heading: "Writing is thinking, exposed", body: "If the outline won't hold together, no quantity of nice sentences will save it, and discovering that in six bullet lines costs an hour less than discovering it in six polished paragraphs." },
              ],
            },
            {
              title: "Write for the skimmer",
              keywords: ["writing", "headings", "formatting", "bullets", "scannable", "readers", "layout"],
              steps: [
                { type: "concept", heading: "Format is information", body: "Headings, bullets, and bolding aren't decoration, they're a second, faster copy of your argument. A skimmer should reconstruct your whole case from headings and bolds alone. Design for that reader; the careful reader gets everything anyway." },
                { type: "mcq", prompt: "Which heading actually helps a skimmer?", options: ["Section 3", "Additional considerations", "Costs: $40k now, $12k a year after", "Miscellaneous"], answer: 2, explain: "Headings that state findings turn the document's skeleton into its summary. Topic labels make the reader dig for what you already know.", gen: { variants: [{ prompt: "Which heading helps a skimmer most?", options: ["Timeline: live March 3, code freeze February 20", "Overview", "Further details", "Part two"], answer: 0, explain: "Headings that carry the content let the skeleton tell the story." }] } },
                { type: "worked", heading: "Rescue a wall of text", problem: "A dense one-page block of prose nobody finishes. Make it scannable.", steps: ["Split it into one-idea paragraphs and read the first sentences alone, fix any that don't carry.", "Turn the list hiding in the prose (“first… also… finally…”) into actual bullets.", "Rewrite headings to state findings, not topics.", "Bold exactly one thing: the decision. Bold ten things and you've bolded none."], takeaway: "Give the skimmer a complete argument in headings, bullets, and one bold line." },
                { type: "order", prompt: "The scannability pass, in order.", items: ["Break the wall into one-idea paragraphs", "Make headings state findings, not topics", "Bullet the parallel items", "Bold one decision, not ten"], explain: "Same law as visual design: emphasis is a budget, and spending it everywhere spends it nowhere.", codeItems: false },
                { type: "mcq", prompt: "Over-bolding a document…", options: ["Emphasizes everything", "Emphasizes nothing", "Is required in memos", "Helps search engines"], answer: 1, explain: "Emphasis works by contrast. The tenth bold phrase costs the first nine their power.", gen: { variants: [{ prompt: "Highlighting every other sentence in yellow…", options: ["Makes nothing stand out", "Doubles retention", "Is standard practice", "Helps navigation"], answer: 0, explain: "Emphasis spends contrast. Spend it on one thing per section." }] } },
                { type: "concept", heading: "Respect is measured in seconds", body: "Every formatting choice either saves the reader time or spends it. Scannable writing is simply courtesy, made visible." },
              ],
            },
            {
              title: "Revise like an editor",
              keywords: ["writing", "revision", "editing", "drafts", "feedback", "rewrite", "proofread"],
              steps: [
                { type: "concept", heading: "Two hats, never together", body: "Drafting wants speed and zero judgment; editing wants cold ruthlessness. Wearing both hats at once produces slow drafts AND soft edits. Write ugly and fast. Then return later as the editor who owes the writer nothing." },
                { type: "order", prompt: "Revision passes, largest problems first.", items: ["Structure: is the order right?", "Argument: does every claim have support?", "Sentences: cut fog, strengthen verbs", "Proof: read it aloud, slowly, once"], explain: "Sentence-polishing a paragraph you'll delete in the structure pass is the most common way to waste an editing hour.", codeItems: false },
                { type: "mcq", prompt: "The best first-draft strategy is…", options: ["Polish each sentence before writing the next", "Write it ugly and fast, edit later", "Start with the formatting", "Wait for inspiration"], answer: 1, explain: "A complete bad draft can be fixed this afternoon. A perfect first paragraph attached to nothing cannot.", gen: { variants: [{ prompt: "You are stuck on the opening paragraph. The move is…", options: ["Write a bad version fast and fix it in revision", "Wait for a better mood", "Perfect it before continuing", "Start with the fonts"], answer: 0, explain: "Drafting and editing are different jobs. Do them separately." }] } },
                { type: "worked", heading: "The 20% cut", problem: "A 200-word paragraph that feels fine. Cut a fifth of it without losing meaning.", steps: ["Hunt the hedges first: very, quite, rather, “I think”, “it seems”, delete them all.", "Collapse duplicates: writers say important things twice; keep the better one, in slightly different words.", "Split any sentence carrying two ideas; one of them usually turns out disposable.", "Result: ~160 words, and every surviving sentence hits harder. The cut didn't shrink the meaning. It concentrated it."], takeaway: "Every draft ships 20% lighter than it arrived, and better for it." },
                { type: "mcq", prompt: "Reading your draft aloud catches…", options: ["Nothing, sentences are visual", "Rhythm problems, missing words, and fog your eyes skip over", "Only typos", "Grammar rules"], answer: 1, explain: "Your eye autocorrects; your ear doesn't. It's the cheapest professional edit that exists.", gen: { variants: [{ prompt: "The cheapest editing tool you own is…", options: ["Reading the draft aloud", "A thesaurus", "Longer sentences", "More adjectives"], answer: 0, explain: "Your ear catches rhythm problems and missing words your eyes autocorrect." }] } },
                { type: "concept", heading: "Ask for confusion, not compliments", body: "“Did you like it?” gets politeness. “Where did you slow down or get lost?” gets the map of exactly what to fix. Readers always know where the fog is. They just need permission to say so." },
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
    { label: "Personal finance", course: "money", u: 0, l: 0, topic: "Personal finance" },
    { label: "Spreadsheets", course: "sheets", u: 0, l: 0, topic: "Spreadsheets" },
    { label: "Clear writing", course: "writing", u: 0, l: 0, topic: "Writing" },
  ],
};
