import { useLanguage } from '../contexts/LanguageContext';

/**
 * useTranslation hook provides access to the translation function 't'.
 * This follows the requested architecture for centralized string management.
 */
export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};

export default useTranslation;
