import { create } from 'zustand'
import { NotificationItem } from '@/types'

interface NotificationState {
  notifications: NotificationItem[]
  unreadCount: () => number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void
  clearAll: () => void
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Reservation',
    message: 'Table for 4 confirmed for 7:30 PM (Mr. Beaumont)',
    timestamp: '5 min ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-2',
    title: 'Order Ready for Table 6',
    message: 'Hot appetizers plated and ready for pickup from Pass 1',
    timestamp: '12 min ago',
    read: false,
    type: 'warning',
    targetRole: 'waiter'
  },
  {
    id: 'notif-3',
    title: 'Low Inventory Alert',
    message: 'Truffle olive oil reserve below 2 bottles threshold',
    timestamp: '35 min ago',
    read: true,
    type: 'danger',
    targetRole: 'admin'
  },
  {
    id: 'notif-4',
    title: 'Shift Handover Complete',
    message: 'Lunch shift balance reconciled and drawer closed',
    timestamp: '2 hours ago',
    read: true,
    type: 'info',
  }
]

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: () => get().notifications.filter(n => !n.read).length,
  markAsRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }))
  },
  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }))
  },
  addNotification: (item) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    }
    set(state => ({
      notifications: [newItem, ...state.notifications]
    }))
  },
  clearAll: () => {
    set({ notifications: [] })
  }
}))
