# fast-utility

> A lightweight, zero-dependency, tree-shaking-friendly JavaScript / TypeScript utility library.

English | [简体中文](./README.md)

fast-utility gathers the helpers you keep rewriting into one place: type checks, date & time, number and currency formatting, string manipulation, array and object operations, deep cloning, storage and cookies, browser helpers, debounce/throttle, math and validators — 111 functions in total. Every function is imported by name from the package root, so you only ship what you use.

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

11 groups by purpose. Groups marked "browser only" rely on `window` / `document` / `localStorage` / `navigator` and will throw in Node.

### Type checks

Most of the `is*` family are type guards (`v is T`) and can be used directly for narrowing.

| Function | Description | Example |
| --- | --- | --- |
| `isArray(v)` | Whether the value is an array | `isArray([])` → `true` |
| `isObject(v)` | Whether the value is a plain object (excludes arrays and `null`) | `isObject([])` → `false` |
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
| `isEmpty(v)` | Whether the value is empty: empty string, array, object, `Map` / `Set`, invalid date, etc. | `isEmpty({})` → `true` |
| `isEmptySv(v)` | Simplified emptiness check (strings, arrays, `Map` / `Set`, `ArrayBuffer` views, objects) | `isEmptySv([])` → `true` |
| `isHexColor(s)` | Whether the value is `#RGB` / `#RRGGBB` | `isHexColor("#fff")` → `true` |
| `isValidEmail(s)` | Loose email validation | `isValidEmail("a@b.com")` → `true` |
| `isPC()` | Whether running in a browser | `false` in Node |
| `isIOS()` | Whether the device is iOS (reads the UA; browser only) | depends on UA |
| `isWindow(v)` | Whether the value is the `window` object | `isWindow(window)` → `true` |
| `isElement(v)` | Whether the value is a DOM element | `isElement(document.body)` → `true` |

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

### Arrays

| Function | Description | Example |
| --- | --- | --- |
| `unique(arr)` | Deduplicate by `===` | `unique([1, 2, 2])` → `[1, 2]` |
| `uniqueByKey(arr, key)` | Deduplicate an object array by key; **keeps the last occurrence** | `uniqueByKey([{ id: 1, n: "a" }, { id: 1, n: "b" }], "id")` → `[{ id: 1, n: "b" }]` |
| `sortNumAsc(arr)` / `sortNumDesc(arr)` | Numeric ascending / descending; returns a new array | `sortNumAsc([3, 1, 2])` → `[1, 2, 3]` |
| `sortByKey(arr, key, order = "asc")` | Sort by a numeric property; returns a new array | `sortByKey([{ n: 3 }, { n: 1 }], "n")` → `[{ n: 1 }, { n: 3 }]` |
| `toArray(x)` | Convert an array-like / iterable to an array | `toArray("abc")` → `["a", "b", "c"]` |
| `mergeArrays(...arrs)` | Merge multiple arrays | `mergeArrays([1], [2, 3])` → `[1, 2, 3]` |
| `flatten(arr, depth = 1)` | Flatten to the given depth | `flatten([1, [2, [3]]], 2)` → `[1, 2, 3]` |
| `arrFind(arr, key, value)` | Find the first match; `undefined` if absent | `arrFind([{ id: 2 }], "id", 2)` → `{ id: 2 }` |
| `groupBy(arr, key)` | Group by a property | `groupBy([{ t: "a" }, { t: "b" }], "t")` → `{ a: [...], b: [...] }` |
| `createRange(len, mapFn?)` | Build a sequence; optional mapping function | `createRange(3)` → `[0, 1, 2]` |

### Objects & cloning

| Function | Description | Example |
| --- | --- | --- |
| `isEqual(x, y)` | Deep equality; supports `Date` / `RegExp` | `isEqual({ a: 1 }, { a: 1 })` → `true` |
| `shallowClone(v)` | Shallow clone; nested objects stay shared | `shallowClone({ a: 1 })` |
| `deepClone(v)` | Recursive deep clone; supports `Date` / `RegExp` / `Map` / `Set` / circular refs | `deepClone({ a: { b: 1 } })` |
| `deepCloneWithJSON(v)` | JSON deep clone; loses `Date` / `Map` / `Set` / functions | `deepCloneWithJSON({ a: 1 })` |
| `structClone(v, opts?)` | `structuredClone` deep clone; needs Node 17+ / modern browsers | `structClone({ a: 1 })` |
| `filterEmptyValues(obj)` | Drop `null` / `undefined` / `""` properties | `filterEmptyValues({ a: 1, b: "" })` → `{ a: 1 }` |

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
| `getUrlParams(url?)` | Query params as an object; uses the current URL when omitted | `getUrlParams("https://x.com/?a=1")` → `{ a: "1" }` |
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

### Math

| Function | Description | Example |
| --- | --- | --- |
| `clamp(v, min, max)` | Clamp to a closed interval; auto-corrects bound order | `clamp(15, 0, 10)` → `10` |
| `randomInt(min, max)` | Random integer in a closed interval (inclusive) | `randomInt(1, 6)` → `1`–`6` |
| `randomFloat(min, max)` | Random float in a half-open interval | `randomFloat(0, 1)` → `0.374...` |
| `round(v, decimals = 0)` | Round to the given number of decimals | `round(3.14159, 2)` → `3.14` |
| `sum(arr)` | Sum an array; `0` for an empty array | `sum([1, 2, 3])` → `6` |
| `average(arr)` | Average; `NaN` for an empty array | `average([1, 2, 3])` → `2` |
| `inRange(v, min, max)` | Whether the value is inside the closed interval | `inRange(5, 1, 10)` → `true` |
| `lerp(start, end, t)` | Linear interpolation | `lerp(0, 100, 0.5)` → `50` |

### Validation

| Function | Description | Example |
| --- | --- | --- |
| `checkCardNo(v)` | Chinese ID format check (15 / 18 digits, trailing `X` allowed); does not verify the checksum | `checkCardNo("11010119900307321X")` → `true` |
| `isEmail(v)` | Email format check (stricter) | `isEmail("a@b.com")` → `true` |
| `isTel(v)` | Mainland China mobile number (`1` first, second digit `3`–`9`, 11 digits) | `isTel("13812345678")` → `true` |

## License

[MIT](https://opensource.org/licenses/MIT) © newborn_calf

- Source: <https://github.com/Libao-Jun/fast-utility>
- Issues: <https://github.com/Libao-Jun/fast-utility/issues>
