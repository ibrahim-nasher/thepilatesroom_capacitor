import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { initI18n, i18n } from '@i18n';
import { useAuthStore } from '@store';
import AppRoutes from './routes';
import './styles/global.scss';

const App: React.FC = () => {
  const [isI18nReady, setIsI18nReady] = useState(false);
  const loadStoredAuth = useAuthStore(state => state.loadStoredAuth);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize i18n
        await initI18n();
        setIsI18nReady(true);
        
        // Load stored authentication
        await loadStoredAuth();
      } catch (error) {
        console.error('App initialization error:', error);
        setIsI18nReady(true); // Still show app even if i18n fails
      }
    };

    initialize();
  }, [loadStoredAuth]);

  if (!isI18nReady || isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
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
