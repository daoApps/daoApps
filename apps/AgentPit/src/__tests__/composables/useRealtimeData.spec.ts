import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRealtimeData } from '@/composables/useRealtimeData'
import { useMonetizationStore } from '@/stores/useMonetizationStore'

describe('useRealtimeData', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useMonetizationStore>
  let realtimeData: ReturnType<typeof useRealtimeData>

  beforeEach(() => {
    vi.useFakeTimers()
    pinia = createPinia()
    setActivePinia(pinia)
    store = useMonetizationStore()
    realtimeData = useRealtimeData(store)
  })

  afterEach(() => {
    vi.useRealTimers()
    realtimeData.stopRealtimeUpdates()
  })

  describe('Initial State', () => {
    it('should initialize with empty notifications array', () => {
      expect(realtimeData.notifications.value).toEqual([])
    })
  })

  describe('addNotification', () => {
    it('should add a notification to the notifications array', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test message'
      })

      expect(realtimeData.notifications.value.length).toBe(1)
      expect(realtimeData.notifications.value[0].type).toBe('info')
      expect(realtimeData.notifications.value[0].title).toBe('Test Notification')
      expect(realtimeData.notifications.value[0].message).toBe('This is a test message')
      expect(realtimeData.notifications.value[0].id).toBeDefined()
      expect(realtimeData.notifications.value[0].timestamp).toBeInstanceOf(Date)
      expect(realtimeData.notifications.value[0].autoDismiss).toBe(true)
    })

    it('should add notification with autoDismiss: false when specified', () => {
      realtimeData.addNotification({
        type: 'error',
        title: 'Error',
        message: 'An error occurred',
        autoDismiss: false
      })

      expect(realtimeData.notifications.value[0].autoDismiss).toBe(false)
    })

    it('should add notification to the beginning of the array', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'First',
        message: 'First message'
      })

      realtimeData.addNotification({
        type: 'info',
        title: 'Second',
        message: 'Second message'
      })

      expect(realtimeData.notifications.value[0].title).toBe('Second')
      expect(realtimeData.notifications.value[1].title).toBe('First')
    })

    it('should generate unique IDs for notifications', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'Test 1',
        message: 'Message 1'
      })

      realtimeData.addNotification({
        type: 'info',
        title: 'Test 2',
        message: 'Message 2'
      })

      const ids = realtimeData.notifications.value.map(n => n.id)
      expect(ids[0]).not.toBe(ids[1])
    })
  })

  describe('removeNotification', () => {
    it('should remove a notification by ID', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'Test',
        message: 'Test message'
      })

      const id = realtimeData.notifications.value[0].id
      realtimeData.removeNotification(id)

      expect(realtimeData.notifications.value.length).toBe(0)
    })

    it('should not remove other notifications when removing one', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'First',
        message: 'First message'
      })

      realtimeData.addNotification({
        type: 'info',
        title: 'Second',
        message: 'Second message'
      })

      const idToRemove = realtimeData.notifications.value[1].id
      realtimeData.removeNotification(idToRemove)

      expect(realtimeData.notifications.value.length).toBe(1)
      expect(realtimeData.notifications.value[0].title).toBe('Second')
    })

    it('should handle removing non-existent ID gracefully', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'Test',
        message: 'Test message'
      })

      expect(() => {
        realtimeData.removeNotification('non-existent-id')
      }).not.toThrow()

      expect(realtimeData.notifications.value.length).toBe(1)
    })
  })

  describe('clearAllNotifications', () => {
    it('should clear all notifications', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'First',
        message: 'First message'
      })

      realtimeData.addNotification({
        type: 'warning',
        title: 'Second',
        message: 'Second message'
      })

      expect(realtimeData.notifications.value.length).toBe(2)

      realtimeData.clearAllNotifications()

      expect(realtimeData.notifications.value).toEqual([])
    })

    it('should be safe to call when there are no notifications', () => {
      expect(() => {
        realtimeData.clearAllNotifications()
      }).not.toThrow()

      expect(realtimeData.notifications.value).toEqual([])
    })
  })

  describe('Auto Dismiss', () => {
    it('should auto-dismiss notifications after 5 seconds by default', () => {
      realtimeData.addNotification({
        type: 'info',
        title: 'Test',
        message: 'Test message'
      })

      expect(realtimeData.notifications.value.length).toBe(1)

      vi.advanceTimersByTime(4999)
      expect(realtimeData.notifications.value.length).toBe(1)

      vi.advanceTimersByTime(2)
      expect(realtimeData.notifications.value.length).toBe(0)
    })

    it('should not auto-dismiss notifications with autoDismiss: false', () => {
      realtimeData.addNotification({
        type: 'error',
        title: 'Error',
        message: 'An error occurred',
        autoDismiss: false
      })

      expect(realtimeData.notifications.value.length).toBe(1)

      vi.advanceTimersByTime(10000)
      expect(realtimeData.notifications.value.length).toBe(1)
    })
  })

  describe('startRealtimeUpdates', () => {
    it('should add info notification when starting', () => {
      realtimeData.startRealtimeUpdates()

      expect(realtimeData.notifications.value.length).toBe(1)
      expect(realtimeData.notifications.value[0].type).toBe('info')
      expect(realtimeData.notifications.value[0].title).toBe('实时监控已启动')
    })

    it('should not start multiple intervals', () => {
      realtimeData.startRealtimeUpdates()
      realtimeData.startRealtimeUpdates()
      realtimeData.startRealtimeUpdates()

      expect(realtimeData.notifications.value.length).toBe(1)
    })
  })

  describe('stopRealtimeUpdates', () => {
    it('should be safe to call when not started', () => {
      expect(() => {
        realtimeData.stopRealtimeUpdates()
      }).not.toThrow()
    })

    it('should be safe to call multiple times', () => {
      realtimeData.startRealtimeUpdates()
      expect(() => {
        realtimeData.stopRealtimeUpdates()
        realtimeData.stopRealtimeUpdates()
        realtimeData.stopRealtimeUpdates()
      }).not.toThrow()
    })
  })

  describe('Lifecycle', () => {
    it('should handle start -> stop -> start flow', () => {
      realtimeData.startRealtimeUpdates()
      realtimeData.stopRealtimeUpdates()
      realtimeData.startRealtimeUpdates()

      expect(realtimeData.notifications.value.length).toBe(2)
    })
  })
})
