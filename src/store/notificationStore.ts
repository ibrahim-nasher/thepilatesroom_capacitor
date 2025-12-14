import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'reminder' | 'promotion' | 'system' | 'payment';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>; // Additional data for navigation/actions
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getUnreadNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) => {
    set(state => {
      const newNotifications = [notification, ...state.notifications];
      const unreadCount = newNotifications.filter(n => !n.isRead).length;
      return { notifications: newNotifications, unreadCount };
    });
  },

  markAsRead: (notificationId) => {
    set(state => {
      const newNotifications = state.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      const unreadCount = newNotifications.filter(n => !n.isRead).length;
      return { notifications: newNotifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (notificationId) => {
    set(state => {
      const newNotifications = state.notifications.filter(n => n.id !== notificationId);
      const unreadCount = newNotifications.filter(n => !n.isRead).length;
      return { notifications: newNotifications, unreadCount };
    });
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  getUnreadNotifications: () => {
    return get().notifications.filter(n => !n.isRead);
  },
}));
