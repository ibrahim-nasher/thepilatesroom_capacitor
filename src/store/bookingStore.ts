import { create } from 'zustand';
import type { ClassSchedule } from './classStore';

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  classSchedule: ClassSchedule;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  packageId?: string; // If booked using a package
  transactionId?: string; // If paid separately
  creditUsed: boolean;
  cancellationDate?: string;
  cancellationReason?: string;
}

export interface BookingFilters {
  status?: Booking['status'];
  startDate?: string;
  endDate?: string;
}

interface BookingState {
  bookings: Booking[];
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  isLoading: boolean;
  
  // Actions
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string, reason: string) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
  filterBookings: (filters: BookingFilters) => Booking[];
  clearBookings: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  upcomingBookings: [],
  pastBookings: [],
  isLoading: false,

  setBookings: (bookings) => {
    const now = new Date();
    const upcoming = bookings.filter(b => 
      new Date(b.classSchedule.date) >= now && 
      b.status === 'confirmed'
    ).sort((a, b) => 
      new Date(a.classSchedule.date).getTime() - new Date(b.classSchedule.date).getTime()
    );
    
    const past = bookings.filter(b => 
      new Date(b.classSchedule.date) < now || 
      ['cancelled', 'completed', 'no-show'].includes(b.status)
    ).sort((a, b) => 
      new Date(b.classSchedule.date).getTime() - new Date(a.classSchedule.date).getTime()
    );
    
    set({ bookings, upcomingBookings: upcoming, pastBookings: past });
  },

  addBooking: (booking) => {
    set(state => {
      const newBookings = [...state.bookings, booking];
      const now = new Date();
      
      const upcoming = newBookings.filter(b => 
        new Date(b.classSchedule.date) >= now && 
        b.status === 'confirmed'
      ).sort((a, b) => 
        new Date(a.classSchedule.date).getTime() - new Date(b.classSchedule.date).getTime()
      );
      
      const past = newBookings.filter(b => 
        new Date(b.classSchedule.date) < now || 
        ['cancelled', 'completed', 'no-show'].includes(b.status)
      ).sort((a, b) => 
        new Date(b.classSchedule.date).getTime() - new Date(a.classSchedule.date).getTime()
      );
      
      return { bookings: newBookings, upcomingBookings: upcoming, pastBookings: past };
    });
  },

  updateBooking: (bookingId, updates) => {
    set(state => {
      const newBookings = state.bookings.map(b =>
        b.id === bookingId ? { ...b, ...updates } : b
      );
      
      const now = new Date();
      const upcoming = newBookings.filter(b => 
        new Date(b.classSchedule.date) >= now && 
        b.status === 'confirmed'
      ).sort((a, b) => 
        new Date(a.classSchedule.date).getTime() - new Date(b.classSchedule.date).getTime()
      );
      
      const past = newBookings.filter(b => 
        new Date(b.classSchedule.date) < now || 
        ['cancelled', 'completed', 'no-show'].includes(b.status)
      ).sort((a, b) => 
        new Date(b.classSchedule.date).getTime() - new Date(a.classSchedule.date).getTime()
      );
      
      return { bookings: newBookings, upcomingBookings: upcoming, pastBookings: past };
    });
  },

  cancelBooking: (bookingId, reason) => {
    get().updateBooking(bookingId, {
      status: 'cancelled',
      cancellationDate: new Date().toISOString(),
      cancellationReason: reason,
    });
  },

  getBookingById: (bookingId) => {
    return get().bookings.find(b => b.id === bookingId);
  },

  getUpcomingBookings: () => {
    return get().upcomingBookings;
  },

  getPastBookings: () => {
    return get().pastBookings;
  },

  filterBookings: (filters) => {
    let filtered = get().bookings;
    
    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(b => 
        new Date(b.classSchedule.date) >= new Date(filters.startDate!)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(b => 
        new Date(b.classSchedule.date) <= new Date(filters.endDate!)
      );
    }
    
    return filtered;
  },

  clearBookings: () => {
    set({ bookings: [], upcomingBookings: [], pastBookings: [] });
  },
}));
