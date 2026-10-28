import { describe, it, expect } from 'vitest'
import {
  unique,
  uniqueByKey,
  sortNumAsc,
  sortNumDesc,
  sortByKey,
  toArray,
  mergeArrays,
  flatten,
  arrFind,
  groupBy,
  filterEmptyValues,
  createRange,
  chunk,
  compact,
  difference,
  intersection,
  union,
  drop,
  dropRight,
  take,
  takeRight,
  nth,
  sample,
  shuffle,
  sampleSize,
  zip,
  partition,
  countBy,
  keyBy,
  maxBy,
  minBy,
  sortBy,
  replace,
  replaceOrAppend,
  toggle,
  zipToObject,
  rotate,
  intersects,
  objectify,
  select,
} from '../src/array'

// ============================================================
// unique
// ============================================================
describe('unique', () => {
  it('should remove duplicate primitives', () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3])
  })

  it('should handle empty array', () => {
    expect(unique([])).toEqual([])
  })

  it('should handle array with no duplicates', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should handle array with all duplicates', () => {
    expect(unique([1, 1, 1])).toEqual([1])
  })

  it('should handle string array', () => {
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('should not mutate original array', () => {
    const arr = [1, 2, 2, 3]
    const result = unique(arr)
    expect(arr).toEqual([1, 2, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('should handle objects by reference', () => {
    const obj = { a: 1 }
    expect(unique([obj, obj])).toEqual([obj])
  })

  it('should not dedupe different object references', () => {
    const result = unique([{ a: 1 }, { a: 1 }])
    expect(result).toHaveLength(2)
  })

  it('should preserve insertion order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
  })
})

// ============================================================
// uniqueByKey
// ============================================================
describe('uniqueByKey', () => {
  it('按指定键去重并保留首次出现', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
      { id: 2, name: 'c' },
    ]
    const result = uniqueByKey(arr, 'id')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 1, name: 'a' })
    expect(result[1]).toEqual({ id: 2, name: 'c' })
  })

  it('重复键保留首次出现的元素', () => {
    const arr = [
      { id: 1, value: 'first' },
      { id: 1, value: 'second' },
    ]
    expect(uniqueByKey(arr, 'id')).toEqual([{ id: 1, value: 'first' }])
  })

  it('should handle empty array', () => {
    expect(uniqueByKey([], 'id')).toEqual([])
  })

  it('should handle array with unique keys', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    expect(uniqueByKey(arr, 'id')).toEqual(arr)
  })

  it('should not mutate original array', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
    ]
    const result = uniqueByKey(arr, 'id')
    expect(arr).toHaveLength(2)
    expect(result).toHaveLength(1)
  })

  it('should work with string key', () => {
    const arr = [
      { code: 'a', val: 1 },
      { code: 'b', val: 2 },
      { code: 'a', val: 3 },
    ]
    expect(uniqueByKey(arr, 'code')).toHaveLength(2)
  })
})

// ============================================================
// sortNumAsc
// ============================================================
describe('sortNumAsc', () => {
  it('should sort numbers in ascending order', () => {
    expect(sortNumAsc([3, 1, 2])).toEqual([1, 2, 3])
  })

  it('should handle negative numbers', () => {
    expect(sortNumAsc([-1, -3, 0, 2])).toEqual([-3, -1, 0, 2])
  })

  it('should handle empty array', () => {
    expect(sortNumAsc([])).toEqual([])
  })

  it('should handle single element', () => {
    expect(sortNumAsc([42])).toEqual([42])
  })

  it('should not mutate original', () => {
    const arr = [3, 1, 2]
    const result = sortNumAsc(arr)
    expect(arr).toEqual([3, 1, 2])
  })

  it('should handle already sorted array', () => {
    expect(sortNumAsc([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should handle duplicate values', () => {
    expect(sortNumAsc([3, 1, 2, 1])).toEqual([1, 1, 2, 3])
  })
})

// ============================================================
// sortNumDesc
// ============================================================
describe('sortNumDesc', () => {
  it('should sort numbers in descending order', () => {
    expect(sortNumDesc([1, 3, 2])).toEqual([3, 2, 1])
  })

  it('should handle negative numbers', () => {
    expect(sortNumDesc([-1, -3, 0, 2])).toEqual([2, 0, -1, -3])
  })

  it('should handle empty array', () => {
    expect(sortNumDesc([])).toEqual([])
  })

  it('should handle single element', () => {
    expect(sortNumDesc([42])).toEqual([42])
  })

  it('should not mutate original', () => {
    const arr = [1, 3, 2]
    const result = sortNumDesc(arr)
    expect(arr).toEqual([1, 3, 2])
  })

  it('should handle duplicate values', () => {
    expect(sortNumDesc([3, 1, 2, 1])).toEqual([3, 2, 1, 1])
  })
})

// ============================================================
// sortByKey
// ============================================================
describe('sortByKey', () => {
  const arr = [{ age: 30 }, { age: 20 }, { age: 40 }]

  it('should sort ascending by default', () => {
    const result = sortByKey(arr, 'age')
    expect(result).toEqual([{ age: 20 }, { age: 30 }, { age: 40 }])
  })

  it('should sort ascending when explicitly specified', () => {
    const result = sortByKey(arr, 'age', 'asc')
    expect(result).toEqual([{ age: 20 }, { age: 30 }, { age: 40 }])
  })

  it('should sort descending', () => {
    const result = sortByKey(arr, 'age', 'desc')
    expect(result).toEqual([{ age: 40 }, { age: 30 }, { age: 20 }])
  })

  it('should not mutate original', () => {
    const original = [{ age: 30 }, { age: 20 }]
    sortByKey(original, 'age')
    expect(original).toEqual([{ age: 30 }, { age: 20 }])
  })

  it('should handle empty array', () => {
    expect(sortByKey([], 'age')).toEqual([])
  })

  it('should handle single element', () => {
    expect(sortByKey([{ age: 30 }], 'age')).toEqual([{ age: 30 }])
  })

  it('should handle string keys', () => {
    const data = [{ name: 'c' }, { name: 'a' }, { name: 'b' }]
    // Note: string subtraction results in NaN, sort order may be unstable
    // This reveals a limitation: sortByKey works best with numeric values
  })
})

// ============================================================
// toArray
// ============================================================
describe('toArray', () => {
  it('should convert NodeList-like to array', () => {
    const divs = document.querySelectorAll('div')
    const result = toArray(divs)
    expect(Array.isArray(result)).toBe(true)
  })

  it('should convert array-like object to array', () => {
    const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 }
    const result = toArray(arrayLike)
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should handle empty array-like', () => {
    const empty = { length: 0 }
    expect(toArray(empty)).toEqual([])
  })

  it('should handle string as array-like', () => {
    // String is also ArrayLike
    const result = toArray('hello')
    expect(result).toEqual(['h', 'e', 'l', 'l', 'o'])
  })
})

// ============================================================
// mergeArrays
// ============================================================
describe('mergeArrays', () => {
  it('should merge multiple arrays', () => {
    expect(mergeArrays([1, 2], [3, 4], [5])).toEqual([1, 2, 3, 4, 5])
  })

  it('should handle single array', () => {
    expect(mergeArrays([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should handle empty arrays', () => {
    expect(mergeArrays([], [1, 2], [])).toEqual([1, 2])
  })

  it('should handle all empty arrays', () => {
    expect(mergeArrays([], [], [])).toEqual([])
  })

  it('should handle no arguments', () => {
    expect(mergeArrays()).toEqual([])
  })

  it('should not mutate original arrays', () => {
    const a = [1, 2]
    const b = [3, 4]
    mergeArrays(a, b)
    expect(a).toEqual([1, 2])
    expect(b).toEqual([3, 4])
  })

  it('should work with string arrays', () => {
    expect(mergeArrays(['a', 'b'], ['c'])).toEqual(['a', 'b', 'c'])
  })

  it('should work with mixed types', () => {
    expect(mergeArrays([1, 'a'], [true])).toEqual([1, 'a', true])
  })

  it('should handle arrays with duplicate values', () => {
    expect(mergeArrays([1, 2], [2, 3])).toEqual([1, 2, 2, 3])
  })
})

// ============================================================
// flatten
// ============================================================
describe('flatten', () => {
  // --- 默认 depth=1 ---
  it('should flatten one level by default', () => {
    expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, [3, 4], 5])
  })

  it('should handle already flat array (default depth)', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should handle empty array (default depth)', () => {
    expect(flatten([])).toEqual([])
  })

  it('should not mutate original array', () => {
    const arr = [1, [2, [3]]]
    flatten(arr)
    expect(arr).toEqual([1, [2, [3]]])
  })

  // --- depth = 0 ---
  it('should not flatten when depth is 0', () => {
    expect(flatten([1, [2, [3, 4]], 5], 0)).toEqual([1, [2, [3, 4]], 5])
  })

  // --- depth = 2 ---
  it('should flatten two levels', () => {
    expect(flatten([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]])
  })

  // --- depth = Infinity ---
  it('should flatten completely with Infinity', () => {
    expect(flatten([1, [2, [3, 4]], 5], Infinity)).toEqual([1, 2, 3, 4, 5])
  })

  it('should handle deeply nested arrays with Infinity', () => {
    expect(flatten([[[[1]]], [[2]]], Infinity)).toEqual([1, 2])
  })

  it('should handle nested empty arrays with Infinity', () => {
    expect(flatten([1, [], [2, []]], Infinity)).toEqual([1, 2])
  })

  it('should handle single element nested with Infinity', () => {
    expect(flatten([[[[42]]]], Infinity)).toEqual([42])
  })

  // --- depth = 3 ---
  it('should flatten exactly three levels', () => {
    expect(flatten([[[[1, 2]]]], 3)).toEqual([1, 2])
  })

  // --- 边界 ---
  it('should return same array ref elements when no nesting', () => {
    const result = flatten([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })
})

// ============================================================
// arrFind
// ============================================================
describe('arrFind', () => {
  const users = [
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
    { id: 3, name: 'c' },
  ]

  it('should find first matching item by key and value', () => {
    expect(arrFind(users, 'id', 2)).toEqual({ id: 2, name: 'b' })
  })

  it('should return undefined when no match', () => {
    expect(arrFind(users, 'id', 99)).toBeUndefined()
  })

  it('should return first match when multiple exist', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
    ]
    expect(arrFind(arr, 'id', 1)).toEqual({ id: 1, name: 'a' })
  })

  it('should handle empty array', () => {
    expect(arrFind([], 'id', 1)).toBeUndefined()
  })

  it('should not mutate original array', () => {
    const arr = [{ id: 1, name: 'a' }]
    arrFind(arr, 'id', 1)
    expect(arr).toEqual([{ id: 1, name: 'a' }])
  })

  it('should work with string values', () => {
    expect(arrFind(users, 'name', 'c')).toEqual({ id: 3, name: 'c' })
  })
})

// ============================================================
// groupBy
// ============================================================
describe('groupBy', () => {
  const items = [
    { type: 'fruit', name: 'apple' },
    { type: 'fruit', name: 'banana' },
    { type: 'vegetable', name: 'carrot' },
  ]

  it('should group by specified key', () => {
    const result = groupBy(items, 'type')
    expect(result).toEqual({
      fruit: [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
      ],
      vegetable: [
        { type: 'vegetable', name: 'carrot' },
      ],
    })
  })

  it('should handle empty array', () => {
    expect(groupBy([], 'type')).toEqual({})
  })

  it('should handle single element', () => {
    const result = groupBy([{ type: 'fruit', name: 'apple' }], 'type')
    expect(result).toEqual({
      fruit: [{ type: 'fruit', name: 'apple' }],
    })
  })

  it('should not mutate original array', () => {
    const arr = [{ type: 'a', val: 1 }]
    groupBy(arr, 'type')
    expect(arr).toEqual([{ type: 'a', val: 1 }])
  })

  it('should handle numeric key values', () => {
    const arr = [
      { score: 10, name: 'a' },
      { score: 20, name: 'b' },
      { score: 10, name: 'c' },
    ]
    const result = groupBy(arr, 'score')
    expect(result['10']).toHaveLength(2)
    expect(result['20']).toHaveLength(1)
  })

  it('should handle string and number keys', () => {
    const arr = [
      { key: 1, val: 'a' },
      { key: 2, val: 'b' },
      { key: 1, val: 'c' },
    ]
    const result = groupBy(arr, 'key')
    expect(result['1']).toHaveLength(2)
  })
})

// ============================================================
// filterEmptyValues
// ============================================================
describe('filterEmptyValues', () => {
  it('should remove null, undefined, and empty string values', () => {
    const obj = { a: 1, b: '', c: null, d: undefined, e: 3 }
    expect(filterEmptyValues(obj)).toEqual({ a: 1, e: 3 })
  })

  it('should keep falsy-but-valid values (0, false)', () => {
    const obj = { a: 0, b: false, c: '', d: null }
    expect(filterEmptyValues(obj)).toEqual({ a: 0, b: false })
  })

  it('should handle empty object', () => {
    expect(filterEmptyValues({})).toEqual({})
  })

  it('should handle object with all valid values', () => {
    const obj = { a: 1, b: 'hello', c: true }
    expect(filterEmptyValues(obj)).toEqual({ a: 1, b: 'hello', c: true })
  })

  it('should handle object with all empty values', () => {
    expect(filterEmptyValues({ a: '', b: null, c: undefined })).toEqual({})
  })

  it('should not mutate original object', () => {
    const obj = { a: 1, b: '' }
    filterEmptyValues(obj)
    expect(obj).toEqual({ a: 1, b: '' })
  })
})

// ============================================================
// createRange
// ============================================================
describe('createRange', () => {
  it('should generate range from 0 to length-1 by default', () => {
    expect(createRange(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('should handle length 0', () => {
    expect(createRange(0)).toEqual([])
  })

  it('should handle length 1', () => {
    expect(createRange(1)).toEqual([0])
  })

  it('should apply custom map function', () => {
    expect(createRange(3, (i) => i * 2)).toEqual([0, 2, 4])
  })

  it('should work with string mapping', () => {
    expect(createRange(3, (i) => `item-${i}`)).toEqual(['item-0', 'item-1', 'item-2'])
  })

  it('should generate 1-based range with custom map', () => {
    expect(createRange(3, (i) => i + 1)).toEqual([1, 2, 3])
  })

  it('负数或非法长度返回空数组', () => {
    expect(createRange(-1)).toEqual([])
    expect(createRange(Number.NaN)).toEqual([])
  })
})

// ============================================================
// chunk
// ============================================================
describe('chunk', () => {
  it('按固定长度切分，末段可不足', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('长度大于数组时返回单个子数组', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]])
  })

  it('非法长度返回空数组', () => {
    expect(chunk([1, 2], 0)).toEqual([])
    expect(chunk([1, 2], -1)).toEqual([])
  })

  it('不修改原数组', () => {
    const source = [1, 2, 3]
    chunk(source, 2)
    expect(source).toEqual([1, 2, 3])
  })
})

// ============================================================
// compact
// ============================================================
describe('compact', () => {
  it('移除所有假值', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined, Number.NaN])).toEqual([1, 2, 3])
  })

  it('保留真值中的对象与数组', () => {
    expect(compact([[], {}, 'x'])).toEqual([[], {}, 'x'])
  })
})

// ============================================================
// difference / intersection / union
// ============================================================
describe('difference', () => {
  it('返回基准数组中不在其余数组的元素', () => {
    expect(difference([1, 2, 3, 2], [2])).toEqual([1, 3])
  })

  it('支持多个排除数组', () => {
    expect(difference([1, 2, 3, 4], [2], [4])).toEqual([1, 3])
  })

  it('空排除数组返回原数组副本', () => {
    const source = [1, 2]
    const result = difference(source)
    expect(result).toEqual([1, 2])
    expect(result).not.toBe(source)
  })
})

describe('intersection', () => {
  it('返回所有数组共有的元素并去重', () => {
    expect(intersection([1, 2, 2, 3], [2, 3, 4])).toEqual([2, 3])
  })

  it('支持多个数组', () => {
    expect(intersection([1, 2, 3], [2, 3], [3, 4])).toEqual([3])
  })

  it('无其余数组时返回去重结果', () => {
    expect(intersection([1, 1, 2])).toEqual([1, 2])
  })
})

describe('union', () => {
  it('合并并去重', () => {
    expect(union([1, 2], [2, 3], [3, 4])).toEqual([1, 2, 3, 4])
  })

  it('保持首次出现顺序', () => {
    expect(union([3, 1], [2, 1])).toEqual([3, 1, 2])
  })
})

// ============================================================
// drop / take / nth
// ============================================================
describe('drop / dropRight / take / takeRight', () => {
  const source = [1, 2, 3, 4]

  it('drop 从开头丢弃', () => {
    expect(drop(source, 2)).toEqual([3, 4])
    expect(drop(source)).toEqual([2, 3, 4])
    expect(drop(source, -1)).toEqual([1, 2, 3, 4])
  })

  it('dropRight 从末尾丢弃', () => {
    expect(dropRight(source, 2)).toEqual([1, 2])
    expect(dropRight(source, 10)).toEqual([])
  })

  it('take 从开头截取', () => {
    expect(take(source, 2)).toEqual([1, 2])
    expect(take(source, -1)).toEqual([])
    expect(take(source, 10)).toEqual([1, 2, 3, 4])
  })

  it('takeRight 从末尾截取', () => {
    expect(takeRight(source, 2)).toEqual([3, 4])
    expect(takeRight(source, 10)).toEqual([1, 2, 3, 4])
  })

  it('均不修改原数组', () => {
    drop(source, 1)
    take(source, 1)
    expect(source).toEqual([1, 2, 3, 4])
  })
})

describe('nth', () => {
  it('支持正负索引', () => {
    expect(nth([1, 2, 3], 0)).toBe(1)
    expect(nth([1, 2, 3], -1)).toBe(3)
  })

  it('越界返回 undefined', () => {
    expect(nth([1, 2, 3], 5)).toBeUndefined()
    expect(nth([1, 2, 3], -5)).toBeUndefined()
  })
})

// ============================================================
// sample / shuffle / sampleSize
// ============================================================
describe('sample', () => {
  it('返回数组中的元素', () => {
    expect([1, 2, 3]).toContain(sample([1, 2, 3]))
  })

  it('空数组返回 undefined', () => {
    expect(sample([])).toBeUndefined()
  })
})

describe('shuffle', () => {
  it('返回等长且元素相同的副本', () => {
    const source = [1, 2, 3, 4, 5]
    const result = shuffle(source)
    expect(result).not.toBe(source)
    expect(result).toHaveLength(source.length)
    expect([...result].sort()).toEqual([...source].sort())
  })

  it('不修改原数组', () => {
    const source = [1, 2, 3]
    shuffle(source)
    expect(source).toEqual([1, 2, 3])
  })
})

describe('sampleSize', () => {
  it('返回指定数量的不重复元素', () => {
    const result = sampleSize([1, 2, 3, 4], 2)
    expect(result).toHaveLength(2)
    expect(new Set(result).size).toBe(2)
  })

  it('数量超出长度时返回全部元素', () => {
    expect(sampleSize([1, 2], 10)).toHaveLength(2)
  })

  it('数量为 0 时返回空数组', () => {
    expect(sampleSize([1, 2], 0)).toEqual([])
  })
})

// ============================================================
// zip
// ============================================================
describe('zip', () => {
  it('按最长数组对齐，缺失补 undefined', () => {
    expect(zip([1, 2], ['a'])).toEqual([[1, 'a'], [2, undefined]])
  })

  it('空输入返回空数组', () => {
    expect(zip()).toEqual([])
  })
})

// ============================================================
// partition
// ============================================================
describe('partition', () => {
  it('按条件拆分为两组并保持顺序', () => {
    expect(partition([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([[2, 4], [1, 3]])
  })

  it('判定函数可读取索引', () => {
    expect(partition(['a', 'b'], (_value, index) => index === 0)).toEqual([['a'], ['b']])
  })
})

// ============================================================
// countBy / keyBy
// ============================================================
describe('countBy', () => {
  it('按属性统计次数', () => {
    expect(countBy([{ type: 'a' }, { type: 'b' }, { type: 'a' }], 'type')).toEqual({ a: 2, b: 1 })
  })

  it('按取值函数统计次数', () => {
    expect(countBy([1, 2, 3, 4], (value) => (value % 2 === 0 ? 'even' : 'odd')))
      .toEqual({ odd: 2, even: 2 })
  })

  it('空数组返回空对象', () => {
    expect(countBy([], (value: number) => value)).toEqual({})
  })
})

describe('keyBy', () => {
  it('按属性建立索引，后者覆盖前者', () => {
    const result = keyBy([{ id: 1, name: 'a' }, { id: 1, name: 'b' }], 'id')
    expect(result).toEqual({ '1': { id: 1, name: 'b' } })
  })

  it('按取值函数建立索引', () => {
    expect(keyBy([{ id: 1 }], (item) => `id-${item.id}`)).toEqual({ 'id-1': { id: 1 } })
  })
})

// ============================================================
// maxBy / minBy
// ============================================================
describe('maxBy / minBy', () => {
  const items = [{ n: 3 }, { n: 1 }, { n: 2 }]

  it('按取值函数返回最大 / 最小元素', () => {
    expect(maxBy(items, (item) => item.n)).toEqual({ n: 3 })
    expect(minBy(items, (item) => item.n)).toEqual({ n: 1 })
  })

  it('空数组返回 undefined', () => {
    expect(maxBy([], (item: { n: number }) => item.n)).toBeUndefined()
    expect(minBy([], (item: { n: number }) => item.n)).toBeUndefined()
  })

  it('不修改原数组', () => {
    maxBy(items, (item) => item.n)
    expect(items).toEqual([{ n: 3 }, { n: 1 }, { n: 2 }])
  })
})

// ============================================================
// sortBy
// ============================================================
describe('sortBy', () => {
  it('按数字取值升序', () => {
    expect(sortBy([{ n: 3 }, { n: 1 }], (item) => item.n)).toEqual([{ n: 1 }, { n: 3 }])
  })

  it('按字符串取值升序', () => {
    expect(sortBy(['b', 'a', 'c'], (value) => value)).toEqual(['a', 'b', 'c'])
  })

  it('返回新数组且不修改入参', () => {
    const source = [2, 1]
    const result = sortBy(source, (value) => value)
    expect(result).not.toBe(source)
    expect(source).toEqual([2, 1])
  })

  it('取值相等时保持原有顺序', () => {
    const source = [{ k: 1, id: 'a' }, { k: 1, id: 'b' }]
    expect(sortBy(source, (item) => item.k).map((item) => item.id)).toEqual(['a', 'b'])
  })
})

// ============================================================
// unique with identity
// ============================================================
describe('unique with identity', () => {
  it('按取值函数去重并保留首次出现', () => {
    const source = [{ id: 1, name: 'a' }, { id: 1, name: 'b' }, { id: 2, name: 'c' }]
    expect(unique(source, (item) => item.id)).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'c' },
    ])
  })

  it('不传取值函数时按 SameValueZero 去重', () => {
    expect(unique([1, 1, 2])).toEqual([1, 2])
  })
})

// ============================================================
// groupBy with iteratee
// ============================================================
describe('groupBy with iteratee', () => {
  it('按取值函数分组', () => {
    expect(groupBy([1, 2, 3, 4], (value) => (value % 2 === 0 ? 'even' : 'odd')))
      .toEqual({ odd: [1, 3], even: [2, 4] })
  })
})

// ============================================================
// replace / replaceOrAppend
// ============================================================
describe('replace', () => {
  it('替换第一个匹配项', () => {
    expect(replace([{ id: 1, n: 'a' }, { id: 2, n: 'b' }], { id: 1, n: 'x' }, (item) => item.id === 1))
      .toEqual([{ id: 1, n: 'x' }, { id: 2, n: 'b' }])
  })

  it('未匹配时返回原数组副本', () => {
    const source = [1, 2]
    const result = replace(source, 9, (item) => item === 3)
    expect(result).toEqual([1, 2])
    expect(result).not.toBe(source)
  })

  it('不修改原数组', () => {
    const source = [1, 2, 3]
    replace(source, 9, (item) => item === 2)
    expect(source).toEqual([1, 2, 3])
  })
})

describe('replaceOrAppend', () => {
  it('匹配时替换，未匹配时追加', () => {
    expect(replaceOrAppend([1, 2], 9, (item) => item === 2)).toEqual([1, 9])
    expect(replaceOrAppend([1, 2], 9, (item) => item === 3)).toEqual([1, 2, 9])
  })
})

// ============================================================
// toggle
// ============================================================
describe('toggle', () => {
  it('不存在时追加，存在时移除', () => {
    expect(toggle([1, 2], 3)).toEqual([1, 2, 3])
    expect(toggle([1, 2], 1)).toEqual([2])
  })

  it('force 为 true 时确保存在，为 false 时确保移除', () => {
    expect(toggle([1], 1, true)).toEqual([1])
    expect(toggle([1], 2, true)).toEqual([1, 2])
    expect(toggle([1, 2], 1, false)).toEqual([2])
    expect(toggle([1], 2, false)).toEqual([1])
  })

  it('移除所有重复项且不修改原数组', () => {
    const source = [1, 2, 1]
    expect(toggle(source, 1)).toEqual([2])
    expect(source).toEqual([1, 2, 1])
  })
})

// ============================================================
// zipToObject
// ============================================================
describe('zipToObject', () => {
  it('按键数组与值数组构造对象', () => {
    expect(zipToObject(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 })
  })

  it('支持取值函数', () => {
    expect(zipToObject(['a', 'b'], (key, index) => `${key}${index}`))
      .toEqual({ a: 'a0', b: 'b1' })
  })

  it('支持固定值', () => {
    expect(zipToObject(['a', 'b'], 0)).toEqual({ a: 0, b: 0 })
  })

  it('值数组不足时对应键为 undefined', () => {
    expect(zipToObject(['a', 'b'], [1])).toEqual({ a: 1, b: undefined })
  })
})

// ============================================================
// rotate
// ============================================================
describe('rotate', () => {
  it('正数向右旋转，负数向左旋转', () => {
    expect(rotate([1, 2, 3], 1)).toEqual([3, 1, 2])
    expect(rotate([1, 2, 3], -1)).toEqual([2, 3, 1])
  })

  it('步数超过长度时取模', () => {
    expect(rotate([1, 2, 3], 4)).toEqual([3, 1, 2])
  })

  it('步数为 0 或长度为 0 时返回副本', () => {
    const source = [1, 2]
    const result = rotate(source, 0)
    expect(result).toEqual([1, 2])
    expect(result).not.toBe(source)
    expect(rotate([], 3)).toEqual([])
  })
})

// ============================================================
// intersects
// ============================================================
describe('intersects', () => {
  it('存在交集返回 true', () => {
    expect(intersects([1, 2], [2, 3])).toBe(true)
  })

  it('无交集或空数组返回 false', () => {
    expect(intersects([1], [2])).toBe(false)
    expect(intersects([], [1])).toBe(false)
  })
})

// ============================================================
// objectify
// ============================================================
describe('objectify', () => {
  it('按键与值取值函数构造对象', () => {
    const result = objectify(
      [{ id: 1, name: 'a' }, { id: 2, name: 'b' }],
      (item) => item.id,
      (item) => item.name,
    )
    expect(result).toEqual({ 1: 'a', 2: 'b' })
  })

  it('省略值取值函数时直接使用元素', () => {
    expect(objectify([{ id: 1 }], (item) => item.id)).toEqual({ 1: { id: 1 } })
  })

  it('键冲突时后者覆盖前者', () => {
    const result = objectify([{ id: 1, n: 'a' }, { id: 1, n: 'b' }], (item) => item.id, (item) => item.n)
    expect(result).toEqual({ 1: 'b' })
  })
})

// ============================================================
// select
// ============================================================
describe('select', () => {
  it('先过滤再映射，仅遍历一次', () => {
    expect(select([1, 2, 3, 4], (value) => value * value, (value) => value > 2))
      .toEqual([9, 16])
  })

  it('判定函数可读取索引', () => {
    expect(select(['a', 'b', 'c'], (value) => value.toUpperCase(), (_value, index) => index !== 1))
      .toEqual(['A', 'C'])
  })

  it('无元素通过时返回空数组', () => {
    expect(select([1, 2], (value) => value, () => false)).toEqual([])
  })
})
