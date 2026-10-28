/**
 * 校验身份证号码（支持 15 位 / 18 位，末位可为 `X`）。
 * @param value - 待校验的身份证号码字符串
 * @returns 格式合法返回 `true`（仅校验格式，不校验校验位真伪）
 */
export const isChineseIDCard = (value: string): boolean => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i
  return reg.test(value)
}

/**
 * 校验是否为合法的邮箱地址（格式级校验）。
 *
 * 本地部分允许字母、数字与 `.` `_` `%` `+` `-`；域名须由至少两段组成，且不允许空段或空格。
 * 仅做格式筛查，不校验域名是否存在、邮箱是否可投递。
 * @param value - 待校验的邮箱字符串
 * @returns 合法返回 `true`
 */
export const isEmail = (value: string): boolean => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(value)
}

/**
 * 校验是否为国内手机号（1 开头，第二位 3-9，共 11 位）。
 * @param value - 待校验的手机号（字符串或数字）
 * @returns 合法返回 `true`
 */
export const isMobilePhone = (value: string | number): boolean => {
  return /^1[3-9]\d{9}$/.test(value.toString())
}

/**
 * 校验是否为合法的 HTTP / HTTPS URL。
 *
 * 仅接受 `http://` 与 `https://` 协议；`mailto:`、`ftp:`、相对路径等一律返回 `false`。
 * @param value - 待校验的字符串
 * @returns 合法返回 `true`
 */
export const isURL = (value: string): boolean => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
