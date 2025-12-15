import type { ClassSchedule, Category } from './classes';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Reformer Pilates',
    description: 'Full body workout using the reformer machine',
    image_url: 'https://via.placeholder.com/300x200?text=Reformer',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mat Pilates',
    description: 'Classic mat-based pilates exercises',
    image_url: 'https://via.placeholder.com/300x200?text=Mat',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Barre',
    description: 'Ballet-inspired workout',
    image_url: 'https://via.placeholder.com/300x200?text=Barre',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Generate mock classes for a date range
export const generateMockClasses = (fromDate: string, toDate?: string): ClassSchedule[] => {
  const classes: ClassSchedule[] = [];
  const startDate = new Date(fromDate);
  const endDate = toDate ? new Date(toDate) : new Date(fromDate);
  
  // Instructors
  const instructors = [
    { id: '1', name: 'Sarah Johnson', image: 'https://via.placeholder.com/100?text=SJ' },
    { id: '2', name: 'Emma Williams', image: 'https://via.placeholder.com/100?text=EW' },
    { id: '3', name: 'Lisa Brown', image: 'https://via.placeholder.com/100?text=LB' },
    { id: '4', name: 'Maria Garcia', image: 'https://via.placeholder.com/100?text=MG' },
  ];

  // Time slots
  const timeSlots = [
    '06:00:00', '07:30:00', '09:00:00', '10:30:00',
    '12:00:00', '13:30:00', '15:00:00', '16:30:00',
    '18:00:00', '19:30:00'
  ];

  // Generate classes for each day
  let currentDate = new Date(startDate);
  let classIdCounter = 1;
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Generate 6-8 classes per day
    const numClasses = Math.floor(Math.random() * 3) + 6;
    const selectedSlots = timeSlots.slice(0, numClasses);
    
    selectedSlots.forEach((time, index) => {
      const instructor = instructors[Math.floor(Math.random() * instructors.length)];
      const category = mockCategories[Math.floor(Math.random() * mockCategories.length)];
      const isGroup = Math.random() > 0.3; // 70% group, 30% private
      const capacity = isGroup ? 12 : 2;
      const bookedCount = Math.floor(Math.random() * (capacity + 2)); // Can be overbooked
      const spotsRemaining = Math.max(0, capacity - bookedCount);
      const isWaitlist = spotsRemaining === 0;
      
      classes.push({
        id: `${classIdCounter}`,
        class_id: `${(index % 5) + 1}`,
        class_name: `${category.name} - ${isGroup ? 'Group' : 'Private'}`,
        category_id: category.id,
        category_name: category.name,
        date: dateStr,
        time: time,
        duration: isGroup ? 60 : 45,
        instructor_id: instructor.id,
        instructor_name: instructor.name,
        instructor_image: instructor.image,
        type: isGroup ? 'group' : 'private',
        capacity: capacity,
        booked_count: bookedCount,
        spots_remaining: spotsRemaining,
        is_waitlist: isWaitlist,
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
      
      classIdCounter++;
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return classes;
};

// Mock active packages
export const mockActivePackages = [
  {
    id: '1',
    package_name: '10 Class Package',
    package_session: '1 Month',
    total_bookings: 3,
    class_limit: 10,
    category_id: '[1,2,3]',
  },
  {
    id: '2',
    package_name: 'Unlimited Monthly',
    package_session: '1 Month',
    total_bookings: 15,
    class_limit: 999,
    category_id: '[1,2,3]',
  },
];

// Mock waitlist classes
export const mockWaitlistClasses = [
  {
    id: '1',
    class_id: '1',
    class_schedule_id: '5',
    class_name: 'Reformer Pilates - Group',
    class_name_ar: 'بيلاتس ريفورمر - جماعي',
    instructor_name: 'Sarah Johnson',
    date: new Date().toISOString().split('T')[0],
    from_time: '09:00:00',
    to_time: '10:00:00',
    startDate: new Date().toISOString().split('T')[0],
  },
];

// Mock bookings
export const mockBookings = {
  total: 5,
  totalPages: 1,
  currentPage: 1,
  package_booking: [
    {
      id: '1',
      transaction_id: 'TXN001',
      package_name: '10 Class Package',
      package_name_ar: 'حزمة 10 حصص',
      package_session: '1 Month',
      package_type: 1,
      category_id: '[1,2]',
      total_bookings: 3,
      class_limit: 10,
      package_start_date: '01/12/2024',
      package_end_date: '31/12/2024',
      booking_type: 'individual',
      class_bookings: [
        {
          id: '1',
          class_date: '16/12/2024',
          day: 'Monday',
          from_time: '09:00:00',
          to_time: '10:00:00',
          class_name: 'Reformer Pilates',
          class_name_ar: 'بيلاتس ريفورمر',
          seat_capacity: 12,
          instructor_name: 'Sarah Johnson',
        },
      ],
    },
  ],
  message: 'success',
};

// Check if mock mode is enabled
export const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true';
};

// Mock delay to simulate network request
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Log mock mode status
if (isMockMode()) {
  console.log('%c🔧 MOCK MODE ENABLED', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('Using mock data instead of real API. Set VITE_USE_MOCK_DATA=false to use real API.');
}
