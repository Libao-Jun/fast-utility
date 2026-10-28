import { describe, it, expect } from 'vitest'
import {
  formatFull,
  formatFullReplace,
  formatYMD,
  formatWeek,
  formatRmb,
  formatNum,
  percentCN,
  compactEN,
  compactCN,
  signed,
  maskPhone,
  spacePhone,
  capitalize,
  kebabToCamel,
  camelToKebab,
  truncate,
  truncateByWords,
  trimAll,
  toCamel,
  firstUpper,
  firstLower,
  reverse,
} from '../src/format'

// ============================================================
// formatFull
// ============================================================
describe('formatFull', () => {
  it('should format date with slashes in zh-CN locale', () => {
    const date = new Date(2026, 5, 3, 14, 30, 45) // June 3, 2026
    const result = formatFull(date)
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/06/)
    expect(result).toMatch(/03/)
    expect(result).toMatch(/14:30:45/)
  })

  it('should use zh-CN format with slashes', () => {
    const date = new Date(2026, 0, 1, 0, 0, 0)
    const result = formatFull(date)
    expect(result).toContain('2026/01/01')
  })

  it('should include seconds in output', () => {
    const date = new Date(2026, 0, 1, 12, 30, 45)
    const result = formatFull(date)
    expect(result).toContain(':45')
  })
})

// ============================================================
// formatFullReplace
// ============================================================
describe('formatFullReplace', () => {
  it('should format date with dashes instead of slashes', () => {
    const date = new Date(2026, 5, 3, 14, 30, 45)
    const result = formatFullReplace(date)
    expect(result).toMatch(/2026-06-03/)
    expect(result).toMatch(/14:30:45/)
  })

  it('should not contain slashes', () => {
    const date = new Date(2026, 5, 3)
    const result = formatFullReplace(date)
    expect(result).not.toContain('/')
  })
})

// ============================================================
// formatYMD
// ============================================================
describe('formatYMD', () => {
  it('should format date in Chinese YMD format', () => {
    const date = new Date(2026, 5, 3) // June 3, 2026
    const result = formatYMD(date)
    // zh-CN long month format: "2026年6月3日"
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/6月/)
    expect(result).toMatch(/3日/)
  })

  it('should handle different months', () => {
    const jan = new Date(2026, 0, 15)
    expect(formatYMD(jan)).toMatch(/1月/)
    const dec = new Date(2026, 11, 1)
    expect(formatYMD(dec)).toMatch(/12月/)
  })
})

// ============================================================
// formatWeek
// ============================================================
describe('formatWeek', () => {
  it('should return Chinese weekday name', () => {
    // June 3, 2026 is a Wednesday
    const date = new Date(2026, 5, 3)
    const result = formatWeek(date)
    expect(result).toMatch(/星期[一二三四五六日]/)
  })
})

// ============================================================
// formatRmb
// ============================================================
describe('formatRmb', () => {
  it('should format RMB currency', () => {
    const result = formatRmb(1234.56, { type: 'zh-CN', currency: 'CNY' })
    expect(result).toContain('1')
    expect(result).toContain('234')
    // CNY uses ¥ symbol
    expect(result).toMatch(/[¥￥]/)
  })

  it('should format integer amounts', () => {
    const result = formatRmb(1000, { type: 'zh-CN', currency: 'CNY' })
    expect(result).toBeTruthy()
  })

  it('should format zero', () => {
    const result = formatRmb(0, { type: 'zh-CN', currency: 'CNY' })
    expect(result).toBeTruthy()
  })
})

// ============================================================
// formatNum
// ============================================================
describe('formatNum', () => {
  it('should format numbers with thousands separator', () => {
    const result = formatNum(1234567)
    expect(result).toBe('1,234,567')
  })

  it('should handle small numbers', () => {
    expect(formatNum(123)).toBe('123')
    expect(formatNum(0)).toBe('0')
  })

  it('should handle negative numbers', () => {
    const result = formatNum(-1234)
    expect(result).toContain('-')
    expect(result).toContain('1,234')
  })

  it('should handle large numbers', () => {
    const result = formatNum(1000000000)
    expect(result).toContain(',')
  })
})

// ============================================================
// percentCN
// ============================================================
describe('percentCN', () => {
  it('should format as percentage with 0 decimal by default', () => {
    const result = percentCN(0.1234)
    expect(result).toContain('12')
    expect(result).toContain('%')
  })

  it('should format with specified decimal places', () => {
    const result = percentCN(0.1234, 2)
    expect(result).toContain('12.34')
    expect(result).toContain('%')
  })

  it('should handle 0', () => {
    const result = percentCN(0)
    expect(result).toContain('0')
    expect(result).toContain('%')
  })

  it('should handle 1 (100%)', () => {
    const result = percentCN(1)
    expect(result).toContain('100')
    expect(result).toContain('%')
  })
})

// ============================================================
// compactEN
// ============================================================
describe('compactEN', () => {
  it('should compact large numbers with English abbreviations', () => {
    const result = compactEN(12345)
    expect(result).toBeTruthy()
  })

  it('should handle millions', () => {
    const result = compactEN(1_500_000)
    expect(result).toMatch(/[KM]/)
  })

  it('should return string', () => {
    expect(typeof compactEN(1000)).toBe('string')
  })
})

// ============================================================
// compactCN
// ============================================================
describe('compactCN', () => {
  it('should compact large numbers with Chinese abbreviations', () => {
    const result = compactCN(12345)
    expect(result).toMatch(/万|亿/)
  })

  it('should handle smaller numbers', () => {
    const result = compactCN(500)
    expect(result).toBeTruthy()
  })

  it('should return string', () => {
    expect(typeof compactCN(1000)).toBe('string')
  })
})

// ============================================================
// signed
// ============================================================
describe('signed', () => {
  it('should always show positive sign', () => {
    expect(signed(42)).toBe('+42')
  })

  it('should always show negative sign', () => {
    expect(signed(-5)).toBe('-5')
  })

  it('should handle zero', () => {
    const result = signed(0)
    expect(result).toMatch(/[+-]0/)
  })

  it('should respect decimal digit parameter', () => {
    const result = signed(42, 1)
    expect(result).toMatch(/\+42\.0/)
  })

  it('should handle negative with decimals', () => {
    const result = signed(-3.14, 2)
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
// spacePhone
// ============================================================
describe('spacePhone', () => {
  it('should format phone with spaces', () => {
    expect(spacePhone('13812345678')).toBe('138 1234 5678')
  })

  it('should handle different phone numbers', () => {
    expect(spacePhone('15900001111')).toBe('159 0000 1111')
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

  it('should handle multiple words', () => {
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
// kebabToCamel
// ============================================================
describe('kebabToCamel', () => {
  it('should convert kebab-case to camelCase', () => {
    expect(kebabToCamel('hello-world')).toBe('helloWorld')
  })

  it('should handle multiple hyphens', () => {
    expect(kebabToCamel('hello-world-example')).toBe('helloWorldExample')
  })

  it('should handle single word', () => {
    expect(kebabToCamel('hello')).toBe('hello')
  })

  it('should handle empty string', () => {
    expect(kebabToCamel('')).toBe('')
  })
})

// ============================================================
// camelToKebab
// ============================================================
describe('camelToKebab', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(camelToKebab('helloWorld')).toBe('hello-world')
  })

  it('should handle PascalCase', () => {
    expect(camelToKebab('HelloWorld')).toBe('-hello-world')
  })

  it('should handle single word', () => {
    expect(camelToKebab('hello')).toBe('hello')
  })

  it('should handle complex camelCase', () => {
    expect(camelToKebab('helloWorldExample')).toBe('hello-world-example')
  })

  it('should handle empty string', () => {
    expect(camelToKebab('')).toBe('')
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
})

// ============================================================
// truncateByWords
// ============================================================
describe('truncateByWords', () => {
  it('should truncate by character count', () => {
    expect(truncateByWords('你好世界欢迎你', 4)).toBe('你好世界...')
  })

  it('should not truncate within maxWords', () => {
    expect(truncateByWords('你好世界', 4)).toBe('你好世界')
  })

  it('should use custom suffix', () => {
    expect(truncateByWords('你好世界欢迎你', 4, '…')).toBe('你好世界…')
  })

  it('should handle empty string', () => {
    expect(truncateByWords('', 5)).toBe('')
  })

  it('should handle exactly maxWords length', () => {
    expect(truncateByWords('hello', 5)).toBe('hello')
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
// toCamel
// ============================================================
describe('toCamel', () => {
  it('should convert snake_case to camelCase', () => {
    expect(toCamel('hello_world')).toBe('helloWorld')
  })

  it('should handle multiple underscores', () => {
    expect(toCamel('hello_world_example')).toBe('helloWorldExample')
  })

  it('should handle single word', () => {
    expect(toCamel('hello')).toBe('hello')
  })

  it('should handle empty string', () => {
    expect(toCamel('')).toBe('')
  })
})

// ============================================================
// firstUpper
// ============================================================
describe('firstUpper', () => {
  it('should capitalize first letter', () => {
    expect(firstUpper('hello')).toBe('Hello')
  })

  it('should keep rest of string unchanged', () => {
    expect(firstUpper('helloWorld')).toBe('HelloWorld')
  })

  it('should handle already capitalized', () => {
    expect(firstUpper('Hello')).toBe('Hello')
  })

  it('should handle single character', () => {
    expect(firstUpper('h')).toBe('H')
  })

  it('should handle empty string', () => {
    expect(firstUpper('')).toBe('')
  })
})

// ============================================================
// firstLower
// ============================================================
describe('firstLower', () => {
  it('should lowercase first letter', () => {
    expect(firstLower('Hello')).toBe('hello')
  })

  it('should keep rest of string unchanged', () => {
    expect(firstLower('HELLO')).toBe('hELLO')
  })

  it('should handle already lowercase', () => {
    expect(firstLower('hello')).toBe('hello')
  })

  it('should handle single character', () => {
    expect(firstLower('H')).toBe('h')
  })

  it('should handle empty string', () => {
    expect(firstLower('')).toBe('')
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
