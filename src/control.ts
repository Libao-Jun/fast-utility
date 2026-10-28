/**
 * 函数执行控制（防抖与节流）工具。
 * @packageDocumentation
 */

/**
 * 防抖：在最后一次触发后等待 `delay` 毫秒再执行；若期间再次触发则重新计时。
 * @template T - 被包装函数的类型
 * @param fn - 需要防抖处理的函数
 * @param delay - 防抖等待时间（毫秒），默认 `300`
 * @param options - 可选配置对象
 * @param options.leading - 是否在首次触发时立即执行一次，默认 `false`
 * @param options.trailing - 是否在等待结束后执行（尾随调用），默认 `true`
 * @returns 带 `cancel` 方法的防抖函数；调用 `cancel()` 可取消尚未执行的调用
 * @example
 * const onResize = debounce(() => console.log('resized'), 200)
 * window.addEventListener('resize', onResize)
 * // 连续 resize 只会在停止 200ms 后打印一次
 * onResize.cancel() // 取消待执行
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
  { leading = false, trailing = true }: { leading?: boolean; trailing?: boolean } = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let shouldTrail = trailing

  const debounced = (...args: Parameters<T>): void => {
    lastArgs = args
    if (timer !== null) {
      clearTimeout(timer)
      shouldTrail = trailing
    } else if (leading) {
      fn(...args)
      shouldTrail = false
    }
    timer = setTimeout(() => {
      if (shouldTrail && lastArgs) fn(...lastArgs)
      timer = lastArgs = null
      shouldTrail = trailing
    }, delay)
  }

  debounced.cancel = (): void => {
    if (timer) { clearTimeout(timer); timer = lastArgs = null }
    shouldTrail = trailing
  }

  return debounced
};

/**
 * 节流：在 `interval` 毫秒的固定间隔内，目标函数最多执行一次。
 * @template T - 被包装函数的类型
 * @param fn - 需要节流处理的函数
 * @param interval - 节流时间间隔（毫秒），默认 `300`
 * @param options - 可选配置对象
 * @param options.leading - 是否在时间窗口开始时立即执行，默认 `true`
 * @param options.trailing - 是否在时间窗口结束后补一次调用，默认 `true`
 * @returns 带 `cancel` 方法的节流函数；调用 `cancel()` 可取消尚未执行的尾随调用
 * @example
 * const onScroll = throttle(() => console.log('scroll'), 100)
 * window.addEventListener('scroll', onScroll)
 * // 滚动期间每 100ms 最多打印一次
 * onScroll.cancel()
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  interval = 300,
  { leading = true, trailing = true }: { leading?: boolean; trailing?: boolean } = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastTime = 0
  let pendingArgs: Parameters<T> | null = null

  const throttled = (...args: Parameters<T>): void => {
    const now = Date.now()
    if (!lastTime && !leading) lastTime = now

    const remaining = interval - (now - lastTime)
    pendingArgs = args

    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null }
      fn(...args)
      lastTime = now
      pendingArgs = null
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        timer = null
        lastTime = leading ? Date.now() : 0
        if (pendingArgs) fn(...pendingArgs)
        pendingArgs = null
      }, remaining)
    }
  }

  throttled.cancel = (): void => {
    if (timer) { clearTimeout(timer); timer = pendingArgs = null }
  }

  return throttled
};
