import { ref, onUnmounted } from 'vue';
import type { useMonetizationStore } from '@/stores/useMonetizationStore';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoDismiss?: boolean;
}

export function useRealtimeData(store: ReturnType<typeof useMonetizationStore>) {
  const notifications = ref<Notification[]>([]);
  let intervalId: number | null = null;

  const generateRandomChange = (): number => {
    const change = (Math.random() - 0.5) * 200;
    return Math.round(change * 100) / 100;
  };

  const checkThresholds = (newBalance: number, change: number): void => {
    const thresholdHigh = 500;
    const thresholdLow = -200;

    if (change > thresholdHigh) {
      addNotification({
        type: 'success',
        title: '收益异常增长',
        message: `检测到单次收益变动 ¥${change.toFixed(2)}，超过预警阈值 ¥${thresholdHigh}`
      });
    } else if (change < thresholdLow) {
      addNotification({
        type: 'warning',
        title: '收益异常下降',
        message: `检测到单次收益变动 ¥${change.toFixed(2)}，低于预警阈值 ¥${thresholdLow}`
      });
    }

    if (newBalance < 0) {
      addNotification({
        type: 'error',
        title: '余额异常',
        message: '当前余额为负数，请及时检查账户状态'
      });
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): void => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      autoDismiss: notification.autoDismiss !== false
    };

    notifications.value.unshift(newNotification);

    if (newNotification.autoDismiss !== false) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string): void => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  const clearAllNotifications = (): void => {
    notifications.value = [];
  };

  const simulateRealtimeUpdate = (): void => {
    const currentBalance = store.wallet.availableBalance;
    const change = generateRandomChange();
    const newBalance = Math.max(0, currentBalance + change);

    store.updateRealtimeBalance(newBalance);
    checkThresholds(newBalance, change);
  };

  const startRealtimeUpdates = (): void => {
    if (intervalId) return;

    intervalId = window.setInterval(() => {
      simulateRealtimeUpdate();
    }, 3000);

    addNotification({
      type: 'info',
      title: '实时监控已启动',
      message: '每3秒更新一次余额数据'
    });
  };

  const stopRealtimeUpdates = (): void => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onUnmounted(() => {
    stopRealtimeUpdates();
  });

  return {
    notifications,
    startRealtimeUpdates,
    stopRealtimeUpdates,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
}
