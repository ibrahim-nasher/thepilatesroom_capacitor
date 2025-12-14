# Migration Plan: Native to Capacitor

## Overview

This document provides a comprehensive step-by-step plan to migrate ThePilatesRoom from native Android (Kotlin) and iOS (Swift) applications to a single Capacitor-based cross-platform application.

### Target Technology Stack
- **Framework:** Capacitor 5.x
- **Platforms:** Android & iOS
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** SCSS (no CSS frameworks)
- **State Management:** Zustand or React Context
- **Routing:** React Router v6

### Estimated Timeline
- **Total Duration:** 10-12 weeks
- **Team Size:** 2-3 developers

---

## Phase 1: Project Setup (Week 1)

### 1.1 Initialize Project

```bash
# Create project directory
mkdir thepilatesroom-capacitor
cd thepilatesroom-capacitor

# Initialize npm project
npm init -y

# Install Capacitor core
npm install @capacitor/core @capacitor/cli

# Install React and TypeScript
npm install react react-dom
npm install -D typescript @types/react @types/react-dom

# Initialize Capacitor
npx cap init "ThePilatesRoom" "com.pilates.room"

# Add platforms
npx cap add android
npx cap add ios
```

### 1.2 Configure Build Tooling

Using Vite for fast development:

```bash
npm install -D vite @vitejs/plugin-react
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@styles/_variables.scss"; @import "@styles/_mixins.scss";`,
      },
    },
  },
});
```

### 1.3 Configure TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@services/*": ["src/services/*"],
      "@store/*": ["src/store/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["src/assets/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.4 Project Structure

```
src/
├── assets/
│   ├── fonts/
│   │   ├── Montserrat-Regular.ttf
│   │   ├── Montserrat-Medium.ttf
│   │   ├── Montserrat-SemiBold.ttf
│   │   └── Montserrat-Bold.ttf
│   ├── images/
│   │   ├── logo.png
│   │   ├── onboarding/
│   │   └── placeholders/
│   └── icons/
│       └── (SVG icons)
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.scss
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── LoadingSpinner/
│   │   ├── Modal/
│   │   ├── Avatar/
│   │   └── Card/
│   ├── layout/
│   │   ├── TabBar/
│   │   ├── Header/
│   │   ├── SafeArea/
│   │   └── PageContainer/
│   └── features/
│       ├── Calendar/
│       │   ├── HorizontalCalendar.tsx
│       │   ├── HorizontalCalendar.scss
│       │   └── index.ts
│       ├── CountryPicker/
│       ├── OTPInput/
│       ├── PaymentCard/
│       ├── ClassCard/
│       ├── PackageCard/
│       └── CategoryCard/
├── pages/
│   ├── Auth/
│   │   ├── Login/
│   │   ├── OTPVerify/
│   │   ├── SignUp/
│   │   └── Onboarding/
│   ├── Home/
│   │   ├── Home.tsx
│   │   ├── Home.scss
│   │   ├── components/
│   │   │   ├── CategoryList/
│   │   │   ├── ClassTimeSlots/
│   │   │   └── BookingBar/
│   │   └── index.ts
│   ├── Classes/
│   │   ├── ClassList/
│   │   ├── ClassDetail/
│   │   ├── FreezeClass/
│   │   └── RescheduleClass/
│   ├── Packages/
│   │   ├── PackageList/
│   │   └── PackageDetail/
│   ├── Payment/
│   │   ├── PaymentSummary/
│   │   └── PaymentGateway/
│   ├── Profile/
│   │   ├── Profile/
│   │   ├── EditProfile/
│   │   ├── ActivePackages/
│   │   ├── ChangeLanguage/
│   │   └── Policies/
│   └── Notifications/
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── classes.api.ts
│   │   ├── packages.api.ts
│   │   ├── bookings.api.ts
│   │   └── notifications.api.ts
│   ├── auth/
│   │   ├── firebaseAuth.ts
│   │   └── tokenManager.ts
│   ├── payment/
│   │   └── hyperPayService.ts
│   ├── storage/
│   │   ├── secureStorage.ts
│   │   └── preferences.ts
│   └── notifications/
│       └── pushService.ts
├── store/
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── classesStore.ts
│   ├── packagesStore.ts
│   ├── bookingStore.ts
│   └── notificationStore.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useStorage.ts
│   ├── useNotifications.ts
│   └── useLanguage.ts
├── utils/
│   ├── constants.ts
│   ├── validation.ts
│   ├── dateUtils.ts
│   ├── formatters.ts
│   └── helpers.ts
├── types/
│   ├── user.types.ts
│   ├── class.types.ts
│   ├── package.types.ts
│   ├── booking.types.ts
│   ├── payment.types.ts
│   └── api.types.ts
├── i18n/
│   ├── index.ts
│   ├── en.json
│   └── ar.json
├── styles/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _reset.scss
│   ├── _typography.scss
│   ├── _utilities.scss
│   └── global.scss
├── App.tsx
├── Router.tsx
├── main.tsx
└── index.html
```

---

## Phase 2: Core Infrastructure (Week 2)

### 2.1 SCSS Design System

**src/styles/_variables.scss:**
```scss
// Colors
$color-primary: #4CAF50;
$color-primary-dark: #2E7D32;
$color-primary-light: #E8F5E9;
$color-secondary: #FFC107;
$color-background: #F5F5F5;
$color-surface: #FFFFFF;
$color-text-primary: #333333;
$color-text-secondary: #666666;
$color-text-disabled: #999999;
$color-border: #E0E0E0;
$color-error: #F44336;
$color-success: #4CAF50;

// Typography
$font-family-primary: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
$font-size-xs: 10px;
$font-size-sm: 12px;
$font-size-md: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
$font-size-3xl: 32px;

$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Spacing
$spacing-xxs: 2px;
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;

// Shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

// Z-index layers
$z-dropdown: 100;
$z-modal: 200;
$z-toast: 300;
$z-tooltip: 400;

// Breakpoints (for reference, mainly native mobile)
$breakpoint-sm: 375px;
$breakpoint-md: 414px;
$breakpoint-lg: 428px;

// Safe areas
$safe-area-top: env(safe-area-inset-top);
$safe-area-bottom: env(safe-area-inset-bottom);
$safe-area-left: env(safe-area-inset-left);
$safe-area-right: env(safe-area-inset-right);

// Tab bar
$tab-bar-height: 60px;
```

**src/styles/_mixins.scss:**
```scss
// Flexbox helpers
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// Typography
@mixin heading-1 {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  line-height: 1.2;
}

@mixin heading-2 {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  line-height: 1.3;
}

@mixin heading-3 {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  line-height: 1.4;
}

@mixin body-text {
  font-size: $font-size-base;
  font-weight: $font-weight-regular;
  line-height: 1.5;
}

@mixin caption {
  font-size: $font-size-sm;
  font-weight: $font-weight-regular;
  line-height: 1.4;
}

// Button base
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-md;
  font-family: $font-family-primary;
  font-weight: $font-weight-semibold;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Card style
@mixin card {
  background: $color-surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  padding: $spacing-md;
}

// Input base
@mixin input-base {
  width: 100%;
  padding: $spacing-md;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-family: $font-family-primary;
  font-size: $font-size-base;
  background: $color-surface;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: $color-primary;
  }
  
  &::placeholder {
    color: $color-text-disabled;
  }
}

// Safe area padding
@mixin safe-area-top {
  padding-top: max($spacing-md, $safe-area-top);
}

@mixin safe-area-bottom {
  padding-bottom: max($spacing-md, $safe-area-bottom);
}

// RTL support
@mixin rtl {
  [dir="rtl"] & {
    @content;
  }
}

// Truncate text
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// Hide scrollbar but allow scrolling
@mixin hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 2.2 State Management with Zustand

```bash
npm install zustand
```

**src/store/authStore.ts:**
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  profileImage?: string;
  gender?: 'male' | 'female';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Custom storage adapter for Capacitor
const capacitorStorage = {
  getItem: async (name: string) => {
    const { value } = await Preferences.get({ key: name });
    return value;
  },
  setItem: async (name: string, value: string) => {
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string) => {
    await Preferences.remove({ key: name });
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => capacitorStorage),
    }
  )
);
```

### 2.3 API Client Setup

```bash
npm install axios
```

**src/services/api/client.ts:**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@store/authStore';

const BASE_URL = 'https://dev.the-pilatesroom.com/prod/api/v1/';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - try to refresh or logout
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper functions
export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<T>(url, config).then((res) => res.data);

export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiClient.post<T>(url, data, config).then((res) => res.data);

export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiClient.put<T>(url, data, config).then((res) => res.data);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<T>(url, config).then((res) => res.data);
```

### 2.4 Localization Setup

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

**src/i18n/index.ts:**
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (lang: 'en' | 'ar') => {
  i18n.changeLanguage(lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export default i18n;
```

---

## Phase 3: Native Plugins Integration (Week 3)

### 3.1 Install Required Plugins

```bash
# Core plugins
npm install @capacitor/app
npm install @capacitor/preferences
npm install @capacitor/camera
npm install @capacitor/network
npm install @capacitor/device
npm install @capacitor/haptics
npm install @capacitor/push-notifications
npm install @capacitor/screen-orientation

# Firebase plugins
npm install @capacitor-firebase/authentication
npm install @capacitor-firebase/messaging
npm install @capacitor-firebase/crashlytics
npm install firebase

# Secure storage
npm install capacitor-secure-storage-plugin
```

### 3.2 Firebase Authentication Service

**src/services/auth/firebaseAuth.ts:**
```typescript
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  PhoneAuthProvider, 
  signInWithCredential,
  signOut 
} from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const sendOTP = async (phoneNumber: string): Promise<string> => {
  const { verificationId } = await FirebaseAuthentication.signInWithPhoneNumber({
    phoneNumber,
  });
  return verificationId!;
};

export const verifyOTP = async (
  verificationId: string, 
  verificationCode: string
): Promise<string> => {
  const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
  const result = await signInWithCredential(auth, credential);
  const token = await result.user.getIdToken();
  return token;
};

export const refreshToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return await currentUser.getIdToken(true);
  }
  return null;
};

export const firebaseSignOut = async (): Promise<void> => {
  await FirebaseAuthentication.signOut();
  await signOut(auth);
};
```

### 3.3 Push Notifications Service

**src/services/notifications/pushService.ts:**
```typescript
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export interface PushNotificationHandler {
  onRegistration: (token: string) => void;
  onNotificationReceived: (notification: PushNotificationSchema) => void;
  onNotificationTapped: (notification: PushNotificationSchema) => void;
}

export const initializePushNotifications = async (
  handlers: PushNotificationHandler
): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications not available on web');
    return;
  }

  // Request permission
  const permission = await PushNotifications.requestPermissions();
  
  if (permission.receive !== 'granted') {
    console.log('Push notification permission not granted');
    return;
  }

  // Register for push notifications
  await PushNotifications.register();

  // Handle registration
  PushNotifications.addListener('registration', (token: Token) => {
    handlers.onRegistration(token.value);
  });

  // Handle registration errors
  PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration error:', error);
  });

  // Handle notification received (foreground)
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    handlers.onNotificationReceived(notification);
  });

  // Handle notification tapped
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    handlers.onNotificationTapped(action.notification);
  });
};

export const getDeliveredNotifications = async () => {
  const { notifications } = await PushNotifications.getDeliveredNotifications();
  return notifications;
};

export const removeAllDeliveredNotifications = async () => {
  await PushNotifications.removeAllDeliveredNotifications();
};
```

### 3.4 Camera Service

**src/services/media/cameraService.ts:**
```typescript
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

export interface ImageResult {
  base64: string;
  format: string;
  path?: string;
}

export const capturePhoto = async (): Promise<ImageResult | null> => {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    return {
      base64: image.base64String!,
      format: image.format,
    };
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
};

export const selectFromGallery = async (): Promise<ImageResult | null> => {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });

    return {
      base64: image.base64String!,
      format: image.format,
    };
  } catch (error) {
    console.error('Gallery error:', error);
    return null;
  }
};

export const selectImage = async (): Promise<ImageResult | null> => {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt, // Shows camera/gallery choice
    });

    return {
      base64: image.base64String!,
      format: image.format,
    };
  } catch (error) {
    console.error('Image selection error:', error);
    return null;
  }
};
```

---

## Phase 4: UI Components Development (Weeks 4-5)

### 4.1 Common Components

#### Button Component

**src/components/common/Button/Button.tsx:**
```tsx
import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
}) => {
  const handleClick = async () => {
    if (disabled || loading) return;
    
    // Haptic feedback
    await Haptics.impact({ style: ImpactStyle.Light });
    
    onClick?.();
  };

  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <span className="btn__loader" />
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          <span className="btn__text">{children}</span>
        </>
      )}
    </button>
  );
};
```

**src/components/common/Button/Button.scss:**
```scss
.btn {
  @include button-base;
  gap: $spacing-sm;
  
  // Variants
  &--primary {
    background: $color-primary;
    color: white;
    
    &:active:not(:disabled) {
      background: $color-primary-dark;
    }
  }
  
  &--secondary {
    background: $color-primary-light;
    color: $color-primary;
    
    &:active:not(:disabled) {
      background: darken($color-primary-light, 5%);
    }
  }
  
  &--outline {
    background: transparent;
    border: 2px solid $color-primary;
    color: $color-primary;
    
    &:active:not(:disabled) {
      background: $color-primary-light;
    }
  }
  
  &--text {
    background: transparent;
    color: $color-primary;
    padding: $spacing-sm;
    
    &:active:not(:disabled) {
      opacity: 0.7;
    }
  }
  
  // Sizes
  &--small {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
  }
  
  &--medium {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-base;
  }
  
  &--large {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
  }
  
  // Full width
  &--full {
    width: 100%;
  }
  
  // Loader
  &__loader {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  &__icon {
    display: flex;
    align-items: center;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### 4.2 Layout Components

#### Tab Bar

**src/components/layout/TabBar/TabBar.tsx:**
```tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { 
  HomeIcon, 
  CalendarIcon, 
  PackageIcon, 
  UserIcon 
} from '@/components/icons';
import './TabBar.scss';

interface Tab {
  path: string;
  icon: React.FC<{ active: boolean }>;
  labelKey: string;
}

const tabs: Tab[] = [
  { path: '/home', icon: HomeIcon, labelKey: 'tabs.home' },
  { path: '/classes', icon: CalendarIcon, labelKey: 'tabs.classes' },
  { path: '/packages', icon: PackageIcon, labelKey: 'tabs.packages' },
  { path: '/profile', icon: UserIcon, labelKey: 'tabs.profile' },
];

export const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTabClick = async (path: string) => {
    if (location.pathname !== path) {
      await Haptics.impact({ style: ImpactStyle.Light });
      navigate(path);
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.path}
            className={`tab-bar__item ${active ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <Icon active={active} />
            <span className="tab-bar__label">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};
```

**src/components/layout/TabBar/TabBar.scss:**
```scss
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: $color-surface;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding-bottom: $safe-area-bottom;
  z-index: $z-dropdown;
  
  &__item {
    flex: 1;
    @include flex-center;
    flex-direction: column;
    padding: $spacing-sm $spacing-xs;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    gap: $spacing-xxs;
    
    svg {
      width: 24px;
      height: 24px;
      color: $color-text-secondary;
      transition: color 0.2s ease;
    }
    
    &.active {
      svg {
        color: $color-primary;
      }
      
      .tab-bar__label {
        color: $color-primary;
      }
    }
  }
  
  &__label {
    @include caption;
    color: $color-text-secondary;
    transition: color 0.2s ease;
  }
}
```

### 4.3 Feature Components

#### Horizontal Calendar

**src/components/features/Calendar/HorizontalCalendar.tsx:**
```tsx
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import './HorizontalCalendar.scss';

interface HorizontalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  daysToShow?: number;
}

export const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  selectedDate,
  onDateSelect,
  daysToShow = 30,
}) => {
  const { i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Date[]>([]);
  
  const locale = i18n.language === 'ar' ? ar : enUS;

  useEffect(() => {
    const today = startOfDay(new Date());
    const daysArray = Array.from({ length: daysToShow }, (_, i) => addDays(today, i));
    setDays(daysArray);
  }, [daysToShow]);

  useEffect(() => {
    // Scroll to selected date
    const selectedIndex = days.findIndex((day) => isSameDay(day, selectedDate));
    if (selectedIndex > -1 && scrollRef.current) {
      const itemWidth = 60 + 8; // width + gap
      scrollRef.current.scrollTo({
        left: selectedIndex * itemWidth - 100,
        behavior: 'smooth',
      });
    }
  }, [selectedDate, days]);

  return (
    <div className="horizontal-calendar">
      <div className="horizontal-calendar__header">
        <span className="horizontal-calendar__month">
          {format(selectedDate, 'MMMM yyyy', { locale })}
        </span>
      </div>
      <div className="horizontal-calendar__scroll" ref={scrollRef}>
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toISOString()}
              className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              <span className="calendar-day__name">
                {format(day, 'EEE', { locale })}
              </span>
              <span className="calendar-day__number">
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
```

**src/components/features/Calendar/HorizontalCalendar.scss:**
```scss
.horizontal-calendar {
  &__header {
    padding: $spacing-md $spacing-md $spacing-sm;
  }
  
  &__month {
    @include heading-3;
    color: $color-text-primary;
    text-transform: capitalize;
  }
  
  &__scroll {
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    overflow-x: auto;
    @include hide-scrollbar;
    scroll-snap-type: x mandatory;
  }
}

.calendar-day {
  @include flex-center;
  flex-direction: column;
  min-width: 60px;
  height: 70px;
  padding: $spacing-sm;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  cursor: pointer;
  scroll-snap-align: center;
  transition: all 0.2s ease;
  gap: $spacing-xs;
  
  &__name {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    text-transform: uppercase;
  }
  
  &__number {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
  
  &.today {
    border-color: $color-primary;
    
    .calendar-day__name {
      color: $color-primary;
    }
  }
  
  &.selected {
    background: $color-primary;
    border-color: $color-primary;
    
    .calendar-day__name,
    .calendar-day__number {
      color: white;
    }
  }
  
  &:active:not(.selected) {
    background: $color-primary-light;
  }
}
```

---

## Phase 5: Feature Implementation (Weeks 6-9)

### 5.1 Authentication Flow

#### Login Page

**src/pages/Auth/Login/Login.tsx:**
```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/common/Button';
import { CountryPicker } from '@components/features/CountryPicker';
import { sendOTP } from '@services/auth/firebaseAuth';
import { useAuthStore } from '@store/authStore';
import './Login.scss';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setLoading } = useAuthStore();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || phoneNumber.length < 8) {
      setError(t('login.invalidPhone'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullNumber = `${countryCode}${phoneNumber}`;
      const verificationId = await sendOTP(fullNumber);
      
      navigate('/otp-verify', {
        state: {
          verificationId,
          phoneNumber: fullNumber,
          countryCode,
        },
      });
    } catch (err: any) {
      setError(err.message || t('login.sendOtpError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__header">
        <h1>{t('login.createAccount')}</h1>
        <p>{t('login.subtitle')}</p>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form__label">
          {t('login.phoneNumber')}
        </label>
        
        <div className="login-form__input-group">
          <CountryPicker
            value={countryCode}
            onChange={setCountryCode}
          />
          <input
            type="tel"
            className="login-form__input"
            placeholder={t('login.enterNumber')}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        
        {error && <p className="login-form__error">{error}</p>}
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
        >
          {t('login.getOtp')}
        </Button>
      </form>
    </div>
  );
};
```

### 5.2 Home Screen

**src/pages/Home/Home.tsx:**
```tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalCalendar } from '@components/features/Calendar';
import { CategoryList } from './components/CategoryList';
import { ClassTimeSlots } from './components/ClassTimeSlots';
import { BookingBar } from './components/BookingBar';
import { useAuthStore } from '@store/authStore';
import { useClassesStore } from '@store/classesStore';
import { getCategories, getClassesByDate } from '@services/api/classes.api';
import './Home.scss';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { selectedClasses, clearSelection } = useClassesStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadClasses();
    }
  }, [selectedDate, selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadClasses = async () => {
    setIsLoading(true);
    try {
      const data = await getClassesByDate(selectedDate, selectedCategory!);
      setClasses(data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 18) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header__greeting">
          <span className="home-header__greeting-text">{getGreeting()}</span>
          <h1 className="home-header__name">{user?.fullName}</h1>
        </div>
        <div className="home-header__avatar">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" />
          ) : (
            <span>{user?.fullName?.charAt(0)}</span>
          )}
        </div>
      </header>

      <HorizontalCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <CategoryList
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <ClassTimeSlots
        classes={classes}
        isLoading={isLoading}
      />

      {selectedClasses.length > 0 && (
        <BookingBar
          count={selectedClasses.length}
          onClear={clearSelection}
        />
      )}
    </div>
  );
};
```

---

## Phase 6: Payment Integration (Week 10)

### 6.1 Custom HyperPay Plugin Development

Since there's no official Capacitor plugin for HyperPay, you need to create a custom one:

#### Plugin Structure

```
capacitor-hyperpay-plugin/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── definitions.ts
│   └── web.ts
├── android/
│   ├── build.gradle
│   └── src/main/java/com/pilates/hyperpay/
│       ├── HyperPayPlugin.java
│       └── HyperPayService.java
└── ios/
    └── Plugin/
        ├── HyperPayPlugin.swift
        └── HyperPayPlugin.m
```

#### TypeScript Definitions

**src/definitions.ts:**
```typescript
export interface HyperPayPlugin {
  /**
   * Get checkout ID from server
   */
  getCheckoutId(options: { 
    amount: number; 
    currency: string;
    paymentType: string;
  }): Promise<{ checkoutId: string }>;

  /**
   * Process card payment
   */
  payWithCard(options: {
    checkoutId: string;
    cardNumber: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    brand: 'VISA' | 'MASTERCARD' | 'MADA';
  }): Promise<{ success: boolean; transactionId?: string; error?: string }>;

  /**
   * Process Apple Pay (iOS only)
   */
  payWithApplePay(options: {
    checkoutId: string;
    amount: number;
    merchantId: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }>;

  /**
   * Check payment status
   */
  getPaymentStatus(options: {
    checkoutId: string;
  }): Promise<{ status: string; transactionId?: string }>;
}
```

---

## Phase 7: Platform Configuration (Week 11)

### 7.1 Capacitor Configuration

**capacitor.config.ts:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pilates.room',
  appName: 'ThePilatesRoom',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
    },
  },
  ios: {
    scheme: 'pilates',
    contentInset: 'always',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
```

### 7.2 iOS Configuration

**ios/App/App/Info.plist additions:**
```xml
<!-- URL Schemes -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.pilates.room.payments</string>
      <string>pilates</string>
    </array>
  </dict>
</array>

<!-- Camera/Photo permissions -->
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture your profile photo</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select your profile photo</string>

<!-- Push notifications -->
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>

<!-- Apple Pay -->
<key>com.apple.developer.in-app-payments</key>
<array>
  <string>merchant.com.pilates.room</string>
</array>
```

### 7.3 Android Configuration

**android/app/src/main/AndroidManifest.xml additions:**
```xml
<!-- Permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Deep links -->
<activity android:name=".MainActivity">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="pilates" />
    <data android:scheme="com.pilates.room.payments" />
  </intent-filter>
</activity>
```

---

## Phase 8: Testing & Deployment (Week 12)

### 8.1 Testing Strategy

1. **Unit Tests** - Jest for business logic and utilities
2. **Component Tests** - React Testing Library
3. **E2E Tests** - Detox for native app testing
4. **Manual Testing** - Device testing checklist

### 8.2 Build Commands

```bash
# Build web assets
npm run build

# Sync with native platforms
npx cap sync

# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android

# Run on device
npx cap run ios
npx cap run android
```

### 8.3 CI/CD Pipeline

**GitHub Actions workflow (.github/workflows/build.yml):**
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      
  build-ios:
    runs-on: macos-latest
    needs: build-web
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx cap sync ios
      - name: Build iOS
        run: |
          cd ios/App
          xcodebuild -workspace App.xcworkspace -scheme App -configuration Release
          
  build-android:
    runs-on: ubuntu-latest
    needs: build-web
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
      - run: npm ci
      - run: npm run build
      - run: npx cap sync android
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleRelease
```

---

## Risk Mitigation

### High Priority Risks

1. **HyperPay Integration**
   - Risk: No official Capacitor plugin
   - Mitigation: Allocate 2 weeks for custom plugin development
   - Fallback: WebView-based checkout if SDK integration fails

2. **Performance**
   - Risk: Web-based UI may feel less native
   - Mitigation: Use native transitions, lazy loading, virtualized lists
   - Testing: Regular performance profiling on mid-range devices

3. **Apple Pay**
   - Risk: Requires merchant ID setup and testing
   - Mitigation: Start merchant certification early in parallel

### Medium Priority Risks

4. **RTL Layout**
   - Risk: Complex RTL transformations
   - Mitigation: Use CSS logical properties, thorough RTL testing

5. **Push Notification Edge Cases**
   - Risk: Different behavior on iOS/Android
   - Mitigation: Comprehensive testing across OS versions

---

## Success Metrics

- [ ] All 35 native features implemented or equivalent provided
- [ ] App startup time < 2 seconds
- [ ] Smooth 60fps scrolling
- [ ] Push notifications working on both platforms
- [ ] Payments processing successfully
- [ ] RTL/LTR language switching working
- [ ] App Store and Play Store submission ready
