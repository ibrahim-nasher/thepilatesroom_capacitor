import { api } from './client';
import type { User } from '@store';

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  language?: 'en' | 'ar';
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdateNotificationSettings {
  notificationsEnabled: boolean;
}

export const userApi = {
  // Get current user profile
  getProfile: () =>
    api.get<User>('/user/profile'),
  
  // Update user profile
  updateProfile: (data: UpdateProfileData) =>
    api.put<User>('/user/profile', data),
  
  // Upload profile image
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>('/user/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Delete profile image
  deleteProfileImage: () =>
    api.delete<{ success: boolean }>('/user/profile/image'),
  
  // Change password
  changePassword: (data: ChangePasswordData) =>
    api.post<{ success: boolean }>('/user/change-password', data),
  
  // Update notification settings
  updateNotificationSettings: (data: UpdateNotificationSettings) =>
    api.put<User>('/user/notifications', data),
  
  // Delete account
  deleteAccount: () =>
    api.delete<{ success: boolean }>('/user/account'),
};
