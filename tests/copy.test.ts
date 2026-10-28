import { describe, it, expect } from 'vitest'
import { deepClone, deepCloneWithJSON, structClone, shallowClone } from '../src/copy'

// ============================================================
// deepClone
// ============================================================
describe('deepClone', () => {
  it('should return primitive values as-is', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
  })

  it('should deep clone plain objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = deepClone(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  it('should deep clone arrays', () => {
    const arr = [1, [2, 3], { a: 4 }]
    const cloned = deepClone(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[1]).not.toBe(arr[1])
    expect(cloned[2]).not.toBe(arr[2])
  })

  it('should clone Date objects', () => {
    const date = new Date('2026-06-03T12:00:00Z')
    const cloned = deepClone(date)

    expect(cloned).toBeInstanceOf(Date)
    expect(cloned.getTime()).toBe(date.getTime())
    expect(cloned).not.toBe(date)

    // Mutating original should not affect clone
    date.setFullYear(2020)
    expect(cloned.getFullYear()).toBe(2026)
  })

  it('should clone RegExp objects', () => {
    const regex = /hello/gi
    const cloned = deepClone(regex)

    expect(cloned).toBeInstanceOf(RegExp)
    expect(cloned.source).toBe('hello')
    expect(cloned.flags).toBe('gi')
    expect(cloned).not.toBe(regex)
  })

  it('should clone Map objects', () => {
    const map = new Map([
      ['a', 1],
      ['b', { nested: true }],
    ])
    const cloned = deepClone(map)

    expect(cloned).toBeInstanceOf(Map)
    expect(cloned.get('a')).toBe(1)
    expect(cloned.get('b')).toEqual({ nested: true })
    expect(cloned.get('b')).not.toBe(map.get('b'))
    expect(cloned).not.toBe(map)
  })

  it('should clone Set objects', () => {
    const set = new Set([1, { a: 1 }])
    const cloned = deepClone(set)

    expect(cloned).toBeInstanceOf(Set)
    expect(cloned.size).toBe(2)
    expect(cloned.has(1)).toBe(true)
    expect(cloned).not.toBe(set)

    // Objects within should be deep cloned
    const originalObj = [...set].find((v) => typeof v === 'object')
    const clonedObj = [...cloned].find((v) => typeof v === 'object')
    expect(clonedObj).not.toBe(originalObj)
  })

  it('should handle nested Map with deep values', () => {
    const map = new Map()
    map.set('arr', [1, 2, 3])
    const cloned = deepClone(map)

    expect(cloned.get('arr')).toEqual([1, 2, 3])
    expect(cloned.get('arr')).not.toBe(map.get('arr'))
  })

  it('should handle empty objects', () => {
    expect(deepClone({})).toEqual({})
    expect(deepClone([])).toEqual([])
    expect(deepClone(new Map())).toEqual(new Map())
    expect(deepClone(new Set())).toEqual(new Set())
  })

  it('should handle objects with many keys', () => {
    const obj = {
      a: 1,
      b: 'string',
      c: null,
      d: undefined,
      e: [1, 2, 3],
      f: { nested: true },
      g: new Date('2026-01-01'),
    }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned.f).not.toBe(obj.f)
  })

  // ============================================================
  // Circular reference tests
  // ============================================================
  describe('circular references', () => {
    it('should handle self-referencing objects', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      const cloned = deepClone(obj)
      expect(cloned.a).toBe(1)
      expect(cloned.self).toBe(cloned) // points to itself, not original
      expect(cloned.self).not.toBe(obj)
    })

    it('should handle mutually referencing objects', () => {
      const objA: any = { name: 'A' }
      const objB: any = { name: 'B' }
      objA.b = objB
      objB.a = objA

      const cloned = deepClone(objA)
      expect(cloned.name).toBe('A')
      expect(cloned.b.name).toBe('B')
      expect(cloned.b.a).toBe(cloned) // circular reference preserved
      expect(cloned.b.a).not.toBe(objA)
    })

    it('should handle circular references in arrays', () => {
      const arr: any[] = [1, 2]
      arr.push(arr)

      const cloned = deepClone(arr)
      expect(cloned[0]).toBe(1)
      expect(cloned[2]).toBe(cloned)
      expect(cloned[2]).not.toBe(arr)
    })

    it('should handle circular references in Map', () => {
      const map = new Map()
      map.set('self', map)

      const cloned = deepClone(map)
      expect(cloned.get('self')).toBe(cloned)
      expect(cloned.get('self')).not.toBe(map)
    })
  })
})

// ============================================================
// deepCloneWithJSON
// ============================================================
describe('deepCloneWithJSON', () => {
  it('should deep clone JSON-safe objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = deepCloneWithJSON(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  it('should deep clone arrays', () => {
    const arr = [1, [2, 3], { a: 4 }]
    const cloned = deepCloneWithJSON(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  it('should not preserve Date (converts to ISO string)', () => {
    const obj = { date: new Date('2026-06-03') }
    const cloned = deepCloneWithJSON(obj)
    // Dates become strings via JSON.stringify
    expect(typeof cloned.date).toBe('string')
  })

  it('should not preserve functions (they are stripped)', () => {
    const obj = { a: 1, fn: () => 'hello' }
    const cloned = deepCloneWithJSON(obj)
    expect(cloned).not.toHaveProperty('fn')
  })

  it('should not preserve undefined values', () => {
    const obj = { a: 1, b: undefined }
    const cloned = deepCloneWithJSON(obj)
    expect(cloned).not.toHaveProperty('b')
  })

  it('should throw on circular references', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    expect(() => deepCloneWithJSON(obj)).toThrow()
  })

  it('should handle primitive values', () => {
    expect(deepCloneWithJSON(42)).toBe(42)
    expect(deepCloneWithJSON('hello')).toBe('hello')
    expect(deepCloneWithJSON(null)).toBe(null)
    expect(deepCloneWithJSON(true)).toBe(true)
  })
})

// ============================================================
// structClone
// ============================================================
describe('structClone', () => {
  it('should return primitive values as-is', () => {
    expect(structClone(42)).toBe(42)
    expect(structClone('hello')).toBe('hello')
    expect(structClone(true)).toBe(true)
    expect(structClone(null)).toBe(null)
    expect(structClone(undefined)).toBe(undefined)
  })

  it('should deep clone plain objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = structClone(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  it('should deep clone arrays', () => {
    const arr = [1, [2, 3], { a: 4 }]
    const cloned = structClone(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[1]).not.toBe(arr[1])
    expect(cloned[2]).not.toBe(arr[2])
  })

  it('should clone Date objects', () => {
    const date = new Date('2026-06-03T12:00:00Z')
    const cloned = structClone(date)

    expect(cloned).toBeInstanceOf(Date)
    expect(cloned.getTime()).toBe(date.getTime())
    expect(cloned).not.toBe(date)

    date.setFullYear(2020)
    expect(cloned.getFullYear()).toBe(2026)
  })

  it('should clone RegExp objects', () => {
    const regex = /hello/gi
    const cloned = structClone(regex)

    expect(cloned).toBeInstanceOf(RegExp)
    expect(cloned.source).toBe('hello')
    expect(cloned.flags).toBe('gi')
    expect(cloned).not.toBe(regex)
  })

  it('should clone Map objects', () => {
    const map = new Map([
      ['a', 1],
      ['b', { nested: true }],
    ])
    const cloned = structClone(map)

    expect(cloned).toBeInstanceOf(Map)
    expect(cloned.get('a')).toBe(1)
    expect(cloned.get('b')).toEqual({ nested: true })
    expect(cloned.get('b')).not.toBe(map.get('b'))
    expect(cloned).not.toBe(map)
  })

  it('should clone Set objects', () => {
    const set = new Set([1, { a: 1 }])
    const cloned = structClone(set)

    expect(cloned).toBeInstanceOf(Set)
    expect(cloned.size).toBe(2)
    expect(cloned.has(1)).toBe(true)
    expect(cloned).not.toBe(set)

    const originalObj = [...set].find((v) => typeof v === 'object')
    const clonedObj = [...cloned].find((v) => typeof v === 'object')
    expect(clonedObj).not.toBe(originalObj)
  })

  it('should handle empty objects', () => {
    expect(structClone({})).toEqual({})
    expect(structClone([])).toEqual([])
    expect(structClone(new Map())).toEqual(new Map())
    expect(structClone(new Set())).toEqual(new Set())
  })

  it('should throw on functions', () => {
    expect(() => structClone(() => {})).toThrow()
    expect(() => structClone({ fn: () => {} })).toThrow()
  })

  it('should throw on Symbol values', () => {
    expect(() => structClone(Symbol('test'))).toThrow()
    expect(() => structClone({ sym: Symbol('test') })).toThrow()
  })

  it('should accept options parameter without throwing', () => {
    const obj = { a: 1, b: [2, 3] }
    const cloned = structClone(obj, {})
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
  })

  // ============================================================
  // Circular reference tests
  // ============================================================
  describe('circular references', () => {
    it('should handle self-referencing objects', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      const cloned = structClone(obj)
      expect(cloned.a).toBe(1)
      expect(cloned.self).toBe(cloned)
      expect(cloned.self).not.toBe(obj)
    })

    it('should handle mutually referencing objects', () => {
      const objA: any = { name: 'A' }
      const objB: any = { name: 'B' }
      objA.b = objB
      objB.a = objA

      const cloned = structClone(objA)
      expect(cloned.name).toBe('A')
      expect(cloned.b.name).toBe('B')
      expect(cloned.b.a).toBe(cloned)
      expect(cloned.b.a).not.toBe(objA)
    })

    it('should handle circular references in arrays', () => {
      const arr: any[] = [1, 2]
      arr.push(arr)

      const cloned = structClone(arr)
      expect(cloned[0]).toBe(1)
      expect(cloned[2]).toBe(cloned)
      expect(cloned[2]).not.toBe(arr)
    })

    it('should handle circular references in Map', () => {
      const map = new Map()
      map.set('self', map)

      const cloned = structClone(map)
      expect(cloned.get('self')).toBe(cloned)
      expect(cloned.get('self')).not.toBe(map)
    })
  })
})

// ============================================================
// shallowClone
// ============================================================
describe('shallowClone', () => {
  it('should return primitive values as-is', () => {
    expect(shallowClone(42)).toBe(42)
    expect(shallowClone('hello')).toBe('hello')
    expect(shallowClone(true)).toBe(true)
    expect(shallowClone(null)).toBe(null)
    expect(shallowClone(undefined)).toBe(undefined)
  })

  it('should shallow clone objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = shallowClone(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    // Shallow: nested reference is shared
    expect(cloned.b).toBe(obj.b)
  })

  it('should shallow clone arrays', () => {
    const arr = [1, [2, 3], { a: 4 }]
    const cloned = shallowClone(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    // Shallow: nested elements are shared
    expect(cloned[1]).toBe(arr[1])
    expect(cloned[2]).toBe(arr[2])
  })

  it('should handle empty objects and arrays', () => {
    expect(shallowClone({})).toEqual({})
    expect(shallowClone([])).toEqual([])
  })

  it('should handle object with many keys', () => {
    const date = new Date()
    const obj = { a: 1, b: 'str', c: date, d: [1, 2] }
    const cloned = shallowClone(obj)

    expect(cloned).not.toBe(obj)
    expect(cloned.c).toBe(obj.c) // same Date reference
    expect(cloned.d).toBe(obj.d) // same array reference
  })
})
