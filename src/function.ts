/**
 * `attempt` 的返回值：成功时为 `[undefined, 结果]`，失败时为 `[Error, undefined]`。
 * @template T - 成功时的结果类型
 */
export type AttemptResult<T> = [error: Error, value: undefined] | [error: undefined, value: T]

/**
 * 包装函数，使其最多执行一次；后续调用直接返回首次结果。
 * @template T - 被包装函数的类型
 * @param fn - 目标函数
 * @returns 仅执行一次的新函数
 * @remarks 首次调用抛出异常时不会锁定状态，允许再次尝试。
 */
export const once = <T extends (...args: any[]) => any>(
  fn: T,
): ((...args: Parameters<T>) => ReturnType<T>) => {
  let called = false
  let result: ReturnType<T>
  return (...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      result = fn(...args)
      called = true
    }
    return result
  }
}

/**
 * 缓存函数计算结果：相同键再次调用时直接返回缓存值。
 * @template T - 被缓存函数的类型
 * @param fn - 目标函数（应为纯函数，否则缓存可能返回过期结果）
 * @param resolver - 可选的自定义缓存键解析函数；省略时使用第一个参数作为键
 * @returns 带缓存能力的新函数
 * @remarks 缓存仅存在于返回函数的闭包中，不提供清理接口；需要失效控制时请自行封装。
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => unknown,
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map<unknown, ReturnType<T>>()
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : args[0]
    if (cache.has(key)) return cache.get(key) as ReturnType<T>
    const value = fn(...args)
    cache.set(key, value)
    return value
  }
}

/**
 * 从左到右组合函数：`pipe(f, g)(x)` 等价于 `g(f(x))`。
 * @template A - 输入类型
 * @template B - 第一步输出类型
 * @param f1 - 第一个执行的函数
 * @returns 组合后的函数
 */
export function pipe<A, B>(f1: (a: A) => B): (a: A) => B
/**
 * 从左到右组合函数：`pipe(f, g)(x)` 等价于 `g(f(x))`。
 * @template A - 输入类型
 * @template B - 第一步输出类型
 * @template C - 最终输出类型
 * @param f1 - 第一个执行的函数
 * @param f2 - 第二个执行的函数
 * @returns 组合后的函数
 */
export function pipe<A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C
/**
 * 从左到右组合函数：`pipe(f, g, h)(x)` 等价于 `h(g(f(x)))`。
 * @template A - 输入类型
 * @template B - 第一步输出类型
 * @template C - 第二步输出类型
 * @template D - 最终输出类型
 * @param f1 - 第一个执行的函数
 * @param f2 - 第二个执行的函数
 * @param f3 - 第三个执行的函数
 * @returns 组合后的函数
 */
export function pipe<A, B, C, D>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
): (a: A) => D
/**
 * 从左到右组合函数：`pipe(f, g, h, i)(x)` 等价于 `i(h(g(f(x))))`。
 * @template A - 输入类型
 * @template B - 第一步输出类型
 * @template C - 第二步输出类型
 * @template D - 第三步输出类型
 * @template E - 最终输出类型
 * @param f1 - 第一个执行的函数
 * @param f2 - 第二个执行的函数
 * @param f3 - 第三个执行的函数
 * @param f4 - 第四个执行的函数
 * @returns 组合后的函数
 */
export function pipe<A, B, C, D, E>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E,
): (a: A) => E
/**
 * 从左到右组合函数（支持任意数量，类型信息会退化）。
 * @param fns - 依次执行的函数列表
 * @returns 组合后的函数
 */
export function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any): any => fns.reduce((value, fn) => fn(value), arg)
}

/**
 * 从右到左组合函数：`compose(f, g)(x)` 等价于 `f(g(x))`。
 * @template A - 输入类型
 * @template B - 输出类型
 * @param f1 - 唯一执行的函数
 * @returns 组合后的函数
 */
export function compose<A, B>(f1: (a: A) => B): (a: A) => B
/**
 * 从右到左组合函数：`compose(f, g)(x)` 等价于 `f(g(x))`。
 * @template A - 输入类型
 * @template B - 第二步输入类型
 * @template C - 最终输出类型
 * @param f2 - 先执行的函数
 * @param f1 - 后执行的函数
 * @returns 组合后的函数
 */
export function compose<A, B, C>(f2: (b: B) => C, f1: (a: A) => B): (a: A) => C
/**
 * 从右到左组合函数：`compose(f, g, h)(x)` 等价于 `f(g(h(x)))`。
 * @template A - 输入类型
 * @template B - 第三步输入类型
 * @template C - 第二步输入类型
 * @template D - 最终输出类型
 * @param f3 - 最先执行的函数
 * @param f2 - 第二个执行的函数
 * @param f1 - 最后执行的函数
 * @returns 组合后的函数
 */
export function compose<A, B, C, D>(
  f3: (c: C) => D,
  f2: (b: B) => C,
  f1: (a: A) => B,
): (a: A) => D
/**
 * 从右到左组合函数：`compose(f, g, h, i)(x)` 等价于 `f(g(h(i(x))))`。
 * @template A - 输入类型
 * @template B - 第四步输入类型
 * @template C - 第三步输入类型
 * @template D - 第二步输入类型
 * @template E - 最终输出类型
 * @param f4 - 最先执行的函数
 * @param f3 - 第二个执行的函数
 * @param f2 - 第三个执行的函数
 * @param f1 - 最后执行的函数
 * @returns 组合后的函数
 */
export function compose<A, B, C, D, E>(
  f4: (d: D) => E,
  f3: (c: C) => D,
  f2: (b: B) => C,
  f1: (a: A) => B,
): (a: A) => E
/**
 * 从右到左组合函数（支持任意数量，类型信息会退化）。
 * @param fns - 函数列表，执行顺序为从右到左
 * @returns 组合后的函数
 */
export function compose(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any): any => fns.reduceRight((value, fn) => fn(value), arg)
}

/**
 * 预置部分参数，返回等待剩余参数的新函数。
 * @template T - 目标函数类型
 * @param fn - 目标函数
 * @param preset - 预先绑定的参数，按顺序置于参数列表前部
 * @returns 接收剩余参数的新函数
 * @remarks 仅支持位置参数预置，不能跳过中间参数；`this` 不参与绑定。
 */
export const partial = <T extends (...args: any[]) => any>(
  fn: T,
  ...preset: unknown[]
): ((...rest: any[]) => ReturnType<T>) => {
  return (...rest: any[]): ReturnType<T> =>
    (fn as (...args: any[]) => ReturnType<T>)(...preset, ...rest)
}

/**
 * 执行函数并捕获异常，统一返回 `[error, value]` 元组，避免调用方编写 try/catch。
 * @template T - 成功时的结果类型
 * @param fn - 待执行的零参函数
 * @returns 成功为 `[undefined, 结果]`，失败为 `[Error, undefined]`；非 `Error` 异常会被包装为 `Error`
 */
export const attempt = <T>(fn: () => T): AttemptResult<T> => {
  try {
    return [undefined, fn()]
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), undefined]
  }
}
