import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  language: 'en' | 'ar';
  notificationsEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  setToken: (token) => {
    set({ token });
  },

  login: async (user, token) => {
    try {
      // Store token and user data in Capacitor Preferences
      await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
      await Preferences.set({ key: USER_DATA_KEY, value: JSON.stringify(user) });
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear stored data
      await Preferences.remove({ key: AUTH_TOKEN_KEY });
      await Preferences.remove({ key: USER_DATA_KEY });
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  },

  updateUser: async (userData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userData };
    
    try {
      await Preferences.set({ key: USER_DATA_KEY, value: JSON.stringify(updatedUser) });
      set({ user: updatedUser });
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  },

  loadStoredAuth: async () => {
    try {
      const [tokenResult, userResult] = await Promise.all([
        Preferences.get({ key: AUTH_TOKEN_KEY }),
        Preferences.get({ key: USER_DATA_KEY }),
      ]);

      if (tokenResult.value && userResult.value) {
        const user = JSON.parse(userResult.value) as User;
        set({
          user,
          token: tokenResult.value,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      set({ isLoading: false });
    }
  },
}));
