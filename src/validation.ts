/**
 * 校验身份证号码（支持 15 位 / 18 位，末位可为 `X`）。
 * @param value - 待校验的身份证号码字符串
 * @returns 格式合法返回 `true`（仅校验格式，不校验校验位真伪）
 */
export const checkCardNo = (value: string): boolean => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i
  return reg.test(value)
}

/**
 * 校验是否为合法的邮箱地址（严格版：本地部分仅允许字母、数字、下划线与短横线，不支持 `+` 和点号；域名须含至少一个点）。
 * @param value - 待校验的邮箱字符串
 * @returns 合法返回 `true`
 * @remarks 需要兼容 `user+tag@example.com`、`user.name@example.com` 等常见格式时，改用 `isValidEmail`。
 * @see isValidEmail
 */
export const isEmail = (value: string): boolean => {
  return /^[\w-]+@[\w-]+(\.[\w-]+)+$/.test(value)
}

/**
 * 校验是否为国内手机号（1 开头，第二位 3-9，共 11 位）。
 * @param value - 待校验的手机号（字符串或数字）
 * @returns 合法返回 `true`
 */
export const isTel = (value: string | number): boolean => {
  return /^1[3-9]\d{9}$/.test(value.toString())
}

/**
 * 校验是否为合法的 HTTP / HTTPS URL。
 * @param value - 待校验的字符串
 * @returns 合法返回 `true`
 * @remarks 仅接受 `http://` 与 `https://` 协议；`mailto:`、`ftp:`、相对路径等一律返回 `false`。
 */
export const isUrl = (value: string): boolean => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
