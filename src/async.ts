/**
 * 异步执行控制工具集合。
 * @packageDocumentation
 */

/**
 * `retry` 的可选配置。
 */
export interface RetryOptions {
  /** 总尝试次数（含首次），默认 `3`；小于 1 时按 1 处理 */
  times?: number
  /** 失败后的等待时间（毫秒），或按失败次数计算等待时间的函数 */
  delay?: number | ((attempt: number) => number)
  /** 判断某次失败后是否继续重试；默认始终重试 */
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

/**
 * 等待指定毫秒数。
 * @param ms - 等待时长（毫秒），负数按 `0` 处理
 * @returns 等待结束后 resolve 的 Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, Math.trunc(ms)))
  })
}

/**
 * 重试执行函数，直到成功或用尽尝试次数。
 * @template T - 返回值类型
 * @param fn - 待执行的函数，接收当前尝试序号（从 `1` 开始）
 * @param options - 重试配置
 * @returns 首次成功的结果
 * @throws 最后一次失败时抛出原始错误（非 `Error` 异常不会被包装）
 * @remarks `delay` 为函数时，参数是刚失败的尝试序号；等待期间不会阻塞事件循环。
 */
export const retry = async <T>(
  fn: (attempt: number) => T | Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const rawTimes = options.times ?? 3
  const times = Number.isFinite(rawTimes) ? Math.max(1, Math.trunc(rawTimes)) : 3
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn(attempt)
    } catch (error) {
      const canRetry = attempt < times
        && (options.shouldRetry ? options.shouldRetry(error, attempt) : true)
      if (!canRetry) throw error
      const wait = typeof options.delay === "function"
        ? options.delay(attempt)
        : (options.delay ?? 0)
      if (wait > 0) await sleep(wait)
    }
  }
  throw new Error("retry: exhausted attempts")
}

/**
 * 并发执行异步映射，限制同时运行的任务数量。
 * @template T - 元素类型
 * @template R - 结果类型
 * @param items - 待处理数组
 * @param fn - 异步映射函数，接收元素与索引
 * @param limit - 最大并发数，默认不限制；小于 `1` 时按 `1` 处理
 * @returns 与输入顺序一致的结果数组
 * @remarks 任一任务失败会立即抛出该错误，其余已启动任务不会被取消。
 */
export const parallel = async <T, R>(
  items: readonly T[],
  fn: (item: T, index: number) => Promise<R>,
  limit: number = Number.POSITIVE_INFINITY,
): Promise<R[]> => {
  if (items.length === 0) return []
  const size = Number.isFinite(limit)
    ? Math.max(1, Math.min(items.length, Math.floor(limit)))
    : items.length
  const results = new Array<R>(items.length)
  let cursor = 0
  const worker = async (): Promise<void> => {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= items.length) return
      results[index] = await fn(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: size }, () => worker()))
  return results
}
