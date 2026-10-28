/**
 * 数组去重（基于 `Set`，按 SameValueZero 比较，`NaN` 会被视为相同值）。
 * @template T - 数组元素的类型
 * @param arr - 待去重的数组
 * @returns 去重后的新数组（不会修改原数组）
 */
export const unique = <T>(arr: readonly T[]): T[] => [...new Set(arr)]

/**
 * 对象数组按指定属性（key）去重；键相同时**后出现的元素覆盖先出现的元素**。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待去重的对象数组
 * @param key - 用作去重依据的属性名
 * @returns 按 `key` 去重后的新数组
 */
export const uniqueByKey = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): T[] => [...new Map(arr.map((item) => [item[key], item])).values()]

/**
 * 数值数组升序排序（不会改变原数组）。
 * @param arr - 待排序的数值数组
 * @returns 升序排列的新数组
 */
export const sortNumAsc = (arr: number[]): number[] => [...arr].sort((a, b) => a - b)

/**
 * 数值数组降序排序（不会改变原数组）。
 * @param arr - 待排序的数值数组
 * @returns 降序排列的新数组
 */
export const sortNumDesc = (arr: number[]): number[] => [...arr].sort((a, b) => b - a)

/**
 * 对象数组按指定数值属性排序。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待排序的对象数组
 * @param key - 用于排序的数值属性名
 * @param order - 排序方向，默认 `"asc"`（升序），可选 `"desc"`（降序）
 * @returns 排序后的新数组（不会修改原数组）
 */
export const sortByKey = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc",
): T[] => {
  const factor = order === "asc" ? 1 : -1
  return [...arr].sort((a, b) => (a[key] - b[key]) * factor)
}

/**
 * 将类数组（ArrayLike）/可迭代对象转换为真正的数组。
 * @template T - 元素类型
 * @param arrayLike - 类数组或可迭代对象（如 `arguments`、`NodeList`、`Set`、字符串等）
 * @returns 转换后的数组
 */
export const toArray = <T>(arrayLike: ArrayLike<T> | Iterable<T>): T[] => Array.from(arrayLike)

/**
 * 合并多个数组（等价于 `Array.prototype.flat`）。
 * @template T - 各数组的元素类型
 * @param arrays - 任意数量的待合并数组
 * @returns 合并后的新数组
 */
export const mergeArrays = <T>(...arrays: T[][]): T[] => arrays.flat()

/**
 * 多维数组扁平化到指定层级。
 * @template T - 扁平后元素的类型
 * @param arr - 待扁平化的（可能多维的）数组
 * @param depth - 扁平化深度，默认 `1`（只展开一层）
 * @returns 扁平化后的新数组
 */
export const flatten = <T>(arr: any[], depth: number = 1): T[] => arr.flat(depth)

/**
 * 在对象数组中按 `key === value` 查找第一个匹配项。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待查找的对象数组
 * @param key - 用于匹配的 property 名
 * @param value - 目标值
 * @returns 第一个匹配的元素，未找到时返回 `undefined`
 */
export const arrFind = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  value: T[keyof T],
): T | undefined => arr.find((item) => item[key] === value)

/**
 * 将对象数组按指定属性分组。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待分组的对象数组
 * @param key - 分组依据的属性名
 * @returns 以属性值（转为字符串）为键、对应元素数组为值的分组对象
 */
export const groupBy = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): Record<string, T[]> => {
  return arr.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      (acc[groupKey] ??= []).push(item)
      return acc;
    },
    {} as Record<string, T[]>,
  );
};

/**
 * 移除对象中值为空（`null` / `undefined` / 空字符串 `""`）的属性。
 * @template T - 输入对象的类型
 * @param obj - 待清理的对象
 * @returns 仅包含非空属性的新对象（原对象不会被修改）
 */
export const filterEmptyValues = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ""),
  ) as Partial<T>;
};

/**
 * 按指定长度快速生成数组，可配合映射函数生成任意类型。
 * @template T - 生成元素的类型，默认 `number`
 * @param length - 数组长度（非负整数）
 * @param mapFn - 可选的映射函数，接收索引 `index`，返回对应元素；省略时返回索引本身
 * @returns 生成的数组
 */
export const createRange = <T = number>(
  length: number,
  mapFn?: (index: number) => T,
): T[] => {
  const size = Number.isFinite(length) ? Math.max(0, Math.floor(length)) : 0
  return Array.from({ length: size }, (_, i) => (mapFn ? mapFn(i) : (i as unknown as T)))
}

/** 内部工具：把「属性名或取值函数」统一为取值函数。 */
const resolveIteratee = <T>(
  iteratee: keyof T | ((item: T) => string | number),
): ((item: T) => string | number) => {
  return typeof iteratee === "function"
    ? iteratee
    : (item: T) => item[iteratee] as unknown as string | number
}

/**
 * 按固定长度切分数组，返回二维数组（不修改入参）。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param size - 每个子数组的长度，需为正整数；非法值返回空数组
 * @returns 切分后的二维数组，最后一段可能不足 `size`
 */
export const chunk = <T>(arr: readonly T[], size: number): T[][] => {
  const step = Math.floor(size)
  if (!Number.isFinite(step) || step <= 0) return []
  const result: T[][] = []
  for (let index = 0; index < arr.length; index += step) {
    result.push(arr.slice(index, index + step))
  }
  return result
}

/**
 * 去除数组中的假值（`false` / `0` / `""` / `null` / `undefined` / `NaN`）。
 * @template T - 元素类型
 * @param arr - 源数组
 * @returns 仅保留真值的新数组
 */
export const compact = <T>(arr: readonly T[]): T[] => arr.filter(Boolean) as T[]

/**
 * 返回存在于第一个数组、但不存在于其余数组的元素（按 SameValueZero 比较）。
 * @template T - 元素类型
 * @param arr - 基准数组
 * @param others - 需要排除的数组
 * @returns 差集新数组，保留基准数组中的顺序；被排除的值会全部移除，未排除的重复值原样保留
 */
export const difference = <T>(
  arr: readonly T[],
  ...others: ReadonlyArray<readonly T[]>
): T[] => {
  const excluded = new Set<T>(others.flat())
  return arr.filter((item) => !excluded.has(item))
}

/**
 * 返回所有数组共有的元素（结果去重，按首次出现顺序）。
 * @template T - 元素类型
 * @param arr - 基准数组
 * @param others - 其余数组
 * @returns 交集新数组
 */
export const intersection = <T>(
  arr: readonly T[],
  ...others: ReadonlyArray<readonly T[]>
): T[] => {
  const sets = others.map((other) => new Set(other))
  return unique(arr).filter((item) => sets.every((set) => set.has(item)))
}

/**
 * 合并多个数组并去重（按 SameValueZero 比较）。
 * @template T - 元素类型
 * @param arrays - 待合并的数组
 * @returns 去重后的合并新数组
 */
export const union = <T>(...arrays: ReadonlyArray<readonly T[]>): T[] =>
  unique(arrays.flat())

/**
 * 从数组开头丢弃指定数量的元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param count - 丢弃数量，默认 `1`；负数按 `0` 处理
 * @returns 剩余元素组成的新数组
 */
export const drop = <T>(arr: readonly T[], count = 1): T[] =>
  arr.slice(Math.max(0, Math.floor(count)))

/**
 * 从数组末尾丢弃指定数量的元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param count - 丢弃数量，默认 `1`；负数按 `0` 处理
 * @returns 剩余元素组成的新数组
 */
export const dropRight = <T>(arr: readonly T[], count = 1): T[] =>
  arr.slice(0, Math.max(0, arr.length - Math.max(0, Math.floor(count))))

/**
 * 从数组开头截取指定数量的元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param count - 截取数量，默认 `1`；负数按 `0` 处理
 * @returns 截取出的新数组
 */
export const take = <T>(arr: readonly T[], count = 1): T[] =>
  arr.slice(0, Math.max(0, Math.floor(count)))

/**
 * 从数组末尾截取指定数量的元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param count - 截取数量，默认 `1`；负数按 `0` 处理
 * @returns 截取出的新数组
 */
export const takeRight = <T>(arr: readonly T[], count = 1): T[] =>
  arr.slice(Math.max(0, arr.length - Math.max(0, Math.floor(count))))

/**
 * 读取指定索引的元素，支持负索引（从末尾计数）。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param index - 索引，负数表示从末尾开始
 * @returns 对应元素，越界返回 `undefined`
 */
export const nth = <T>(arr: readonly T[], index: number): T | undefined => {
  const target = index < 0 ? arr.length + index : index
  return target >= 0 && target < arr.length ? arr[target] : undefined
}

/**
 * 随机返回数组中的一个元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @returns 随机元素；空数组返回 `undefined`
 */
export const sample = <T>(arr: readonly T[]): T | undefined =>
  arr.length === 0 ? undefined : arr[Math.floor(Math.random() * arr.length)]

/**
 * 洗牌：返回随机打乱顺序的新数组（Fisher–Yates，不修改入参）。
 * @template T - 元素类型
 * @param arr - 源数组
 * @returns 打乱顺序的新数组
 */
export const shuffle = <T>(arr: readonly T[]): T[] => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 随机抽取指定数量的不重复元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param count - 抽取数量，超出数组长度时返回全部元素的乱序结果
 * @returns 抽取出的新数组
 */
export const sampleSize = <T>(arr: readonly T[], count: number): T[] => {
  const size = Math.max(0, Math.min(arr.length, Math.floor(count)))
  return shuffle(arr).slice(0, size)
}

/**
 * 拉链式合并多个数组，按最长数组对齐，缺失位置补 `undefined`。
 * @template T - 元素类型
 * @param arrays - 待合并的数组
 * @returns 二维数组，每个子数组对应一个索引位置
 */
export const zip = <T>(
  ...arrays: ReadonlyArray<readonly T[]>
): Array<Array<T | undefined>> => {
  const length = arrays.reduce((max, arr) => Math.max(max, arr.length), 0)
  return Array.from({ length }, (_, index) => arrays.map((arr) => arr[index]))
}

/**
 * 按条件把数组拆分为「通过」与「未通过」两组。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param predicate - 判定函数，接收元素与索引
 * @returns `[通过组, 未通过组]`，两组均保持原顺序
 */
export const partition = <T>(
  arr: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] => {
  const passed: T[] = []
  const failed: T[] = []
  arr.forEach((item, index) => {
    ;(predicate(item, index) ? passed : failed).push(item)
  })
  return [passed, failed]
}

/**
 * 按属性或取值函数统计元素出现次数。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param iteratee - 分组依据：属性名或返回键的取值函数
 * @returns 以键为属性、出现次数为值的新对象
 */
export const countBy = <T>(
  arr: readonly T[],
  iteratee: keyof T | ((item: T) => string | number),
): Record<string, number> => {
  const getKey = resolveIteratee<T>(iteratee)
  const counts = new Map<string, number>()
  arr.forEach((item) => {
    const key = String(getKey(item))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  return Object.fromEntries(counts)
}

/**
 * 按属性或取值函数建立索引，键冲突时后出现的元素覆盖先出现的。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param iteratee - 索引依据：属性名或返回键的取值函数
 * @returns 以键为属性、元素为值的新对象
 */
export const keyBy = <T>(
  arr: readonly T[],
  iteratee: keyof T | ((item: T) => string | number),
): Record<string, T> => {
  const getKey = resolveIteratee<T>(iteratee)
  const entries = new Map<string, T>()
  arr.forEach((item) => { entries.set(String(getKey(item)), item) })
  return Object.fromEntries(entries)
}

/**
 * 返回按取值函数计算后最大的元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param iteratee - 数值取值函数
 * @returns 最大元素；空数组返回 `undefined`
 */
export const maxBy = <T>(
  arr: readonly T[],
  iteratee: (item: T) => number,
): T | undefined => {
  let result: T | undefined
  let max = -Infinity
  arr.forEach((item) => {
    const value = iteratee(item)
    if (result === undefined || value > max) {
      result = item
      max = value
    }
  })
  return result
}

/**
 * 返回按取值函数计算后最小的元素。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param iteratee - 数值取值函数
 * @returns 最小元素；空数组返回 `undefined`
 */
export const minBy = <T>(
  arr: readonly T[],
  iteratee: (item: T) => number,
): T | undefined => {
  let result: T | undefined
  let min = Infinity
  arr.forEach((item) => {
    const value = iteratee(item)
    if (result === undefined || value < min) {
      result = item
      min = value
    }
  })
  return result
}

/**
 * 按取值函数升序排序，返回新数组（不修改入参）。
 * @template T - 元素类型
 * @param arr - 源数组
 * @param iteratee - 返回数字或字符串的排序依据
 * @returns 排序后的新数组；取值相等时保持原有顺序
 */
export const sortBy = <T>(
  arr: readonly T[],
  iteratee: (item: T) => number | string,
): T[] => {
  return [...arr].sort((a, b) => {
    const left: any = iteratee(a)
    const right: any = iteratee(b)
    if (left < right) return -1
    if (left > right) return 1
    return 0
  })
}
