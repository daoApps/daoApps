import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should initialize with the initial value of the ref', () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value)
      expect(debouncedValue.value).toBe('initial')
    })

    it('should initialize with the return value of a function', () => {
      const debouncedValue = useDebounce(() => 'function value')
      expect(debouncedValue.value).toBe('function value')
    })

    it('should work with numbers', () => {
      const value = ref(42)
      const debouncedValue = useDebounce(value)
      expect(debouncedValue.value).toBe(42)
    })

    it('should work with booleans', () => {
      const value = ref(true)
      const debouncedValue = useDebounce(value)
      expect(debouncedValue.value).toBe(true)
    })

    it('should work with objects', () => {
      const value = ref({ key: 'value' })
      const debouncedValue = useDebounce(value)
      expect(debouncedValue.value).toEqual({ key: 'value' })
    })
  })

  describe('Debounce Delay', () => {
    it('should not update immediately when the source value changes', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value, 300)

      value.value = 'changed'
      await nextTick()
      expect(debouncedValue.value).toBe('initial')
    })

    it('should update after the specified delay', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value, 300)

      value.value = 'changed'
      await nextTick()
      vi.advanceTimersByTime(299)
      expect(debouncedValue.value).toBe('initial')

      vi.advanceTimersByTime(2)
      await nextTick()
      expect(debouncedValue.value).toBe('changed')
    })

    it('should use default delay of 300ms', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value)

      value.value = 'changed'
      await nextTick()
      vi.advanceTimersByTime(299)
      expect(debouncedValue.value).toBe('initial')

      vi.advanceTimersByTime(2)
      await nextTick()
      expect(debouncedValue.value).toBe('changed')
    })

    it('should work with custom delay', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value, 100)

      value.value = 'changed'
      await nextTick()
      vi.advanceTimersByTime(99)
      expect(debouncedValue.value).toBe('initial')

      vi.advanceTimersByTime(2)
      await nextTick()
      expect(debouncedValue.value).toBe('changed')
    })
  })

  describe('Multiple Updates', () => {
    it('should reset the timer when source value changes multiple times', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value, 300)

      value.value = 'change 1'
      await nextTick()
      vi.advanceTimersByTime(200)
      expect(debouncedValue.value).toBe('initial')

      value.value = 'change 2'
      await nextTick()
      vi.advanceTimersByTime(200)
      expect(debouncedValue.value).toBe('initial')

      vi.advanceTimersByTime(101)
      await nextTick()
      expect(debouncedValue.value).toBe('change 2')
    })

    it('should keep the latest value after multiple rapid changes', async () => {
      const value = ref(0)
      const debouncedValue = useDebounce(value, 100)

      for (let i = 1; i <= 5; i++) {
        value.value = i
        await nextTick()
        vi.advanceTimersByTime(50)
      }

      expect(debouncedValue.value).toBe(0)

      vi.advanceTimersByTime(101)
      await nextTick()
      expect(debouncedValue.value).toBe(5)
    })
  })

  describe('Function Source', () => {
    it('should initialize with function return value', () => {
      let count = 5
      const debouncedValue = useDebounce(() => count, 300)
      expect(debouncedValue.value).toBe(5)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null values', async () => {
      const value = ref<string | null>('initial')
      const debouncedValue = useDebounce(value, 100)

      value.value = null
      await nextTick()
      vi.advanceTimersByTime(101)
      await nextTick()
      expect(debouncedValue.value).toBeNull()
    })

    it('should handle undefined values', async () => {
      const value = ref<string | undefined>('initial')
      const debouncedValue = useDebounce(value, 100)

      value.value = undefined
      await nextTick()
      vi.advanceTimersByTime(101)
      await nextTick()
      expect(debouncedValue.value).toBeUndefined()
    })

    it('should handle empty strings', async () => {
      const value = ref('non-empty')
      const debouncedValue = useDebounce(value, 100)

      value.value = ''
      await nextTick()
      vi.advanceTimersByTime(101)
      await nextTick()
      expect(debouncedValue.value).toBe('')
    })

    it('should work with very short delay', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value, 1)

      value.value = 'changed'
      await nextTick()
      vi.advanceTimersByTime(2)
      await nextTick()
      expect(debouncedValue.value).toBe('changed')
    })

    it('should work with very long delay', async () => {
      const value = ref('initial')
      const debouncedValue = useDebounce(value, 10000)

      value.value = 'changed'
      await nextTick()
      vi.advanceTimersByTime(9999)
      expect(debouncedValue.value).toBe('initial')

      vi.advanceTimersByTime(2)
      await nextTick()
      expect(debouncedValue.value).toBe('changed')
    })
  })
})
