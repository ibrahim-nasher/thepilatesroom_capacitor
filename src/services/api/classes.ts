import { api } from './client';
import type { ClassSchedule, ClassCategory } from '@store';

interface GetSchedulesParams {
  date?: string; // ISO date
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export const classApi = {
  // Get all categories
  getCategories: () =>
    api.get<ClassCategory[]>('/classes/categories'),
  
  // Get category by ID
  getCategoryById: (categoryId: string) =>
    api.get<ClassCategory>(`/classes/categories/${categoryId}`),
  
  // Get class schedules
  getSchedules: (params?: GetSchedulesParams) =>
    api.get<ClassSchedule[]>('/classes/schedules', { params }),
  
  // Get schedule by ID
  getScheduleById: (scheduleId: string) =>
    api.get<ClassSchedule>(`/classes/schedules/${scheduleId}`),
  
  // Get schedules for a specific date range
  getSchedulesByDateRange: (startDate: string, endDate: string) =>
    api.get<ClassSchedule[]>('/classes/schedules', {
      params: { startDate, endDate },
    }),
  
  // Get schedules for a specific category
  getSchedulesByCategory: (categoryId: string) =>
    api.get<ClassSchedule[]>('/classes/schedules', {
      params: { categoryId },
    }),
};
