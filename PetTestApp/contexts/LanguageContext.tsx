import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../locales/en/common.json';
import zh from '../locales/zh/common.json';

type Language = 'en' | 'zh';

interface LanguageContextType {
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
  currentLanguage: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create a new i18n instance
const i18n = new I18n({
  en,
  zh
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync('language');
      if (savedLanguage) {
        setLanguage(savedLanguage as Language);
        i18n.locale = savedLanguage;
      } else {
        const locales = Localization.getLocales?.();
        const deviceLanguage = (locales && locales.length > 0 ? locales[0].languageCode : 'en');
        const defaultLanguage = deviceLanguage === 'zh' ? 'zh' : 'en';
        setLanguage(defaultLanguage);
        i18n.locale = defaultLanguage;
        await SecureStore.setItemAsync('language', defaultLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleSetLanguage = async (newLanguage: Language) => {
    try {
      await SecureStore.setItemAsync('language', newLanguage);
      setLanguage(newLanguage);
      i18n.locale = newLanguage;
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        t: (key: string) => i18n.t(key),
        setLanguage: handleSetLanguage,
        currentLanguage: language,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 