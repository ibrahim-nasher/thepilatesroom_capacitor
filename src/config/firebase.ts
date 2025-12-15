import { Capacitor } from '@capacitor/core';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Get platform-specific Firebase configuration
 * Returns iOS config for iOS, Android config for Android, Web config for web
 */
export const getFirebaseConfig = (): FirebaseConfig => {
  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_IOS_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_IOS_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_IOS_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_IOS_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_IOS_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_IOS_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_IOS_MEASUREMENT_ID,
    };
  }

  if (platform === 'android') {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_ANDROID_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_ANDROID_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_ANDROID_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_ANDROID_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_ANDROID_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_ANDROID_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_ANDROID_MEASUREMENT_ID,
    };
  }

  // Fallback to web config (for development/testing in browser)
  return {
    apiKey: import.meta.env.VITE_FIREBASE_WEB_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_WEB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_WEB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_WEB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_WEB_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_WEB_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_WEB_MEASUREMENT_ID,
  };
};

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return !!(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.appId &&
    !config.apiKey.includes('your_')
  );
};
