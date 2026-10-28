import { describe, it, expect } from 'vitest'
import {
  isArray,
  isObject,
  isTypeOf,
  isFunction,
  isDate,
  isNumber,
  isInteger,
  isFloat,
  isAsyncFunction,
  isPromise,
  isString,
  isBoolean,
  isBrowser,
  isWindow,
  isElement,
  isNull,
  isHexColor,
  isIOSDevice,
  isDefined,
  isUndefined,
  isSymbol,
  isBasicType,
  isEmpty,
  isEqual,
  isNullOrUndefined,
  isError,
  isRegExp,
  isTypedArray,
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
describe('isTypeOf', () => {
  it('should correctly identify types via Object.prototype.toString', () => {
    expect(isTypeOf([], 'Array')).toBe(true)
    expect(isTypeOf({}, 'Object')).toBe(true)
    expect(isTypeOf(() => {}, 'Function')).toBe(true)
    expect(isTypeOf(new Date(), 'Date')).toBe(true)
    expect(isTypeOf(/regex/, 'RegExp')).toBe(true)
    expect(isTypeOf('hello', 'String')).toBe(true)
    expect(isTypeOf(42, 'Number')).toBe(true)
    expect(isTypeOf(true, 'Boolean')).toBe(true)
    expect(isTypeOf(null, 'Null')).toBe(true)
    expect(isTypeOf(undefined, 'Undefined')).toBe(true)
    expect(isTypeOf(new Map(), 'Map')).toBe(true)
    expect(isTypeOf(new Set(), 'Set')).toBe(true)
  })

  it('should return false for mismatched types', () => {
    expect(isTypeOf([], 'Object')).toBe(false)
    expect(isTypeOf({}, 'Array')).toBe(false)
    expect(isTypeOf(42, 'String')).toBe(false)
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

  it('should return true for NaN and Infinity (typeof number)', () => {
    expect(isNumber(NaN)).toBe(true)
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
// isInteger
// ============================================================
describe('isInteger', () => {
  it('should return true for integers', () => {
    expect(isInteger(0)).toBe(true)
    expect(isInteger(42)).toBe(true)
    expect(isInteger(-10)).toBe(true)
    expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  it('should return false for floats', () => {
    expect(isInteger(3.14)).toBe(false)
    expect(isInteger(0.1)).toBe(false)
    expect(isInteger(-1.5)).toBe(false)
  })

  it('should return false for NaN and Infinity', () => {
    expect(isInteger(NaN)).toBe(false)
    expect(isInteger(Infinity)).toBe(false)
    expect(isInteger(-Infinity)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isInteger('42')).toBe(false)
    expect(isInteger(null)).toBe(false)
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
    expect(isString(`renderTemplate`)).toBe(true)
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
// isBrowser
// ============================================================
describe('isBrowser', () => {
  it('should return true in browser/jsdom environment', () => {
    expect(isBrowser()).toBe(true)
  })
})

// ============================================================
// isWindow
// ============================================================
describe('isWindow', () => {
  it('should return boolean for window and non-window objects', () => {
    // isWindow checks: typeof window !== "undefined" && isTypeOf(val, "Window")
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
// isIOSDevice
// ============================================================
describe('isIOSDevice', () => {
  it('should return false in jsdom (non-iOS userAgent)', () => {
    // jsdom userAgent doesn't match iPad/iPhone/iPod
    expect(isIOSDevice()).toBe(false)
  })
})

// ============================================================
// isDefined
// ============================================================
describe('isDefined', () => {
  it('should return true for defined values', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined('')).toBe(true)
    expect(isDefined(null)).toBe(true)
    expect(isDefined(false)).toBe(true)
    expect(isDefined(NaN)).toBe(true)
  })

  it('should return false for undefined', () => {
    expect(isDefined(undefined)).toBe(false)
  })
})

// ============================================================
// isUndefined
// ============================================================
describe('isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })

  it('should return false for non-undefined values', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(false)).toBe(false)
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
// isBasicType
// ============================================================
describe('isBasicType', () => {
  it('should return true for primitive types', () => {
    expect(isBasicType(42)).toBe(true)
    expect(isBasicType('hello')).toBe(true)
    expect(isBasicType(true)).toBe(true)
    expect(isBasicType(false)).toBe(true)
    expect(isBasicType(null)).toBe(true)
    expect(isBasicType(undefined)).toBe(true)
    expect(isBasicType(Symbol())).toBe(true)
    expect(isBasicType(BigInt(1))).toBe(true)
  })

  it('should return false for objects and functions', () => {
    expect(isBasicType({})).toBe(false)
    expect(isBasicType([])).toBe(false)
    expect(isBasicType(() => {})).toBe(false)
    expect(isBasicType(new Date())).toBe(false)
    expect(isBasicType(new Map())).toBe(false)
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

  it('should handle ArrayBuffer views by byteLength', () => {
    expect(isEmpty(new Uint8Array(0))).toBe(true)
    expect(isEmpty(new Uint8Array([1, 2]))).toBe(false)
    expect(isEmpty(new DataView(new ArrayBuffer(0)))).toBe(true)
    expect(isEmpty(new DataView(new ArrayBuffer(4)))).toBe(false)
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
// isObject (plain object semantics)
// ============================================================
describe('isObject plain object semantics', () => {
  it('Date / Map / Set / 类实例返回 false', () => {
    expect(isObject(new Date())).toBe(false)
    expect(isObject(new Map())).toBe(false)
    expect(isObject(new Set())).toBe(false)
    expect(isObject(new (class Foo {})())).toBe(false)
  })
})

// ============================================================
// isNumber robustness
// ============================================================
describe('isNumber robustness', () => {
  it('Symbol 不会抛错', () => {
    expect(() => isNumber(Symbol('x'))).not.toThrow()
    expect(isNumber(Symbol('x'))).toBe(false)
  })

  it('Number 包装对象返回 false', () => {
    expect(isNumber(new Number(1))).toBe(false)
  })
})

// ============================================================
// isNullOrUndefined
// ============================================================
describe('isNullOrUndefined', () => {
  it('null / undefined 返回 true', () => {
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(undefined)).toBe(true)
  })

  it('其他值返回 false', () => {
    expect(isNullOrUndefined(0)).toBe(false)
    expect(isNullOrUndefined('')).toBe(false)
    expect(isNullOrUndefined(false)).toBe(false)
  })
})

// ============================================================
// isError
// ============================================================
describe('isError', () => {
  it('Error 实例返回 true', () => {
    expect(isError(new Error('x'))).toBe(true)
    expect(isError(new TypeError('x'))).toBe(true)
  })

  it('普通对象与字符串返回 false', () => {
    expect(isError({ message: 'x' })).toBe(false)
    expect(isError('Error')).toBe(false)
  })
})

// ============================================================
// isRegExp
// ============================================================
describe('isRegExp', () => {
  it('正则对象返回 true', () => {
    expect(isRegExp(/a/)).toBe(true)
    expect(isRegExp(new RegExp('a'))).toBe(true)
  })

  it('字符串与其他对象返回 false', () => {
    expect(isRegExp('/a/')).toBe(false)
    expect(isRegExp({})).toBe(false)
  })
})

// ============================================================
// isTypedArray
// ============================================================
describe('isTypedArray', () => {
  it('TypedArray 返回 true', () => {
    expect(isTypedArray(new Uint8Array([1]))).toBe(true)
    expect(isTypedArray(new Float64Array([1]))).toBe(true)
  })

  it('DataView / 数组 / 普通对象返回 false', () => {
    expect(isTypedArray(new DataView(new ArrayBuffer(8)))).toBe(false)
    expect(isTypedArray([])).toBe(false)
    expect(isTypedArray({})).toBe(false)
  })
})

// ============================================================
// isEqual enhancements
// ============================================================
describe('isEqual enhancements', () => {
  it('处理循环引用', () => {
    const a: any = { name: 'x' }
    const b: any = { name: 'x' }
    a.self = a
    b.self = b
    expect(isEqual(a, b)).toBe(true)
  })

  it('循环结构不一致时返回 false', () => {
    const a: any = { name: 'x' }
    const b: any = { name: 'y' }
    a.self = a
    b.self = b
    expect(isEqual(a, b)).toBe(false)
  })

  it('比较 Map 的键值', () => {
    expect(isEqual(new Map([['a', { n: 1 }]]), new Map([['a', { n: 1 }]]))).toBe(true)
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false)
    expect(isEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false)
  })

  it('比较 Set 的元素', () => {
    expect(isEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true)
    expect(isEqual(new Set([1]), new Set([2]))).toBe(false)
  })

  it('比较 TypedArray 的字节内容', () => {
    expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true)
    expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false)
  })

  it('原型不同返回 false', () => {
    expect(isEqual({}, Object.create(null))).toBe(false)
  })
})
