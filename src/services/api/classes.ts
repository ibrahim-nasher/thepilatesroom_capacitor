import { api } from './client';

// API Response Types
interface ClassScheduleResponse {
  status: boolean;
  class_schedule: ClassSchedule[];
  total: number;
  totalPages: number;
  currentPage: number;
  message: string;
}

interface CategoryResponse {
  status: boolean;
  categories: Category[];
  message: string;
}

// Data Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  class_name: string;
  category_id: string;
  category_name: string;
  date: string;
  time: string;
  duration: number; // in minutes
  instructor_id: string;
  instructor_name: string;
  instructor_image?: string;
  type: 'group' | 'private';
  capacity: number;
  booked_count: number;
  spots_remaining: number;
  is_waitlist: boolean;
  status: 'active' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

// API Query Parameters
interface GetClassesParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: 'group' | 'private';
  category_id?: string;
  session_id?: string;
  from_date?: string; // YYYY-MM-DD
  to_date?: string; // YYYY-MM-DD
  v2?: boolean;
}

export const classApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<CategoryResponse>('/v1/category/');
    return response.categories || [];
  },
  
  // Get category by ID
  getCategoryById: async (categoryId: string): Promise<Category | null> => {
    const response = await api.get<{ status: boolean; category: Category; message: string }>(`/v1/category/${categoryId}`);
    return response.category || null;
  },
  
  // Get class schedules with filters
  getClasses: async (params?: GetClassesParams): Promise<ClassScheduleResponse> => {
    return api.get<ClassScheduleResponse>('/v1/classes/', { params });
  },
  
  // Get class schedule by ID
  getClassById: async (classId: string): Promise<ClassSchedule | null> => {
    const response = await api.get<{ status: boolean; classDetail: ClassSchedule; message: string }>(`/v1/classes/${classId}`);
    return response.classDetail || null;
  },
  
  // Get schedules for a specific date range
  getSchedulesByDateRange: async (from_date: string, to_date: string): Promise<ClassSchedule[]> => {
    const response = await api.get<ClassScheduleResponse>('/v1/classes/', {
      params: { 
        type: 'individual',
        v2: true,
        from_date, 
        to_date 
      },
    });
    return response.class_schedule || [];
  },
  
  // Get schedules for a specific category
  getSchedulesByCategory: async (category_id: string, from_date?: string, to_date?: string): Promise<ClassSchedule[]> => {
    const response = await api.get<ClassScheduleResponse>('/v1/classes/', {
      params: { 
        type: 'individual',
        v2: true,
        category_id, 
        from_date, 
        to_date 
      },
    });
    return response.class_schedule || [];
  },

  // Get schedules by date (matching native app pattern)
  getSchedulesByDate: async (date: string, category_id?: string): Promise<ClassSchedule[]> => {
    const params: any = {
      type: 'individual',
      v2: true,
      from_date: date,
      to_date: date,
    };

    if (category_id) {
      params.category_id = category_id;
    }

    console.log('[API Request] GET /v1/classes/', params);
    
    const response = await api.get<ClassScheduleResponse>('/v1/classes/', { params });
    
    console.log('[API Response]', {
      status: response.status,
      totalClasses: response.class_schedule?.length || 0,
      classes: response.class_schedule
    });
    
    return response.class_schedule || [];
  },
};
