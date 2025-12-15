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
  isGuest?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
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
  isGuest: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),

  login: async (user, token) => {
    try {
      await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
      await Preferences.set({ key: USER_DATA_KEY, value: JSON.stringify(user) });
      set({ user, token, isAuthenticated: true, isGuest: false, isLoading: false });
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  },

  loginAsGuest: async () => {
    const guestUser: User = {
      id: 'guest',
      email: '',
      firstName: 'Guest',
      lastName: 'User',
      phone: '',
      language: 'en',
      notificationsEnabled: false,
      isGuest: true,
    };
    try {
      await Preferences.set({ key: 'is_guest', value: 'true' });
      await Preferences.set({ key: USER_DATA_KEY, value: JSON.stringify(guestUser) });
      set({ user: guestUser, token: null, isAuthenticated: false, isGuest: true, isLoading: false });
    } catch (error) {
      console.error('Failed to set guest mode:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await Preferences.remove({ key: AUTH_TOKEN_KEY });
      await Preferences.remove({ key: USER_DATA_KEY });
      await Preferences.remove({ key: 'is_guest' });
      await get().loginAsGuest();
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
      const [tokenResult, userResult, isGuestResult] = await Promise.all([
        Preferences.get({ key: AUTH_TOKEN_KEY }),
        Preferences.get({ key: USER_DATA_KEY }),
        Preferences.get({ key: 'is_guest' }),
      ]);

      if (tokenResult.value && userResult.value) {
        const user = JSON.parse(userResult.value) as User;
        set({ user, token: tokenResult.value, isAuthenticated: true, isGuest: false, isLoading: false });
      } else if (isGuestResult.value === 'true' && userResult.value) {
        const user = JSON.parse(userResult.value) as User;
        set({ user, token: null, isAuthenticated: false, isGuest: true, isLoading: false });
      } else {
        await get().loginAsGuest();
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      await get().loginAsGuest();
    }
  },
}));
