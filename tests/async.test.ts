import { describe, it, expect, vi, afterEach } from 'vitest'
import { sleep, retry, parallelMap } from '../src/async'

afterEach(() => {
  vi.useRealTimers()
})

// ============================================================
// sleep
// ============================================================
describe('sleep', () => {
  it('在指定时间后 resolve', async () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const promise = sleep(100).then(spy)

    await vi.advanceTimersByTimeAsync(99)
    expect(spy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    await promise
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('负数按 0 处理', async () => {
    vi.useFakeTimers()
    const promise = sleep(-10)
    await vi.advanceTimersByTimeAsync(0)
    await expect(promise).resolves.toBeUndefined()
  })
})

// ============================================================
// retry
// ============================================================
describe('retry', () => {
  it('首次成功时不重试', async () => {
    const fn = vi.fn(() => 'ok')
    await expect(retry(fn)).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('失败后重试直到成功', async () => {
    let calls = 0
    const result = await retry(() => {
      calls++
      if (calls < 3) throw new Error('fail')
      return calls
    }, { times: 3 })
    expect(result).toBe(3)
    expect(calls).toBe(3)
  })

  it('用尽次数后抛出最后一次错误', async () => {
    let calls = 0
    await expect(retry(() => {
      calls++
      throw new Error(`fail-${calls}`)
    }, { times: 2 })).rejects.toThrow('fail-2')
    expect(calls).toBe(2)
  })

  it('shouldRetry 返回 false 时立即停止', async () => {
    const fn = vi.fn(() => {
      throw new Error('x')
    })
    await expect(retry(fn, { times: 5, shouldRetry: () => false })).rejects.toThrow('x')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('按 delay 等待后重试', async () => {
    vi.useFakeTimers()
    let calls = 0
    const promise = retry(() => {
      calls++
      if (calls === 1) throw new Error('fail')
      return 'ok'
    }, { times: 2, delay: 50 })

    await vi.advanceTimersByTimeAsync(50)
    await expect(promise).resolves.toBe('ok')
    expect(calls).toBe(2)
  })

  it('delay 函数接收失败次数', async () => {
    vi.useFakeTimers()
    const delays: number[] = []
    let calls = 0
    const promise = retry(() => {
      calls++
      if (calls === 1) throw new Error('fail')
      return 'ok'
    }, {
      times: 2,
      delay: (attempt) => {
        delays.push(attempt)
        return 10
      },
    })

    await vi.advanceTimersByTimeAsync(10)
    await promise
    expect(delays).toEqual([1])
  })

  it('times 小于 1 时仍执行一次', async () => {
    let calls = 0
    await expect(retry(() => {
      calls++
      throw new Error('x')
    }, { times: 0 })).rejects.toThrow('x')
    expect(calls).toBe(1)
  })

  it('向函数传入从 1 开始的尝试序号', async () => {
    const attempts: number[] = []
    await retry((attempt) => {
      attempts.push(attempt)
      if (attempt < 2) throw new Error('x')
      return attempt
    }, { times: 2 })
    expect(attempts).toEqual([1, 2])
  })
})

// ============================================================
// parallelMap
// ============================================================
describe('parallelMap', () => {
  it('保持输入顺序', async () => {
    const result = await parallelMap([1, 2, 3], async (value) => value * 2, 2)
    expect(result).toEqual([2, 4, 6])
  })

  it('限制最大并发数', async () => {
    let active = 0
    let max = 0
    const result = await parallelMap([1, 2, 3, 4, 5], async (value) => {
      active++
      max = Math.max(max, active)
      await new Promise((resolve) => setTimeout(resolve, 5))
      active--
      return value
    }, 2)

    expect(result).toEqual([1, 2, 3, 4, 5])
    expect(max).toBeLessThanOrEqual(2)
    expect(max).toBeGreaterThan(1)
  })

  it('并发数小于 1 时按 1 处理', async () => {
    let active = 0
    let max = 0
    await parallelMap([1, 2, 3], async () => {
      active++
      max = Math.max(max, active)
      await new Promise((resolve) => setTimeout(resolve, 1))
      active--
    }, 0)
    expect(max).toBe(1)
  })

  it('空数组返回空数组', async () => {
    await expect(parallelMap([], async () => 1)).resolves.toEqual([])
  })

  it('任务失败时抛出错误', async () => {
    await expect(parallelMap([1], async () => {
      throw new Error('x')
    })).rejects.toThrow('x')
  })
})
