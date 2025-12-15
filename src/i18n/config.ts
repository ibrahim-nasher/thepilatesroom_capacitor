import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';

// Import translations
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const LANGUAGE_KEY = 'app_language';

// Get stored language or default to English
const getStoredLanguage = async (): Promise<string> => {
  try {
    const { value } = await Preferences.get({ key: LANGUAGE_KEY });
    return value || 'en';
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return 'en';
  }
};

// Store language preference
export const storeLanguage = async (language: string): Promise<void> => {
  try {
    await Preferences.set({ key: LANGUAGE_KEY, value: language });
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};

// Initialize i18next
export const initI18n = async (): Promise<void> => {
  const storedLanguage = await getStoredLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: enTranslations.en,
        ar: arTranslations.ar,
      },
      lng: storedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      react: {
        useSuspense: false,
      },
    });
  
  // Set initial HTML attributes
  document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = storedLanguage;
};

// Change language
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
  await storeLanguage(language);
};

export default i18n;
