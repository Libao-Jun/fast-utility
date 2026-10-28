/**
 * 判断是否为数组（`Array.isArray` 的类型守卫版本）。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `any[]`
 */
export const isArray = Array.isArray as (value: any) => value is any[]

/**
 * 判断是否为普通对象（原型为 `Object.prototype` 或 `null`）。
 *
 * 数组、`Date`、`Map`、`Set`、类实例等均返回 `false`。
 * @param value - 任意值
 * @returns 是普通对象返回 `true`
 */
export const isObject = (value: any): boolean => {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * 通用类型判断：基于 `Object.prototype.toString` 精确识别内置类型。
 * @param val - 任意值
 * @param type - 期望的类型名（如 `"Array"`、`"Date"`、`"Function"`）
 * @returns 类型匹配返回 `true`
 */
export const isTypeOf = (val: unknown, type: string): boolean => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 判断是否为函数（含普通函数、异步函数、类、箭头函数等可调用对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `Function`
 */
export const isFunction = (val: any): val is Function => {
  return isTypeOf(val, "Function") || !!(val && val.constructor && val.call && val.apply);
};

/**
 * 判断是否为 `Date` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `Date`
 */
export const isDate = (val: any): val is Date => {
  return isTypeOf(val, "Date") || (!!val && val.constructor === Date);
};

/**
 * 判断是否为数字（`typeof` 为 `number`，因此 `NaN` 与 `Infinity` 均返回 `true`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `number`
 */
export const isNumber = (val: any): val is number => {
  return typeof val === "number";
};

/**
 * 判断是否为整数（有限且为整数，排除 `NaN` / `Infinity`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `number`
 */
export const isInteger = (val: any): val is number => {
  return isNumber(val) && Number.isFinite(val) && val % 1 === 0;
};

/**
 * 判断是否为浮点数（有限且含小数部分）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `number`
 */
export const isFloat = (val: any): val is number => {
  return isNumber(val) && Number.isFinite(val) && val % 1 !== 0;
};

/**
 * 判断是否为异步函数（`async function`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为异步函数
 */
export const isAsyncFunction = (val: unknown): val is (...args: any[]) => Promise<any> => {
  return isTypeOf(val, "AsyncFunction");
};

/**
 * 判断是否为 Promise（具有 `then` 方法的可调用对象）。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `Promise`
 */
export const isPromise = (value: any): value is Promise<any> => {
  return !!value && isFunction((value as any).then);
};

/**
 * 判断是否为字符串（含 `String` 包装对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `string`
 */
export const isString = (val: unknown): val is string => {
  return isTypeOf(val, "String") || typeof val === "string" || val instanceof String;
};

/**
 * 判断是否为布尔值（含 `Boolean` 包装对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `boolean`
 */
export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === "boolean" || isTypeOf(val, "Boolean");
};

/**
 * 判断当前运行环境是否为浏览器（存在 `window`）。
 * @returns 是浏览器环境返回 `true`
 */
export const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * 判断是否为 `window` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `Window`
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== "undefined" && isTypeOf(val, "Window");
};

/**
 * 判断是否为 DOM 元素（具有 `tagName` 的普通对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `Element`
 */
export const isElement = (val: unknown): val is Element => {
  return typeof val === "object" && val !== null && typeof (val as Element).tagName === "string";
};

/**
 * 判断值是否为 `null`。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `null`
 */
export const isNull = (val: unknown): val is null => val === null;

/**
 * 判断是否为合法的十六进制颜色字符串（支持 `#RGB` 或 `#RRGGBB`）。
 * @param str - 待校验的字符串
 * @returns 合法返回 `true`
 */
export const isHexColor = (str: string): boolean => {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
};

/**
 * 判断当前设备是否为 iOS（iPhone / iPad / iPod）。
 * @returns 是 iOS 设备返回 `true`
 */
export const isIOSDevice = (): boolean =>
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * 判断值是否已定义（不为 `undefined`）。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `T`（排除 `undefined`）
 */
export const isDefined = <T>(val: T | undefined): val is T => typeof val !== "undefined";

/**
 * 判断值是否为 `undefined`。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `undefined`
 */
export const isUndefined = <T>(val: T | undefined): val is undefined => typeof val === "undefined";

/**
 * 判断是否为 `Symbol`。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `symbol`
 */
export const isSymbol = (value: any): value is symbol => {
  return !!value && value.constructor === Symbol;
};

/**
 * 判断是否为基本类型（`string` / `number` / `boolean` / `symbol` / `bigint` / `null` / `undefined`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `string | number | boolean | symbol | bigint | null | undefined`
 */
export const isBasicType = (
  val: any,
): val is string | number | boolean | symbol | bigint | null | undefined => {
  return (
    val === undefined ||
    val === null ||
    (typeof val !== "object" && typeof val !== "function")
  );
};

/**
 * 判断值是否为“空”：`null` / `undefined` / 空字符串 / 空数组 / 空 `Map` / 空 `Set` / 空 `ArrayBuffer` 视图 / 无效日期，以及没有可枚举自有属性的对象。
 *
 * 数字（含 `NaN`）、布尔、`Symbol`、函数一律返回 `false`。
 * @param value - 任意值
 * @returns 视为空返回 `true`
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (isDate(value)) return Number.isNaN(value.getTime());
  if (typeof value !== "object") return false;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (ArrayBuffer.isView(value)) return value.byteLength === 0;
  const length = (value as any).length;
  if (typeof length === "number") return length === 0;
  return Object.keys(value).length === 0;
};

/** 内部实现：递归比较，`seen` 用于处理循环引用。 */
const _isEqual = (x: any, y: any, seen: WeakMap<object, object>): boolean => {
  if (Object.is(x, y)) return true;
  if (x instanceof Date && y instanceof Date) return x.getTime() === y.getTime();
  if (x instanceof RegExp && y instanceof RegExp) return x.toString() === y.toString();
  if (typeof x !== "object" || x === null || typeof y !== "object" || y === null) return false;
  if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false;

  const mapped = seen.get(x);
  if (mapped) return mapped === y;
  seen.set(x, y);

  if (x instanceof Map && y instanceof Map) {
    if (x.size !== y.size) return false;
    for (const [key, value] of x) {
      if (!y.has(key)) return false;
      if (!_isEqual(value, y.get(key), seen)) return false;
    }
    return true;
  }

  if (x instanceof Set && y instanceof Set) {
    if (x.size !== y.size) return false;
    for (const value of x) {
      if (!y.has(value)) return false;
    }
    return true;
  }

  if (ArrayBuffer.isView(x) && ArrayBuffer.isView(y)) {
    if (x.byteLength !== y.byteLength) return false;
    const left = new Uint8Array(x.buffer, x.byteOffset, x.byteLength);
    const right = new Uint8Array(y.buffer, y.byteOffset, y.byteLength);
    for (let i = 0; i < left.length; i++) {
      if (left[i] !== right[i]) return false;
    }
    return true;
  }

  const keysX = Reflect.ownKeys(x);
  const keysY = Reflect.ownKeys(y);
  if (keysX.length !== keysY.length) return false;
  for (const key of keysX) {
    if (!Object.prototype.hasOwnProperty.call(y, key)) return false;
    if (!_isEqual(x[key], y[key], seen)) return false;
  }
  return true;
};

/**
 * 深度相等比较：支持 `Date` / `RegExp` / `Map` / `Set` / `ArrayBuffer` 视图、嵌套对象与循环引用。
 *
 * `Map` 的键与 `Set` 的元素按引用（SameValueZero）比较，不递归比较其内部对象。
 * @template T - 比较值的类型
 * @param x - 第一个值
 * @param y - 第二个值
 * @returns 完全相等返回 `true`
 */
export const isEqual = <T>(x: T, y: T): boolean => _isEqual(x, y, new WeakMap());

/**
 * 判断值是否为 `null` 或 `undefined`。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `null | undefined`
 */
export const isNullOrUndefined = (val: unknown): val is null | undefined =>
  val === null || val === undefined;

/**
 * 判断是否为 `Error` 实例（含跨执行域的 `Error`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `Error`
 */
export const isError = (val: unknown): val is Error =>
  val instanceof Error || isTypeOf(val, "Error");

/**
 * 判断是否为 `RegExp` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时入参被收窄为 `RegExp`
 */
export const isRegExp = (val: unknown): val is RegExp => isTypeOf(val, "RegExp");

/**
 * 判断是否为 TypedArray（`Uint8Array`、`Float64Array` 等，不含 `DataView`）。
 * @param val - 任意值
 * @returns 是 TypedArray 返回 `true`
 */
export const isTypedArray = (val: unknown): boolean =>
  ArrayBuffer.isView(val) && !(val instanceof DataView);
