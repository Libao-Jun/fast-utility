import { describe, it, expect } from 'vitest'
import {
  formatDateTime,
  formatDateTimeDash,
  formatDateZhCN,
  formatWeekdayZhCN,
  formatCurrencyCNY,
  formatNumber,
  formatPercent,
  formatCompactEnUS,
  formatCompactZhCN,
  formatSigned,
  maskPhone,
  formatPhoneWithSpaces,
  capitalize,
  truncate,
  trimAll,
  uppercaseFirst,
  lowercaseFirst,
  reverse,
} from '../src/format'

// ============================================================
// formatDateTime
// ============================================================
describe('formatDateTime', () => {
  it('should format date with slashes in zh-CN locale', () => {
    const date = new Date(2026, 5, 3, 14, 30, 45) // June 3, 2026
    const result = formatDateTime(date)
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/06/)
    expect(result).toMatch(/03/)
    expect(result).toMatch(/14:30:45/)
  })

  it('should use zh-CN format with slashes', () => {
    const date = new Date(2026, 0, 1, 0, 0, 0)
    const result = formatDateTime(date)
    expect(result).toContain('2026/01/01')
  })

  it('should include seconds in output', () => {
    const date = new Date(2026, 0, 1, 12, 30, 45)
    const result = formatDateTime(date)
    expect(result).toContain(':45')
  })
})

// ============================================================
// formatDateTimeDash
// ============================================================
describe('formatDateTimeDash', () => {
  it('should format date with dashes instead of slashes', () => {
    const date = new Date(2026, 5, 3, 14, 30, 45)
    const result = formatDateTimeDash(date)
    expect(result).toMatch(/2026-06-03/)
    expect(result).toMatch(/14:30:45/)
  })

  it('should not contain slashes', () => {
    const date = new Date(2026, 5, 3)
    const result = formatDateTimeDash(date)
    expect(result).not.toContain('/')
  })
})

// ============================================================
// formatDateZhCN
// ============================================================
describe('formatDateZhCN', () => {
  it('should format date in Chinese YMD format', () => {
    const date = new Date(2026, 5, 3) // June 3, 2026
    const result = formatDateZhCN(date)
    // zh-CN long month format: "2026年6月3日"
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/6月/)
    expect(result).toMatch(/3日/)
  })

  it('should handle different months', () => {
    const jan = new Date(2026, 0, 15)
    expect(formatDateZhCN(jan)).toMatch(/1月/)
    const dec = new Date(2026, 11, 1)
    expect(formatDateZhCN(dec)).toMatch(/12月/)
  })
})

// ============================================================
// formatWeekdayZhCN
// ============================================================
describe('formatWeekdayZhCN', () => {
  it('should return Chinese weekday name', () => {
    // June 3, 2026 is a Wednesday
    const date = new Date(2026, 5, 3)
    const result = formatWeekdayZhCN(date)
    expect(result).toMatch(/星期[一二三四五六日]/)
  })
})

// ============================================================
// formatCurrencyCNY
// ============================================================
describe('formatCurrencyCNY', () => {
  it('should format RMB currency', () => {
    const result = formatCurrencyCNY(1234.56, { type: 'zh-CN', currency: 'CNY' })
    expect(result).toContain('1')
    expect(result).toContain('234')
    // CNY uses ¥ symbol
    expect(result).toMatch(/[¥￥]/)
  })

  it('should format integer amounts', () => {
    const result = formatCurrencyCNY(1000, { type: 'zh-CN', currency: 'CNY' })
    expect(result).toBeTruthy()
  })

  it('should format zero', () => {
    const result = formatCurrencyCNY(0, { type: 'zh-CN', currency: 'CNY' })
    expect(result).toBeTruthy()
  })
})

// ============================================================
// formatNumber
// ============================================================
describe('formatNumber', () => {
  it('should format numbers with thousands separator', () => {
    const result = formatNumber(1234567)
    expect(result).toBe('1,234,567')
  })

  it('should handle small numbers', () => {
    expect(formatNumber(123)).toBe('123')
    expect(formatNumber(0)).toBe('0')
  })

  it('should handle negative numbers', () => {
    const result = formatNumber(-1234)
    expect(result).toContain('-')
    expect(result).toContain('1,234')
  })

  it('should handle large numbers', () => {
    const result = formatNumber(1000000000)
    expect(result).toContain(',')
  })
})

// ============================================================
// formatPercent
// ============================================================
describe('formatPercent', () => {
  it('should format as percentage with 0 decimal by default', () => {
    const result = formatPercent(0.1234)
    expect(result).toContain('12')
    expect(result).toContain('%')
  })

  it('should format with specified decimal places', () => {
    const result = formatPercent(0.1234, 2)
    expect(result).toContain('12.34')
    expect(result).toContain('%')
  })

  it('should handle 0', () => {
    const result = formatPercent(0)
    expect(result).toContain('0')
    expect(result).toContain('%')
  })

  it('should handle 1 (100%)', () => {
    const result = formatPercent(1)
    expect(result).toContain('100')
    expect(result).toContain('%')
  })
})

// ============================================================
// formatCompactEnUS
// ============================================================
describe('formatCompactEnUS', () => {
  it('should compact large numbers with English abbreviations', () => {
    const result = formatCompactEnUS(12345)
    expect(result).toBeTruthy()
  })

  it('should handle millions', () => {
    const result = formatCompactEnUS(1_500_000)
    expect(result).toMatch(/[KM]/)
  })

  it('should return string', () => {
    expect(typeof formatCompactEnUS(1000)).toBe('string')
  })
})

// ============================================================
// formatCompactZhCN
// ============================================================
describe('formatCompactZhCN', () => {
  it('should compact large numbers with Chinese abbreviations', () => {
    const result = formatCompactZhCN(12345)
    expect(result).toMatch(/万|亿/)
  })

  it('should handle smaller numbers', () => {
    const result = formatCompactZhCN(500)
    expect(result).toBeTruthy()
  })

  it('should return string', () => {
    expect(typeof formatCompactZhCN(1000)).toBe('string')
  })
})

// ============================================================
// formatSigned
// ============================================================
describe('formatSigned', () => {
  it('should always show positive sign', () => {
    expect(formatSigned(42)).toBe('+42')
  })

  it('should always show negative sign', () => {
    expect(formatSigned(-5)).toBe('-5')
  })

  it('should handle zero', () => {
    const result = formatSigned(0)
    expect(result).toMatch(/[+-]0/)
  })

  it('should respect decimal digit parameter', () => {
    const result = formatSigned(42, 1)
    expect(result).toMatch(/\+42\.0/)
  })

  it('should handle negative with decimals', () => {
    const result = formatSigned(-3.14, 2)
    expect(result).toContain('-3.14')
  })
})

// ============================================================
// maskPhone
// ============================================================
describe('maskPhone', () => {
  it('should mask middle 4 digits', () => {
    expect(maskPhone('13812345678')).toBe('138****5678')
  })

  it('should handle different phone numbers', () => {
    expect(maskPhone('15900001111')).toBe('159****1111')
  })
})

// ============================================================
// formatPhoneWithSpaces
// ============================================================
describe('formatPhoneWithSpaces', () => {
  it('should format phone with spaces', () => {
    expect(formatPhoneWithSpaces('13812345678')).toBe('138 1234 5678')
  })

  it('should handle different phone numbers', () => {
    expect(formatPhoneWithSpaces('15900001111')).toBe('159 0000 1111')
  })
})

// ============================================================
// capitalize
// ============================================================
describe('capitalize', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalize('hello world')).toBe('Hello World')
  })

  it('should handle single word', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should handle multiple splitWords', () => {
    expect(capitalize('the quick brown fox')).toBe('The Quick Brown Fox')
  })

  it('should handle already capitalized text', () => {
    expect(capitalize('Hello World')).toBe('Hello World')
  })

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('')
  })
})



// ============================================================
// truncate
// ============================================================
describe('truncate', () => {
  it('should truncate string exceeding maxLength', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...')
  })

  it('should not truncate string within maxLength', () => {
    expect(truncate('Hello', 8)).toBe('Hello')
  })

  it('should use custom suffix', () => {
    expect(truncate('Hello World', 8, '…')).toBe('Hello W…')
  })

  it('should handle short maxLength', () => {
    expect(truncate('Hello World', 5)).toBe('He...')
  })

  it('should handle border length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('should count CJK and emoji as one character', () => {
    expect(truncate('你好世界欢迎你呀', 7)).toBe('你好世界...')
    expect(truncate('你好世界欢迎你', 7)).toBe('你好世界欢迎你')
    expect(truncate('👍👍👍👍👍👍', 5)).toBe('👍👍...')
  })
})

// ============================================================
// trimAll
// ============================================================
describe('trimAll', () => {
  it('should remove all whitespace', () => {
    expect(trimAll(' hello  world ')).toBe('helloworld')
  })

  it('should remove tabs and newlines', () => {
    expect(trimAll('hello\t\n world')).toBe('helloworld')
  })

  it('should handle string with no spaces', () => {
    expect(trimAll('hello')).toBe('hello')
  })

  it('should handle empty string', () => {
    expect(trimAll('')).toBe('')
  })

  it('should handle only whitespace', () => {
    expect(trimAll('   ')).toBe('')
  })
})


// ============================================================
// uppercaseFirst
// ============================================================
describe('uppercaseFirst', () => {
  it('should capitalize first letter', () => {
    expect(uppercaseFirst('hello')).toBe('Hello')
  })

  it('should keep rest of string unchanged', () => {
    expect(uppercaseFirst('helloWorld')).toBe('HelloWorld')
  })

  it('should handle already capitalized', () => {
    expect(uppercaseFirst('Hello')).toBe('Hello')
  })

  it('should handle single character', () => {
    expect(uppercaseFirst('h')).toBe('H')
  })

  it('should handle empty string', () => {
    expect(uppercaseFirst('')).toBe('')
  })
})

// ============================================================
// lowercaseFirst
// ============================================================
describe('lowercaseFirst', () => {
  it('should lowercase first letter', () => {
    expect(lowercaseFirst('Hello')).toBe('hello')
  })

  it('should keep rest of string unchanged', () => {
    expect(lowercaseFirst('HELLO')).toBe('hELLO')
  })

  it('should handle already lowercase', () => {
    expect(lowercaseFirst('hello')).toBe('hello')
  })

  it('should handle single character', () => {
    expect(lowercaseFirst('H')).toBe('h')
  })

  it('should handle empty string', () => {
    expect(lowercaseFirst('')).toBe('')
  })
})

// ============================================================
// reverse
// ============================================================
describe('reverse', () => {
  it('should reverse a string', () => {
    expect(reverse('hello')).toBe('olleh')
  })

  it('should handle palindrome', () => {
    expect(reverse('aba')).toBe('aba')
  })

  it('should handle single character', () => {
    expect(reverse('a')).toBe('a')
  })

  it('should handle empty string', () => {
    expect(reverse('')).toBe('')
  })

  it('should handle string with spaces', () => {
    expect(reverse('ab cd')).toBe('dc ba')
  })
})
