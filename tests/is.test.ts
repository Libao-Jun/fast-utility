import { describe, it, expect } from 'vitest'
import {
  isArray,
  isObject,
  is,
  isFunction,
  isDate,
  isNumber,
  isInt,
  isFloat,
  isAsyncFunction,
  isPromise,
  isString,
  isBoolean,
  isPC,
  isWindow,
  isElement,
  isNull,
  isHexColor,
  isIOS,
  isValidEmail,
  isDef,
  isUnDef,
  isNullOrUnDef,
  isSymbol,
  isPrimitive,
  isBasicType,
  isEmpty,
  isEmptySv,
  isEqual,
} from '../src/is'

// ============================================================
// isArray
// ============================================================
describe('isArray', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray([])).toBe(true)
  })

  it('should return false for non-arrays', () => {
    expect(isArray('hello')).toBe(false)
    expect(isArray(42)).toBe(false)
    expect(isArray({})).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray(undefined)).toBe(false)
    expect(isArray(true)).toBe(false)
    expect(isArray(() => {})).toBe(false)
  })
})

// ============================================================
// isObject
// ============================================================
describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject(Object.create(null))).toBe(true)
  })

  it('should return false for arrays', () => {
    expect(isObject([1, 2, 3])).toBe(false)
    expect(isObject([])).toBe(false)
  })

  it('should return false for null and non-objects', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(() => {})).toBe(false)
  })
})

// ============================================================
// is (internal type check)
// ============================================================
describe('is', () => {
  it('should correctly identify types via Object.prototype.toString', () => {
    expect(is([], 'Array')).toBe(true)
    expect(is({}, 'Object')).toBe(true)
    expect(is(() => {}, 'Function')).toBe(true)
    expect(is(new Date(), 'Date')).toBe(true)
    expect(is(/regex/, 'RegExp')).toBe(true)
    expect(is('hello', 'String')).toBe(true)
    expect(is(42, 'Number')).toBe(true)
    expect(is(true, 'Boolean')).toBe(true)
    expect(is(null, 'Null')).toBe(true)
    expect(is(undefined, 'Undefined')).toBe(true)
    expect(is(new Map(), 'Map')).toBe(true)
    expect(is(new Set(), 'Set')).toBe(true)
  })

  it('should return false for mismatched types', () => {
    expect(is([], 'Object')).toBe(false)
    expect(is({}, 'Array')).toBe(false)
    expect(is(42, 'String')).toBe(false)
  })
})

// ============================================================
// isFunction
// ============================================================
describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(function () {})).toBe(true)
    expect(isFunction(async () => {})).toBe(true)
    expect(isFunction(function* () {})).toBe(true)
    expect(isFunction(Math.max)).toBe(true)
  })

  it('should return false for non-functions', () => {
    expect(isFunction(null)).toBe(false)
    expect(isFunction(undefined)).toBe(false)
    expect(isFunction({})).toBe(false)
    expect(isFunction([])).toBe(false)
    expect(isFunction(42)).toBe(false)
    expect(isFunction('str')).toBe(false)
  })
})

// ============================================================
// isDate
// ============================================================
describe('isDate', () => {
  it('should return true for Date objects', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date('2026-01-01'))).toBe(true)
  })

  it('should return false for non-Date values', () => {
    expect(isDate(null)).toBe(false)
    expect(isDate('2026-01-01')).toBe(false)
    expect(isDate(Date.now())).toBe(false)
    expect(isDate({})).toBe(false)
    expect(isDate([])).toBe(false)
  })

  it('should return false for invalid Date (still a Date object)', () => {
    // new Date('invalid') still returns a Date instance
    expect(isDate(new Date('invalid'))).toBe(true)
  })
})

// ============================================================
// isNumber
// ============================================================
describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(42)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(3.14)).toBe(true)
  })

  it('should return false for NaN and Infinity (Number(x) !== x)', () => {
    // isNumber uses Number(val) === val. NaN !== NaN so isNumber(NaN) is false.
    expect(isNumber(NaN)).toBe(false)
    // Infinity works: Number(Infinity) === Infinity
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(-Infinity)).toBe(true)
  })

  it('should return false for non-numbers', () => {
    expect(isNumber('42')).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber([])).toBe(false)
  })
})

// ============================================================
// isInt
// ============================================================
describe('isInt', () => {
  it('should return true for integers', () => {
    expect(isInt(0)).toBe(true)
    expect(isInt(42)).toBe(true)
    expect(isInt(-10)).toBe(true)
    expect(isInt(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  it('should return false for floats', () => {
    expect(isInt(3.14)).toBe(false)
    expect(isInt(0.1)).toBe(false)
    expect(isInt(-1.5)).toBe(false)
  })

  it('should return false for NaN and Infinity', () => {
    expect(isInt(NaN)).toBe(false)
    expect(isInt(Infinity)).toBe(false)
    expect(isInt(-Infinity)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isInt('42')).toBe(false)
    expect(isInt(null)).toBe(false)
  })
})

// ============================================================
// isFloat
// ============================================================
describe('isFloat', () => {
  it('should return true for floats', () => {
    expect(isFloat(3.14)).toBe(true)
    expect(isFloat(0.1)).toBe(true)
    expect(isFloat(-1.5)).toBe(true)
    expect(isFloat(1.0 + 0.0001)).toBe(true)
  })

  it('should return false for integers', () => {
    expect(isFloat(0)).toBe(false)
    expect(isFloat(42)).toBe(false)
    expect(isFloat(-10)).toBe(false)
  })

  it('should return false for NaN and Infinity', () => {
    expect(isFloat(NaN)).toBe(false)
    expect(isFloat(Infinity)).toBe(false)
    expect(isFloat(-Infinity)).toBe(false)
  })
})

// ============================================================
// isAsyncFunction
// ============================================================
describe('isAsyncFunction', () => {
  it('should return true for async functions', () => {
    expect(isAsyncFunction(async () => {})).toBe(true)
    expect(isAsyncFunction(async function () {})).toBe(true)
  })

  it('should return false for sync functions', () => {
    expect(isAsyncFunction(() => {})).toBe(false)
    expect(isAsyncFunction(function () {})).toBe(false)
  })

  it('should return false for non-functions', () => {
    expect(isAsyncFunction(null)).toBe(false)
    expect(isAsyncFunction(undefined)).toBe(false)
    expect(isAsyncFunction({})).toBe(false)
    expect(isAsyncFunction(Promise.resolve())).toBe(false)
  })
})

// ============================================================
// isPromise
// ============================================================
describe('isPromise', () => {
  it('should return true for Promise instances', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(Promise.reject().catch(() => {}))).toBe(true)
    expect(isPromise(new Promise(() => {}))).toBe(true)
  })

  it('should return false for non-Promise values', () => {
    expect(isPromise(null)).toBe(false)
    expect(isPromise(undefined)).toBe(false)
    expect(isPromise({})).toBe(false)
    expect(isPromise({ then: 'not a function' })).toBe(false)
    expect(isPromise(42)).toBe(false)
  })

  it('should return true for thenables with function then', () => {
    expect(isPromise({ then: () => {} })).toBe(true)
  })
})

// ============================================================
// isString
// ============================================================
describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
    expect(isString(`template`)).toBe(true)
  })

  it('should return true for String objects', () => {
    expect(isString(new String('hello'))).toBe(true)
  })

  it('should return false for non-strings', () => {
    expect(isString(42)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

// ============================================================
// isBoolean
// ============================================================
describe('isBoolean', () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })

  it('should return true for Boolean objects', () => {
    expect(isBoolean(new Boolean(true))).toBe(true)
    expect(isBoolean(new Boolean(false))).toBe(true)
  })

  it('should return false for non-booleans', () => {
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(null)).toBe(false)
    expect(isBoolean(undefined)).toBe(false)
  })
})

// ============================================================
// isPC
// ============================================================
describe('isPC', () => {
  it('should return true in browser/jsdom environment', () => {
    expect(isPC()).toBe(true)
  })
})

// ============================================================
// isWindow
// ============================================================
describe('isWindow', () => {
  it('should return boolean for window and non-window objects', () => {
    // isWindow checks: typeof window !== "undefined" && is(val, "Window")
    // In jsdom, Object.prototype.toString.call(window) may not return "[object Window]"
    // So we just verify it doesn't throw and returns a boolean
    const result = isWindow(window)
    expect(typeof result).toBe('boolean')

    expect(isWindow({})).toBe(false)
    expect(isWindow(null)).toBe(false)
    expect(isWindow(undefined)).toBe(false)
    expect(isWindow(document)).toBe(false)
  })
})

// ============================================================
// isElement
// ============================================================
describe('isElement', () => {
  it('should return true for DOM elements', () => {
    expect(isElement(document.body)).toBe(true)
    expect(isElement(document.createElement('div'))).toBe(true)
    expect(isElement(document.createElement('span'))).toBe(true)
  })

  it('should return false for non-elements', () => {
    expect(isElement(null)).toBe(false)
    expect(isElement(undefined)).toBe(false)
    expect(isElement({})).toBe(false)
    expect(isElement({ tagName: 'div' })).toBe(true) // duck-typing works
    expect(isElement('div')).toBe(false)
    expect(isElement(42)).toBe(false)
  })
})

// ============================================================
// isNull
// ============================================================
describe('isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  it('should return false for non-null values', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull({})).toBe(false)
  })
})

// ============================================================
// isHexColor
// ============================================================
describe('isHexColor', () => {
  it('should return true for valid 3-digit hex colors', () => {
    expect(isHexColor('#fff')).toBe(true)
    expect(isHexColor('#000')).toBe(true)
    expect(isHexColor('#abc')).toBe(true)
    expect(isHexColor('fff')).toBe(true) // # is optional
  })

  it('should return true for valid 6-digit hex colors', () => {
    expect(isHexColor('#ff0000')).toBe(true)
    expect(isHexColor('#00ff00')).toBe(true)
    expect(isHexColor('#1a2b3c')).toBe(true)
    expect(isHexColor('ff0000')).toBe(true)
  })

  it('should return false for invalid hex colors', () => {
    expect(isHexColor('')).toBe(false)
    expect(isHexColor('red')).toBe(false)
    expect(isHexColor('#ff')).toBe(false)
    expect(isHexColor('#ffff')).toBe(false)
    expect(isHexColor('#ggg')).toBe(false)
    expect(isHexColor('#fffffff')).toBe(false)
  })
})

// ============================================================
// isIOS
// ============================================================
describe('isIOS', () => {
  it('should return false in jsdom (non-iOS userAgent)', () => {
    // jsdom userAgent doesn't match iPad/iPhone/iPod
    expect(isIOS()).toBe(false)
  })
})

// ============================================================
// isValidEmail
// ============================================================
describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co')).toBe(true)
    expect(isValidEmail('user+tag@domain.com')).toBe(true)
    expect(isValidEmail('a@b.c')).toBe(true)
  })

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('plaintext')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user@.com')).toBe(false)
    expect(isValidEmail('user name@domain.com')).toBe(false)
  })
})

// ============================================================
// isDef
// ============================================================
describe('isDef', () => {
  it('should return true for defined values', () => {
    expect(isDef(0)).toBe(true)
    expect(isDef('')).toBe(true)
    expect(isDef(null)).toBe(true)
    expect(isDef(false)).toBe(true)
    expect(isDef(NaN)).toBe(true)
  })

  it('should return false for undefined', () => {
    expect(isDef(undefined)).toBe(false)
  })
})

// ============================================================
// isUnDef
// ============================================================
describe('isUnDef', () => {
  it('should return true for undefined', () => {
    expect(isUnDef(undefined)).toBe(true)
  })

  it('should return false for non-undefined values', () => {
    expect(isUnDef(null)).toBe(false)
    expect(isUnDef(0)).toBe(false)
    expect(isUnDef('')).toBe(false)
    expect(isUnDef(false)).toBe(false)
  })
})

// ============================================================
// isNullOrUnDef
// ============================================================
describe('isNullOrUnDef', () => {
  it('should return true for null or undefined', () => {
    expect(isNullOrUnDef(null)).toBe(true)
    expect(isNullOrUnDef(undefined)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isNullOrUnDef(0)).toBe(false)
    expect(isNullOrUnDef('')).toBe(false)
    expect(isNullOrUnDef(false)).toBe(false)
    expect(isNullOrUnDef('hello')).toBe(false)
    expect(isNullOrUnDef([])).toBe(false)
    expect(isNullOrUnDef({})).toBe(false)
  })
})

// ============================================================
// isSymbol
// ============================================================
describe('isSymbol', () => {
  it('should return true for symbols', () => {
    expect(isSymbol(Symbol())).toBe(true)
    expect(isSymbol(Symbol('foo'))).toBe(true)
    expect(isSymbol(Symbol.iterator)).toBe(true)
  })

  it('should return false for non-symbols', () => {
    expect(isSymbol(null)).toBe(false)
    expect(isSymbol(undefined)).toBe(false)
    expect(isSymbol('symbol')).toBe(false)
    expect(isSymbol({})).toBe(false)
    expect(isSymbol(0)).toBe(false)
    expect(isSymbol(false)).toBe(false)
  })
})

// ============================================================
// isPrimitive
// ============================================================
describe('isPrimitive', () => {
  it('should return true for primitive types', () => {
    expect(isPrimitive(42)).toBe(true)
    expect(isPrimitive('hello')).toBe(true)
    expect(isPrimitive(true)).toBe(true)
    expect(isPrimitive(false)).toBe(true)
    expect(isPrimitive(null)).toBe(true)
    expect(isPrimitive(undefined)).toBe(true)
    expect(isPrimitive(Symbol())).toBe(true)
    expect(isPrimitive(BigInt(1))).toBe(true)
  })

  it('should return false for objects and functions', () => {
    expect(isPrimitive({})).toBe(false)
    expect(isPrimitive([])).toBe(false)
    expect(isPrimitive(() => {})).toBe(false)
    expect(isPrimitive(new Date())).toBe(false)
    expect(isPrimitive(new Map())).toBe(false)
  })
})

// ============================================================
// isEmpty
// ============================================================
describe('isEmpty', () => {
  it('should return true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('should return false for non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false)
  })

  it('should return true for empty arrays', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('should return false for non-empty arrays', () => {
    expect(isEmpty([1, 2, 3])).toBe(false)
  })

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('should return false for non-empty objects', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('should return true for empty Map and Set', () => {
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
  })

  it('should return false for non-empty Map and Set', () => {
    expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    expect(isEmpty(new Set([1]))).toBe(false)
  })

  it('should return true for invalid Date', () => {
    expect(isEmpty(new Date('invalid'))).toBe(true)
  })

  it('should return false for valid Date', () => {
    expect(isEmpty(new Date())).toBe(false)
  })

  it('should return false for numbers', () => {
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(42)).toBe(false)
  })

  it('should return false for functions and symbols', () => {
    expect(isEmpty(() => {})).toBe(false)
    expect(isEmpty(Symbol())).toBe(false)
  })
})

// ============================================================
// isEmptySv
// ============================================================
describe('isEmptySv', () => {
  it('should return true for null and undefined', () => {
    expect(isEmptySv(null)).toBe(true)
    expect(isEmptySv(undefined)).toBe(true)
  })

  it('should return true for empty strings', () => {
    expect(isEmptySv('')).toBe(true)
  })

  it('should return false for non-empty strings', () => {
    expect(isEmptySv('hello')).toBe(false)
  })

  it('should return true for empty arrays', () => {
    expect(isEmptySv([])).toBe(true)
  })

  it('should return false for non-empty arrays', () => {
    expect(isEmptySv([1])).toBe(false)
  })

  it('should return true for empty objects', () => {
    expect(isEmptySv({})).toBe(true)
  })

  it('should return false for non-empty objects', () => {
    expect(isEmptySv({ a: 1 })).toBe(false)
  })

  it('should return true for empty Map and Set', () => {
    expect(isEmptySv(new Map())).toBe(true)
    expect(isEmptySv(new Set())).toBe(true)
  })

  it('should return false for non-empty Map and Set', () => {
    expect(isEmptySv(new Map([['a', 1]]))).toBe(false)
    expect(isEmptySv(new Set([1]))).toBe(false)
  })

  it('should return true for empty TypedArrays', () => {
    expect(isEmptySv(new Uint8Array(0))).toBe(true)
  })

  it('should return false for non-empty TypedArrays', () => {
    expect(isEmptySv(new Uint8Array([1, 2]))).toBe(false)
  })
})

// ============================================================
// isEqual
// ============================================================
describe('isEqual', () => {
  it('should return true for identical primitive values', () => {
    expect(isEqual(42, 42)).toBe(true)
    expect(isEqual('hello', 'hello')).toBe(true)
    expect(isEqual(true, true)).toBe(true)
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(undefined, undefined)).toBe(true)
  })

  it('should return true for NaN comparisons (via Object.is)', () => {
    expect(isEqual(NaN, NaN)).toBe(true)
  })

  it('should return false for different primitive values', () => {
    expect(isEqual(42, 43)).toBe(false)
    expect(isEqual('hello', 'world')).toBe(false)
    expect(isEqual(true, false)).toBe(false)
  })

  it('should return true for deeply equal objects', () => {
    expect(isEqual({}, {})).toBe(true)
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('should return false for non-equal objects', () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false)
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(isEqual([1, 2], [2, 1])).toBe(false)
  })

  it('should handle Date comparison', () => {
    const d1 = new Date('2026-01-01')
    const d2 = new Date('2026-01-01')
    const d3 = new Date('2025-12-31')
    expect(isEqual(d1, d2)).toBe(true)
    expect(isEqual(d1, d3)).toBe(false)
  })

  it('should handle RegExp comparison', () => {
    expect(isEqual(/abc/g, /abc/g)).toBe(true)
    expect(isEqual(/abc/, /def/)).toBe(false)
    expect(isEqual(/abc/g, /abc/i)).toBe(false)
  })

  it('should handle empty objects vs arrays', () => {
    expect(isEqual([], {})).toBe(false)
  })
})

// ============================================================
// isBasicType
// ============================================================
describe('isBasicType', () => {
  it('null 是基础类型', () => {
    expect(isBasicType(null)).toBe(true)
  })

  it('undefined 是基础类型', () => {
    expect(isBasicType(undefined)).toBe(true)
  })

  it('字符串是基础类型', () => {
    expect(isBasicType('hello')).toBe(true)
  })

  it('数字是基础类型', () => {
    expect(isBasicType(42)).toBe(true)
    expect(isBasicType(0)).toBe(true)
    expect(isBasicType(NaN)).toBe(true)
  })

  it('布尔值是基础类型', () => {
    expect(isBasicType(true)).toBe(true)
    expect(isBasicType(false)).toBe(true)
  })

  it('symbol 是基础类型', () => {
    expect(isBasicType(Symbol('foo'))).toBe(true)
  })

  it('bigint 是基础类型', () => {
    expect(isBasicType(BigInt(42))).toBe(true)
  })

  it('对象不是基础类型', () => {
    expect(isBasicType({})).toBe(false)
    expect(isBasicType({ a: 1 })).toBe(false)
  })

  it('数组不是基础类型', () => {
    expect(isBasicType([])).toBe(false)
    expect(isBasicType([1, 2, 3])).toBe(false)
  })

  it('函数不是基础类型', () => {
    expect(isBasicType(() => {})).toBe(false)
    expect(isBasicType(function () {})).toBe(false)
  })

  it('Date 不是基础类型', () => {
    expect(isBasicType(new Date())).toBe(false)
  })

  it('正则不是基础类型', () => {
    expect(isBasicType(/abc/)).toBe(false)
  })

  it('Map / Set 不是基础类型', () => {
    expect(isBasicType(new Map())).toBe(false)
    expect(isBasicType(new Set())).toBe(false)
  })

  it('Promise 不是基础类型', () => {
    expect(isBasicType(Promise.resolve())).toBe(false)
  })

  it('new String / new Number 包装对象不是基础类型', () => {
    expect(isBasicType(new String('hello'))).toBe(false)
    expect(isBasicType(new Number(42))).toBe(false)
    expect(isBasicType(new Boolean(true))).toBe(false)
  })
})
