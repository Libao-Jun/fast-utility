import { describe, it, expect } from 'vitest'
import { clamp, randomInteger, randomFloat, round, sum, average, inRange, linearInterpolate, toInteger, toFloat } from '../src/math'

// ============================================================
// clamp
// ============================================================
describe('clamp', () => {
  it('value 在区间内时返回原值', () => {
    expect(clamp(5, 1, 10)).toBe(5)
  })

  it('value 小于 min 时返回 min', () => {
    expect(clamp(0, 1, 10)).toBe(1)
  })

  it('value 大于 max 时返回 max', () => {
    expect(clamp(20, 1, 10)).toBe(10)
  })

  it('value 等于 min 时返回 min', () => {
    expect(clamp(1, 1, 10)).toBe(1)
  })

  it('value 等于 max 时返回 max', () => {
    expect(clamp(10, 1, 10)).toBe(10)
  })

  it('min 大于 max 时自动交换', () => {
    expect(clamp(5, 10, 1)).toBe(5)
  })

  it('处理负数', () => {
    expect(clamp(-10, -5, 5)).toBe(-5)
    expect(clamp(-3, -5, 5)).toBe(-3)
  })

  it('处理 min 和 max 相同的情况', () => {
    expect(clamp(5, 3, 3)).toBe(3)
    expect(clamp(1, 3, 3)).toBe(3)
  })
})

// ============================================================
// randomInteger
// ============================================================
describe('randomInteger', () => {
  it('返回整数', () => {
    const val = randomInteger(1, 10)
    expect(Number.isInteger(val)).toBe(true)
  })

  it('返回值在 [min, max] 区间内', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInteger(1, 5)
      expect(val).toBeGreaterThanOrEqual(1)
      expect(val).toBeLessThanOrEqual(5)
    }
  })

  it('min 等于 max 时返回该值', () => {
    expect(randomInteger(7, 7)).toBe(7)
  })

  it('min 大于 max 时自动交换', () => {
    for (let i = 0; i < 50; i++) {
      const val = randomInteger(10, -5)
      expect(val).toBeGreaterThanOrEqual(-5)
      expect(val).toBeLessThanOrEqual(10)
    }
  })

  it('能够返回边界值', () => {
    const results = new Set<number>()
    for (let i = 0; i < 200; i++) {
      results.add(randomInteger(1, 3))
    }
    // 在大样本下应覆盖到 1、2、3
    expect(results.has(1)).toBe(true)
    expect(results.has(2)).toBe(true)
    expect(results.has(3)).toBe(true)
  })

  it('处理负数范围', () => {
    for (let i = 0; i < 50; i++) {
      const val = randomInteger(-10, -1)
      expect(val).toBeGreaterThanOrEqual(-10)
      expect(val).toBeLessThanOrEqual(-1)
    }
  })
})

// ============================================================
// randomFloat
// ============================================================
describe('randomFloat', () => {
  it('返回值在 [min, max) 区间内', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomFloat(0, 1)
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(1)
    }
  })

  it('min 等于 max 时返回该值', () => {
    expect(randomFloat(5, 5)).toBe(5)
  })

  it('min 大于 max 时自动交换', () => {
    for (let i = 0; i < 50; i++) {
      const val = randomFloat(10, 0)
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(10)
    }
  })

  it('返回值是浮点数类型', () => {
    const val = randomFloat(1.5, 2.5)
    expect(typeof val).toBe('number')
  })
})

// ============================================================
// round
// ============================================================
describe('round', () => {
  it('默认保留 0 位小数（四舍五入到整数）', () => {
    expect(round(3.14)).toBe(3)
    expect(round(3.6)).toBe(4)
  })

  it('保留指定小数位', () => {
    expect(round(3.14159, 2)).toBe(3.14)
    expect(round(3.14159, 4)).toBe(3.1416)
  })

  it('处理整数', () => {
    expect(round(5, 2)).toBe(5)
  })

  it('保留 0 位小数', () => {
    expect(round(3.7, 0)).toBe(4)
  })

  it('处理负数', () => {
    expect(round(-3.14159, 2)).toBe(-3.14)
    expect(round(-3.6)).toBe(-4)
  })

  it('处理 0', () => {
    expect(round(0, 3)).toBe(0)
  })

  it('处理 .5 向上取整', () => {
    expect(round(1.5, 0)).toBe(2)
    expect(round(2.5, 0)).toBe(3)
  })
})

// ============================================================
// sum
// ============================================================
describe('sum', () => {
  it('计算数组和', () => {
    expect(sum([1, 2, 3])).toBe(6)
  })

  it('空数组返回 0', () => {
    expect(sum([])).toBe(0)
  })

  it('单元素数组返回该元素', () => {
    expect(sum([42])).toBe(42)
  })

  it('处理负数', () => {
    expect(sum([1, -2, 3])).toBe(2)
  })

  it('处理浮点数', () => {
    expect(sum([0.1, 0.2])).toBeCloseTo(0.3)
  })

  it('全为 0', () => {
    expect(sum([0, 0, 0])).toBe(0)
  })
})

// ============================================================
// average
// ============================================================
describe('average', () => {
  it('计算平均值', () => {
    expect(average([1, 2, 3])).toBe(2)
  })

  it('空数组返回 NaN', () => {
    expect(average([])).toBeNaN()
  })

  it('单元素数组', () => {
    expect(average([5])).toBe(5)
  })

  it('处理浮点数', () => {
    expect(average([0.1, 0.2])).toBeCloseTo(0.15)
  })

  it('处理负数', () => {
    expect(average([-1, 1])).toBe(0)
  })
})

// ============================================================
// inRange
// ============================================================
describe('inRange', () => {
  it('value 在区间内返回 true', () => {
    expect(inRange(5, 1, 10)).toBe(true)
  })

  it('value 小于 min 返回 false', () => {
    expect(inRange(0, 1, 10)).toBe(false)
  })

  it('value 大于 max 返回 false', () => {
    expect(inRange(20, 1, 10)).toBe(false)
  })

  it('value 等于 min 返回 true', () => {
    expect(inRange(1, 1, 10)).toBe(true)
  })

  it('value 等于 max 返回 true', () => {
    expect(inRange(10, 1, 10)).toBe(true)
  })

  it('min 大于 max 时自动交换', () => {
    expect(inRange(5, 10, 1)).toBe(true)
  })

  it('处理负数区间', () => {
    expect(inRange(-3, -5, 5)).toBe(true)
    expect(inRange(-10, -5, 5)).toBe(false)
  })
})

// ============================================================
// linearInterpolate
// ============================================================
describe('linearInterpolate', () => {
  it('t=0 返回 start', () => {
    expect(linearInterpolate(0, 100, 0)).toBe(0)
  })

  it('t=1 返回 end', () => {
    expect(linearInterpolate(0, 100, 1)).toBe(100)
  })

  it('t=0.5 返回中点', () => {
    expect(linearInterpolate(0, 100, 0.5)).toBe(50)
  })

  it('处理负数', () => {
    expect(linearInterpolate(-10, 10, 0.5)).toBe(0)
  })

  it('t 超出 [0,1] 可外推', () => {
    expect(linearInterpolate(0, 10, 2)).toBe(20)
    expect(linearInterpolate(0, 10, -1)).toBe(-10)
  })

  it('start 等于 end', () => {
    expect(linearInterpolate(5, 5, 0.7)).toBe(5)
  })
})

// ============================================================
// round precision
// ============================================================
describe('round precision', () => {
  it('处理浮点误差', () => {
    expect(round(1.005, 2)).toBe(1.01)
  })

  it('处理科学计数法输入', () => {
    expect(round(1e-7, 8)).toBe(1e-7)
  })

  it('非有限值原样返回', () => {
    expect(round(Number.POSITIVE_INFINITY, 2)).toBe(Number.POSITIVE_INFINITY)
  })
})

// ============================================================
// toInteger
// ============================================================
describe('toInteger', () => {
  it('解析整数', () => {
    expect(toInteger('42')).toBe(42)
    expect(toInteger(42)).toBe(42)
  })

  it('截断小数部分', () => {
    expect(toInteger('42.9')).toBe(42)
  })

  it('支持进制参数', () => {
    expect(toInteger('ff', 16)).toBe(255)
  })

  it('无法解析时返回 0', () => {
    expect(toInteger('abc')).toBe(0)
    expect(toInteger(null)).toBe(0)
    expect(toInteger(Symbol('x'))).toBe(0)
  })
})

// ============================================================
// toFloat
// ============================================================
describe('toFloat', () => {
  it('解析浮点数并忽略尾部字符', () => {
    expect(toFloat('3.14px')).toBe(3.14)
  })

  it('无法解析时返回 0', () => {
    expect(toFloat('abc')).toBe(0)
  })
})

// ============================================================
// sum / average with iteratee
// ============================================================
describe('sum / average with iteratee', () => {
  it('按取值函数求和', () => {
    expect(sum([{ n: 1 }, { n: 2 }], (item) => item.n)).toBe(3)
  })

  it('按取值函数求平均值', () => {
    expect(average([{ n: 1 }, { n: 3 }], (item) => item.n)).toBe(2)
  })

  it('空数组保持原有边界行为', () => {
    expect(sum([], (item: { n: number }) => item.n)).toBe(0)
    expect(average([], (item: { n: number }) => item.n)).toBeNaN()
  })
})
