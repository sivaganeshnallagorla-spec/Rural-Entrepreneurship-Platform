import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

/** Keys must match top-level keys in `translations`. */
export const AVAILABLE_LANGUAGES = ['en', 'hi', 'te', 'ta'];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, availableLanguages: AVAILABLE_LANGUAGES }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
