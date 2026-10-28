import { describe, it, expect } from 'vitest'
import { checkCardNo, isEmail, isTel } from '../src/validation'

// ============================================================
// checkCardNo
// ============================================================
describe('checkCardNo', () => {
  it('18 位有效身份证返回 true', () => {
    expect(checkCardNo('110101199003074519')).toBe(true)
  })

  it('15 位有效身份证返回 true', () => {
    expect(checkCardNo('110101900307451')).toBe(true)
  })

  it('17 位 + X 结尾返回 true', () => {
    expect(checkCardNo('11010119900307451X')).toBe(true)
  })

  it('17 位 + x（小写）结尾返回 true', () => {
    expect(checkCardNo('11010119900307451x')).toBe(true)
  })

  it('无效身份证返回 false', () => {
    expect(checkCardNo('1234567890abcdef')).toBe(false)
  })

  it('长度不足返回 false', () => {
    expect(checkCardNo('11010119900307')).toBe(false)
  })

  it('长度超出返回 false', () => {
    expect(checkCardNo('11010119900307451900')).toBe(false)
  })

  it('含非数字非 X 字符返回 false', () => {
    expect(checkCardNo('11010119900307451Y')).toBe(false)
  })

  it('空字符串返回 false', () => {
    expect(checkCardNo('')).toBe(false)
  })
})

// ============================================================
// isEmail
// ============================================================
describe('isEmail', () => {
  it('标准邮箱返回 true', () => {
    expect(isEmail('test@example.com')).toBe(true)
  })

  it('带下划线返回 true', () => {
    expect(isEmail('user_name@example.com')).toBe(true)
  })

  it('带数字返回 true', () => {
    expect(isEmail('user123@example.com')).toBe(true)
  })

  it('带短横线返回 true', () => {
    expect(isEmail('user-name@example.com')).toBe(true)
  })

  it('多级域名返回 true', () => {
    expect(isEmail('test@mail.example.com')).toBe(true)
  })

  it('无 @ 符号返回 false', () => {
    expect(isEmail('testexample.com')).toBe(false)
  })

  it('无域名部分返回 false', () => {
    expect(isEmail('test@')).toBe(false)
  })

  it('无用户名部分返回 false', () => {
    expect(isEmail('@example.com')).toBe(false)
  })

  it('空字符串返回 false', () => {
    expect(isEmail('')).toBe(false)
  })
})

// ============================================================
// isTel
// ============================================================
describe('isTel', () => {
  it('标准 11 位手机号返回 true', () => {
    expect(isTel('13812345678')).toBe(true)
  })

  it('13x 开头返回 true', () => {
    expect(isTel('13012345678')).toBe(true)
  })

  it('15x 开头返回 true', () => {
    expect(isTel('15012345678')).toBe(true)
  })

  it('18x 开头返回 true', () => {
    expect(isTel('18012345678')).toBe(true)
  })

  it('19x 开头返回 true', () => {
    expect(isTel('19012345678')).toBe(true)
  })

  it('数字类型也可校验', () => {
    expect(isTel(13812345678)).toBe(true)
  })

  it('12x 开头返回 false', () => {
    expect(isTel('12012345678')).toBe(false)
  })

  it('10 位号码返回 false', () => {
    expect(isTel('1381234567')).toBe(false)
  })

  it('12 位号码返回 false', () => {
    expect(isTel('138123456789')).toBe(false)
  })

  it('含非数字字符返回 false', () => {
    expect(isTel('1381234567a')).toBe(false)
  })

  it('空字符串返回 false', () => {
    expect(isTel('')).toBe(false)
  })
})
