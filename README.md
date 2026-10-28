# fast-utility

> 轻量、零依赖、Tree-shaking 友好的 JavaScript / TypeScript 工具函数库。

[English](./README.en.md) | 简体中文

fast-utility 把日常开发中反复出现的工具函数收拢到一处：类型判断、时间日期、数字与货币格式化、字符串处理、数组与对象操作、深拷贝、存储与 Cookie、浏览器增强、防抖节流、异步控制、数学计算与格式校验，共 178 个函数。全部从包根按名导出，用到哪个打包哪个。

- **零运行时依赖**：安装体积即自身代码。
- **Tree-shaking 友好**：每个函数独立导出，未引用的不会进入产物。
- **类型完备**：内置 `.d.ts`，`is*` 系列为类型守卫，可在 `if` 中自动收窄类型。
- **双端可用**：纯逻辑函数浏览器与 Node 通用，DOM 相关函数单独分组标注。

## 安装

```bash
pnpm add fast-utility
# 或：npm install fast-utility / yarn add fast-utility
```

## 快速开始

```ts
import { isArray, isDef, formatFull, formatRmb, localGet, localSet, debounce } from "fast-utility";

// 类型守卫：if 内类型自动收窄
const list: unknown = [1, 2, 3];
if (isArray(list) && isDef(list[0])) list.length;

// 日期与货币
formatFull(new Date(2026, 8, 20, 14, 30, 5)); // "2026/09/20 14:30:05"
formatRmb(1234.5, { type: "zh-CN", currency: "CNY" }); // "¥1,234.50"

// localStorage：自动 JSON 序列化
localSet("user", { name: "张三", age: 18 });
localGet<{ name: string; age: number }>("user"); // { name: "张三", age: 18 }

// 防抖：返回函数带 cancel()
const search = debounce((kw: string) => fetch(`/api?q=${kw}`), 300);
search("a");
search("ab"); // 停止输入 300ms 后只触发一次
search.cancel();
```

> 全部函数均从包根具名导入，不使用默认导出；除写入类函数（`localSet`、`setCookie` 等）外，处理类函数不修改入参。参数签名与返回值类型见 `.d.ts`，编辑器悬停即可查看完整 JSDoc。

## API

按用途分 12 组。标注「仅浏览器」的分组依赖 `window` / `document` / `localStorage` / `navigator`，在 Node 中会抛错。

### 类型判断

`is*` 系列多数为类型守卫（`v is T`），可直接用于条件收窄。

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `isArray(v)` | 是否数组 | `isArray([])` → `true` |
| `isObject(v)` | 是否普通对象（排除数组、`Date`、`Map` 等） | `isObject([])` → `false` |
| `is(v, type)` | 按 `Object.prototype.toString` 比对类型名 | `is([], "Array")` → `true` |
| `isFunction(v)` | 是否可调用对象 | `isFunction(() => {})` → `true` |
| `isAsyncFunction(v)` | 是否 `async` 函数 | `isAsyncFunction(async () => {})` → `true` |
| `isPromise(v)` | 是否含 `then` 方法 | `isPromise(Promise.resolve())` → `true` |
| `isDate(v)` | 是否 `Date` | `isDate(new Date())` → `true` |
| `isString(v)` | 是否字符串（含包装对象） | `isString("a")` → `true` |
| `isNumber(v)` | 是否数字；`NaN` 返回 `false`，`Infinity` 返回 `true` | `isNumber(NaN)` → `false` |
| `isInt(v)` / `isFloat(v)` | 是否有限整数 / 有限小数 | `isInt(42)` → `true` |
| `isBoolean(v)` | 是否布尔值 | `isBoolean(true)` → `true` |
| `isSymbol(v)` | 是否 `Symbol` | `isSymbol(Symbol())` → `true` |
| `isPrimitive(v)` | 是否原始类型（非对象、非函数） | `isPrimitive(1)` → `true` |
| `isBasicType(v)` | 是否基本类型（含 `null` / `undefined`） | `isBasicType({})` → `false` |
| `isNull(v)` | 是否 `null` | `isNull(null)` → `true` |
| `isDef(v)` / `isUnDef(v)` | 是否已定义 / 未定义 | `isDef(0)` → `true` |
| `isNullOrUnDef(v)` | 是否 `null` 或 `undefined` | `isNullOrUnDef(undefined)` → `true` |
| `isNil(v)` | 是否 `null` 或 `undefined`（语义化别名） | `isNil(null)` → `true` |
| `isEmpty(v)` | 是否为空：空串、空数组、空对象、空 `Map` / `Set`、无效日期等 | `isEmpty({})` → `true` |
| `isEmptySv(v)` | 简化版空值判断（字符串、数组、`Map` / `Set`、`ArrayBuffer` 视图、对象） | `isEmptySv([])` → `true` |
| `isHexColor(s)` | 是否 `#RGB` / `#RRGGBB` | `isHexColor("#fff")` → `true` |
| `isValidEmail(s)` | 宽松邮箱校验 | `isValidEmail("a@b.com")` → `true` |
| `isPC()` | 是否浏览器环境 | Node 中为 `false` |
| `isIOS()` | 是否 iOS 设备（读取 UA，仅浏览器） | 依 UA 而定 |
| `isWindow(v)` | 是否 `window` 对象 | `isWindow(window)` → `true` |
| `isElement(v)` | 是否 DOM 元素 | `isElement(document.body)` → `true` |
| `isError(v)` | 是否 `Error` 实例 | `isError(new Error())` → `true` |
| `isRegExp(v)` | 是否正则对象 | `isRegExp(/a/)` → `true` |
| `isTypedArray(v)` | 是否 TypedArray（不含 `DataView`） | `isTypedArray(new Uint8Array())` → `true` |

> `isBasicType` 是 `isPrimitive` 的别名（行为一致）；`isEmpty` 与 `isEmptySv` 对 `Date`、`DataView` 的处理不同；`isEmail` 比 `isValidEmail` 严格（不接受 `+` 与本地部分的点号）。

### 时间与日期

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `timestamp()` | 当前毫秒时间戳（同 `Date.now()`） | `timestamp()` → `1750000000000` |
| `isToday(d)` | 是否今天；`d` 可为 `Date` / 时间戳 / 日期字符串 | `isToday(new Date())` → `true` |
| `firstDay(y, m)` | 指定年月第一天，`m` 取 1–12 | `firstDay(2026, 9)` → `2026-09-01` |
| `lastDay(y, m)` | 指定年月最后一天 | `lastDay(2024, 2)` → `2024-02-29` |
| `formatFull(d)` | `YYYY/MM/DD HH:mm:ss` | `formatFull(new Date(2026, 8, 20, 14, 30, 5))` → `"2026/09/20 14:30:05"` |
| `formatFullReplace(d)` | 同上，短横线分隔 | 同上 → `"2026-09-20 14:30:05"` |
| `formatYMD(d)` | 中文年月日 | 同上 → `"2026年9月20日"` |
| `formatWeek(d)` | 中文星期 | 同上 → `"星期日"` |

### 数字与格式化

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `formatNum(v)` | 千位分隔符 | `formatNum(1234567)` → `"1,234,567"` |
| `formatRmb(v, opts)` | 人民币格式；`opts` 固定为 `{ type: "zh-CN", currency: "CNY" }` | `formatRmb(1234.5, { type: "zh-CN", currency: "CNY" })` → `"¥1,234.50"` |
| `percentCN(v, digit = 0)` | 百分比；`v` 为小数比例，`digit` 为小数位数 | `percentCN(0.1234, 2)` → `"12.34%"` |
| `compactEN(v)` | 大数简化（英文缩写） | `compactEN(12345)` → `"12K"` |
| `compactCN(v)` | 大数简化（中文缩写） | `compactCN(12345)` → `"1.2万"` |
| `signed(v, digit = 0)` | 强制带 `+` / `-` 符号 | `signed(42, 1)` → `"+42.0"` |

### 字符串

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `capitalize(s)` | 每个单词首字母大写 | `capitalize("hello world")` → `"Hello World"` |
| `firstUpper(s)` / `firstLower(s)` | 首字母大写 / 小写 | `firstUpper("hello")` → `"Hello"` |
| `kebabToCamel(s)` / `camelToKebab(s)` | 短横线命名 ↔ 小驼峰 | `kebabToCamel("my-name")` → `"myName"` |
| `toCamel(s)` | 下划线命名转小驼峰 | `toCamel("my_name")` → `"myName"` |
| `trimAll(s)` | 去除所有空白字符 | `trimAll(" a b\nc ")` → `"abc"` |
| `reverse(s)` | 按码点反转（emoji 安全） | `reverse("abc")` → `"cba"` |
| `truncate(s, max, suffix = "...")` | 按长度截断，`max` 含后缀长度 | `truncate("Hello World", 8)` → `"Hello..."` |
| `truncateByWords(s, max, suffix = "...")` | 按字符截断，中文按一字计 | `truncateByWords("你好世界欢迎你", 4)` → `"你好世界..."` |
| `maskPhone(s)` | 手机号脱敏 | `maskPhone("13812345678")` → `"138****5678"` |
| `spacePhone(s)` | 手机号 3-4-4 空格分隔 | `spacePhone("13812345678")` → `"138 1234 5678"` |
| `maskName(v)` | 姓名脱敏，保留首字 | `maskName("张三丰")` → `"张**"` |
| `escapeHtml(s)` / `unescapeHtml(s)` | HTML 实体转义 / 还原 | `escapeHtml("<b>")` → `"&lt;b&gt;"` |
| `stripHtml(s)` | 去除 HTML 标签 | `stripHtml("<p>hi</p>")` → `"hi"` |
| `ensurePrefix(s, p)` / `ensureSuffix(s, suf)` | 缺失时补前缀 / 后缀 | `ensureSuffix("a", ".txt")` → `"a.txt"` |
| `removePrefix(s, p)` / `removeSuffix(s, suf)` | 存在时移除前缀 / 后缀 | `removeSuffix("a.txt", ".txt")` → `"a"` |
| `randomString(len = 8)` | 随机字母数字串 | `randomString(6)` → 如 `"aZ3kL9"` |
| `uuid()` | UUID v4（RFC 4122） | `uuid()` → `"550e8400-..."` |
| `byteSize(s)` | UTF-8 字节长度 | `byteSize("你好")` → `6` |
| `words(s)` | 拆分为 ASCII 单词数组 | `words("fooBar baz")` → `["foo", "Bar", "baz"]` |
| `camelCase(s)` | 转换为小驼峰 | `camelCase("foo_bar")` → `"fooBar"` |
| `pascalCase(s)` | 转换为大驼峰 | `pascalCase("foo bar")` → `"FooBar"` |
| `snakeCase(s)` | 转换为下划线命名 | `snakeCase("fooBar")` → `"foo_bar"` |
| `kebabCase(s)` | 转换为短横线命名 | `kebabCase("fooBar")` → `"foo-bar"` |
| `deburr(s)` | 去除拉丁变音符号 | `deburr("café")` → `"cafe"` |
| `escapeRegExp(s)` | 转义正则元字符 | `escapeRegExp("a.b")` → `"a\\.b"` |
| `template(s, data, pattern?)` | 按 `{{key}}` 占位符替换变量 | `template("Hi {{name}}", { name: "Ray" })` → `"Hi Ray"` |
| `titleCase(s)` | 转换为标题式命名（空格分隔、首字母大写） | `titleCase("fooBar baz")` → `"Foo Bar Baz"` |

### 数组

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `unique(arr, identity?)` | 去重；可传取值函数按值去重并保留首次出现 | `unique([1, 2, 2])` → `[1, 2]` |
| `uniqueByKey(arr, key)` | 对象数组按 key 去重，**保留首次出现** | `uniqueByKey([{ id: 1, n: "a" }, { id: 1, n: "b" }], "id")` → `[{ id: 1, n: "a" }]` |
| `sortNumAsc(arr)` / `sortNumDesc(arr)` | 数值升序 / 降序，返回新数组 | `sortNumAsc([3, 1, 2])` → `[1, 2, 3]` |
| `sortByKey(arr, key, order = "asc")` | 按数值属性排序，返回新数组 | `sortByKey([{ n: 3 }, { n: 1 }], "n")` → `[{ n: 1 }, { n: 3 }]` |
| `toArray(x)` | 类数组 / 可迭代对象转数组 | `toArray("abc")` → `["a", "b", "c"]` |
| `mergeArrays(...arrs)` | 合并多个数组 | `mergeArrays([1], [2, 3])` → `[1, 2, 3]` |
| `flatten(arr, depth = 1)` | 扁平化到指定层级 | `flatten([1, [2, [3]]], 2)` → `[1, 2, 3]` |
| `arrFind(arr, key, value)` | 查找首个匹配项，未找到返回 `undefined` | `arrFind([{ id: 2 }], "id", 2)` → `{ id: 2 }` |
| `groupBy(arr, keyOrFn)` | 按属性或取值函数分组 | `groupBy([{ t: "a" }, { t: "b" }], "t")` → `{ a: [...], b: [...] }` |
| `createRange(len, mapFn?)` | 生成长度序列，可传映射函数 | `createRange(3)` → `[0, 1, 2]` |
| `chunk(arr, size)` | 按固定长度切分数组 | `chunk([1, 2, 3], 2)` → `[[1, 2], [3]]` |
| `compact(arr)` | 去除假值 | `compact([0, 1, "", 2])` → `[1, 2]` |
| `difference(arr, ...others)` | 差集 | `difference([1, 2, 3], [2])` → `[1, 3]` |
| `intersection(arr, ...others)` | 交集（去重） | `intersection([1, 2], [2, 3])` → `[2]` |
| `union(...arrs)` | 并集（去重） | `union([1, 2], [2, 3])` → `[1, 2, 3]` |
| `drop(arr, n = 1)` / `dropRight(arr, n = 1)` | 从开头 / 末尾丢弃 n 个 | `drop([1, 2, 3], 1)` → `[2, 3]` |
| `take(arr, n = 1)` / `takeRight(arr, n = 1)` | 从开头 / 末尾截取 n 个 | `take([1, 2, 3], 2)` → `[1, 2]` |
| `nth(arr, index)` | 读取元素，支持负索引 | `nth([1, 2, 3], -1)` → `3` |
| `sample(arr)` | 随机取一个元素 | `sample([1, 2, 3])` → `2`（随机） |
| `shuffle(arr)` | 洗牌，返回新数组 | `shuffle([1, 2, 3])` |
| `sampleSize(arr, n)` | 随机取 n 个不重复元素 | `sampleSize([1, 2, 3], 2)` |
| `zip(...arrs)` | 按最长数组拉链合并 | `zip([1, 2], ["a"])` → `[[1, "a"], [2, undefined]]` |
| `partition(arr, fn)` | 按条件拆分为两组 | `partition([1, 2, 3], n => n % 2)` → `[[1, 3], [2]]` |
| `countBy(arr, keyOrFn)` | 按属性或函数计数 | `countBy([{ t: "a" }, { t: "a" }], "t")` → `{ a: 2 }` |
| `keyBy(arr, keyOrFn)` | 按属性或函数建立索引 | `keyBy([{ id: 1 }], "id")` → `{ "1": { id: 1 } }` |
| `maxBy(arr, fn)` / `minBy(arr, fn)` | 按数值取值取最大 / 最小元素 | `maxBy([{ n: 1 }, { n: 2 }], o => o.n)` → `{ n: 2 }` |
| `sortBy(arr, fn)` | 按取值升序排序，返回新数组 | `sortBy([3, 1], n => n)` → `[1, 3]` |
| `replace(arr, newItem, match)` | 替换第一个匹配元素，返回新数组 | `replace([1, 2], 9, n => n === 2)` → `[1, 9]` |
| `replaceOrAppend(arr, newItem, match)` | 替换第一个匹配元素，未匹配时追加到末尾 | `replaceOrAppend([1], 9, n => n === 2)` → `[1, 9]` |
| `toggle(arr, item, force?)` | 切换元素存在状态，可强制保留 / 移除 | `toggle([1, 2], 1)` → `[2]` |
| `zipToObject(keys, values)` | 键数组 + 值来源构造对象 | `zipToObject(["a", "b"], [1, 2])` → `{ a: 1, b: 2 }` |
| `rotate(arr, steps = 1)` | 旋转数组，正数向右、负数向左 | `rotate([1, 2, 3], 1)` → `[3, 1, 2]` |
| `intersects(a, b)` | 两个数组是否存在交集 | `intersects([1, 2], [2, 3])` → `true` |
| `objectify(arr, getKey, getValue?)` | 按取值函数把数组投影为对象 | `objectify([{ id: 1 }], o => o.id)` → `{ 1: { id: 1 } }` |
| `select(arr, mapper, predicate)` | 单次遍历完成过滤与映射 | `select([1, 2, 3], n => n * n, n => n > 1)` → `[4, 9]` |

### 对象与拷贝

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `isEqual(x, y)` | 深度比较，支持 `Date` / `RegExp` / `Map` / `Set` / 循环引用 | `isEqual({ a: 1 }, { a: 1 })` → `true` |
| `shallowClone(v)` | 浅拷贝，嵌套对象仍共享引用 | `shallowClone({ a: 1 })` |
| `deepClone(v)` | 递归深拷贝，支持 `Date` / `RegExp` / `Map` / `Set` / 循环引用 | `deepClone({ a: { b: 1 } })` |
| `deepCloneWithJSON(v)` | JSON 深拷贝，会丢失 `Date` / `Map` / `Set` / 函数 | `deepCloneWithJSON({ a: 1 })` |
| `structClone(v, opts?)` | `structuredClone` 深拷贝，需 Node 17+ / 现代浏览器 | `structClone({ a: 1 })` |
| `filterEmptyValues(obj)` | 去除 `null` / `undefined` / `""` 属性 | `filterEmptyValues({ a: 1, b: "" })` → `{ a: 1 }` |
| `pick(obj, keys)` | 挑选自有属性 | `pick({ a: 1, b: 2 }, ["a"])` → `{ a: 1 }` |
| `omit(obj, keys)` | 排除指定属性 | `omit({ a: 1, b: 2 }, ["b"])` → `{ a: 1 }` |
| `mapValues(obj, fn)` | 映射对象的值 | `mapValues({ a: 1 }, v => v * 2)` → `{ a: 2 }` |
| `mapKeys(obj, fn)` | 映射对象的键 | `mapKeys({ a: 1 }, (_, k) => k.toUpperCase())` → `{ A: 1 }` |
| `invert(obj)` | 键值互换 | `invert({ a: "x" })` → `{ x: "a" }` |
| `merge(target, ...sources)` | 深度合并普通对象，返回新对象 | `merge({ a: { b: 1 } }, { a: { c: 2 } })` → `{ a: { b: 1, c: 2 } }` |
| `get(obj, path, default?)` | 按路径读取，支持 `a[0].b` | `get({ a: { b: 1 } }, "a.b")` → `1` |
| `has(obj, path)` | 判断路径是否存在 | `has({ a: { b: 1 } }, "a.b")` → `true` |
| `set(obj, path, value)` | 按路径写入，返回新对象（仅复制路径节点） | `set({ a: 1 }, "b.c", 2)` → `{ a: 1, b: { c: 2 } }` |
| `crush(obj, sep = ".")` | 将嵌套对象压平为路径键 | `crush({ a: { b: 1 } })` → `{ "a.b": 1 }` |
| `construct(obj, sep = ".")` | 将路径键还原为嵌套对象 | `construct({ "a.b": 1 })` → `{ a: { b: 1 } }` |
| `mapEntries(obj, fn)` | 同时映射键与值 | `mapEntries({ a: 1 }, (k, v) => [k.toUpperCase(), v])` → `{ A: 1 }` |

### 存储与 Cookie（仅浏览器）

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `localGet<T>(key)` | 读取并 `JSON.parse`；键不存在返回 `null`，非 JSON 原样返回 | `localGet("user")` |
| `localSet(key, v)` | 写入并 `JSON.stringify` | `localSet("user", { age: 18 })` |
| `localRm(key)` / `localClear()` | 删除指定键 / 清空全部 | `localRm("user")` |
| `setCookie(name, value, days = 0)` | 设置 Cookie；`days = 0` 为会话级，负数立即过期 | `setCookie("token", "abc", 7)` |
| `getCookie(name)` | 读取 Cookie，不存在返回 `null` | `getCookie("token")` → `"abc"` |
| `delCookie(name)` | 删除 Cookie | `delCookie("token")` |

### 浏览器相关（仅浏览器）

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `getUrlParams(url?)` | 查询参数转对象，支持相对路径；省略 `url` 时用当前地址 | `getUrlParams("https://x.com/?a=1")` → `{ a: "1" }` |
| `getUrlParam(key, url?)` | 读取单个参数，不存在返回 `null` | `getUrlParam("a", "https://x.com/?a=1")` → `"1"` |
| `toQueryString(obj)` | 对象转查询串，忽略 `null` / `undefined` | `toQueryString({ a: 1, b: "x y" })` → `"a=1&b=x%20y"` |
| `copyToClipboard(text)` | 复制文本，优先 Clipboard API，返回 `Promise<boolean>` | `await copyToClipboard("hi")` → `true` |
| `downloadFile(content, name, mime = "text/plain")` | 通过 Blob 触发下载 | `downloadFile("hi", "a.txt")` |
| `exportJSON(data, name = "data.json")` | 以 JSON 文件导出并下载 | `exportJSON({ a: 1 })` |
| `scrollToTop(behavior = "smooth")` / `scrollToBottom(...)` | 滚动到页面顶部 / 底部 | `scrollToTop()` |
| `onScroll(cb)` | 监听滚动（rAF 节流），返回清理函数 | `const off = onScroll(y => {})` |
| `observeIntersection(el, onEnter, onLeave?, opts?)` | 监听元素进出可视区，返回清理函数 | `const stop = observeIntersection(el, load)` |

### 函数控制

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `debounce(fn, delay = 300, opts?)` | 停止调用 `delay` 毫秒后执行；`leading` 默认 `false`、`trailing` 默认 `true`；返回值带 `cancel()` | `debounce(save, 500)` |
| `throttle(fn, interval = 300, opts?)` | 固定间隔内最多执行一次；`leading` / `trailing` 默认均为 `true`；返回值带 `cancel()` | `throttle(onScroll, 200)` |

### 异步

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `sleep(ms)` | 等待指定毫秒后 resolve | `await sleep(100)` |
| `retry(fn, opts?)` | 失败后按次数与延迟重试，`times` 默认 3 | `await retry(load, { times: 3 })` |
| `parallel(items, fn, limit?)` | 限制并发数执行异步映射，结果保持输入顺序 | `await parallel(list, load, 4)` |
| `once(fn)` | 最多执行一次并缓存结果 | `const init = once(setup)` |
| `memoize(fn, resolver?)` | 按首参缓存结果，可自定义缓存键 | `const f = memoize(slowFn)` |
| `pipe(...fns)` | 从左到右组合函数 | `pipe(f, g)(x)` → `g(f(x))` |
| `compose(...fns)` | 从右到左组合函数 | `compose(f, g)(x)` → `f(g(x))` |
| `partial(fn, ...args)` | 预置前部参数 | `partial(add, 1)(2)` → `3` |
| `attempt(fn, ...args)` | 捕获同步 / 异步异常，返回 `[error, value]` | `attempt(() => 1)` → `[undefined, 1]` |
| `chain(...fns)` | 顺序串联函数，首函数可接收多个参数 | `chain((a, b) => a + b, n => n * 2)(1, 2)` → `6` |
| `guard(fn, shouldGuard?)` | 吞掉异常返回 `undefined`，可定制放行条件 | `guard(jsonParse)` → 结果或 `undefined` |

### 数学

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `clamp(v, min, max)` | 限制在闭区间，自动纠正边界顺序 | `clamp(15, 0, 10)` → `10` |
| `randomInt(min, max)` | 闭区间随机整数（含两端） | `randomInt(1, 6)` → `1`–`6` |
| `randomFloat(min, max)` | 半开区间随机浮点数 | `randomFloat(0, 1)` → `0.374...` |
| `round(v, decimals = 0)` | 四舍五入到指定小数位 | `round(3.14159, 2)` → `3.14` |
| `sum(arr, fn?)` | 求和；可传取值函数 | `sum([1, 2, 3])` → `6` |
| `average(arr, fn?)` | 平均值；可传取值函数 | `average([1, 2, 3])` → `2` |
| `inRange(v, min, max)` | 是否在闭区间内 | `inRange(5, 1, 10)` → `true` |
| `lerp(start, end, t)` | 线性插值 | `lerp(0, 100, 0.5)` → `50` |
| `toInt(v, radix = 10)` | 转换为整数，失败返回 `0` | `toInt("42.9")` → `42` |
| `toFloat(v)` | 转换为浮点数，失败返回 `0` | `toFloat("3.14px")` → `3.14` |

### 格式校验

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| `checkCardNo(v)` | 身份证格式校验（15 / 18 位，末位可为 `X`），不校验校验位 | `checkCardNo("11010119900307321X")` → `true` |
| `isEmail(v)` | 邮箱格式校验（较严格） | `isEmail("a@b.com")` → `true` |
| `isTel(v)` | 国内手机号（`1` 开头、第二位 `3`–`9`、共 11 位） | `isTel("13812345678")` → `true` |
| `isUrl(v)` | 是否合法的 HTTP / HTTPS URL | `isUrl("https://x.com")` → `true` |

## License

[MIT](https://opensource.org/licenses/MIT) © newborn_calf

- 源码：<https://github.com/Libao-Jun/fast-utility>
- 问题反馈：<https://github.com/Libao-Jun/fast-utility/issues>
