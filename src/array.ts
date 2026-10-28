/**
 * 数组与类数组相关的工具函数集合。
 * @packageDocumentation
 */

/**
 * 数组去重（基于 `Set`，按严格相等 `===` 比较）。
 * @template T - 数组元素的类型
 * @param arr - 待去重的数组
 * @returns 去重后的新数组（不会修改原数组）
 * @example
 * unique([1, 1, 2, 3, 3]) // [1, 2, 3]
 * unique(['a', 'b', 'a']) // ['a', 'b']
 */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)]

/**
 * 对象数组按指定属性（key）去重，保留首次出现的元素。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待去重的对象数组
 * @param key - 用作去重依据的属性名
 * @returns 按 `key` 去重后的新数组
 * @example
 * uniqueByKey([{id:1},{id:1},{id:2}], 'id') // [{id:1},{id:2}]
 */
export const uniqueByKey = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): T[] => [...new Map(arr.map((item) => [item[key], item])).values()]

/**
 * 数值数组升序排序（不会改变原数组）。
 * @param arr - 待排序的数值数组
 * @returns 升序排列的新数组
 * @example
 * sortNumAsc([3, 1, 2]) // [1, 2, 3]
 */
export const sortNumAsc = (arr: number[]): number[] => [...arr].sort((a, b) => a - b)

/**
 * 数值数组降序排序（不会改变原数组）。
 * @param arr - 待排序的数值数组
 * @returns 降序排列的新数组
 * @example
 * sortNumDesc([3, 1, 2]) // [3, 2, 1]
 */
export const sortNumDesc = (arr: number[]): number[] => [...arr].sort((a, b) => b - a)

/**
 * 对象数组按指定数值属性排序。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待排序的对象数组
 * @param key - 用于排序的数值属性名
 * @param order - 排序方向，默认 `"asc"`（升序），可选 `"desc"`（降序）
 * @returns 排序后的新数组（不会修改原数组）
 * @example
 * sortByKey([{n:3},{n:1}], 'n') // [{n:1},{n:3}]
 * sortByKey([{n:3},{n:1}], 'n', 'desc') // [{n:3},{n:1}]
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
 * @param arrayLike - 类数组或可迭代对象（如 `arguments`、`NodeList`、`Set` 等）
 * @returns 转换后的数组
 * @example
 * toArray(document.querySelectorAll('div')) // HTMLDivElement[]
 */
export const toArray = <T>(arrayLike: ArrayLike<T>): T[] => Array.from(arrayLike)

/**
 * 合并多个数组（等价于 `Array.prototype.flat`）。
 * @template T - 各数组的元素类型
 * @param arrays - 任意数量的待合并数组
 * @returns 合并后的新数组
 * @example
 * mergeArrays([1, 2], [3, 4]) // [1, 2, 3, 4]
 */
export const mergeArrays = <T>(...arrays: T[][]): T[] => arrays.flat()

/**
 * 多维数组扁平化到指定层级。
 * @template T - 扁平后元素的类型
 * @param arr - 待扁平化的（可能多维的）数组
 * @param depth - 扁平化深度，默认 `1`（只展开一层）
 * @returns 扁平化后的新数组
 * @example
 * flatten([1, [2, [3]]], 1) // [1, 2, [3]]
 * flatten([1, [2, [3]]], 2) // [1, 2, 3]
 */
export const flatten = <T>(arr: any[], depth: number = 1): T[] => arr.flat(depth)

/**
 * 在对象数组中按 `key === value` 查找第一个匹配项。
 * @template T - 对象元素的类型（需为可索引的普通对象）
 * @param arr - 待查找的对象数组
 * @param key - 用于匹配的 property 名
 * @param value - 目标值
 * @returns 第一个匹配的元素，未找到时返回 `undefined`
 * @example
 * arrFind([{id:1},{id:2}], 'id', 2) // {id:2}
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
 * @example
 * groupBy([{type:'a'},{type:'b'},{type:'a'}], 'type')
 * // { a: [{type:'a'},{type:'a'}], b: [{type:'b'}] }
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
 * @example
 * filterEmptyValues({a:1, b:null, c:'', d:undefined}) // {a:1}
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
 * @example
 * createRange(3) // [0, 1, 2]
 * createRange(3, i => i * 2) // [0, 2, 4]
 * createRange(2, i => `no${i}`) // ['no0', 'no1']
 */
export const createRange = <T = number>(
  length: number,
  mapFn?: (index: number) => T,
): T[] => Array.from({ length }, (_, i) => mapFn ? mapFn(i) : i as unknown as T)
