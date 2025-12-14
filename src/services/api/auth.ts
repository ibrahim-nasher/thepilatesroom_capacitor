import { api } from './client';
import type { User } from '@store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  language?: 'en' | 'ar';
}

interface AuthResponse {
  user: User;
  token: string;
}

interface VerifyOtpData {
  phone: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export const authApi = {
  // Login with email and password
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  // Register new user
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/auth/register', data),
  
  // Request OTP for phone verification
  requestOtp: (phone: string) =>
    api.post<{ success: boolean }>('/auth/request-otp', { phone }),
  
  // Verify OTP
  verifyOtp: (data: VerifyOtpData) =>
    api.post<AuthResponse>('/auth/verify-otp', data),
  
  // Request password reset
  requestPasswordReset: (email: string) =>
    api.post<{ success: boolean }>('/auth/forgot-password', { email }),
  
  // Reset password with OTP
  resetPassword: (data: ResetPasswordData) =>
    api.post<{ success: boolean }>('/auth/reset-password', data),
  
  // Refresh auth token
  refreshToken: (refreshToken: string) =>
    api.post<{ token: string }>('/auth/refresh', { refreshToken }),
  
  // Logout
  logout: () =>
    api.post<{ success: boolean }>('/auth/logout'),
};
