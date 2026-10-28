import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, throttle } from '../src/control'

// ============================================================
// debounce
// ============================================================
describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('trailing (default)', () => {
    it('should execute after delay when calls stop', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300)

      debounced('a')
      debounced('b')
      debounced('c')

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('c')
    })

    it('should reset timer on each call', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300)

      debounced('a')
      vi.advanceTimersByTime(200)
      debounced('b')
      vi.advanceTimersByTime(200)
      // only 200ms since last call, not yet
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      // 300ms since last call
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('b')
    })

    it('should execute after exact delay', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 500)

      debounced()
      vi.advanceTimersByTime(499)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('leading', () => {
    it('should execute immediately on first call when leading is true', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300, { leading: true, trailing: false })

      debounced('a')
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')

      debounced('b')
      debounced('c')
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should execute on leading edge of each burst', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300, { leading: true, trailing: false })

      debounced('a')
      expect(fn).toHaveBeenCalledWith('a')

      vi.advanceTimersByTime(300)
      debounced('b')
      expect(fn).toHaveBeenCalledWith('b')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not duplicate when both leading and trailing are true', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300, { leading: true, trailing: true })

      debounced('a')
      expect(fn).toHaveBeenCalledTimes(1) // leading

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1) // trailing suppressed
    })

    it('should execute trailing for calls after leading in same burst', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300, { leading: true, trailing: true })

      debounced('a')
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')

      debounced('b')
      debounced('c')

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('c')
    })
  })

  describe('only trailing (leading: false, trailing: true)', () => {
    it('should not execute on first call', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300, { leading: false, trailing: true })

      debounced('a')
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')
    })
  })

  describe('cancel', () => {
    it('should cancel pending execution', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300)

      debounced('a')
      debounced.cancel()

      vi.advanceTimersByTime(300)
      expect(fn).not.toHaveBeenCalled()
    })

    it('should allow new calls after cancel', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300)

      debounced('a')
      debounced.cancel()
      vi.advanceTimersByTime(300)
      expect(fn).not.toHaveBeenCalled()

      debounced('b')
      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('b')
    })
  })

  describe('edge cases', () => {
    it('should handle single call', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300)

      debounced(42)
      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(42)
    })

    it('should handle delay 0 with trailing', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 0)

      debounced('a')
      // setTimeout(fn, 0) needs timer flush
      vi.advanceTimersByTime(0)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle delay 0 with leading', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 0, { leading: true, trailing: false })

      debounced('a')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should coerce delay of negative values by treating as zero', () => {
      const fn = vi.fn()
      // negative delay passed — setTimeout with negative behaves like 0
      const debounced = debounce(fn, -100, { leading: false, trailing: true })

      debounced('a')
      vi.advanceTimersByTime(0)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })
})

// ============================================================
// throttle
// ============================================================
describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('leading + trailing (default)', () => {
    it('should execute immediately on first call', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300)

      throttled('a')
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')
    })

    it('should suppress calls within interval', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300)

      throttled('a')
      expect(fn).toHaveBeenCalledTimes(1)

      throttled('b')
      throttled('c')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should execute trailing call after interval', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300)

      throttled('a')
      throttled('b')
      throttled('c')

      vi.advanceTimersByTime(300)
      // trailing fires with last args
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('c')
    })

    it('should execute at most once per interval', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      throttled() // leading → 1
      vi.advanceTimersByTime(50)
      throttled() // within interval, suppressed → 1
      vi.advanceTimersByTime(50)
      // 100ms elapsed, trailing fires → 2
      expect(fn).toHaveBeenCalledTimes(2)

      throttled() // lastTime 刚更新，未超过间隔，进入 trailing 等待
      expect(fn).toHaveBeenCalledTimes(2)

      vi.advanceTimersByTime(100)
      // trailing fires → 3
      expect(fn).toHaveBeenCalledTimes(3)

      // 再等 100ms 超过间隔，下一次调用触发 leading
      vi.advanceTimersByTime(100)
      throttled() // leading → 4
      expect(fn).toHaveBeenCalledTimes(4)
    })
  })

  describe('leading only (trailing: false)', () => {
    it('should execute immediately then suppress', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300, { leading: true, trailing: false })

      throttled('a')
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')

      throttled('b')
      throttled('c')
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(300)
      // no trailing execution
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should execute again after interval', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300, { leading: true, trailing: false })

      throttled('a')
      vi.advanceTimersByTime(300)
      throttled('b')
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('b')
    })
  })

  describe('trailing only (leading: false)', () => {
    it('should not execute immediately', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300, { leading: false, trailing: true })

      throttled('a')
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('a')
    })

    it('should execute trailing with last args', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300, { leading: false, trailing: true })

      throttled('a')
      throttled('b')
      throttled('c')

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('c')
    })
  })

  describe('cancel', () => {
    it('should cancel pending trailing execution', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300)

      throttled('a') // leading
      throttled('b')
      throttled.cancel()

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1) // only leading
    })

    it('should allow new calls after cancel', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300)

      throttled('a')
      throttled.cancel()
      vi.advanceTimersByTime(300)

      throttled('b')
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('b')
    })
  })

  describe('edge cases', () => {
    it('should handle single call', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300)

      throttled(42)
      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(42)
    })

    it('should handle interval 0', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 0)

      throttled('a')
      throttled('b')
      // interval 0: every call passes the remaining <= 0 check
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not execute with leading false and trailing false', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 300, { leading: false, trailing: false })

      throttled('a')
      vi.advanceTimersByTime(500)
      expect(fn).not.toHaveBeenCalled()
    })

    it('should handle rapid continuous calls', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      // Simulate scroll: fire every 10ms for 500ms
      for (let i = 0; i < 50; i++) {
        throttled(i)
        vi.advanceTimersByTime(10)
      }
      // 500ms / 100ms = 5 leading + trailing pattern => ~6 calls
      expect(fn).toHaveBeenCalled()
      const callCount = fn.mock.calls.length
      // should be much less than 50
      expect(callCount).toBeLessThan(20)
    })
  })
})
