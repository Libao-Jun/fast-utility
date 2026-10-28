/** 内部辅助：确保两个边界值按 [较小, 较大] 顺序返回。 */
const _swap = (a: number, b: number): [number, number] => a > b ? [b, a] : [a, b]

/**
 * 将数值限制在 `[min, max]` 闭区间内（自动纠正 `min`/`max` 顺序）。
 * @param value - 待限制的数值
 * @param min - 最小边界
 * @param max - 最大边界
 * @returns 限制后的数值（超出时取边界值）
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
 */
export const round = (value: number, decimals: number = 0): number => {
  if (!Number.isFinite(value) || !Number.isFinite(decimals)) return value
  const digits = Math.trunc(decimals)
  const [mantissa, exponent = "0"] = String(value).split("e")
  const shifted = Number(`${mantissa}e${Number(exponent) + digits}`)
  const rounded = Math.round(shifted)
  if (!Number.isFinite(rounded)) return value
  const [roundedMantissa, roundedExponent = "0"] = String(rounded).split("e")
  return Number(`${roundedMantissa}e${Number(roundedExponent) - digits}`)
}

/**
 * 对数值数组求和。
 * @param arr - 数值数组
 * @returns 所有元素之和（空数组为 `0`）
 */
export const sum = (arr: number[]): number => arr.reduce((acc, val) => acc + val, 0)

/**
 * 计算数值数组的平均值。
 * @param arr - 数值数组
 * @returns 平均值；空数组返回 `NaN`
 */
export const average = (arr: number[]): number => arr.length === 0 ? NaN : sum(arr) / arr.length

/**
 * 判断数值是否在 `[min, max]` 闭区间内（自动纠正顺序）。
 * @param value - 待判断的数值
 * @param min - 最小边界
 * @param max - 最大边界
 * @returns 在区间内返回 `true`
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
 */
export const lerp = (start: number, end: number, t: number): number => start + (end - start) * t

/**
 * 转换为整数。
 * @param value - 待转换的值
 * @param radix - 进制，默认 `10`（取值 2–36）
 * @returns 解析出的整数；无法解析时返回 `0`
 * @remarks 语义等价于 `Number.parseInt`，但把 `NaN` 统一为 `0`，调用方无需重复判空。
 */
export const toInt = (value: unknown, radix: number = 10): number => {
  const result = Number.parseInt(String(value), radix)
  return Number.isNaN(result) ? 0 : result
}

/**
 * 转换为浮点数。
 * @param value - 待转换的值
 * @returns 解析出的浮点数；无法解析时返回 `0`
 * @remarks 语义等价于 `Number.parseFloat`，但把 `NaN` 统一为 `0`。
 */
export const toFloat = (value: unknown): number => {
  const result = Number.parseFloat(String(value))
  return Number.isNaN(result) ? 0 : result
}
