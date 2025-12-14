import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pilates.room',
  appName: 'ThePilatesRoom',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true, // For dev environment
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFFFFF',
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
