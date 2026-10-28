/**
 * 浏览器环境（URL、剪贴板、文件下载、滚动、可视区域）相关工具函数。
 * @packageDocumentation
 */

/**
 * 解析 URL 的查询字符串（search params）为键值对对象。
 * @param url - 可选的目标 URL；省略时使用当前页面地址 `window.location.href`
 * @returns 以参数名为键、参数值为值的对象（值均为字符串）
 * @example
 * getUrlParams('https://x.com/?a=1&b=2') // { a: '1', b: '2' }
 */
const resolveUrl = (url?: string): URL => new URL(url ?? window.location.href);

/**
 * 解析 URL 的查询字符串（search params）为键值对对象。
 * @param url - 可选的目标 URL；省略时使用当前页面地址 `window.location.href`
 * @returns 以参数名为键、参数值为值的对象（值均为字符串）
 * @example
 * getUrlParams('https://x.com/?a=1&b=2') // { a: '1', b: '2' }
 */
export const getUrlParams = (url?: string): Record<string, string> =>
  Object.fromEntries(resolveUrl(url).searchParams);

/**
 * 读取 URL 中单个查询参数的值。
 * @param key - 参数名
 * @param url - 可选的目标 URL；省略时使用当前页面地址
 * @returns 参数值字符串，不存在时返回 `null`
 * @example
 * getUrlParam('a', 'https://x.com/?a=1') // '1'
 * getUrlParam('x', 'https://x.com/?a=1') // null
 */
export const getUrlParam = (key: string, url?: string): string | null =>
  resolveUrl(url).searchParams.get(key);

/**
 * 将普通对象转换为 URL 查询字符串（已对键名/值进行 `encodeURIComponent` 编码）。
 * @param params - 待转换的键值对对象；值为 `undefined` / `null` 的字段会被忽略
 * @returns 形如 `a=1&b=2` 的查询字符串（不含前导 `?`）
 * @example
 * toQueryString({ a: 1, b: 'x y' }) // 'a=1&b=x%20y'
 */
export const toQueryString = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
};

/**
 * 复制文本到剪贴板（优先使用 `navigator.clipboard`，失败时回退到 `execCommand`）。
 * @param text - 待复制的文本
 * @returns `Promise<boolean>`：复制成功返回 `true`，失败返回 `false`
 * @example
 * await copyToClipboard('hello') // true
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard) {
    try { await navigator.clipboard.writeText(text); return true } catch { return false }
  }
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.cssText = "position:fixed;opacity:0"
  document.body.appendChild(textarea)
  textarea.select()
  const result = document.execCommand("copy")
  document.body.removeChild(textarea)
  return result
};

/**
 * 通过 Blob 触发浏览器文件下载。
 * @param content - 文件内容（字符串或任意 Blob 数据片段）
 * @param filename - 下载时保存的文件名
 * @param mimeType - 文件的 MIME 类型，默认 `"text/plain"`
 * @returns 无返回值（会直接触发下载）
 * @example
 * downloadFile('hello', 'a.txt', 'text/plain')
 */
export const downloadFile = (
  content: string | BlobPart,
  filename: string,
  mimeType = "text/plain",
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * 将任意数据以 JSON 文件形式导出下载。
 * @param data - 待导出的数据（会被 `JSON.stringify` 序列化）
 * @param filename - 文件名，默认 `"data.json"`
 * @returns 无返回值（会直接触发下载）
 * @example
 * exportJSON({ a: 1 }, 'config.json')
 */
export const exportJSON = (data: any, filename = "data.json"): void => {
  downloadFile(JSON.stringify(data, null, 2), filename, "application/json");
};

/**
 * 滚动页面到顶部。
 * @param behavior - 滚动行为，默认 `"smooth"`（平滑滚动），可选 `"auto"`（瞬时）
 * @returns 无返回值
 * @example
 * scrollToTop() // 平滑滚到顶部
 * scrollToTop('auto') // 立即跳到顶部
 */
export const scrollToTop = (behavior: ScrollBehavior = "smooth"): void => {
  window.scrollTo({ top: 0, behavior });
};

/**
 * 滚动页面到底部。
 * @param behavior - 滚动行为，默认 `"smooth"`（平滑滚动），可选 `"auto"`（瞬时）
 * @returns 无返回值
 * @example
 * scrollToBottom() // 平滑滚到底部
 */
export const scrollToBottom = (behavior: ScrollBehavior = "smooth"): void => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
};

/**
 * 监听页面滚动事件（使用 `requestAnimationFrame` 节流，每帧最多回调一次）。
 * @param callback - 滚动回调，接收当前垂直滚动距离 `scrollY`
 * @returns 清理函数：调用后移除滚动监听
 * @example
 * const stop = onScroll((y) => console.log(y))
 * // 稍后 stop() 取消监听
 */
export const onScroll = (callback: (scrollY: number) => void): () => void => {
  let ticking = false;
  const handler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
};

/**
 * 监听目标元素进入/离开可视区域（基于 `IntersectionObserver`）。
 * @param target - 待观察的 DOM 元素
 * @param onEnter - 元素进入可视区域时触发，接收对应的 `IntersectionObserverEntry`
 * @param onLeave - 可选，元素离开可视区域时触发，接收对应的 `IntersectionObserverEntry`
 * @param options - 可选，`IntersectionObserver` 配置项（如 `root`、`rootMargin`、`threshold`）
 * @returns 清理函数：调用后停止观察并断开连接
 * @example
 * const stop = observeIntersection(el, () => console.log('进入'), () => console.log('离开'))
 * // 稍后 stop() 取消观察
 */
export const observeIntersection = (
  target: Element,
  onEnter: (entry: IntersectionObserverEntry) => void,
  onLeave?: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
): () => void => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onEnter(entry);
      } else if (onLeave) {
        onLeave(entry);
      }
    });
  }, options);
  observer.observe(target);
  return () => observer.disconnect();
};
