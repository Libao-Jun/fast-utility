import { describe, it, expect } from 'vitest'
import { nowMilliseconds, isToday, firstDayOfMonth, lastDayOfMonth } from '../src/time'

describe('nowMilliseconds', () => {
  it('应该返回一个数字', () => {
    expect(typeof nowMilliseconds()).toBe('number')
  })

  it('应该返回正整数', () => {
    expect(nowMilliseconds()).toBeGreaterThan(0)
  })

  it('应该返回当前时间戳（与 Date.now() 相差不超过 10ms）', () => {
    const now = Date.now()
    const ts = nowMilliseconds()
    expect(Math.abs(ts - now)).toBeLessThanOrEqual(10)
  })

  it('应该返回毫秒级时间戳（值应大于 1970 年后的合理值）', () => {
    // 2020-01-01 的时间戳为 1577836800000
    expect(nowMilliseconds()).toBeGreaterThan(1577836800000)
  })

  it('两次连续调用返回值应为非递减（后 >= 前）', () => {
    const ts1 = nowMilliseconds()
    const ts2 = nowMilliseconds()
    expect(ts2).toBeGreaterThanOrEqual(ts1)
  })

  it('应精确到毫秒级（与 new Date().getTime() 一致）', () => {
    const before = new Date().getTime()
    const ts = nowMilliseconds()
    const after = new Date().getTime()
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after + 5)
  })

  it('返回的应是整数，非浮点数', () => {
    expect(Number.isInteger(nowMilliseconds())).toBe(true)
  })

  it('不是 NaN', () => {
    expect(Number.isNaN(nowMilliseconds())).toBe(false)
  })

  it('不是 Infinity', () => {
    expect(Number.isFinite(nowMilliseconds())).toBe(true)
  })
})

// ============================================================
// isToday
// ============================================================
describe('isToday', () => {
  it('今天日期返回 true', () => {
    expect(isToday(new Date())).toBe(true)
  })

  it('今天的时间戳返回 true', () => {
    expect(isToday(Date.now())).toBe(true)
  })

  it('今天的日期字符串返回 true', () => {
    expect(isToday(new Date().toISOString())).toBe(true)
  })

  it('昨天日期返回 false', () => {
    const yesterday = new Date(Date.now() - 86400000)
    expect(isToday(yesterday)).toBe(false)
  })

  it('明天日期返回 false', () => {
    const tomorrow = new Date(Date.now() + 86400000)
    expect(isToday(tomorrow)).toBe(false)
  })

  it('不同年份返回 false', () => {
    expect(isToday(new Date('2020-01-01'))).toBe(false)
  })
})

// ============================================================
// firstDayOfMonth
// ============================================================
describe('firstDayOfMonth', () => {
  it('返回指定年月的第一天', () => {
    const result = firstDayOfMonth(2026, 7)
    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(6) // 0-indexed
    expect(result.getDate()).toBe(1)
  })

  it('1 月的第一天', () => {
    const result = firstDayOfMonth(2026, 1)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(1)
  })

  it('12 月的第一天', () => {
    const result = firstDayOfMonth(2026, 12)
    expect(result.getMonth()).toBe(11)
    expect(result.getDate()).toBe(1)
  })

  it('闰年 2 月第一天', () => {
    const result = firstDayOfMonth(2024, 2)
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(1)
  })
})

// ============================================================
// lastDayOfMonth
// ============================================================
describe('lastDayOfMonth', () => {
  it('返回指定年月的最后一天', () => {
    const result = lastDayOfMonth(2026, 7)
    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(6) // 0-indexed
    expect(result.getDate()).toBe(31)
  })

  it('1 月有 31 天', () => {
    expect(lastDayOfMonth(2026, 1).getDate()).toBe(31)
  })

  it('平年 2 月有 28 天', () => {
    expect(lastDayOfMonth(2025, 2).getDate()).toBe(28)
  })

  it('闰年 2 月有 29 天', () => {
    expect(lastDayOfMonth(2024, 2).getDate()).toBe(29)
  })

  it('4 月有 30 天', () => {
    expect(lastDayOfMonth(2026, 4).getDate()).toBe(30)
  })

  it('12 月有 31 天', () => {
    expect(lastDayOfMonth(2026, 12).getDate()).toBe(31)
  })
})
