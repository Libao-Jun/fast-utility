# 更新日志

本文件记录 fast-utility 的版本变更。版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## v1.0.0

首个正式版本：零依赖、Tree-shaking 友好的 JavaScript / TypeScript 工具函数库，共 159 个函数。

**核心特性**

- 零运行时依赖，每个函数独立导出，未引用的不会进入产物。
- 内置 `.d.ts` 类型声明，`is*` 系列均为类型守卫，可在条件中自动收窄类型。
- 纯逻辑函数在浏览器与 Node 中通用；DOM 相关函数按分组标注「仅浏览器」。
- 处理类函数不修改入参，排序、去重、合并等均返回新数组或新对象。

### 类型判断 `is`（32）

- `isArray` — 判断是否为数组（类型守卫）
- `isObject` — 判断是否为普通对象（原型为 `Object.prototype` 或 `null`）
- `is` — 按 `Object.prototype.toString` 匹配类型名
- `isFunction` — 判断是否为可调用对象
- `isAsyncFunction` — 判断是否为 `async` 函数
- `isPromise` — 判断是否为 Promise（含 `then` 方法）
- `isDate` — 判断是否为 `Date`
- `isNumber` — 判断是否为数字（`NaN` 返回 `false`，`Infinity` 返回 `true`）
- `isInt` — 判断是否为有限整数
- `isFloat` — 判断是否为有限小数
- `isString` — 判断是否为字符串（含包装对象）
- `isBoolean` — 判断是否为布尔值
- `isSymbol` — 判断是否为 `Symbol`
- `isPrimitive` — 判断是否为原始类型
- `isBasicType` — 判断是否为基本类型（`isPrimitive` 的别名）
- `isNull` — 判断是否为 `null`
- `isDef` — 判断是否已定义（不为 `undefined`）
- `isUnDef` — 判断是否为 `undefined`
- `isNullOrUnDef` — 判断是否为 `null` 或 `undefined`
- `isNil` — 判断是否为 `null` 或 `undefined`（语义化别名）
- `isEmpty` — 判断是否为空（完备版：含无效日期、空 `Map` / `Set`）
- `isEmptySv` — 判断是否为空（简化版：支持 `ArrayBuffer` 视图）
- `isEqual` — 深度相等比较（支持 `Date` / `RegExp` / `Map` / `Set` / 循环引用）
- `isHexColor` — 判断是否为十六进制颜色
- `isValidEmail` — 宽松邮箱校验
- `isPC` — 判断是否为浏览器环境
- `isWindow` — 判断是否为 `window` 对象
- `isElement` — 判断是否为 DOM 元素
- `isIOS` — 判断是否为 iOS 设备
- `isError` — 判断是否为 `Error` 实例
- `isRegExp` — 判断是否为正则对象
- `isTypedArray` — 判断是否为 TypedArray（不含 `DataView`）

### 时间与日期 `time` / `format`（8）

- `timestamp` — 获取当前毫秒时间戳，等价于 `Date.now()`
- `isToday` — 判断给定日期是否为今天
- `firstDay` — 获取指定年月的第一天
- `lastDay` — 获取指定年月的最后一天
- `formatFull` — 格式化完整日期时间（斜杠分隔）
- `formatFullReplace` — 格式化完整日期时间（短横线分隔）
- `formatYMD` — 格式化为中文年月日
- `formatWeek` — 获取中文星期几

### 数字与货币格式化 `format`（6）

- `formatRmb` — 人民币货币格式化
- `formatNum` — 千位分隔符格式化
- `percentCN` — 百分比格式化（入参为小数比例）
- `compactEN` — 大数简化（英文缩写，如 `12K`）
- `compactCN` — 大数简化（中文缩写，如 `1.2万`）
- `signed` — 带正负号的数值格式化

### 字符串 `format` / `string`（30）

- `maskPhone` — 手机号脱敏
- `spacePhone` — 手机号按 3-4-4 空格分隔
- `capitalize` — 每个单词首字母大写
- `kebabToCamel` — 短横线命名转小驼峰
- `camelToKebab` — 小驼峰转短横线命名
- `toCamel` — 下划线命名转小驼峰
- `firstUpper` — 首字母大写
- `firstLower` — 首字母小写
- `reverse` — 按码点反转字符串（emoji 安全）
- `trimAll` — 去除所有空白字符
- `truncate` — 按长度截断（上限含后缀）
- `truncateByWords` — 按字符截断（中文按一字计）
- `randomString` — 生成随机字母数字字符串
- `uuid` — 生成 UUID v4（优先 `crypto.randomUUID()`）
- `escapeHtml` — 转义 HTML 特殊字符
- `unescapeHtml` — 反转义 HTML 实体
- `stripHtml` — 去除 HTML 标签
- `ensurePrefix` — 缺失时补充前缀
- `ensureSuffix` — 缺失时补充后缀
- `removePrefix` — 存在时移除前缀
- `removeSuffix` — 存在时移除后缀
- `byteSize` — 获取 UTF-8 字节长度
- `maskName` — 姓名脱敏
- `words` — 拆分为 ASCII 单词数组
- `camelCase` — 转换为小驼峰命名
- `pascalCase` — 转换为大驼峰命名
- `snakeCase` — 转换为下划线命名
- `kebabCase` — 转换为短横线命名
- `deburr` — 去除拉丁变音符号
- `escapeRegExp` — 转义正则元字符

### 数组 `array`（32）

- `unique` — 按 SameValueZero 去重
- `uniqueByKey` — 对象数组按属性去重（保留最后一次出现）
- `sortNumAsc` — 数值升序排序
- `sortNumDesc` — 数值降序排序
- `sortByKey` — 对象数组按数值属性排序
- `toArray` — 类数组或可迭代对象转数组
- `mergeArrays` — 合并多个数组
- `flatten` — 多维数组扁平化到指定层级
- `arrFind` — 按属性值查找首个匹配项
- `groupBy` — 按属性分组
- `filterEmptyValues` — 移除对象中的空值属性
- `createRange` — 按长度生成序列数组
- `chunk` — 按固定长度切分数组
- `compact` — 去除数组中的假值
- `difference` — 数组差集
- `intersection` — 数组交集（去重）
- `union` — 数组合并去重
- `drop` — 从开头丢弃指定数量元素
- `dropRight` — 从末尾丢弃指定数量元素
- `take` — 从开头截取指定数量元素
- `takeRight` — 从末尾截取指定数量元素
- `nth` — 读取指定索引元素（支持负索引）
- `sample` — 随机取一个元素
- `shuffle` — 洗牌（Fisher–Yates）
- `sampleSize` — 随机取指定数量的不重复元素
- `zip` — 按最长数组拉链合并
- `partition` — 按条件拆分为两组
- `countBy` — 按属性或取值函数计数
- `keyBy` — 按属性或取值函数建立索引
- `maxBy` — 按数值取值取最大元素
- `minBy` — 按数值取值取最小元素
- `sortBy` — 按取值函数升序排序

### 对象 `object`（8）

- `pick` — 挑选自有属性
- `omit` — 排除指定属性
- `mapValues` — 映射对象的值
- `mapKeys` — 映射对象的键
- `invert` — 键值互换
- `merge` — 深度合并普通对象（返回新对象，拦截原型污染键）
- `get` — 按路径读取值（支持 `a[0].b`）
- `has` — 判断路径是否存在

### 拷贝 `copy`（4）

- `deepClone` — 递归深拷贝（支持 `Date` / `RegExp` / `Map` / `Set` / 循环引用）
- `deepCloneWithJSON` — 基于 JSON 的深拷贝（仅 JSON 安全类型）
- `structClone` — 基于 `structuredClone` 的深拷贝
- `shallowClone` — 浅拷贝（仅第一层）

### 存储与 Cookie `storage` / `cookie`（7，仅浏览器）

- `localGet` — 读取 localStorage（自动 `JSON.parse`）
- `localSet` — 写入 localStorage（自动 `JSON.stringify`）
- `localRm` — 移除指定 localStorage
- `localClear` — 清空 localStorage
- `setCookie` — 设置 Cookie（`days` 为 0 表示会话级）
- `getCookie` — 读取 Cookie
- `delCookie` — 删除 Cookie

### 浏览器 `browser`（10，仅浏览器）

- `getUrlParams` — 解析 URL 查询参数为对象（支持相对路径）
- `getUrlParam` — 读取单个 URL 查询参数
- `toQueryString` — 对象转查询字符串
- `copyToClipboard` — 复制文本到剪贴板（Clipboard API 失败时回退）
- `downloadFile` — 通过 Blob 触发文件下载
- `exportJSON` — 以 JSON 文件导出并下载
- `scrollToTop` — 滚动到页面顶部
- `scrollToBottom` — 滚动到页面底部
- `onScroll` — 监听页面滚动（rAF 节流，被动监听）
- `observeIntersection` — 监听元素进出可视区域

### 函数控制 `control` / `function`（8）

- `debounce` — 防抖，返回值带 `cancel()`
- `throttle` — 节流，返回值带 `cancel()`
- `once` — 最多执行一次并缓存结果
- `memoize` — 按首参缓存结果，可自定义缓存键
- `pipe` — 从左到右组合函数
- `compose` — 从右到左组合函数
- `partial` — 预置前部参数
- `attempt` — 捕获异常并返回 `[error, value]` 元组

### 数学 `math`（10）

- `clamp` — 将数值限制在闭区间内
- `randomInt` — 生成闭区间内的随机整数
- `randomFloat` — 生成半开区间内的随机浮点数
- `round` — 四舍五入到指定小数位（修正浮点误差）
- `sum` — 数组求和
- `average` — 数组平均值
- `inRange` — 判断数值是否在闭区间内
- `lerp` — 线性插值
- `toInt` — 转换为整数（失败返回 `0`）
- `toFloat` — 转换为浮点数（失败返回 `0`）

### 格式校验 `validation`（4）

- `checkCardNo` — 校验身份证号码格式
- `isEmail` — 严格邮箱格式校验
- `isTel` — 校验国内手机号
- `isUrl` — 校验 HTTP / HTTPS URL
