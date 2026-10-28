/**
 * 生成指定长度的随机字符串（由大小写字母与数字组成）。
 * @param length - 字符串长度，默认 `8`
 * @returns 随机字符串
 */
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars.charAt(Math.random() * chars.length | 0)).join('')
}

/**
 * 生成 UUID v4（随机 UUID，符合 RFC 4122）。
 * @returns 形如 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` 的 UUID 字符串
 * @remarks 优先使用 `crypto.randomUUID()`；环境不支持时回退到基于 `Math.random` 的实现。
 */
export const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * 转义 HTML 特殊字符（防 XSS）。
 * @param str - 原始字符串
 * @returns 转义后的安全字符串（`&` `<` `>` `"` `'` 被替换）
 */
export const escapeHTML = (str: string): string => {
  const m: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return str.replace(/[&<>"']/g, (c) => m[c])
}

/**
 * 反转义 HTML 实体（将 `escapeHTML` 的结果还原）。
 * @param str - 含 HTML 实体的字符串
 * @returns 还原后的原始字符串
 */
export const unescapeHTML = (str: string): string => {
  const m: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (e) => m[e])
}

/**
 * 去除字符串中的全部 HTML 标签。
 * @param str - 含 HTML 标签的字符串
 * @returns 纯文本字符串
 */
export const stripHTML = (str: string): string => str.replace(/<[^>]*>/g, '')

/**
 * 确保字符串以指定前缀开头（已有则不变，否则添加）。
 * @param str - 原始字符串
 * @param prefix - 需确保的前缀
 * @returns 处理后的字符串
 */
export const ensurePrefix = (str: string, prefix: string): string => str.startsWith(prefix) ? str : prefix + str

/**
 * 确保字符串以指定后缀结尾（已有则不变，否则添加）。
 * @param str - 原始字符串
 * @param suffix - 需确保的后缀
 * @returns 处理后的字符串
 */
export const ensureSuffix = (str: string, suffix: string): string => str.endsWith(suffix) ? str : str + suffix

/**
 * 移除字符串开头的指定前缀（若存在）。
 * @param str - 原始字符串
 * @param prefix - 待移除的前缀；为空则不处理
 * @returns 处理后的字符串
 */
export const removePrefix = (str: string, prefix: string): string => {
  return !prefix || !str.startsWith(prefix) ? str : str.slice(prefix.length)
}

/**
 * 移除字符串结尾的指定后缀（若存在）。
 * @param str - 原始字符串
 * @param suffix - 待移除的后缀；为空则不处理
 * @returns 处理后的字符串
 */
export const removeSuffix = (str: string, suffix: string): string => {
  return !suffix || !str.endsWith(suffix) ? str : str.slice(0, -suffix.length)
}

/**
 * 计算字符串的 UTF-8 字节长度（中文等按多字节计）。
 * @param str - 原始字符串
 * @returns UTF-8 编码下的字节数
 */
export const byteSize = (str: string): number => new TextEncoder().encode(str).length

/**
 * 姓名脱敏：保留首字符，其余以 `*` 代替（长度大于 1 时）。
 * @param name - 姓名（任意可转为字符串的值）
 * @returns 脱敏后的姓名；空值或空字符串返回空字符串
 */
export const maskName = (name: unknown): string => {
  const str = String(name ?? '')
  if (!str.trim()) return ''
  const chars = [...str]
  return chars.length === 1 ? str : chars[0] + '*'.repeat(chars.length - 1)
}

/** 内部工具：ASCII 单词匹配（兼容 camelCase、snake_case、kebab-case 与空格分隔）。 */
const WORD_PATTERN = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g

/**
 * 将字符串拆分为单词数组（仅识别 ASCII 字母与数字）。
 * @param str - 原始字符串
 * @returns 单词数组；无匹配时返回空数组
 * @remarks 支持 `fooBar`、`foo_bar`、`foo-bar`、`foo bar` 等常见分隔形式；中文等非 ASCII 字符不会被识别为单词。
 */
export const splitWords = (str: string): string[] => {
  if (!str) return []
  return str.match(WORD_PATTERN) ?? []
}

/** 内部工具：单词首字母大写并统一小写其余部分。 */
const capitalizeWord = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

/**
 * 转换为小驼峰命名（camelCase）。
 * @param str - 原始字符串
 * @returns 小驼峰字符串；无单词时返回空字符串
 */
export const camelCase = (str: string): string => {
  return splitWords(str)
    .map((word, index) => index === 0 ? word.toLowerCase() : capitalizeWord(word))
    .join('')
}

/**
 * 转换为大驼峰命名（PascalCase）。
 * @param str - 原始字符串
 * @returns 大驼峰字符串；无单词时返回空字符串
 */
export const pascalCase = (str: string): string =>
  splitWords(str).map(capitalizeWord).join('')

/**
 * 转换为下划线命名（snake_case）。
 * @param str - 原始字符串
 * @returns 下划线字符串；无单词时返回空字符串
 */
export const snakeCase = (str: string): string =>
  splitWords(str).map((word) => word.toLowerCase()).join('_')

/**
 * 转换为短横线命名（kebab-case）。
 * @param str - 原始字符串
 * @returns 短横线字符串；无单词时返回空字符串
 */
export const kebabCase = (str: string): string =>
  splitWords(str).map((word) => word.toLowerCase()).join('-')

/**
 * 转换为标题式命名（每个单词首字母大写、空格分隔）。
 * @param str - 原始字符串
 * @returns 标题式字符串；无单词时返回空字符串
 * @remarks 仅识别 ASCII 单词，camelCase 会被拆分为多个单词。
 */
export const titleCase = (str: string): string =>
  splitWords(str).map(capitalizeWord).join(' ')

/**
 * 去除拉丁字符上的变音符号（如 `café` → `cafe`）。
 * @param str - 原始字符串
 * @returns 去除组合附加符号后的字符串
 * @remarks 基于 `String.prototype.normalize('NFD')`，不处理中文、日文等非拉丁文字。
 */
export const deburr = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * 转义字符串中的正则元字符，便于安全地拼接到 `RegExp` 中。
 * @param str - 原始字符串
 * @returns 转义后的字符串
 */
export const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * 按占位符替换模板中的变量。
 * @param str - 模板字符串
 * @param data - 变量表
 * @param pattern - 匹配模式，默认匹配 `{{key}}`；需包含一个捕获组并带 `g` 标志
 * @returns 替换后的字符串
 * @remarks 变量缺失或为 `null` / `undefined` 时替换为空字符串；自定义模式缺少 `g` 标志时只会替换首个匹配。
 */
export const renderTemplate = (
  str: string,
  data: Record<string, unknown>,
  pattern: RegExp = /\{\{\s*([\w.$-]+)\s*\}\}/g,
): string => {
  return str.replace(pattern, (_match: string, key: string) => {
    const value = data[key]
    return value === undefined || value === null ? '' : String(value)
  })
}
