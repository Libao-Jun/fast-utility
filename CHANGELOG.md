# 更新日志

fast-utility 的版本变更都记在这里，版本号按 [语义化版本](https://semver.org/lang/zh-CN/) 走。

## v1.0.3

微调 `README.md`、`README.en.md`、`CHANGELOG.md` 内容和排版


## v1.0.2

### 构建

- 构建结构参照 radash 调整：ESM / CJS 去掉产物注释、不输出 sourcemap，压缩交给使用方；另外加了 IIFE 全局包 `dist/index.global.js` 和压缩版 `dist/index.global.min.js`。
- 类型声明改由 `rolldown-plugin-dts` 打包为单个 `dist/index.d.ts`，产物不含相对导入，`node16` / `nodenext` 下可直接解析。
- `package.json` 增加 `sideEffects: false`、`unpkg`、`jsdelivr` 字段。

### 变更

- `src/index.ts` 不再用 `export *`，改为逐个列出导出（168 个函数，加上 `RetryOptions`、`AttemptResult` 两个类型）。以后模块里新增的内部函数不会自动暴露出去。

## v1.0.1

### 修复

- `dist/index.d.ts` 的相对导出补全 `.js` 扩展名。此前使用方在 `moduleResolution: node16 | nodenext` 下会遇到 TS2834，并导致全部导出类型缺失。
- `exports` 条件顺序调整，`types` 置于 `import` / `require` 之前，确保 TypeScript 优先读取类型声明。
- `repository.url` 规范为 `git+https://github.com/Libao-Jun/fast-utility.git`，消除 `npm publish` 的自动修正警告。

## v1.0.0

第一个正式版本。168 个函数，零运行时依赖，全部按名导出。

- 每个函数单独导出，未使用的不进入打包结果。
- 自带 TypeScript 类型声明，`isArray`、`isString` 这类判断函数可直接用作类型守卫。
- 不依赖 DOM 的函数在浏览器和 Node.js 中都能运行，依赖 DOM 的按分组标注「仅浏览器」。
- 除写入类函数外，其余函数不修改入参；排序、去重、合并都返回新数组或新对象。

### 类型判断 `is`（28）

- `isArray`：判断是否为数组（类型守卫）
- `isObject`：判断是否为普通对象（原型为 `Object.prototype` 或 `null`）
- `isTypeOf`：按 `Object.prototype.toString` 匹配类型名
- `isFunction`：判断是否为可调用对象
- `isAsyncFunction`：判断是否为 `async` 函数
- `isPromise`：判断是否为 Promise（含 `then` 方法）
- `isDate`：判断是否为 `Date`
- `isNumber`：判断是否为数字（`NaN` / `Infinity` 均为 `true`）
- `isInteger`：判断是否为有限整数
- `isFloat`：判断是否为有限小数
- `isString`：判断是否为字符串（含包装对象）
- `isBoolean`：判断是否为布尔值
- `isSymbol`：判断是否为 `Symbol`
- `isBasicType`：判断是否为基本类型（原始类型）
- `isNull`：判断是否为 `null`
- `isDefined`：判断是否已定义（不为 `undefined`）
- `isUndefined`：判断是否为 `undefined`
- `isNullOrUndefined`：判断是否为 `null` 或 `undefined`
- `isEmpty`：判断是否为空（含无效日期、空 `Map` / `Set`、空 `ArrayBuffer` 视图）
- `isEqual`：深度相等比较（支持 `Date` / `RegExp` / `Map` / `Set` / 循环引用）
- `isHexColor`：判断是否为十六进制颜色
- `isBrowser`：判断是否为浏览器环境
- `isWindow`：判断是否为 `window` 对象
- `isElement`：判断是否为 DOM 元素
- `isIOSDevice`：判断是否为 iOS 设备
- `isError`：判断是否为 `Error` 实例
- `isRegExp`：判断是否为正则对象
- `isTypedArray`：判断是否为 TypedArray（不含 `DataView`）

### 时间与日期 `time` / `format`（8）

- `nowMilliseconds`：获取当前毫秒时间戳，等价于 `Date.now()`
- `isToday`：判断给定日期是否为今天
- `firstDayOfMonth`：获取指定年月的第一天
- `lastDayOfMonth`：获取指定年月的最后一天
- `formatDateTime`：格式化完整日期时间（斜杠分隔）
- `formatDateTimeDash`：格式化完整日期时间（短横线分隔）
- `formatDateZhCN`：格式化为中文年月日
- `formatWeekdayZhCN`：获取中文星期几

### 数字与货币格式化 `format`（6）

- `formatCurrencyCNY`：人民币货币格式化
- `formatNumber`：千位分隔符格式化
- `formatPercent`：百分比格式化（入参为小数比例）
- `formatCompactEnUS`：大数简化（英文缩写，如 `12K`）
- `formatCompactZhCN`：大数简化（中文缩写，如 `1.2万`）
- `formatSigned`：带正负号的数值格式化

### 字符串 `format` / `string`（28）

- `maskPhone`：手机号脱敏
- `formatPhoneWithSpaces`：手机号按 3-4-4 空格分隔
- `capitalize`：每个单词首字母大写
- `uppercaseFirst`：首字母大写
- `lowercaseFirst`：首字母小写
- `reverse`：按码点反转字符串（emoji 安全）
- `trimAll`：去除所有空白字符
- `truncate`：按字符截断（中文 / emoji 按一字计，上限含后缀）
- `generateRandomString`：生成随机字母数字字符串
- `generateUUID`：生成 UUID v4（优先 `crypto.randomUUID()`）
- `escapeHTML`：转义 HTML 特殊字符
- `unescapeHTML`：反转义 HTML 实体
- `stripHTML`：去除 HTML 标签
- `ensurePrefix`：缺失时补充前缀
- `ensureSuffix`：缺失时补充后缀
- `removePrefix`：存在时移除前缀
- `removeSuffix`：存在时移除后缀
- `byteSize`：获取 UTF-8 字节长度
- `maskName`：姓名脱敏
- `splitWords`：拆分为 ASCII 单词数组
- `camelCase`：转换为小驼峰命名
- `pascalCase`：转换为大驼峰命名
- `snakeCase`：转换为下划线命名
- `kebabCase`：转换为短横线命名
- `removeDiacritics`：去除拉丁变音符号
- `escapeRegExp`：转义正则元字符
- `renderTemplate`：按 `{{key}}` 占位符替换变量
- `titleCase`：转换为标题式命名

### 数组 `array`（39）

- `unique`：按 SameValueZero 去重；可传取值函数按值去重（保留首次出现）
- `uniqueByKey`：对象数组按属性去重（保留首次出现）
- `sortNumbersAscending`：数值升序排序
- `sortNumbersDescending`：数值降序排序
- `sortNumbersByKey`：对象数组按数值属性排序
- `toArray`：类数组或可迭代对象转数组
- `flatten`：多维数组扁平化到指定层级
- `findInArray`：按属性值查找首个匹配项
- `groupBy`：按属性或取值函数分组
- `omitEmptyValues`：移除对象中的空值属性
- `createRange`：按长度生成序列数组
- `chunk`：按固定长度切分数组
- `compact`：去除数组中的假值
- `difference`：数组差集
- `intersection`：数组交集（去重）
- `union`：数组合并去重
- `drop`：从开头丢弃指定数量元素
- `dropRight`：从末尾丢弃指定数量元素
- `take`：从开头截取指定数量元素
- `takeRight`：从末尾截取指定数量元素
- `nth`：读取指定索引元素（支持负索引）
- `sample`：随机取一个元素
- `shuffle`：洗牌（Fisher–Yates）
- `sampleSize`：随机取指定数量的不重复元素
- `zip`：按最长数组拉链合并
- `partition`：按条件拆分为两组
- `countBy`：按属性或取值函数计数
- `keyBy`：按属性或取值函数建立索引
- `maxBy`：按数值取值取最大元素
- `minBy`：按数值取值取最小元素
- `sortBy`：按取值函数升序排序
- `replace`：替换第一个匹配元素
- `replaceOrAppend`：替换第一个匹配元素，未匹配时追加
- `toggle`：切换元素存在状态（可强制保留 / 移除）
- `zipToObject`：由键数组与值来源构造对象
- `rotate`：旋转数组（正数向右、负数向左）
- `hasIntersection`：判断两个数组是否存在交集
- `toObjectBy`：按取值函数把数组投影为对象
- `filterMap`：单次遍历完成过滤与映射

### 对象 `object`（12）

- `pick`：挑选自有属性
- `omit`：排除指定属性
- `mapValues`：映射对象的值
- `mapKeys`：映射对象的键
- `invert`：键值互换
- `merge`：深度合并普通对象（返回新对象，拦截原型污染键）
- `get`：按路径读取值（支持 `a[0].b`）
- `has`：判断路径是否存在
- `set`：按路径写入（不可变，仅复制路径节点）
- `flattenObject`：将嵌套对象压平为路径键
- `unflattenObject`：将路径键还原为嵌套对象
- `mapEntries`：同时映射对象的键与值

### 拷贝 `copy`（4）

- `deepClone`：递归深拷贝（支持 `Date` / `RegExp` / `Map` / `Set` / 循环引用）
- `cloneWithJSON`：基于 JSON 的深拷贝（仅 JSON 安全类型）
- `cloneStructured`：基于 `structuredClone` 的深拷贝
- `shallowClone`：浅拷贝（仅第一层）

### 存储与 Cookie `storage` / `cookie`（7，仅浏览器）

- `getLocalStorage`：读取 localStorage（自动 `JSON.parse`）
- `setLocalStorage`：写入 localStorage（自动 `JSON.stringify`）
- `removeLocalStorage`：移除指定 localStorage
- `clearLocalStorage`：清空 localStorage
- `setCookie`：设置 Cookie（`days` 为 0 表示会话级）
- `getCookie`：读取 Cookie
- `removeCookie`：删除 Cookie

### 浏览器 `browser`（10，仅浏览器）

- `getURLParams`：解析 URL 查询参数为对象（支持相对路径）
- `getURLParam`：读取单个 URL 查询参数
- `toQueryString`：对象转查询字符串
- `copyToClipboard`：复制文本到剪贴板（Clipboard API 失败时回退）
- `downloadFile`：通过 Blob 触发文件下载
- `exportJSON`：以 JSON 文件导出并下载
- `scrollToTop`：滚动到页面顶部
- `scrollToBottom`：滚动到页面底部
- `onScroll`：监听页面滚动（rAF 节流，被动监听）
- `observeIntersection`：监听元素进出可视区域

### 函数控制 `control` / `function`（9）

- `debounce`：防抖，返回值带 `cancel()`
- `throttle`：节流，返回值带 `cancel()`
- `once`：最多执行一次并缓存结果
- `memoize`：按首参缓存结果，可自定义缓存键
- `pipe`：从左到右组合函数
- `compose`：从右到左组合函数
- `partial`：预置前部参数
- `attempt`：捕获同步 / 异步异常并返回 `[error, value]` 元组（支持透传参数）
- `tryOrUndefined`：吞掉异常返回 `undefined`，可定制放行条件

### 异步 `async`（3）

- `sleep`：等待指定毫秒后 resolve
- `retry`：失败后按次数与延迟重试（支持自定义退避与停止条件）
- `parallelMap`：限制并发数执行异步映射，结果保持输入顺序

### 数学 `math`（10）

- `clamp`：将数值限制在闭区间内
- `randomInteger`：生成闭区间内的随机整数
- `randomFloat`：生成半开区间内的随机浮点数
- `round`：四舍五入到指定小数位（修正浮点误差）
- `sum`：数组求和；可传取值函数
- `average`：数组平均值；可传取值函数
- `inRange`：判断数值是否在闭区间内
- `linearInterpolate`：线性插值
- `toInteger`：转换为整数（失败返回 `0`）
- `toFloat`：转换为浮点数（失败返回 `0`）

### 格式校验 `validation`（4）

- `isChineseIDCard`：校验身份证号码格式
- `isEmail`：邮箱格式校验（兼容 `+` 与点号）
- `isMobilePhone`：校验国内手机号
- `isURL`：校验 HTTP / HTTPS URL
