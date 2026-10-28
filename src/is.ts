/**
 * 判断是否为数组（`Array.isArray` 的类型守卫版本）。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `any[]`
 */
export const isArray = Array.isArray as (value: any) => value is any[]

/**
 * 判断是否为普通对象（原型为 `Object.prototype` 或 `null`）。
 * @param value - 任意值
 * @returns 是普通对象返回 `true`
 * @remarks 数组、`Date`、`Map`、`Set`、类实例等均返回 `false`。
 */
export const isObject = (value: any): boolean => {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * 通用内部类型判断：基于 `Object.prototype.toString` 精确识别内置类型。
 * @param val - 任意值
 * @param type - 期望的类型名（如 `"Array"`、`"Date"`、`"Function"`）
 * @returns 类型匹配返回 `true`
 */
export const is = (val: unknown, type: string): boolean => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 判断是否为函数（含普通函数、异步函数、类、箭头函数等可调用对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Function`
 */
export const isFunction = (val: any): val is Function => {
  return is(val, "Function") || !!(val && val.constructor && val.call && val.apply);
};

/**
 * 判断是否为 `Date` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Date`
 */
export const isDate = (val: any): val is Date => {
  return is(val, "Date") || (!!val && val.constructor === Date);
};

/**
 * 判断是否为数字（`Infinity` / `-Infinity` 视为数字；`NaN` 因 `NaN !== NaN` 返回 `false`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `number`
 */
export const isNumber = (val: any): val is number => {
  return typeof val === "number" && !Number.isNaN(val);
};

/**
 * 判断是否为整数（有限且为整数，排除 `NaN` / `Infinity`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `number`
 */
export const isInt = (val: any): val is number => {
  return isNumber(val) && Number.isFinite(val) && val % 1 === 0;
};

/**
 * 判断是否为浮点数（有限且含小数部分）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `number`
 */
export const isFloat = (val: any): val is number => {
  return isNumber(val) && Number.isFinite(val) && val % 1 !== 0;
};

/**
 * 判断是否为异步函数（`async function`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为异步函数
 */
export const isAsyncFunction = (val: unknown): val is (...args: any[]) => Promise<any> => {
  return is(val, "AsyncFunction");
};

/**
 * 判断是否为 Promise（具有 `then` 方法的可调用对象）。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Promise`
 */
export const isPromise = (value: any): value is Promise<any> => {
  return !!value && isFunction((value as any).then);
};

/**
 * 判断是否为字符串（含 `String` 包装对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `string`
 */
export const isString = (val: unknown): val is string => {
  return is(val, "String") || typeof val === "string" || val instanceof String;
};

/**
 * 判断是否为布尔值（含 `Boolean` 包装对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `boolean`
 */
export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === "boolean" || is(val, "Boolean");
};

/**
 * 判断当前运行环境是否为浏览器（存在 `window`）。
 * @returns 是浏览器环境返回 `true`
 */
export const isPC = (): boolean => typeof window !== "undefined";

/**
 * 判断是否为 `window` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Window`
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== "undefined" && is(val, "Window");
};

/**
 * 判断是否为 DOM 元素（具有 `tagName` 的普通对象）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Element`
 */
export const isElement = (val: unknown): val is Element => {
  return typeof val === "object" && val !== null && typeof (val as Element).tagName === "string";
};

/**
 * 判断值是否为 `null`。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `null`
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
export const isIOS = (): boolean =>
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * 判断是否为合法的邮箱地址（宽松校验：允许 `+`、点号等常见字符，仅要求含 `@` 与带点的域名）。
 * @param email - 待校验的邮箱字符串
 * @returns 合法返回 `true`
 * @remarks 与 `isEmail` 的差异：本函数只做粗筛，`user+tag@example.com` 可通过；需要限制本地部分字符集时改用 `isEmail`。
 * @see isEmail
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email);
};

/**
 * 判断值是否已定义（不为 `undefined`）。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `T`（排除 `undefined`）
 */
export const isDef = <T>(val: T | undefined): val is T => typeof val !== "undefined";

/**
 * 判断值是否为 `undefined`。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `undefined`
 */
export const isUnDef = <T>(val: T | undefined): val is undefined => typeof val === "undefined";

/**
 * 判断值是否为 `null` 或 `undefined`。
 * @template T - 原始类型
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `null | undefined`
 */
export const isNullOrUnDef = <T>(val: T | null | undefined): val is null | undefined => {
  return isUnDef(val) || isNull(val);
};

/**
 * 判断是否为 `Symbol`。
 * @param value - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `symbol`
 */
export const isSymbol = (value: any): value is symbol => {
  return !!value && value.constructor === Symbol;
};

/**
 * 判断是否为原始（基本）类型（`string` / `number` / `boolean` / `symbol` / `bigint` / `null` / `undefined`）。
 * @param value - 任意值
 * @returns 是原始类型返回 `true`
 */
export const isPrimitive = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  );
};

/**
 * 判断是否为基本类型。`isPrimitive` 的别名，二者行为完全一致（保留导出仅为兼容）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为基本类型
 * @see isPrimitive
 */
export const isBasicType = (val: any): val is string | number | boolean | symbol | bigint | null | undefined => {
  return isPrimitive(val)
};

/**
 * 判断值是否为“空”：`null` / `undefined` / 空字符串 / 空数组 / 空对象 / 空 `Map` / 空 `Set` / 无效日期，以及长度为 0 的可枚举对象。
 * @param value - 任意值
 * @returns 视为空返回 `true`
 * @remarks 与 `isEmptySv` 的差异：本函数对数字、函数、`Symbol` 一律返回 `false`，并按有效性判断 `Date`；`isEmptySv` 不特判 `Date`（任何 `Date` 都视为空），但能正确处理 `DataView` 等没有 `length` 的 `ArrayBuffer` 视图。
 * @see isEmptySv
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
 * @remarks 与 `isEmpty` 的差异：不特判 `Date`（任何 `Date` 都没有可枚举自有属性，会被判为空），但支持 `DataView` 等 `ArrayBuffer` 视图。
 * @see isEmpty
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
 * 深度相等比较：支持 `Date` / `RegExp` / `Map` / `Set` / `ArrayBuffer` 视图、嵌套对象与循环引用。
 * @template T - 比较值的类型
 * @param x - 第一个值
 * @param y - 第二个值
 * @returns 完全相等返回 `true`
 * @remarks `Map` 的键与 `Set` 的元素按引用（SameValueZero）比较，不递归比较其内部对象。
 */
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

export const isEqual = <T>(x: T, y: T): boolean => _isEqual(x, y, new WeakMap());

/**
 * 判断值是否为 `null` 或 `undefined`。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `null | undefined`
 */
export const isNil = (val: unknown): val is null | undefined =>
  val === null || val === undefined;

/**
 * 判断是否为 `Error` 实例（含跨执行域的 `Error`）。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `Error`
 */
export const isError = (val: unknown): val is Error =>
  val instanceof Error || is(val, "Error");

/**
 * 判断是否为 `RegExp` 对象。
 * @param val - 任意值
 * @returns 类型谓词：为 `true` 时 `value` 被收窄为 `RegExp`
 */
export const isRegExp = (val: unknown): val is RegExp => is(val, "RegExp");

/**
 * 判断是否为 TypedArray（`Uint8Array`、`Float64Array` 等，不含 `DataView`）。
 * @param val - 任意值
 * @returns 是 TypedArray 返回 `true`
 */
export const isTypedArray = (val: unknown): boolean =>
  ArrayBuffer.isView(val) && !(val instanceof DataView);
