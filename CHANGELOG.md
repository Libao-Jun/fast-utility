# 更新日志

本文件记录 fast-utility 的版本变更。版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## v1.0.0

> 首次发布。零依赖、支持 Tree-shaking 的轻量级前端工具函数库，涵盖类型判断、时间日期与货币格式化、字符串处理、深拷贝与数组操作、存储、Cookie、浏览器增强、防抖节流、数学工具与格式校验。

### 类型判断 `is`

- `isArray` — 判断是否为数组
- `isObject` — 判断是否为对象（不含数组）
- `is` — 通用类型判断（内部工具函数）
- `isFunction` — 判断是否为函数
- `isAsyncFunction` — 判断是否为异步函数
- `isPromise` — 判断是否为 Promise
- `isDate` — 判断是否为 Date 对象
- `isNumber` — 判断是否为数字（含 NaN / Infinity）
- `isInt` — 判断是否为整数
- `isFloat` — 判断是否为浮点数
- `isString` — 判断是否为字符串
- `isBoolean` — 判断是否为布尔值
- `isSymbol` — 判断是否为 Symbol
- `isPrimitive` — 判断是否为原始类型
- `isBasicType` — 检查是否为基础类型（string / number / boolean / symbol / bigint / null / undefined）
- `isNull` — 判断是否为 null
- `isDef` — 判断是否不是 undefined
- `isUnDef` — 判断是否为 undefined
- `isNullOrUnDef` — 判断是否为 null 或 undefined
- `isEmpty` — 判断是否为空（完备版：支持 Date / Map / Set 等）
- `isEmptySv` — 判断是否为空（简化版）
- `isEqual` — 深度相等比较（支持 Date / RegExp）
- `isHexColor` — 判断是否为十六进制颜色
- `isValidEmail` — 判断是否为有效邮箱
- `isPC` — 判断是否为 PC 端（浏览器环境）
- `isWindow` — 判断是否为 window 对象
- `isElement` — 判断是否为 DOM 元素
- `isIOS` — 判断设备是否为 iOS

### 时间戳 `time`

- `timestamp` — 获取当前时间戳（毫秒），等价于 `Date.now()`
- `isToday` — 判断日期是否为今天
- `firstDay` — 获取指定年月的第一天
- `lastDay` — 获取指定年月的最后一天

### 时间日期格式化 `format`

- `formatFull` — 完整日期时间（斜杠分隔）
- `formatFullReplace` — 完整日期时间（短横线分隔）
- `formatYMD` — 中文年月日
- `formatWeek` — 星期几

### 数字与货币格式化 `format`

- `formatRmb` — 货币格式化（人民币）
- `formatNum` — 千位分隔符
- `percentCN` — 百分比格式化
- `compactEN` — 大数简化（英文缩写）
- `compactCN` — 大数简化（中文缩写）
- `signed` — 带正负号显示

### 字符串处理 `string`

- `maskPhone` — 手机号脱敏（隐藏中间 4 位）
- `spacePhone` — 手机号空格分隔
- `capitalize` — 每个单词首字母大写
- `kebabToCamel` — 短横线转小驼峰
- `camelToKebab` — 驼峰转短横线
- `toCamel` — 下划线转驼峰
- `firstUpper` — 首字母大写
- `firstLower` — 首字母小写
- `reverse` — 反转字符串
- `trimAll` — 去除所有空格
- `truncate` — 超长文本截断
- `truncateByWords` — 按字数截断（中文友好）

### 存储 `storage`

- `localGet` — 获取 localStorage（自动 JSON 解析）
- `localSet` — 设置 localStorage（自动 JSON 序列化）
- `localRm` — 移除指定 localStorage
- `localClear` — 清除所有 localStorage

### 拷贝 `copy`

- `deepClone` — 递归深拷贝（支持 Date / RegExp / Map / Set / 循环引用）
- `deepCloneWithJSON` — JSON 深拷贝（仅 JSON 安全类型）
- `structClone` — structuredClone 深拷贝（不支持函数 / Symbol）
- `shallowClone` — 浅拷贝（仅第一层）

### 数组 `array`

- `unique` — Set 去重
- `uniqueByKey` — 对象数组按 key 去重
- `sortNumAsc` — 数值升序
- `sortNumDesc` — 数值降序
- `sortByKey` — 按对象属性排序
- `toArray` — 类数组转数组
- `mergeArrays` — 合并多个数组
- `flatten` — 多维数组扁平化到指定层级
- `arrFind` — 对象数组中按 key-value 查找第一个匹配项
- `groupBy` — 对象数组按指定属性分组
- `filterEmptyValues` — 移除对象中值为空（null / undefined / 空字符串）的属性
- `createRange` — 根据长度和映射函数快速生成数组

### Cookie `cookie`

- `setCookie` — 设置 Cookie
- `getCookie` — 获取 Cookie
- `delCookie` — 删除 Cookie

### 浏览器 `browser`

- `getUrlParams` — 获取 URL 参数对象
- `getUrlParam` — 获取单个 URL 参数
- `toQueryString` — 对象转 URL 参数字符串
- `copyToClipboard` — 复制文本到剪贴板（支持降级）
- `downloadFile` — 下载文件（Blob）
- `exportJSON` — 导出 JSON 为文件
- `scrollToTop` — 滚动到顶部（默认平滑）
- `scrollToBottom` — 滚动到底部（默认平滑）
- `onScroll` — 监听页面滚动（rAF 节流）
- `observeIntersection` — 监听目标元素进入 / 离开可视区域

### 防抖与节流 `control`

- `debounce` — 防抖：停止调用 delay 毫秒后才执行
- `throttle` — 节流：固定间隔内最多执行一次

### 数学 `math`

- `clamp` — 将值限制在 [min, max] 闭区间内
- `randomInt` — 生成 [min, max] 闭区间内的随机整数
- `randomFloat` — 生成 [min, max) 区间内的随机浮点数
- `round` — 四舍五入到指定小数位
- `sum` — 数组求和
- `average` — 数组平均值
- `inRange` — 判断数值是否在 [min, max] 闭区间内
- `lerp` — 线性插值

### 字符串 `string`

- `randomString` — 生成指定长度的随机字母数字字符串
- `uuid` — 生成 UUID v4
- `escapeHtml` — 转义 HTML 特殊字符
- `unescapeHtml` — 反转义 HTML 实体
- `stripHtml` — 去除字符串中的 HTML 标签
- `ensurePrefix` — 确保字符串以指定前缀开头
- `ensureSuffix` — 确保字符串以指定后缀结尾
- `removePrefix` — 移除字符串的前缀
- `removeSuffix` — 移除字符串的后缀
- `byteSize` — 获取字符串的 UTF-8 字节长度
- `maskName` — 姓名脱敏

### 格式校验 `validation`

- `checkCardNo` — 校验身份证号码（支持 15 / 18 位）
- `isEmail` — 校验是否为邮箱地址
- `isTel` — 校验是否为国内手机号
