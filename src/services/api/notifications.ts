import { api } from './client';
import type { Notification } from '@store';

export const notificationApi = {
  // Get all notifications
  getNotifications: () =>
    api.get<Notification[]>('/notifications'),
  
  // Get unread notifications
  getUnreadNotifications: () =>
    api.get<Notification[]>('/notifications/unread'),
  
  // Mark notification as read
  markAsRead: (notificationId: string) =>
    api.put<Notification>(`/notifications/${notificationId}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () =>
    api.put<{ success: boolean }>('/notifications/read-all'),
  
  // Delete notification
  deleteNotification: (notificationId: string) =>
    api.delete<{ success: boolean }>(`/notifications/${notificationId}`),
  
  // Clear all notifications
  clearAllNotifications: () =>
    api.delete<{ success: boolean }>('/notifications'),
  
  // Register FCM token for push notifications
  registerPushToken: (token: string) =>
    api.post<{ success: boolean }>('/notifications/push-token', { token }),
  
  // Unregister FCM token
  unregisterPushToken: () =>
    api.delete<{ success: boolean }>('/notifications/push-token'),
};
