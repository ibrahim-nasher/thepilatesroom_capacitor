import { api } from './client';
import type { Booking } from '@store';

interface CreateBookingData {
  scheduleId: string;
  packageId?: string; // Use package credit
  paymentMethod?: 'package' | 'card'; // If not using package
}

interface CancelBookingData {
  reason: string;
}

interface GetBookingsParams {
  status?: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  startDate?: string;
  endDate?: string;
}

export const bookingApi = {
  // Get user's bookings
  getBookings: (params?: GetBookingsParams) =>
    api.get<Booking[]>('/bookings', { params }),
  
  // Get booking by ID
  getBookingById: (bookingId: string) =>
    api.get<Booking>(`/bookings/${bookingId}`),
  
  // Create new booking
  createBooking: (data: CreateBookingData) =>
    api.post<Booking>('/bookings', data),
  
  // Cancel booking
  cancelBooking: (bookingId: string, data: CancelBookingData) =>
    api.post<Booking>(`/bookings/${bookingId}/cancel`, data),
  
  // Get upcoming bookings
  getUpcomingBookings: () =>
    api.get<Booking[]>('/bookings/upcoming'),
  
  // Get past bookings
  getPastBookings: () =>
    api.get<Booking[]>('/bookings/past'),
  
  // Check if user can book a class
  checkBookingAvailability: (scheduleId: string) =>
    api.get<{ available: boolean; reason?: string }>(`/bookings/check/${scheduleId}`),
};
