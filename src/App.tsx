import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { SplashScreen } from '@capacitor/splash-screen';
import { initI18n, i18n } from '@i18n';
import { getFirebaseConfig, isFirebaseConfigured } from './config/firebase';
import { useAuthStore } from '@store';
import AppRoutes from './routes';
import './styles/global.scss';

const App: React.FC = () => {
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const loadStoredAuth = useAuthStore(state => state.loadStoredAuth);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Show splash screen explicitly (in case it was hidden)
        await SplashScreen.show({
          autoHide: false,
          fadeInDuration: 300,
          fadeOutDuration: 300,
        });
        
        // Initialize i18n
        await initI18n();
        setIsI18nReady(true);
        
        // Initialize Firebase if configured
        if (isFirebaseConfigured()) {
          const firebaseConfig = getFirebaseConfig();
          const app = initializeApp(firebaseConfig);
          getAuth(app); // Initialize auth
          console.log('Firebase initialized successfully');
        } else {
          console.warn('Firebase not configured. Please set up environment variables.');
        }
        setIsFirebaseReady(true);
        
        // Load stored authentication or set guest mode
        await loadStoredAuth();
        
        // Hide native splash screen once initialization is complete
        setTimeout(async () => {
          await SplashScreen.hide({ fadeOutDuration: 300 });
        }, 500); // Small delay to ensure smooth transition
      } catch (error) {
        console.error('App initialization error:', error);
        setIsI18nReady(true);
        setIsFirebaseReady(true); // Still show app even if Firebase fails
        await SplashScreen.hide(); // Hide splash even on error
      }
    };

    initialize();
  }, [loadStoredAuth]);

  // Don't show Loading component - let native splash screen handle it
  if (!isI18nReady || !isFirebaseReady || isLoading) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
};

export default App;
