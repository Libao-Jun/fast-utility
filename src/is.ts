/**
 * 类型判断与比较工具集合。
 * @packageDocumentation
 */

/**
 * 判断是否为数组（`Array.isArray` 的类型守卫版本）。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `any[]`
 * @example
 * isArray([1, 2]) // true
 * isArray('x') // false
 */
export const isArray = Array.isArray as (value: any) => value is any[]

/**
 * 判断是否为普通对象（不含数组、不含 `null`）。
 * @param value - 任意值
 * @returns 是普通对象返回 `true`
 * @example
 * isObject({}) // true
 * isObject([]) // false
 * isObject(null) // false
 */
export const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

/**
 * 通用内部类型判断：基于 `Object.prototype.toString` 精确识别内置类型。
 * @param val - 任意值
 * @param type - 期望的类型名（如 `"Array"`、`"Date"`、`"Function"`）
 * @returns 类型匹配返回 `true`
 * @example
 * is([], 'Array') // true
 * is(new Date(), 'Date') // true
 */
export const is = (val: unknown, type: string): boolean => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 判断是否为函数（含普通函数、异步函数、类、箭头函数等可调用对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Function`
 * @example
 * isFunction(() => {}) // true
 * isFunction(123) // false
 */
export const isFunction = (val: any): val is Function => {
  return is(val, "Function") || !!(val && val.constructor && val.call && val.apply);
};

/**
 * 判断是否为 `Date` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Date`
 * @example
 * isDate(new Date()) // true
 * isDate('2026-01-01') // false
 */
export const isDate = (val: any): val is Date => {
  return is(val, "Date") || (!!val && val.constructor === Date);
};

/**
 * 判断是否为数字（含 `NaN` / `Infinity`，因为 `Number(x) === x` 对这些特殊值也成立）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `number`
 * @example
 * isNumber(1) // true
 * isNumber('1') // false
 * isNumber(NaN) // true
 */
export const isNumber = (val: any): val is number => {
  return Number(val) === val;
};

/**
 * 判断是否为整数（有限且为整数，排除 `NaN` / `Infinity`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `number`
 * @example
 * isInt(10) // true
 * isInt(10.5) // false
 */
export const isInt = (val: any): val is number => {
  return isNumber(val) && Number.isFinite(val) && val % 1 === 0;
};

/**
 * 判断是否为浮点数（有限且含小数部分）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `number`
 * @example
 * isFloat(10.5) // true
 * isFloat(10) // false
 */
export const isFloat = (val: any): val is number => {
  return isNumber(val) && Number.isFinite(val) && val % 1 !== 0;
};

/**
 * 判断是否为异步函数（`async function`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为异步函数
 * @example
 * isAsyncFunction(async () => {}) // true
 */
export const isAsyncFunction = (val: unknown): val is (...args: any[]) => Promise<any> => {
  return is(val, "AsyncFunction");
};

/**
 * 判断是否为 Promise（具有 `then` 方法的可调用对象）。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Promise`
 * @example
 * isPromise(Promise.resolve()) // true
 */
export const isPromise = (value: any): value is Promise<any> => {
  return !!value && isFunction((value as any).then);
};

/**
 * 判断是否为字符串（含 `String` 包装对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `string`
 * @example
 * isString('x') // true
 * isString(1) // false
 */
export const isString = (val: unknown): val is string => {
  return is(val, "String") || typeof val === "string" || val instanceof String;
};

/**
 * 判断是否为布尔值（含 `Boolean` 包装对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `boolean`
 * @example
 * isBoolean(false) // true
 * isBoolean(0) // false
 */
export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === "boolean" || is(val, "Boolean");
};

/**
 * 判断当前运行环境是否为浏览器（存在 `window`）。
 * @returns 是浏览器环境返回 `true`
 * @example
 * isPC() // 浏览器中 true，Node 中 false
 */
export const isPC = (): boolean => typeof window !== "undefined";

/**
 * 判断是否为 `window` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Window`
 * @example
 * isWindow(window) // true
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== "undefined" && is(val, "Window");
};

/**
 * 判断是否为 DOM 元素（具有 `tagName` 的普通对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Element`
 * @example
 * isElement(document.createElement('div')) // true
 */
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!(val as Element).tagName;
};

/**
 * 判断值是否为 `null`。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `null`
 * @example
 * isNull(null) // true
 */
export const isNull = (val: unknown): val is null => val === null;

/**
 * 判断是否为合法的十六进制颜色字符串（支持 `#RGB` 或 `#RRGGBB`）。
 * @param str - 待校验的字符串
 * @returns 合法返回 `true`
 * @example
 * isHexColor('#fff') // true
 * isHexColor('#1a2b3c') // true
 * isHexColor('red') // false
 */
export const isHexColor = (str: string): boolean => {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
};

/**
 * 判断当前设备是否为 iOS（iPhone / iPad / iPod）。
 * @returns 是 iOS 设备返回 `true`
 * @example
 * isIOS() // 依 UA 而定
 */
export const isIOS = (): boolean => /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * 判断是否为合法的邮箱地址（宽松校验）。
 * @param email - 待校验的邮箱字符串
 * @returns 合法返回 `true`
 * @example
 * isValidEmail('a@b.com') // true
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email);
};

/**
 * 判断值是否已定义（不为 `undefined`）。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `T`（排除 `undefined`）
 * @example
 * isDef(0) // true
 * isDef(undefined) // false
 */
export const isDef = <T>(val: T | undefined): val is T => typeof val !== "undefined";

/**
 * 判断值是否为 `undefined`。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `undefined`
 * @example
 * isUnDef(undefined) // true
 */
export const isUnDef = <T>(val: T | undefined): val is undefined => typeof val === "undefined";

/**
 * 判断值是否为 `null` 或 `undefined`。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `null | undefined`
 * @example
 * isNullOrUnDef(null) // true
 * isNullOrUnDef(undefined) // true
 * isNullOrUnDef(0) // false
 */
export const isNullOrUnDef = <T>(val: T | null | undefined): val is null | undefined => {
  return isUnDef(val) || isNull(val);
};

/**
 * 判断是否为 `Symbol`。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `symbol`
 * @example
 * isSymbol(Symbol('x')) // true
 */
export const isSymbol = (value: any): value is symbol => {
  return !!value && value.constructor === Symbol;
};

/**
 * 判断是否为原始（基本）类型（`string` / `number` / `boolean` / `symbol` / `bigint` / `null` / `undefined`）。
 * @param value - 任意值
 * @returns 是原始类型返回 `true`
 * @example
 * isPrimitive('x') // true
 * isPrimitive({}) // false
 */
export const isPrimitive = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  );
};

/**
 * 判断是否为基本类型（同 `isPrimitive` 的另一种实现，使用装箱比较）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为基本类型
 * @example
 * isBasicType(1) // true
 * isBasicType([]) // false
 */
export const isBasicType = (val: any): val is string | number | boolean | symbol | bigint | null | undefined => {
  return !val || Object(val) !== val
};

/**
 * 判断值是否为“空”：`null` / `undefined` / 空字符串 / 空数组 / 空对象 / 空 `Map` / 空 `Set` / 无效日期，以及长度为 0 的可枚举对象。
 * @param value - 任意值
 * @returns 视为空返回 `true`
 * @example
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty({a:1}) // false
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (isDate(value)) return isNaN(value.getTime());
  if (isFunction(value) || isSymbol(value)) return false;
  if (isNumber(value)) return false;
  const length = (value as any).length;
  if (isNumber(length)) return length === 0;
  const size = (value as any).size;
  if (isNumber(size)) return size === 0;
  const keys = Object.keys(value).length;
  return keys === 0;
};

/**
 * 判断值是否为“空”（简化版，仅覆盖字符串 / 数组 / `Map` / `Set` / `ArrayBuffer` 视图 / 普通对象）。
 * @param value - 字符串、对象、`null` 或 `undefined`
 * @returns 视为空返回 `true`
 * @example
 * isEmptySv('') // true
 * isEmptySv([]) // true
 * isEmptySv({}) // true
 */
export function isEmptySv(value: string | object | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (ArrayBuffer.isView(value)) return value.byteLength === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * 深度相等比较：支持 `Date` / `RegExp` 及嵌套对象的递归比较。
 * @template T - 比较值的类型
 * @param x - 第一个值
 * @param y - 第二个值
 * @returns 完全相等返回 `true`
 * @example
 * isEqual({a:[1,2]}, {a:[1,2]}) // true
 * isEqual(NaN, NaN) // true（通过 Object.is）
 */
export const isEqual = <T>(x: T, y: T): boolean => {
  if (Object.is(x, y)) return true;
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }
  if (x instanceof RegExp && y instanceof RegExp) {
    return x.toString() === y.toString();
  }
  if (typeof x !== "object" || x === null || typeof y !== "object" || y === null) {
    return false;
  }
  const keysX = Reflect.ownKeys(x as unknown as object) as (keyof typeof x)[];
  const keysY = Reflect.ownKeys(y as unknown as object);
  if (keysX.length !== keysY.length) return false;
  for (let i = 0; i < keysX.length; i++) {
    if (!Reflect.has(y as unknown as object, keysX[i])) return false;
    if (!isEqual(x[keysX[i]], y[keysX[i]])) return false;
  }
  return true;
};
