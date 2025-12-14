// Central export for all stores
export { useAuthStore } from './authStore';
export { useClassStore } from './classStore';
export { usePackageStore } from './packageStore';
export { useBookingStore } from './bookingStore';
export { useNotificationStore } from './notificationStore';

// Re-export types
export type { User, AuthState } from './authStore';
export type { ClassSchedule, ClassCategory } from './classStore';
export type { Package, UserPackage } from './packageStore';
export type { Booking, BookingFilters } from './bookingStore';
export type { Notification } from './notificationStore';
