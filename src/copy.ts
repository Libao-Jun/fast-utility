/**
 * 数据拷贝（深拷贝 / 浅拷贝）工具。
 * @packageDocumentation
 */

/**
 * 递归深拷贝：支持 `Date` / `RegExp` / `Map` / `Set` 以及循环引用。
 * @template T - 被拷贝值的类型
 * @param obj - 待深拷贝的源对象/值
 * @param hash - 内部使用的缓存表（`WeakMap`），用于正确处理循环引用；一般无需传入
 * @returns 与源结构完全一致的全新拷贝
 * @example
 * const a = { d: new Date(), m: new Map([['k', 1]]) }
 * const b = deepClone(a)
 * b === a // false（完全独立）
 * @remarks 函数、DOM 节点等无法被结构化拷贝的内容会按引用/浅层方式保留。
 */
export function deepClone<T>(obj: T, hash = new WeakMap<any, any>()): T {
  if (obj === null || typeof obj !== "object") return obj
  if (hash.has(obj)) return hash.get(obj)

  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as any

  if (obj instanceof Map) {
    const clone = new Map()
    hash.set(obj, clone)
    obj.forEach((value, key) => clone.set(key, deepClone(value, hash)))
    return clone as any
  }

  if (obj instanceof Set) {
    const clone = new Set()
    hash.set(obj, clone)
    obj.forEach((value) => clone.add(deepClone(value, hash)))
    return clone as any
  }

  if (Array.isArray(obj)) {
    const clone: any[] = []
    hash.set(obj, clone)
    obj.forEach((item, index) => { clone[index] = deepClone(item, hash) })
    return clone as any
  }

  const clone: Record<string, any> = {}
  hash.set(obj, clone)
  Object.keys(obj).forEach((key) => { clone[key] = deepClone((obj as any)[key], hash) })
  return clone as any
}

/**
 * 基于 `JSON.parse(JSON.stringify(...))` 的深拷贝。
 * @template T - 被拷贝值的类型
 * @param obj - 待拷贝的值（仅支持 JSON 安全类型：`Object` / `Array` / `string` / `number` / `boolean` / `null`）
 * @returns 深拷贝结果
 * @example
 * const b = deepCloneWithJSON({ a: 1, b: [2, 3] })
 * @remarks 会丢失 `Date` / `Map` / `Set` / `function` / `undefined` 等类型（如 `Date` 会变成字符串）。
 */
export const deepCloneWithJSON = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

/**
 * 基于原生 `structuredClone` 的深拷贝。
 * @template T - 被拷贝值的类型
 * @param obj - 待拷贝的值（不支持函数、`Symbol`、`DOM` 节点等）
 * @param options - 可选的 `StructuredSerializeOptions`（如 `{ transfer: [...] }`）
 * @returns 深拷贝结果
 * @example
 * const b = structClone({ a: 1, nested: { b: 2 } })
 * @remarks 环境需支持 `structuredClone`（现代浏览器 / Node 17+）。
 */
export const structClone = <T>(obj: T, options?: StructuredSerializeOptions): T => structuredClone(obj, options)

/**
 * 浅拷贝：仅复制第一层，嵌套对象仍为引用共享。
 * @template T - 被拷贝值的类型
 * @param obj - 待拷贝的数组或对象（其他类型按原值返回）
 * @returns 拷贝后的新值（数组用展开符、对象用 `{...}`）
 * @example
 * const src = { a: 1, nested: { b: 2 } }
 * const c = shallowClone(src)
 * c.nested === src.nested // true（共享引用）
 */
export const shallowClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj
  return (Array.isArray(obj) ? [...obj] : { ...obj }) as any
}
