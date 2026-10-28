/** 内部工具：把 `a.b[0].c` 形式的路径解析为键序列。 */
const toPath = (path: string | readonly (string | number)[]): (string | number)[] => {
  if (typeof path !== "string") return [...path]
  const normalized = path.replace(/\[(\d+)\]/g, ".$1")
  return normalized.split(".").filter((segment) => segment.length > 0)
}

/** 内部工具：判断是否为普通对象（原型为 `Object.prototype` 或 `null`）。 */
const isPlainObject = (value: unknown): value is Record<string, any> => {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** 内部工具：仅保留自有属性，避免原型链污染。 */
const hasOwn = (target: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(target, key)

/** 内部工具：判断是否属于需要拦截的危险键。 */
const isUnsafeKey = (key: string): boolean =>
  key === "__proto__" || key === "constructor" || key === "prototype"

/**
 * 从对象中挑选指定键，返回新对象（只读取自有属性）。
 * @template T - 源对象类型
 * @template K - 需要保留的键
 * @param obj - 源对象
 * @param keys - 需要保留的键数组
 * @returns 仅包含指定键的新对象，缺失的键会被忽略
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (hasOwn(obj, key as PropertyKey)) result[key] = obj[key]
  })
  return result
}

/**
 * 排除对象中的指定键，返回新对象（浅拷贝，不修改入参）。
 * @template T - 源对象类型
 * @template K - 需要排除的键
 * @param obj - 源对象
 * @param keys - 需要排除的键数组
 * @returns 不含指定键的新对象
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> => {
  const result = { ...obj } as T
  keys.forEach((key) => { delete result[key] })
  return result as Omit<T, K>
}

/**
 * 映射对象的每个值，返回键不变的新对象。
 * @template T - 源对象类型
 * @template R - 映射后的值类型
 * @param obj - 源对象
 * @param fn - 映射函数，接收当前值与键
 * @returns 值被映射后的新对象
 */
export const mapValues = <T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R,
): { [K in keyof T]: R } => {
  const result = {} as { [K in keyof T]: R }
  ;(Object.keys(obj) as (keyof T)[]).forEach((key) => {
    result[key] = fn(obj[key], key)
  })
  return result
}

/**
 * 映射对象的每个键，返回新对象；键冲突时后出现的覆盖先出现的。
 * @template T - 源对象类型
 * @param obj - 源对象
 * @param fn - 键映射函数，接收当前值与键，需返回字符串键
 * @returns 键被映射后的新对象
 */
export const mapKeys = <T extends object>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => string,
): Record<string, T[keyof T]> => {
  const entries: Array<[string, T[keyof T]]> = []
  ;(Object.keys(obj) as (keyof T)[]).forEach((key) => {
    const nextKey = fn(obj[key], key)
    if (!isUnsafeKey(nextKey)) entries.push([nextKey, obj[key]])
  })
  return Object.fromEntries(entries)
}

/**
 * 反转对象的键与值（值会转为字符串键）。
 * @template T - 源对象类型，值需可安全转为字符串
 * @param obj - 源对象
 * @returns 键值互换后的新对象
 */
export const invert = <T extends Record<string, string | number>>(
  obj: T,
): Record<string, string> => {
  const entries: Array<[string, string]> = []
  Object.keys(obj).forEach((key) => {
    const value = String(obj[key])
    if (!isUnsafeKey(value)) entries.push([value, key])
  })
  return Object.fromEntries(entries)
}

/**
 * 深度合并普通对象，返回新对象（不修改任何入参）。
 * @template T - 目标对象类型
 * @param target - 目标对象
 * @param sources - 一个或多个来源对象，后者覆盖前者
 * @returns 合并后的新对象
 * @remarks 仅递归合并普通对象；数组会被浅拷贝覆盖，`Date` / `Map` / `Set` 等按引用保留。`__proto__`、`constructor`、`prototype` 键会被忽略。
 */
export const merge = <T extends Record<string, any>>(
  target: T,
  ...sources: Array<Record<string, any>>
): T => {
  const result: Record<string, any> = { ...target }
  sources.forEach((source) => {
    if (!isPlainObject(source)) return
    Object.keys(source).forEach((key) => {
      if (isUnsafeKey(key)) return
      const sourceValue = source[key]
      const targetValue = result[key]
      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = merge(targetValue, sourceValue)
      } else if (Array.isArray(sourceValue)) {
        result[key] = sourceValue.slice()
      } else {
        result[key] = sourceValue
      }
    })
  })
  return result as T
}

/**
 * 按路径读取对象值，路径不存在时返回默认值。
 * @template T - 期望的返回值类型
 * @param obj - 目标对象
 * @param path - 路径，支持 `a.b.c`、`a[0].b` 或键数组
 * @param defaultValue - 路径不存在时返回的默认值
 * @returns 读取到的值或默认值
 */
export const get = <T = unknown>(
  obj: unknown,
  path: string | readonly (string | number)[],
  defaultValue?: T,
): T | undefined => {
  const segments = toPath(path)
  if (segments.length === 0) return defaultValue
  let current: any = obj
  for (const segment of segments) {
    if (current === null || current === undefined) return defaultValue
    current = current[segment as any]
  }
  return (current === undefined ? defaultValue : current) as T
}

/**
 * 判断对象在指定路径上是否存在属性（含继承属性）。
 * @param obj - 目标对象
 * @param path - 路径，支持 `a.b.c`、`a[0].b` 或键数组
 * @returns 路径完整存在返回 `true`
 */
export const has = (
  obj: unknown,
  path: string | readonly (string | number)[],
): boolean => {
  const segments = toPath(path)
  if (segments.length === 0) return false
  let current: any = obj
  for (const segment of segments) {
    if (current === null || current === undefined) return false
    if (!(segment in Object(current))) return false
    current = current[segment as any]
  }
  return true
}
