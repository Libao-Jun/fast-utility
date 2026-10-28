/**
 * 表单 / 输入校验工具集合。
 * @packageDocumentation
 */

/**
 * 校验身份证号码（支持 15 位 / 18 位，末位可为 `X`）。
 * @param value - 待校验的身份证号码字符串
 * @returns 格式合法返回 `true`（仅校验格式，不校验校验位真伪）
 * @example
 * checkCardNo('11010119900307321X') // true
 * checkCardNo('123') // false
 */
export const checkCardNo = (value: string): boolean => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i
  return reg.test(value)
}

/**
 * 校验是否为合法的邮箱地址。
 * @param value - 待校验的邮箱字符串
 * @returns 合法返回 `true`
 * @example
 * isEmail('user@example.com') // true
 * isEmail('invalid') // false
 */
export const isEmail = (value: string): boolean => {
  return /^[\w-]+@[\w-]+(\.[\w-]+)+$/.test(value)
}

/**
 * 校验是否为国内手机号（1 开头，第二位 3-9，共 11 位）。
 * @param value - 待校验的手机号（字符串或数字）
 * @returns 合法返回 `true`
 * @example
 * isTel('13812345678') // true
 * isTel(13812345678) // true
 * isTel('12345') // false
 */
export const isTel = (value: string | number): boolean => {
  return /^1[3-9,]\d{9}$/.test(value.toString())
}
