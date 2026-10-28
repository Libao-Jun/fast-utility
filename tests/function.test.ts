import { describe, it, expect, vi } from 'vitest'
import { once, memoize, pipe, compose, partial, attempt, chain, guard } from '../src/function'

// ============================================================
// once
// ============================================================
describe('once', () => {
  it('只执行一次并缓存结果', () => {
    const fn = vi.fn((value: number) => value * 2)
    const wrapped = once(fn)
    expect(wrapped(2)).toBe(4)
    expect(wrapped(3)).toBe(4)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('首次抛错后允许重试', () => {
    let attempts = 0
    const wrapped = once(() => {
      attempts++
      if (attempts === 1) throw new Error('boom')
      return 'ok'
    })
    expect(() => wrapped()).toThrow('boom')
    expect(wrapped()).toBe('ok')
    expect(attempts).toBe(2)
  })
})

// ============================================================
// memoize
// ============================================================
describe('memoize', () => {
  it('相同首参命中缓存', () => {
    const fn = vi.fn((value: number) => value * 2)
    const memoized = memoize(fn)
    expect(memoized(2)).toBe(4)
    expect(memoized(2)).toBe(4)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('不同参数分别计算', () => {
    const fn = vi.fn((value: number) => value * 2)
    const memoized = memoize(fn)
    memoized(2)
    memoized(3)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('支持自定义缓存键', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoized = memoize(fn, (a, b) => `${a}-${b}`)
    memoized(1, 2)
    memoized(1, 2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('缓存 undefined 结果', () => {
    const fn = vi.fn(() => undefined)
    const memoized = memoize(fn)
    expect(memoized()).toBeUndefined()
    expect(memoized()).toBeUndefined()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

// ============================================================
// pipe
// ============================================================
describe('pipe', () => {
  it('从左到右执行', () => {
    const transform = pipe(
      (value: number) => value + 1,
      (value: number) => value * 2,
    )
    expect(transform(3)).toBe(8)
  })

  it('支持三个函数', () => {
    const transform = pipe(
      (value: number) => value + 1,
      (value: number) => value * 2,
      (value: number) => String(value),
    )
    expect(transform(3)).toBe('8')
  })
})

// ============================================================
// compose
// ============================================================
describe('compose', () => {
  it('从右到左执行', () => {
    const transform = compose(
      (value: number) => value + 1,
      (value: number) => value * 2,
    )
    expect(transform(3)).toBe(7)
  })

  it('支持三个函数', () => {
    const transform = compose(
      (value: number) => `#${value}`,
      (value: number) => value * 2,
      (value: number) => value + 1,
    )
    expect(transform(3)).toBe('#8')
  })
})

// ============================================================
// partial
// ============================================================
describe('partial', () => {
  it('预置前部参数', () => {
    const fn = (a: number, b: number, c: number) => a + b + c
    expect(partial(fn, 1, 2)(3)).toBe(6)
  })

  it('保留剩余参数', () => {
    const fn = (prefix: string, ...rest: string[]) => prefix + rest.join('')
    expect(partial(fn, 'a')('b', 'c')).toBe('abc')
  })
})

// ============================================================
// attempt
// ============================================================
describe('attempt', () => {
  it('成功时返回 [undefined, 结果]', () => {
    expect(attempt(() => 42)).toEqual([undefined, 42])
  })

  it('失败时返回 [Error, undefined]', () => {
    const [error, value] = attempt(() => {
      throw new Error('boom')
    })
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('boom')
    expect(value).toBeUndefined()
  })

  it('非 Error 异常会被包装为 Error', () => {
    const [error] = attempt(() => {
      throw 'oops'
    })
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('oops')
  })
})

// ============================================================
// attempt (async & args)
// ============================================================
describe('attempt async & args', () => {
  it('异步成功返回 [undefined, 结果]', async () => {
    await expect(attempt(async () => 42)).resolves.toEqual([undefined, 42])
  })

  it('异步失败返回 [Error, undefined]', async () => {
    const [error, value] = await attempt(async () => {
      throw new Error('boom')
    })
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('boom')
    expect(value).toBeUndefined()
  })

  it('透传参数', () => {
    expect(attempt((a: number, b: number) => a + b, 1, 2)).toEqual([undefined, 3])
  })
})

// ============================================================
// chain
// ============================================================
describe('chain', () => {
  it('第一个函数接收全部初始参数', () => {
    const fn = chain((a: number, b: number) => a + b, (sum) => sum * 2)
    expect(fn(1, 2)).toBe(6)
  })

  it('支持三步与四步串联', () => {
    expect(chain((a: number) => a + 1, (value) => value * 2, (value) => String(value))(3)).toBe('8')
    expect(chain(
      (a: number) => a + 1,
      (value) => value * 2,
      (value) => String(value),
      (value) => `#${value}`,
    )(3)).toBe('#8')
  })

  it('无函数时抛出 TypeError', () => {
    expect(() => (chain as any)()).toThrow(TypeError)
  })
})

// ============================================================
// guard
// ============================================================
describe('guard', () => {
  it('成功时返回结果', () => {
    expect(guard(() => 42)).toBe(42)
  })

  it('同步异常返回 undefined', () => {
    expect(guard(() => {
      throw new Error('x')
    })).toBeUndefined()
  })

  it('shouldGuard 返回 false 时重新抛出', () => {
    expect(() => guard(() => {
      throw new Error('x')
    }, () => false)).toThrow('x')
  })

  it('异步成功与失败', async () => {
    await expect(guard(async () => 1)).resolves.toBe(1)
    await expect(guard(async () => {
      throw new Error('x')
    })).resolves.toBeUndefined()
  })
})
