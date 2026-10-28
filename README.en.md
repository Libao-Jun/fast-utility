# fast-utility

> A lightweight, zero-dependency, tree-shaking-friendly JavaScript / TypeScript utility library.

English | [简体中文](./README.md)

fast-utility gathers the helpers you keep rewriting into one place: type checks, date & time, number and currency formatting, string manipulation, array and object operations, deep cloning, storage and cookies, browser helpers, debounce/throttle, async control, math and validators — 178 functions in total. Every function is imported by name from the package root, so you only ship what you use.

## ✨ Features

- **Zero runtime dependencies**: the install size is just this library.
- **Tree-shaking friendly**: each function is exported independently; unused ones never reach your bundle.
- **Complete types**: ships `.d.ts`. The `is*` family are type guards that narrow types inside `if`.
- **Runs everywhere**: pure-logic functions work in both browser and Node; DOM-dependent functions are grouped and labelled separately.

## Installation

```bash
pnpm add fast-utility
# or: npm install fast-utility / yarn add fast-utility
```

## Quick start

```ts
import { isArray, isDef, formatFull, formatRmb, localGet, localSet, debounce } from "fast-utility";

// Type guards: types narrow inside the if block
const list: unknown = [1, 2, 3];
if (isArray(list) && isDef(list[0])) list.length;

// Dates and currency
formatFull(new Date(2026, 8, 20, 14, 30, 5)); // "2026/09/20 14:30:05"
formatRmb(1234.5, { type: "zh-CN", currency: "CNY" }); // "¥1,234.50"

// localStorage: automatic JSON serialization
localSet("user", { name: "张三", age: 18 });
localGet<{ name: string; age: number }>("user"); // { name: "张三", age: 18 }

// Debounce: the returned function has cancel()
const search = debounce((kw: string) => fetch(`/api?q=${kw}`), 300);
search("a");
search("ab"); // fires once, 300ms after typing stops
search.cancel();
```

> All functions are named exports from the package root; there is no default export. Apart from writers (`localSet`, `setCookie`, etc.), functions do not mutate their arguments. Signatures and return types live in `.d.ts`; hover in your editor for the full JSDoc.

## API

12 groups by purpose. Groups marked "browser only" rely on `window` / `document` / `localStorage` / `navigator` and will throw in Node.

### Type checks

Most of the `is*` family are type guards (`v is T`) and can be used directly for narrowing.

| Function | Description | Example |
| --- | --- | --- |
| `isArray(v)` | Whether the value is an array | `isArray([])` → `true` |
| `isObject(v)` | Whether the value is a plain object (excludes arrays, `Date`, `Map`, etc.) | `isObject([])` → `false` |
| `is(v, type)` | Compare against a type name via `Object.prototype.toString` | `is([], "Array")` → `true` |
| `isFunction(v)` | Whether the value is callable | `isFunction(() => {})` → `true` |
| `isAsyncFunction(v)` | Whether the value is an `async` function | `isAsyncFunction(async () => {})` → `true` |
| `isPromise(v)` | Whether the value has a `then` method | `isPromise(Promise.resolve())` → `true` |
| `isDate(v)` | Whether the value is a `Date` | `isDate(new Date())` → `true` |
| `isString(v)` | Whether the value is a string (including boxed objects) | `isString("a")` → `true` |
| `isNumber(v)` | Whether the value is a number; `NaN` returns `false`, `Infinity` returns `true` | `isNumber(NaN)` → `false` |
| `isInt(v)` / `isFloat(v)` | Whether the value is a finite integer / finite float | `isInt(42)` → `true` |
| `isBoolean(v)` | Whether the value is a boolean | `isBoolean(true)` → `true` |
| `isSymbol(v)` | Whether the value is a `Symbol` | `isSymbol(Symbol())` → `true` |
| `isPrimitive(v)` | Whether the value is primitive (not object, not function) | `isPrimitive(1)` → `true` |
| `isBasicType(v)` | Whether the value is a basic type (including `null` / `undefined`) | `isBasicType({})` → `false` |
| `isNull(v)` | Whether the value is `null` | `isNull(null)` → `true` |
| `isDef(v)` / `isUnDef(v)` | Whether the value is defined / undefined | `isDef(0)` → `true` |
| `isNullOrUnDef(v)` | Whether the value is `null` or `undefined` | `isNullOrUnDef(undefined)` → `true` |
| `isNil(v)` | Whether the value is `null` or `undefined` (semantic alias) | `isNil(null)` → `true` |
| `isEmpty(v)` | Whether the value is empty: empty string, array, object, `Map` / `Set`, invalid date, etc. | `isEmpty({})` → `true` |
| `isEmptySv(v)` | Simplified emptiness check (strings, arrays, `Map` / `Set`, `ArrayBuffer` views, objects) | `isEmptySv([])` → `true` |
| `isHexColor(s)` | Whether the value is `#RGB` / `#RRGGBB` | `isHexColor("#fff")` → `true` |
| `isValidEmail(s)` | Loose email validation | `isValidEmail("a@b.com")` → `true` |
| `isPC()` | Whether running in a browser | `false` in Node |
| `isIOS()` | Whether the device is iOS (reads the UA; browser only) | depends on UA |
| `isWindow(v)` | Whether the value is the `window` object | `isWindow(window)` → `true` |
| `isElement(v)` | Whether the value is a DOM element | `isElement(document.body)` → `true` |
| `isError(v)` | Whether the value is an `Error` instance | `isError(new Error())` → `true` |
| `isRegExp(v)` | Whether the value is a regular expression | `isRegExp(/a/)` → `true` |
| `isTypedArray(v)` | Whether the value is a TypedArray (excluding `DataView`) | `isTypedArray(new Uint8Array())` → `true` |

> `isBasicType` is an alias of `isPrimitive` (identical behaviour); `isEmpty` and `isEmptySv` differ on `Date` and `DataView`; `isEmail` is stricter than `isValidEmail` (no `+` or dots in the local part).

### Date & time

| Function | Description | Example |
| --- | --- | --- |
| `timestamp()` | Current timestamp in milliseconds (same as `Date.now()`) | `timestamp()` → `1750000000000` |
| `isToday(d)` | Whether the date is today; `d` may be a `Date`, timestamp or date string | `isToday(new Date())` → `true` |
| `firstDay(y, m)` | First day of the given year/month; `m` is 1–12 | `firstDay(2026, 9)` → `2026-09-01` |
| `lastDay(y, m)` | Last day of the given year/month | `lastDay(2024, 2)` → `2024-02-29` |
| `formatFull(d)` | `YYYY/MM/DD HH:mm:ss` | `formatFull(new Date(2026, 8, 20, 14, 30, 5))` → `"2026/09/20 14:30:05"` |
| `formatFullReplace(d)` | Same as above, hyphen-separated | same input → `"2026-09-20 14:30:05"` |
| `formatYMD(d)` | Chinese year-month-day | same input → `"2026年9月20日"` |
| `formatWeek(d)` | Chinese weekday | same input → `"星期日"` |

### Numbers & formatting

| Function | Description | Example |
| --- | --- | --- |
| `formatNum(v)` | Thousands separator | `formatNum(1234567)` → `"1,234,567"` |
| `formatRmb(v, opts)` | RMB currency format; `opts` is fixed to `{ type: "zh-CN", currency: "CNY" }` | `formatRmb(1234.5, { type: "zh-CN", currency: "CNY" })` → `"¥1,234.50"` |
| `percentCN(v, digit = 0)` | Percentage; `v` is a ratio, `digit` is the decimal count | `percentCN(0.1234, 2)` → `"12.34%"` |
| `compactEN(v)` | Compact large numbers (English) | `compactEN(12345)` → `"12K"` |
| `compactCN(v)` | Compact large numbers (Chinese) | `compactCN(12345)` → `"1.2万"` |
| `signed(v, digit = 0)` | Force an explicit `+` / `-` sign | `signed(42, 1)` → `"+42.0"` |

### Strings

| Function | Description | Example |
| --- | --- | --- |
| `capitalize(s)` | Capitalize the first letter of every word | `capitalize("hello world")` → `"Hello World"` |
| `firstUpper(s)` / `firstLower(s)` | Uppercase / lowercase the first character | `firstUpper("hello")` → `"Hello"` |
| `kebabToCamel(s)` / `camelToKebab(s)` | kebab-case ↔ camelCase | `kebabToCamel("my-name")` → `"myName"` |
| `toCamel(s)` | snake_case to camelCase | `toCamel("my_name")` → `"myName"` |
| `trimAll(s)` | Remove all whitespace | `trimAll(" a b\nc ")` → `"abc"` |
| `reverse(s)` | Reverse by code points (emoji-safe) | `reverse("abc")` → `"cba"` |
| `truncate(s, max, suffix = "...")` | Truncate by length; `max` includes the suffix | `truncate("Hello World", 8)` → `"Hello..."` |
| `truncateByWords(s, max, suffix = "...")` | Truncate by characters; CJK counts as one | `truncateByWords("你好世界欢迎你", 4)` → `"你好世界..."` |
| `maskPhone(s)` | Mask a phone number | `maskPhone("13812345678")` → `"138****5678"` |
| `spacePhone(s)` | Space a phone number as 3-4-4 | `spacePhone("13812345678")` → `"138 1234 5678"` |
| `maskName(v)` | Mask a name, keeping the first character | `maskName("张三丰")` → `"张**"` |
| `escapeHtml(s)` / `unescapeHtml(s)` | Escape / unescape HTML entities | `escapeHtml("<b>")` → `"&lt;b&gt;"` |
| `stripHtml(s)` | Remove HTML tags | `stripHtml("<p>hi</p>")` → `"hi"` |
| `ensurePrefix(s, p)` / `ensureSuffix(s, suf)` | Add a prefix / suffix when missing | `ensureSuffix("a", ".txt")` → `"a.txt"` |
| `removePrefix(s, p)` / `removeSuffix(s, suf)` | Remove a prefix / suffix when present | `removeSuffix("a.txt", ".txt")` → `"a"` |
| `randomString(len = 8)` | Random alphanumeric string | `randomString(6)` → e.g. `"aZ3kL9"` |
| `uuid()` | UUID v4 (RFC 4122) | `uuid()` → `"550e8400-..."` |
| `byteSize(s)` | UTF-8 byte length | `byteSize("你好")` → `6` |
| `words(s)` | Split into ASCII words | `words("fooBar baz")` → `["foo", "Bar", "baz"]` |
| `camelCase(s)` | Convert to camelCase | `camelCase("foo_bar")` → `"fooBar"` |
| `pascalCase(s)` | Convert to PascalCase | `pascalCase("foo bar")` → `"FooBar"` |
| `snakeCase(s)` | Convert to snake_case | `snakeCase("fooBar")` → `"foo_bar"` |
| `kebabCase(s)` | Convert to kebab-case | `kebabCase("fooBar")` → `"foo-bar"` |
| `deburr(s)` | Remove Latin diacritics | `deburr("café")` → `"cafe"` |
| `escapeRegExp(s)` | Escape regex metacharacters | `escapeRegExp("a.b")` → `"a\\.b"` |
| `template(s, data, pattern?)` | Replace `{{key}}` placeholders with values | `template("Hi {{name}}", { name: "Ray" })` → `"Hi Ray"` |
| `titleCase(s)` | Convert to Title Case (space-separated, capitalized) | `titleCase("fooBar baz")` → `"Foo Bar Baz"` |

### Arrays

| Function | Description | Example |
| --- | --- | --- |
| `unique(arr, identity?)` | Deduplicate; optional identity keeps the first occurrence per value | `unique([1, 2, 2])` → `[1, 2]` |
| `uniqueByKey(arr, key)` | Deduplicate an object array by key; **keeps the first occurrence** | `uniqueByKey([{ id: 1, n: "a" }, { id: 1, n: "b" }], "id")` → `[{ id: 1, n: "a" }]` |
| `sortNumAsc(arr)` / `sortNumDesc(arr)` | Numeric ascending / descending; returns a new array | `sortNumAsc([3, 1, 2])` → `[1, 2, 3]` |
| `sortByKey(arr, key, order = "asc")` | Sort by a numeric property; returns a new array | `sortByKey([{ n: 3 }, { n: 1 }], "n")` → `[{ n: 1 }, { n: 3 }]` |
| `toArray(x)` | Convert an array-like / iterable to an array | `toArray("abc")` → `["a", "b", "c"]` |
| `mergeArrays(...arrs)` | Merge multiple arrays | `mergeArrays([1], [2, 3])` → `[1, 2, 3]` |
| `flatten(arr, depth = 1)` | Flatten to the given depth | `flatten([1, [2, [3]]], 2)` → `[1, 2, 3]` |
| `arrFind(arr, key, value)` | Find the first match; `undefined` if absent | `arrFind([{ id: 2 }], "id", 2)` → `{ id: 2 }` |
| `groupBy(arr, keyOrFn)` | Group by a property or iteratee | `groupBy([{ t: "a" }, { t: "b" }], "t")` → `{ a: [...], b: [...] }` |
| `createRange(len, mapFn?)` | Build a sequence; optional mapping function | `createRange(3)` → `[0, 1, 2]` |
| `chunk(arr, size)` | Split into fixed-size chunks | `chunk([1, 2, 3], 2)` → `[[1, 2], [3]]` |
| `compact(arr)` | Remove falsy values | `compact([0, 1, "", 2])` → `[1, 2]` |
| `difference(arr, ...others)` | Set difference | `difference([1, 2, 3], [2])` → `[1, 3]` |
| `intersection(arr, ...others)` | Set intersection (deduplicated) | `intersection([1, 2], [2, 3])` → `[2]` |
| `union(...arrs)` | Set union (deduplicated) | `union([1, 2], [2, 3])` → `[1, 2, 3]` |
| `drop(arr, n = 1)` / `dropRight(arr, n = 1)` | Drop n items from the start / end | `drop([1, 2, 3], 1)` → `[2, 3]` |
| `take(arr, n = 1)` / `takeRight(arr, n = 1)` | Take n items from the start / end | `take([1, 2, 3], 2)` → `[1, 2]` |
| `nth(arr, index)` | Read an element; supports negative indices | `nth([1, 2, 3], -1)` → `3` |
| `sample(arr)` | Pick a random element | `sample([1, 2, 3])` → `2` (random) |
| `shuffle(arr)` | Shuffle into a new array | `shuffle([1, 2, 3])` |
| `sampleSize(arr, n)` | Pick n distinct random elements | `sampleSize([1, 2, 3], 2)` |
| `zip(...arrs)` | Zip arrays to the longest length | `zip([1, 2], ["a"])` → `[[1, "a"], [2, undefined]]` |
| `partition(arr, fn)` | Split into two groups by predicate | `partition([1, 2, 3], n => n % 2)` → `[[1, 3], [2]]` |
| `countBy(arr, keyOrFn)` | Count elements by property or function | `countBy([{ t: "a" }, { t: "a" }], "t")` → `{ a: 2 }` |
| `keyBy(arr, keyOrFn)` | Index elements by property or function | `keyBy([{ id: 1 }], "id")` → `{ "1": { id: 1 } }` |
| `maxBy(arr, fn)` / `minBy(arr, fn)` | Element with the max / min numeric value | `maxBy([{ n: 1 }, { n: 2 }], o => o.n)` → `{ n: 2 }` |
| `sortBy(arr, fn)` | Ascending sort by iteratee; returns a new array | `sortBy([3, 1], n => n)` → `[1, 3]` |
| `replace(arr, newItem, match)` | Replace the first match; returns a new array | `replace([1, 2], 9, n => n === 2)` → `[1, 9]` |
| `replaceOrAppend(arr, newItem, match)` | Replace the first match, or append when absent | `replaceOrAppend([1], 9, n => n === 2)` → `[1, 9]` |
| `toggle(arr, item, force?)` | Toggle membership; `force` can force keep / remove | `toggle([1, 2], 1)` → `[2]` |
| `zipToObject(keys, values)` | Build an object from keys and a value source | `zipToObject(["a", "b"], [1, 2])` → `{ a: 1, b: 2 }` |
| `rotate(arr, steps = 1)` | Rotate right for positive steps, left for negative | `rotate([1, 2, 3], 1)` → `[3, 1, 2]` |
| `intersects(a, b)` | Whether the two arrays share any element | `intersects([1, 2], [2, 3])` → `true` |
| `objectify(arr, getKey, getValue?)` | Project an array into an object via key/value selectors | `objectify([{ id: 1 }], o => o.id)` → `{ 1: { id: 1 } }` |
| `select(arr, mapper, predicate)` | Filter and map in a single pass | `select([1, 2, 3], n => n * n, n => n > 1)` → `[4, 9]` |

### Objects & cloning

| Function | Description | Example |
| --- | --- | --- |
| `isEqual(x, y)` | Deep equality; supports `Date` / `RegExp` / `Map` / `Set` / circular refs | `isEqual({ a: 1 }, { a: 1 })` → `true` |
| `shallowClone(v)` | Shallow clone; nested objects stay shared | `shallowClone({ a: 1 })` |
| `deepClone(v)` | Recursive deep clone; supports `Date` / `RegExp` / `Map` / `Set` / circular refs | `deepClone({ a: { b: 1 } })` |
| `deepCloneWithJSON(v)` | JSON deep clone; loses `Date` / `Map` / `Set` / functions | `deepCloneWithJSON({ a: 1 })` |
| `structClone(v, opts?)` | `structuredClone` deep clone; needs Node 17+ / modern browsers | `structClone({ a: 1 })` |
| `filterEmptyValues(obj)` | Drop `null` / `undefined` / `""` properties | `filterEmptyValues({ a: 1, b: "" })` → `{ a: 1 }` |
| `pick(obj, keys)` | Pick own properties | `pick({ a: 1, b: 2 }, ["a"])` → `{ a: 1 }` |
| `omit(obj, keys)` | Exclude properties | `omit({ a: 1, b: 2 }, ["b"])` → `{ a: 1 }` |
| `mapValues(obj, fn)` | Map over object values | `mapValues({ a: 1 }, v => v * 2)` → `{ a: 2 }` |
| `mapKeys(obj, fn)` | Map over object keys | `mapKeys({ a: 1 }, (_, k) => k.toUpperCase())` → `{ A: 1 }` |
| `invert(obj)` | Swap keys and values | `invert({ a: "x" })` → `{ x: "a" }` |
| `merge(target, ...sources)` | Deep-merge plain objects into a new object | `merge({ a: { b: 1 } }, { a: { c: 2 } })` → `{ a: { b: 1, c: 2 } }` |
| `get(obj, path, default?)` | Read by path, supporting `a[0].b` | `get({ a: { b: 1 } }, "a.b")` → `1` |
| `has(obj, path)` | Whether the path exists | `has({ a: { b: 1 } }, "a.b")` → `true` |
| `set(obj, path, value)` | Write by path; returns a new object (only path nodes copied) | `set({ a: 1 }, "b.c", 2)` → `{ a: 1, b: { c: 2 } }` |
| `crush(obj, sep = ".")` | Flatten a nested object into path keys | `crush({ a: { b: 1 } })` → `{ "a.b": 1 }` |
| `construct(obj, sep = ".")` | Rebuild a nested object from path keys | `construct({ "a.b": 1 })` → `{ a: { b: 1 } }` |
| `mapEntries(obj, fn)` | Map keys and values at once | `mapEntries({ a: 1 }, (k, v) => [k.toUpperCase(), v])` → `{ A: 1 }` |

### Storage & cookies (browser only)

| Function | Description | Example |
| --- | --- | --- |
| `localGet<T>(key)` | Read and `JSON.parse`; `null` if missing, raw string if not JSON | `localGet("user")` |
| `localSet(key, v)` | Write and `JSON.stringify` | `localSet("user", { age: 18 })` |
| `localRm(key)` / `localClear()` | Remove one key / clear everything | `localRm("user")` |
| `setCookie(name, value, days = 0)` | Set a cookie; `days = 0` is session-only, negative expires immediately | `setCookie("token", "abc", 7)` |
| `getCookie(name)` | Read a cookie; `null` if missing | `getCookie("token")` → `"abc"` |
| `delCookie(name)` | Delete a cookie | `delCookie("token")` |

### Browser (browser only)

| Function | Description | Example |
| --- | --- | --- |
| `getUrlParams(url?)` | Query params as an object; relative paths supported; uses the current URL when omitted | `getUrlParams("https://x.com/?a=1")` → `{ a: "1" }` |
| `getUrlParam(key, url?)` | Read a single param; `null` if missing | `getUrlParam("a", "https://x.com/?a=1")` → `"1"` |
| `toQueryString(obj)` | Object to query string; ignores `null` / `undefined` | `toQueryString({ a: 1, b: "x y" })` → `"a=1&b=x%20y"` |
| `copyToClipboard(text)` | Copy text, preferring the Clipboard API; returns `Promise<boolean>` | `await copyToClipboard("hi")` → `true` |
| `downloadFile(content, name, mime = "text/plain")` | Trigger a download via Blob | `downloadFile("hi", "a.txt")` |
| `exportJSON(data, name = "data.json")` | Export data as a JSON file | `exportJSON({ a: 1 })` |
| `scrollToTop(behavior = "smooth")` / `scrollToBottom(...)` | Scroll to the top / bottom of the page | `scrollToTop()` |
| `onScroll(cb)` | Listen to scroll (rAF-throttled); returns a cleanup function | `const off = onScroll(y => {})` |
| `observeIntersection(el, onEnter, onLeave?, opts?)` | Observe enter/leave of the viewport; returns a cleanup function | `const stop = observeIntersection(el, load)` |

### Function control

| Function | Description | Example |
| --- | --- | --- |
| `debounce(fn, delay = 300, opts?)` | Runs `delay` ms after the last call; `leading` defaults to `false`, `trailing` to `true`; returns a function with `cancel()` | `debounce(save, 500)` |
| `throttle(fn, interval = 300, opts?)` | At most one call per interval; `leading` / `trailing` both default to `true`; returns a function with `cancel()` | `throttle(onScroll, 200)` |

### Async

| Function | Description | Example |
| --- | --- | --- |
| `sleep(ms)` | Resolve after the given milliseconds | `await sleep(100)` |
| `retry(fn, opts?)` | Retry on failure with attempts and delay; `times` defaults to 3 | `await retry(load, { times: 3 })` |
| `parallel(items, fn, limit?)` | Run async mapping with a concurrency limit, preserving input order | `await parallel(list, load, 4)` |
| `once(fn)` | Run at most once and cache the result | `const init = once(setup)` |
| `memoize(fn, resolver?)` | Cache results by first argument; custom key supported | `const f = memoize(slowFn)` |
| `pipe(...fns)` | Compose left to right | `pipe(f, g)(x)` → `g(f(x))` |
| `compose(...fns)` | Compose right to left | `compose(f, g)(x)` → `f(g(x))` |
| `partial(fn, ...args)` | Preset leading arguments | `partial(add, 1)(2)` → `3` |
| `attempt(fn, ...args)` | Catch sync / async errors; returns `[error, value]` | `attempt(() => 1)` → `[undefined, 1]` |
| `chain(...fns)` | Chain functions left to right; the first may take multiple args | `chain((a, b) => a + b, n => n * 2)(1, 2)` → `6` |
| `guard(fn, shouldGuard?)` | Swallow errors and return `undefined`; optional rethrow predicate | `guard(jsonParse)` → result or `undefined` |

### Math

| Function | Description | Example |
| --- | --- | --- |
| `clamp(v, min, max)` | Clamp to a closed interval; auto-corrects bound order | `clamp(15, 0, 10)` → `10` |
| `randomInt(min, max)` | Random integer in a closed interval (inclusive) | `randomInt(1, 6)` → `1`–`6` |
| `randomFloat(min, max)` | Random float in a half-open interval | `randomFloat(0, 1)` → `0.374...` |
| `round(v, decimals = 0)` | Round to the given number of decimals | `round(3.14159, 2)` → `3.14` |
| `sum(arr, fn?)` | Sum; optional iteratee | `sum([1, 2, 3])` → `6` |
| `average(arr, fn?)` | Average; optional iteratee | `average([1, 2, 3])` → `2` |
| `inRange(v, min, max)` | Whether the value is inside the closed interval | `inRange(5, 1, 10)` → `true` |
| `lerp(start, end, t)` | Linear interpolation | `lerp(0, 100, 0.5)` → `50` |
| `toInt(v, radix = 10)` | Convert to integer; `0` when unparsable | `toInt("42.9")` → `42` |
| `toFloat(v)` | Convert to float; `0` when unparsable | `toFloat("3.14px")` → `3.14` |

### Validation

| Function | Description | Example |
| --- | --- | --- |
| `checkCardNo(v)` | Chinese ID format check (15 / 18 digits, trailing `X` allowed); does not verify the checksum | `checkCardNo("11010119900307321X")` → `true` |
| `isEmail(v)` | Email format check (stricter) | `isEmail("a@b.com")` → `true` |
| `isTel(v)` | Mainland China mobile number (`1` first, second digit `3`–`9`, 11 digits) | `isTel("13812345678")` → `true` |
| `isUrl(v)` | Whether the value is a valid HTTP / HTTPS URL | `isUrl("https://x.com")` → `true` |

## License

[MIT](https://opensource.org/licenses/MIT) © newborn_calf

- Source: <https://github.com/Libao-Jun/fast-utility>
- Issues: <https://github.com/Libao-Jun/fast-utility/issues>
