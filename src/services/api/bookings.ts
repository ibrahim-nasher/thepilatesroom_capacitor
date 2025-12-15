import { api } from './client';

// API Response Types
interface BookingResponse {
  status: boolean;
  message: string;
  bookingDetails?: BookingDetails;
}

interface BookingDetails {
  id: string;
  transaction_id: string;
  user_id: string;
  package_id: string;
  category_id: string;
  session_id: string;
  total_bookings: number;
  class_limit: number;
  start_date: string;
  end_date: string;
  booking_type: 'individual' | 'book_all';
  send_reminder: boolean;
  payment_status: string;
  created_at: string;
}

interface WaitlistResponse {
  status: boolean;
  data: Waitlist | null;
}

interface Waitlist {
  id: string;
  user_id: string;
  class_id: string;
  class_schedule_id: string;
  startDate: string;
  created_at: string;
}

interface MyWaitlistResponse {
  status: boolean;
  data: WaitlistClass[];
}

interface WaitlistClass {
  id: string;
  class_id: string;
  class_schedule_id: string;
  class_name: string;
  class_name_ar: string;
  instructor_name: string;
  date: string;
  from_time: string;
  to_time: string;
  startDate: string;
}

interface GetBookingsResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  package_booking: PackageBooking[];
  message: string;
}

interface PackageBooking {
  id: string;
  transaction_id: string;
  package_name: string;
  package_name_ar: string;
  package_session: string;
  package_type: number;
  category_id: string;
  total_bookings: number;
  class_limit: number;
  package_start_date: string;
  package_end_date: string;
  booking_type: string;
  class_bookings: ClassBooking[];
}

interface ClassBooking {
  id: string;
  class_date: string;
  day: string;
  from_time: string;
  to_time: string;
  class_name: string;
  class_name_ar: string;
  seat_capacity: number;
  instructor_name: string;
}

interface ActivePackagesResponse {
  status: boolean;
  message: string;
  user_active_package_booking: ActivePackage[];
}

interface ActivePackage {
  id: string;
  package_name: string;
  package_session: string;
  total_bookings: number;
  class_limit: number;
  category_id: string;
}

// Request Data Types
interface CheckAvailabilityData {
  bookings: {
    class_id: number;
    class_schedule_id: number;
    class_date: string; // DD/MM/YYYY format
    dayNumber?: number; // 1=Sunday, 2=Monday, etc.
  }[];
  booking_type: 'individual' | 'book_all';
  transaction_id?: string; // For editing existing booking
  start_date?: string; // For book_all type
  end_date?: string; // For book_all type
}

interface CreateBookingData {
  bookings: {
    class_id: number;
    class_schedule_id: number;
    class_date: string; // DD/MM/YYYY format
    dayNumber?: number; // For book_all type
  }[];
  booking_type: 'individual' | 'book_all';
  package_id: string;
  category_id: string;
  session_id: string;
  start_date?: string; // For book_all type (DD/MM/YYYY)
  end_date?: string; // For book_all type (DD/MM/YYYY)
  send_reminder: boolean;
  joined_user_id?: string[]; // For semi-private classes
}

interface WaitlistData {
  class_id: number;
  class_schedule_id: number;
  startDate: string;
}

export const bookingApi = {
  // Check if booking is available (before creating)
  checkBookingAvailability: async (data: CheckAvailabilityData): Promise<{ status: boolean; message: string }> => {
    console.log('[API Request] POST /v1/user/checkBookingAvailability', data);
    const response = await api.post<BookingResponse>('/v1/user/checkBookingAvailability', data);
    console.log('[API Response]', response);
    return { status: response.status, message: response.message };
  },

  // Create new booking
  addBooking: async (data: CreateBookingData): Promise<BookingResponse> => {
    console.log('[API Request] POST /v1/user/addBooking', data);
    const response = await api.post<BookingResponse>('/v1/user/addBooking', data);
    console.log('[API Response]', response);
    return response;
  },

  // Get user's bookings
  getUserBookings: async (params?: { page?: number; limit?: number }): Promise<GetBookingsResponse> => {
    const response = await api.get<GetBookingsResponse>('/v1/user/getUserBookings', { params });
    return response;
  },

  // Get active packages (available for booking)
  getActivePackages: async (): Promise<ActivePackage[]> => {
    const response = await api.get<ActivePackagesResponse>('/v1/user/getActivePackages');
    return response.user_active_package_booking || [];
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ status: boolean; message: string }> => {
    const response = await api.delete<BookingResponse>(`/v1/user/cancelBooking/${bookingId}`);
    return { status: response.status, message: response.message };
  },

  // Reschedule booking
  rescheduleBooking: async (
    bookingId: string,
    data: { class_id: number; class_schedule_id: number; class_date: string }
  ): Promise<BookingResponse> => {
    const response = await api.patch<BookingResponse>(`/v1/user/rescheduleBooking/${bookingId}`, data);
    return response;
  },

  // Waitlist Management
  addToWaitlist: async (data: WaitlistData): Promise<Waitlist | null> => {
    console.log('[API Request] POST /v1/user/addToWaitlist', data);
    const response = await api.post<WaitlistResponse>('/v1/user/addToWaitlist', data);
    console.log('[API Response]', response);
    return response.data;
  },

  removeFromWaitlist: async (data: WaitlistData): Promise<boolean> => {
    console.log('[API Request] POST /v1/user/removeFromWaitlist', data);
    const response = await api.post<WaitlistResponse>('/v1/user/removeFromWaitlist', data);
    console.log('[API Response]', response);
    return response.status;
  },

  getMyWaitlist: async (): Promise<WaitlistClass[]> => {
    const response = await api.get<MyWaitlistResponse>('/v1/user/getMyWaitlist');
    return response.data || [];
  },
};

