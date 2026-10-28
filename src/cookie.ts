/**
 * 设置 Cookie（默认不过期，即会话级 Cookie）。
 * @param name - Cookie 名称（会自动 `encodeURIComponent` 编码）
 * @param value - Cookie 值（会自动 `encodeURIComponent` 编码）
 * @param days - 有效期天数，默认 `0`（会话级，关闭浏览器即失效）；传负数可立即过期
 * @returns 无返回值
 */
export const setCookie = (name: string, value: string, days = 0): void => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
};

/**
 * 读取指定名称的 Cookie 值。
 * @param name - Cookie 名称
 * @returns Cookie 值字符串，不存在时返回 `null`
 */
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(
    new RegExp("(^| )" + encodeURIComponent(name) + "=([^;]+)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * 删除指定名称的 Cookie（通过设置过期时间为过去实现）。
 * @param name - 要删除的 Cookie 名称
 * @returns 无返回值
 */
export const removeCookie = (name: string): void => {
  setCookie(name, "", -1);
};
