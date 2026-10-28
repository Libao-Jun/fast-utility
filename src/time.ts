/**
 * 获取当前时间戳（毫秒）。
 * @returns 自 Unix 纪元（1970-01-01）起的毫秒数
 */
export const nowMilliseconds = () => Date.now()

/**
 * 判断给定日期是否为今天。
 * @param date - 日期，可为 `Date`、时间戳（毫秒数字）或日期字符串
 * @returns 是今天返回 `true`
 */
export const isToday = (date: string | number | Date): boolean => {
  const d1 = new Date(date)
  const d2 = new Date()
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate()
}

/**
 * 获取指定年月的**第一天**（`Date` 对象，时间归零）。
 * @param y - 年份（如 `2026`）
 * @param m - 月份（1-12，按人类习惯，内部已 `-1` 转换）
 * @returns 该月 1 日 00:00:00 的 `Date`
 */
export const firstDayOfMonth = (y: number, m: number): Date => new Date(y, m - 1, 1)

/**
 * 获取指定年月的**最后一天**（`Date` 对象，时间归零）。
 * @param y - 年份（如 `2026`）
 * @param m - 月份（1-12，按人类习惯）
 * @returns 该月最后一天 00:00:00 的 `Date`（如 9 月返回 30 日）
 */
export const lastDayOfMonth = (y: number, m: number): Date => new Date(y, m, 0)
