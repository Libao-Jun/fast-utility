import { describe, it, expect, beforeEach } from 'vitest'
import { getLocalStorage, setLocalStorage, removeLocalStorage, clearLocalStorage } from '../src/storage'

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear()
})

// ============================================================
// setLocalStorage & getLocalStorage
// ============================================================
describe('setLocalStorage & getLocalStorage', () => {
  it('should set and get string values', () => {
    setLocalStorage('name', '张三')
    expect(getLocalStorage('name')).toBe('张三')
  })

  it('should set and get number values', () => {
    setLocalStorage('count', 42)
    expect(getLocalStorage('count')).toBe(42)
  })

  it('should set and get object values', () => {
    const user = { name: '张三', age: 30 }
    setLocalStorage('user', user)
    const result = getLocalStorage('user')
    expect(result).toEqual(user)
  })

  it('should set and get array values', () => {
    setLocalStorage('items', [1, 2, 3])
    expect(getLocalStorage('items')).toEqual([1, 2, 3])
  })

  it('should set and get boolean values', () => {
    setLocalStorage('flag', true)
    expect(getLocalStorage('flag')).toBe(true)
    setLocalStorage('flag', false)
    expect(getLocalStorage('flag')).toBe(false)
  })

  it('should set and get null values', () => {
    setLocalStorage('nothing', null)
    expect(getLocalStorage('nothing')).toBe(null)
  })

  it('should set and get nested objects', () => {
    const data = { a: { b: { c: 1 } } }
    setLocalStorage('nested', data)
    expect(getLocalStorage('nested')).toEqual(data)
  })

  it('should return null for non-existent keys', () => {
    expect(getLocalStorage('nonexistent')).toBe(null)
  })

  it('should overwrite existing values', () => {
    setLocalStorage('key', 'old')
    setLocalStorage('key', 'new')
    expect(getLocalStorage('key')).toBe('new')
  })

  it('should return raw string when JSON.parse fails', () => {
    localStorage.setItem('raw', 'not-json{{{')
    // getLocalStorage returns the raw string since JSON.parse throws
    const result = getLocalStorage('raw')
    expect(result).toBe('not-json{{{')
  })
})

// ============================================================
// removeLocalStorage
// ============================================================
describe('removeLocalStorage', () => {
  it('should remove a stored key', () => {
    setLocalStorage('temp', 'value')
    expect(getLocalStorage('temp')).toBe('value')

    removeLocalStorage('temp')
    expect(getLocalStorage('temp')).toBe(null)
  })

  it('should not throw when removing non-existent key', () => {
    expect(() => removeLocalStorage('nonexistent')).not.toThrow()
  })

  it('should not affect other keys', () => {
    setLocalStorage('a', 1)
    setLocalStorage('b', 2)
    removeLocalStorage('a')
    expect(getLocalStorage('a')).toBe(null)
    expect(getLocalStorage('b')).toBe(2)
  })
})

// ============================================================
// clearLocalStorage
// ============================================================
describe('clearLocalStorage', () => {
  it('should clear all stored values', () => {
    setLocalStorage('a', 1)
    setLocalStorage('b', 2)
    setLocalStorage('c', 3)

    clearLocalStorage()

    expect(getLocalStorage('a')).toBe(null)
    expect(getLocalStorage('b')).toBe(null)
    expect(getLocalStorage('c')).toBe(null)
  })

  it('should not throw on empty storage', () => {
    expect(() => clearLocalStorage()).not.toThrow()
  })
})
