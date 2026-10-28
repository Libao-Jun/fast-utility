/**
 * 数学计算与数值处理工具集合。
 * @packageDocumentation
 */

/** 内部辅助：确保两个边界值按 [较小, 较大] 顺序返回。 */
const _swap = (a: number, b: number): [number, number] => a > b ? [b, a] : [a, b]

/**
 * 将数值限制在 `[min, max]` 闭区间内（自动纠正 `min`/`max` 顺序）。
 * @param value - 待限制的数值
 * @param min - 最小边界
 * @param max - 最大边界
 * @returns 限制后的数值（超出时取边界值）
 * @example
 * clamp(15, 0, 10) // 10
 * clamp(-1, 0, 10) // 0
 * clamp(5, 0, 10) // 5
 */
export const clamp = (value: number, min: number, max: number): number => {
  [min, max] = _swap(min, max)
  return Math.min(Math.max(value, min), max)
}

/**
 * 生成 `[min, max]` 闭区间内的随机整数（含两端）。
 * @param min - 最小边界（含）
 * @param max - 最大边界（含）
 * @returns 随机整数
 * @example
 * randomInt(1, 6) // 1~6 之间（如掷骰子）
 */
export const randomInt = (min: number, max: number): number => {
  [min, max] = _swap(min, max)
  const lower = Math.ceil(min)
  const upper = Math.floor(max)
  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

/**
 * 生成 `[min, max)` 半开区间内的随机浮点数。
 * @param min - 最小边界（含）
 * @param max - 最大边界（不含）
 * @returns 随机浮点数
 * @example
 * randomFloat(0, 1) // 0 ~ 1 之间的小数
 */
export const randomFloat = (min: number, max: number): number => {
  [min, max] = _swap(min, max)
  return Math.random() * (max - min) + min
}

/**
 * 将数值四舍五入到指定小数位。
 * @param value - 待处理的数值
 * @param decimals - 保留的小数位数，默认 `0`
 * @returns 四舍五入后的数值
 * @example
 * round(3.14159, 2) // 3.14
 * round(2.5) // 3
 */
export const round = (value: number, decimals: number = 0): number => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/**
 * 对数值数组求和。
 * @param arr - 数值数组
 * @returns 所有元素之和（空数组为 `0`）
 * @example
 * sum([1, 2, 3]) // 6
 */
export const sum = (arr: number[]): number => arr.reduce((acc, val) => acc + val, 0)

/**
 * 计算数值数组的平均值。
 * @param arr - 数值数组
 * @returns 平均值；空数组返回 `NaN`
 * @example
 * average([1, 2, 3]) // 2
 */
export const average = (arr: number[]): number => arr.length === 0 ? NaN : sum(arr) / arr.length

/**
 * 判断数值是否在 `[min, max]` 闭区间内（自动纠正顺序）。
 * @param value - 待判断的数值
 * @param min - 最小边界
 * @param max - 最大边界
 * @returns 在区间内返回 `true`
 * @example
 * inRange(5, 0, 10) // true
 * inRange(15, 0, 10) // false
 */
export const inRange = (value: number, min: number, max: number): boolean => {
  [min, max] = _swap(min, max)
  return value >= min && value <= max
}

/**
 * 线性插值：在 `start` 与 `end` 之间按比例 `t` 取值。
 * @param start - 起始值
 * @param end - 结束值
 * @param t - 插值比例，通常取值 `[0, 1]`（`0` 取 `start`，`1` 取 `end`）
 * @returns 插值结果
 * @example
 * lerp(0, 100, 0.5) // 50
 * lerp(10, 20, 0.25) // 12.5
 */
export const lerp = (start: number, end: number, t: number): number => start + (end - start) * t
