import { describe, it, expect, beforeEach } from 'vitest'
import { localGet, localSet, localRm, localClear } from '../src/storage'

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear()
})

// ============================================================
// localSet & localGet
// ============================================================
describe('localSet & localGet', () => {
  it('should set and get string values', () => {
    localSet('name', '张三')
    expect(localGet('name')).toBe('张三')
  })

  it('should set and get number values', () => {
    localSet('count', 42)
    expect(localGet('count')).toBe(42)
  })

  it('should set and get object values', () => {
    const user = { name: '张三', age: 30 }
    localSet('user', user)
    const result = localGet('user')
    expect(result).toEqual(user)
  })

  it('should set and get array values', () => {
    localSet('items', [1, 2, 3])
    expect(localGet('items')).toEqual([1, 2, 3])
  })

  it('should set and get boolean values', () => {
    localSet('flag', true)
    expect(localGet('flag')).toBe(true)
    localSet('flag', false)
    expect(localGet('flag')).toBe(false)
  })

  it('should set and get null values', () => {
    localSet('nothing', null)
    expect(localGet('nothing')).toBe(null)
  })

  it('should set and get nested objects', () => {
    const data = { a: { b: { c: 1 } } }
    localSet('nested', data)
    expect(localGet('nested')).toEqual(data)
  })

  it('should return null for non-existent keys', () => {
    expect(localGet('nonexistent')).toBe(null)
  })

  it('should overwrite existing values', () => {
    localSet('key', 'old')
    localSet('key', 'new')
    expect(localGet('key')).toBe('new')
  })

  it('should return raw string when JSON.parse fails', () => {
    localStorage.setItem('raw', 'not-json{{{')
    // localGet returns the raw string since JSON.parse throws
    const result = localGet('raw')
    expect(result).toBe('not-json{{{')
  })
})

// ============================================================
// localRm
// ============================================================
describe('localRm', () => {
  it('should remove a stored key', () => {
    localSet('temp', 'value')
    expect(localGet('temp')).toBe('value')

    localRm('temp')
    expect(localGet('temp')).toBe(null)
  })

  it('should not throw when removing non-existent key', () => {
    expect(() => localRm('nonexistent')).not.toThrow()
  })

  it('should not affect other keys', () => {
    localSet('a', 1)
    localSet('b', 2)
    localRm('a')
    expect(localGet('a')).toBe(null)
    expect(localGet('b')).toBe(2)
  })
})

// ============================================================
// localClear
// ============================================================
describe('localClear', () => {
  it('should clear all stored values', () => {
    localSet('a', 1)
    localSet('b', 2)
    localSet('c', 3)

    localClear()

    expect(localGet('a')).toBe(null)
    expect(localGet('b')).toBe(null)
    expect(localGet('c')).toBe(null)
  })

  it('should not throw on empty storage', () => {
    expect(() => localClear()).not.toThrow()
  })
})
