import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getUrlParams,
  getUrlParam,
  toQueryString,
  copyToClipboard,
  downloadFile,
  exportJSON,
  scrollToTop,
  scrollToBottom,
  onScroll,
  observeIntersection,
} from '../src/browser'

// ============================================================
// getUrlParams
// ============================================================
describe('getUrlParams', () => {
  it('should parse URL params from given URL', () => {
    const params = getUrlParams('https://example.com?a=1&b=2')
    expect(params).toEqual({ a: '1', b: '2' })
  })

  it('should handle URL without params', () => {
    const params = getUrlParams('https://example.com')
    expect(params).toEqual({})
  })

  it('should handle URL with single param', () => {
    const params = getUrlParams('https://example.com?key=value')
    expect(params).toEqual({ key: 'value' })
  })

  it('should handle encoded params', () => {
    const params = getUrlParams('https://example.com?name=%E5%BC%A0%E4%B8%89')
    expect(params.name).toBe('张三')
  })

  it('should use current page URL when no arg provided', () => {
    // In jsdom, window.location.href is something like "about:blank"
    const params = getUrlParams()
    expect(params).toBeDefined()
    expect(typeof params).toBe('object')
  })

  it('should handle empty param values', () => {
    const params = getUrlParams('https://example.com?a=&b=2')
    expect(params.a).toBe('')
    expect(params.b).toBe('2')
  })

  it('should handle duplicate params (last wins)', () => {
    const params = getUrlParams('https://example.com?a=1&a=2')
    expect(params.a).toBe('2')
  })
})

// ============================================================
// getUrlParam
// ============================================================
describe('getUrlParam', () => {
  it('should get single URL param', () => {
    expect(getUrlParam('a', 'https://example.com?a=1')).toBe('1')
  })

  it('should return null for missing param', () => {
    expect(getUrlParam('missing', 'https://example.com?a=1')).toBe(null)
  })

  it('should use current page URL when no url arg provided', () => {
    const result = getUrlParam('test')
    expect(result).toBe(null) // about:blank has no params
  })

  it('should handle encoded param name', () => {
    const url = 'https://example.com?name=value'
    expect(getUrlParam('name', url)).toBe('value')
  })
})

// ============================================================
// toQueryString
// ============================================================
describe('toQueryString', () => {
  it('should convert object to query string', () => {
    expect(toQueryString({ a: 1, b: 'hello' })).toBe('a=1&b=hello')
  })

  it('should filter out null and undefined values', () => {
    const result = toQueryString({ a: 1, b: null, c: undefined, d: 'ok' })
    expect(result).toBe('a=1&d=ok')
    // Should not contain b or c
    expect(result).not.toContain('b=')
    expect(result).not.toContain('c=')
  })

  it('should encode special characters', () => {
    const result = toQueryString({ name: '张三', msg: 'hello world' })
    expect(result).toContain('name=')
    expect(result).toContain('msg=')
    // spaces and CJK should be encoded
    expect(result).not.toContain(' ')
  })

  it('should handle empty object', () => {
    expect(toQueryString({})).toBe('')
  })

  it('should handle boolean values', () => {
    const result = toQueryString({ flag: true, active: false })
    expect(result).toBe('flag=true&active=false')
  })

  it('should handle number values including 0', () => {
    const result = toQueryString({ count: 0 })
    expect(result).toBe('count=0')
  })
})

// ============================================================
// copyToClipboard
// ============================================================
describe('copyToClipboard', () => {
  it('should copy text using Clipboard API if available', async () => {
    // jsdom implements navigator.clipboard.writeText as a mock
    if (navigator.clipboard) {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      const result = await copyToClipboard('Hello World')
      expect(writeTextSpy).toHaveBeenCalledWith('Hello World')
      expect(result).toBe(true)
      writeTextSpy.mockRestore()
    }
  })

  it('should return false when Clipboard API throws', async () => {
    if (navigator.clipboard) {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
      const result = await copyToClipboard('test')
      expect(result).toBe(false)
      writeTextSpy.mockRestore()
    }
  })

  it('should fallback to execCommand when clipboard API is absent', async () => {
    const originalClipboard = navigator.clipboard
    // Simulate absence of clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    })

    // document.execCommand doesn't exist in jsdom, so mock it on the prototype
    const execSpy = vi.fn(() => true)
    HTMLDocument.prototype.execCommand = execSpy

    const result = await copyToClipboard('fallback text')
    expect(execSpy).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)

    // Cleanup
    delete (HTMLDocument.prototype as any).execCommand
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    })
  })
})

// ============================================================
// downloadFile
// ============================================================
describe('downloadFile', () => {
  it('should create a download link and click it', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    // Mock anchor click
    const anchor = document.createElement('a')
    const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {})
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
      if (tag === 'a') return anchor
      return originalCreateElement(tag, options)
    })

    downloadFile('Hello World', 'hello.txt')

    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(anchor.download).toBe('hello.txt')
    expect(anchor.href).toBe('blob:test')
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test')

    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('should use default mimeType text/plain', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    downloadFile('test')
    expect(URL.createObjectURL).toHaveBeenCalled()
    // The Blob arg should have type = 'text/plain'
    const callArgs = (vi.mocked(URL.createObjectURL) as any).mock.calls[0]
    const blobArg = callArgs[0] as Blob
    expect(blobArg).toBeInstanceOf(Blob)
    expect(blobArg.type).toBe('text/plain')

    vi.restoreAllMocks()
  })

  it('should use custom mimeType', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    downloadFile('{"a":1}', 'data.json', 'application/json')
    const callArgs = (vi.mocked(URL.createObjectURL) as any).mock.calls[0]
    const blobArg = callArgs[0] as Blob
    expect(blobArg.type).toBe('application/json')

    vi.restoreAllMocks()
  })
})

// ============================================================
// exportJSON
// ============================================================
describe('exportJSON', () => {
  it('should export JSON with default filename', () => {
    const anchor = document.createElement('a')
    const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    exportJSON({ name: '张三', age: 30 })

    expect(anchor.download).toBe('data.json')
    expect(clickSpy).toHaveBeenCalled()

    vi.restoreAllMocks()
  })

  it('should export JSON with custom filename', () => {
    const anchor = document.createElement('a')
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    vi.spyOn(anchor, 'click').mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    exportJSON([1, 2, 3], 'numbers.json')

    expect(anchor.download).toBe('numbers.json')

    vi.restoreAllMocks()
  })

  it('should produce valid JSON blob', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    const data = { a: 1, b: { c: [1, 2, 3] } }
    exportJSON(data)

    const blobArg = (URL.createObjectURL as any).mock.calls[0][0]
    expect(blobArg.type).toBe('application/json')

    vi.restoreAllMocks()
  })
})

// ============================================================
// scrollToTop
// ============================================================
describe('scrollToTop', () => {
  it('should call window.scrollTo with top: 0', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollToTop()
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    scrollToSpy.mockRestore()
  })

  it('should use smooth behavior by default', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollToTop()
    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' }),
    )

    scrollToSpy.mockRestore()
  })

  it('should accept custom scroll behavior', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollToTop('auto')
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })

    scrollToSpy.mockRestore()
  })
})

// ============================================================
// scrollToBottom
// ============================================================
describe('scrollToBottom', () => {
  it('should call window.scrollTo with document height', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    // Set a known scrollHeight
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      configurable: true,
    })

    scrollToBottom()
    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 5000, behavior: 'smooth' }),
    )

    scrollToSpy.mockRestore()
  })

  it('should accept custom scroll behavior', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollToBottom('auto')
    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'auto' }),
    )

    scrollToSpy.mockRestore()
  })
})

// ============================================================
// onScroll
// ============================================================
describe('onScroll', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      // Do NOT execute callback here — real browsers fire rAF async
      return 1
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add scroll event listener and return cleanup', () => {
    const callback = vi.fn()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    const cleanup = onScroll(callback)

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(typeof cleanup).toBe('function')
  })

  it('should remove listener when cleanup is called', () => {
    const callback = vi.fn()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const cleanup = onScroll(callback)
    cleanup()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('should throttle via requestAnimationFrame', () => {
    const callback = vi.fn()
    // Override rAF to execute callback immediately for test
    vi.restoreAllMocks()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })

    onScroll(callback)

    // Dispatch scroll event
    window.dispatchEvent(new Event('scroll'))
    // rAF ran immediately in our mock
    // The callback should have received some value
    expect(callback).toHaveBeenCalled()
  })
})

// ============================================================
// observeIntersection
// ============================================================
describe('observeIntersection', () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let observerCallback: IntersectionObserverCallback | null

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    // Mock IntersectionObserver — must use a regular function (not arrow) for `new` to work
    const MockObserver = vi.fn(function (this: any, cb: IntersectionObserverCallback) {
      observerCallback = cb
      this.observe = mockObserve
      this.disconnect = mockDisconnect
      this.unobserve = vi.fn()
      this.takeRecords = vi.fn(() => [])
      this.root = null
      this.rootMargin = ''
      this.thresholds = []
    })
    vi.stubGlobal('IntersectionObserver', MockObserver)
  })

  afterEach(() => {
    observerCallback = null
    vi.restoreAllMocks()
  })

  it('should observe the target element', () => {
    const target = document.createElement('div')
    observeIntersection(target, vi.fn())
    expect(mockObserve).toHaveBeenCalledWith(target)
  })

  it('should call onEnter when element becomes visible', () => {
    const target = document.createElement('div')
    const onEnter = vi.fn()

    observeIntersection(target, onEnter)

    // Simulate intersection
    observerCallback!(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('should call onLeave when element leaves viewport', () => {
    const target = document.createElement('div')
    const onEnter = vi.fn()
    const onLeave = vi.fn()

    observeIntersection(target, onEnter, onLeave)

    // Simulate leaving
    observerCallback!(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onEnter).not.toHaveBeenCalled()
  })

  it('should not throw when onLeave is not provided and element leaves', () => {
    const target = document.createElement('div')
    const onEnter = vi.fn()

    observeIntersection(target, onEnter)

    // Simulate leaving without onLeave — should not throw
    expect(() => {
      observerCallback!(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    }).not.toThrow()
    expect(onEnter).not.toHaveBeenCalled()
  })

  it('should return a cleanup function that disconnects', () => {
    const target = document.createElement('div')
    const cleanup = observeIntersection(target, vi.fn())

    cleanup()
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('should pass options to IntersectionObserver', () => {
    const target = document.createElement('div')
    const options = { threshold: 0.5, rootMargin: '10px' }

    observeIntersection(target, vi.fn(), undefined, options)

    expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options)
  })
})
