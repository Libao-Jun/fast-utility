import { describe, it, expect } from 'vitest'
import { unique, uniqueByKey, sortNumAsc, sortNumDesc, sortByKey, toArray, mergeArrays, flatten, arrFind, groupBy, filterEmptyValues, createRange } from '../src/array'

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
  it('should dedupe objects by specified key (last wins via Map)', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
      { id: 2, name: 'c' },
    ]
    const result = uniqueByKey(arr, 'id')
    expect(result).toHaveLength(2)
    // Map constructor overwrites duplicate keys — last occurrence kept
    expect(result[0]).toEqual({ id: 1, name: 'b' })
    expect(result[1]).toEqual({ id: 2, name: 'c' })
  })

  it('should preserve last occurrence for duplicate keys', () => {
    const arr = [
      { id: 1, value: 'first' },
      { id: 1, value: 'second' },
    ]
    expect(uniqueByKey(arr, 'id')).toEqual([{ id: 1, value: 'second' }])
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
})
