/**
 * `localStorage` 读写工具（自动进行 JSON 序列化 / 反序列化）。
 * @packageDocumentation
 */

/**
 * 读取 `localStorage` 中的值（自动尝试 `JSON.parse` 反序列化）。
 * @template T - 期望返回的数据类型，默认 `any`
 * @param key - 存储键名
 * @returns 反序列化后的值；键不存在返回 `null`；若内容非 JSON 则原样返回字符串
 * @example
 * localSet('user', { name: 'Tom' })
 * localGet<{ name: string }>('user') // { name: 'Tom' }
 */
export const localGet = <T = any>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as any;
  }
};

/**
 * 写入 `localStorage`（自动 `JSON.stringify` 序列化；基本类型也推荐以对象/数组存储）。
 * @param key - 存储键名
 * @param value - 任意可序列化的值
 * @returns 无返回值
 * @example
 * localSet('token', 'abc123')
 * localSet('list', [1, 2, 3])
 */
export const localSet = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * 移除 `localStorage` 中指定键。
 * @param key - 要移除的键名
 * @returns 无返回值
 * @example
 * localRm('token')
 */
export const localRm = (key: string): void => {
  localStorage.removeItem(key);
};

/**
 * 清空当前域下的全部 `localStorage`。
 * @returns 无返回值
 * @example
 * localClear()
 */
export const localClear = (): void => {
  localStorage.clear();
};
