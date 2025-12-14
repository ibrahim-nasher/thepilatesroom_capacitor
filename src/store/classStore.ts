import { create } from 'zustand';

export interface ClassSchedule {
  id: string;
  classId: string;
  className: string;
  categoryId: string;
  categoryName: string;
  instructorName: string;
  date: string; // ISO date
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // minutes
  capacity: number;
  bookedCount: number;
  availableSlots: number;
  status: 'available' | 'full' | 'cancelled';
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface ClassCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  color: string;
  classCount: number;
}

interface ClassState {
  categories: ClassCategory[];
  schedules: ClassSchedule[];
  selectedCategory: string | null;
  selectedDate: Date;
  isLoading: boolean;
  
  // Actions
  setCategories: (categories: ClassCategory[]) => void;
  setSchedules: (schedules: ClassSchedule[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedDate: (date: Date) => void;
  getSchedulesByDate: (date: Date) => ClassSchedule[];
  getSchedulesByCategory: (categoryId: string) => ClassSchedule[];
  getScheduleById: (scheduleId: string) => ClassSchedule | undefined;
  clearSchedules: () => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
  categories: [],
  schedules: [],
  selectedCategory: null,
  selectedDate: new Date(),
  isLoading: false,

  setCategories: (categories) => {
    set({ categories });
  },

  setSchedules: (schedules) => {
    set({ schedules });
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  getSchedulesByDate: (date) => {
    const schedules = get().schedules;
    const targetDate = date.toISOString().split('T')[0];
    return schedules.filter(schedule => 
      schedule.date.split('T')[0] === targetDate
    );
  },

  getSchedulesByCategory: (categoryId) => {
    const schedules = get().schedules;
    return schedules.filter(schedule => schedule.categoryId === categoryId);
  },

  getScheduleById: (scheduleId) => {
    const schedules = get().schedules;
    return schedules.find(schedule => schedule.id === scheduleId);
  },

  clearSchedules: () => {
    set({ schedules: [], selectedCategory: null });
  },
}));
