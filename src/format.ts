/**
 * 格式化相关工具：日期、货币、数字、字符串样式与脱敏。
 * @packageDocumentation
 */

/**
 * 格式化为完整的日期时间（中文区域，斜杠分隔 `YYYY/MM/DD HH:mm:ss`，24 小时制）。
 * @param date - 待格式化的 `Date` 对象
 * @returns 形如 `2026/09/20 14:30:05` 的字符串
 * @example
 * formatFull(new Date(2026, 8, 20, 14, 30, 5)) // '2026/09/20 14:30:05'
 */
export const formatFull = (date: Date): string => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(date)
};

/**
 * 完整日期时间，但使用短横线分隔（由 `formatFull` 转换而来）。
 * @param date - 待格式化的 `Date` 对象
 * @returns 形如 `2026-09-20 14:30:05` 的字符串
 * @example
 * formatFullReplace(new Date(2026, 8, 20)) // '2026-09-20 00:00:00'
 */
export const formatFullReplace = (date: Date): string => formatFull(date).replace(/\//g, "-")

/**
 * 格式化为中文年月日（如 `2026年9月20日`）。
 * @param date - 待格式化的 `Date` 对象
 * @returns 中文长格式日期字符串
 * @example
 * formatYMD(new Date(2026, 8, 20)) // '2026年9月20日'
 */
export const formatYMD = (date: Date): string => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "long", day: "numeric",
  }).format(date)
};

/**
 * 获取中文星期几（如 `星期日`）。
 * @param date - 待格式化的 `Date` 对象
 * @returns 中文星期字符串
 * @example
 * formatWeek(new Date(2026, 8, 20)) // '星期日'（依实际日期而定）
 */
export const formatWeek = (date: Date): string => {
  return new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(date)
};

/**
 * 格式化为人民币货币字符串（如 `¥1,234.00`）。
 * @param value - 数值金额
 * @param options - 固定为 `{ type: "zh-CN", currency: "CNY" }`，保持接口一致性
 * @returns 人民币格式字符串
 * @example
 * formatRmb(1234.5, { type: "zh-CN", currency: "CNY" }) // '¥1,234.50'
 */
export const formatRmb = (
  value: number,
  options: { type: "zh-CN"; currency: "CNY" },
): string => {
  return new Intl.NumberFormat(options.type, {
    style: "currency", currency: options.currency,
  }).format(value)
};

/**
 * 数字千位分隔符格式化（中文区域）。
 * @param value - 待格式化的数值
 * @returns 带千位分隔符的字符串
 * @example
 * formatNum(1234567) // '1,234,567'
 */
export const formatNum = (value: number): string => new Intl.NumberFormat("zh-CN").format(value)

/**
 * 百分比格式化（值会被乘以 100 并附加 `%`）。
 * @param value - 小数比例值（如 `0.25` 表示 25%）
 * @param digit - 保留的小数位数，默认 `0`
 * @returns 百分比字符串
 * @example
 * percentCN(0.25) // '25%'
 * percentCN(0.1234, 2) // '12.34%'
 */
export const percentCN = (value: number, digit: number = 0): string => {
  return new Intl.NumberFormat("zh-CN", {
    style: "percent", minimumFractionDigits: digit,
  }).format(value)
};

/**
 * 大数简化（英文缩写，如 `1.2K` / `3.4M`）。
 * @param value - 待简化的数值
 * @returns 紧凑英文格式字符串
 * @example
 * compactEN(1234) // '1.2K'
 * compactEN(1_000_000) // '1M'
 */
export const compactEN = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact", compactDisplay: "short",
  }).format(value)
};

/**
 * 大数简化（中文缩写，如 `1.2万` / `3.4亿`）。
 * @param value - 待简化的数值
 * @returns 紧凑中文格式字符串
 * @example
 * compactCN(12345) // '1.2万'
 */
export const compactCN = (value: number): string => {
  return new Intl.NumberFormat("zh-CN", {
    notation: "compact", compactDisplay: "short",
  }).format(value)
};

/**
 * 带正负号的数值格式化（负数带 `-`，正数强制带 `+`）。
 * @param value - 待格式化的数值
 * @param digit - 保留的小数位数，默认 `0`
 * @returns 带符号的字符串
 * @example
 * signed(5) // '+5'
 * signed(-3.2, 1) // '-3.2'
 */
export const signed = (value: number, digit = 0): string => {
  return new Intl.NumberFormat("en-US", {
    signDisplay: "always", minimumFractionDigits: digit,
  }).format(value)
};

/**
 * 手机号脱敏：保留前 3 位与后 4 位，中间 4 位替换为 `*`。
 * @param phone - 11 位手机号字符串
 * @returns 脱敏后的字符串
 * @example
 * maskPhone('13812345678') // '138****5678'
 */
export const maskPhone = (phone: string): string => phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")

/**
 * 手机号按 `3 4 4` 规则以空格分隔，便于阅读。
 * @param phone - 11 位手机号字符串
 * @returns 空格分隔后的字符串
 * @example
 * spacePhone('13812345678') // '138 1234 5678'
 */
export const spacePhone = (phone: string): string => phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")

/**
 * 将字符串中每个单词的首字母大写（其余保持不变）。
 * @param str - 待处理的字符串
 * @returns 首字母大写的字符串
 * @example
 * capitalize('hello world') // 'Hello World'
 */
export const capitalize = (str: string): string => str.replace(/\b\w/g, (char) => char.toUpperCase())

/**
 * 短横线命名（kebab-case）转为小驼峰命名（camelCase）。
 * @param str - kebab-case 字符串
 * @returns camelCase 字符串
 * @example
 * kebabToCamel('my-user-name') // 'myUserName'
 */
export const kebabToCamel = (str: string): string => str.replace(/-([a-z])/g, (_, l) => l.toUpperCase())

/**
 * 小驼峰命名（camelCase）转为短横线命名（kebab-case）。
 * @param str - camelCase 字符串
 * @returns kebab-case 字符串
 * @example
 * camelToKebab('myUserName') // 'my-user-name'
 */
export const camelToKebab = (str: string): string => str.replace(/([A-Z])/g, "-$1").toLowerCase()

/**
 * 按字符数截断字符串，超出部分追加后缀。
 * @param str - 原始字符串
 * @param maxLength - 允许的最大长度（含后缀）
 * @param suffix - 截断后缀，默认 `"..."`
 * @returns 截断后的字符串（未超出则原样返回）
 * @example
 * truncate('hello world', 8) // 'hello...'
 */
export const truncate = (str: string, maxLength: number, suffix = "..."): string => {
  return str.length <= maxLength ? str : str.substring(0, maxLength - suffix.length) + suffix
};

/**
 * 按"字符"（含中文按一个字计）截断文本，对中文更友好。
 * @param str - 原始字符串
 * @param maxWords - 允许的最大字符数（含后缀）
 * @param suffix - 截断后缀，默认 `"..."`
 * @returns 截断后的字符串
 * @example
 * truncateByWords('你好世界abc', 4) // '你好世...'
 */
export const truncateByWords = (str: string, maxWords: number, suffix = "..."): string => {
  const chars = [...str]
  return chars.length <= maxWords ? str : chars.slice(0, maxWords).join("") + suffix
};

/**
 * 去除字符串中所有空白字符（空格、制表符、换行等）。
 * @param str - 原始字符串
 * @returns 去除全部空白后的字符串
 * @example
 * trimAll(' a  b\nc ') // 'abc'
 */
export const trimAll = (str: string): string => str.replace(/\s+/g, "")

/**
 * 下划线命名（snake_case）转为小驼峰命名（camelCase）。
 * @param str - snake_case 字符串
 * @returns camelCase 字符串
 * @example
 * toCamel('my_user_name') // 'myUserName'
 */
export const toCamel = (str: string): string => str.replace(/_([a-z])/g, (_, l) => l.toUpperCase())

/**
 * 首字母大写。
 * @param str - 原始字符串
 * @returns 首字母大写的字符串
 * @example
 * firstUpper('hello') // 'Hello'
 */
export const firstUpper = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * 首字母小写。
 * @param str - 原始字符串
 * @returns 首字母小写的字符串
 * @example
 * firstLower('Hello') // 'hello'
 */
export const firstLower = (str: string): string => str.charAt(0).toLowerCase() + str.slice(1)

/**
 * 反转字符串（按 Unicode 码点，正确处理 emoji 等多字节字符）。
 * @param str - 原始字符串
 * @returns 反转后的字符串
 * @example
 * reverse('abc') // 'cba'
 */
export const reverse = (str: string): string => [...str].reverse().join("")
