/**
 * 字符串处理与生成工具集合。
 * @packageDocumentation
 */

/**
 * 生成指定长度的随机字符串（由大小写字母与数字组成）。
 * @param length - 字符串长度，默认 `8`
 * @returns 随机字符串
 */
export const randomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars.charAt(Math.random() * chars.length | 0)).join('')
}

/**
 * 生成 UUID v4（随机 UUID，符合 RFC 4122）。
 * @returns 形如 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` 的 UUID 字符串
 */
export const uuid = (): string => {
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return template.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * 转义 HTML 特殊字符（防 XSS）。
 * @param str - 原始字符串
 * @returns 转义后的安全字符串（`&` `<` `>` `"` `'` 被替换）
 */
export const escapeHtml = (str: string): string => {
  const m: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return str.replace(/[&<>"']/g, (c) => m[c])
}

/**
 * 反转义 HTML 实体（将 `escapeHtml` 的结果还原）。
 * @param str - 含 HTML 实体的字符串
 * @returns 还原后的原始字符串
 */
export const unescapeHtml = (str: string): string => {
  const m: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (e) => m[e])
}

/**
 * 去除字符串中的全部 HTML 标签。
 * @param str - 含 HTML 标签的字符串
 * @returns 纯文本字符串
 */
export const stripHtml = (str: string): string => str.replace(/<[^>]*>/g, '')

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
