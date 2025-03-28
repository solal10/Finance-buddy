import { translations, Language, TranslationKey } from '@/translations';
import { useFinanceStore } from '@/store/finance-store';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';

// Default language
const DEFAULT_LANGUAGE: Language = 'en';

// RTL languages
const RTL_LANGUAGES: Language[] = ['he'];

/**
 * Translate a key to the current language
 * @param key The translation key
 * @param params Optional parameters to replace in the translation
 * @returns The translated string
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const language = useFinanceStore.getState().profile.language || DEFAULT_LANGUAGE;
  
  // Get the translation
  let translation = translations[language]?.[key] || translations[DEFAULT_LANGUAGE][key];
  
  // If translation is not found, return the key
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
    });
  }
  
  return translation;
}

/**
 * Set the app's language and handle RTL if needed
 * @param language The language code to set
 */
export function setAppLanguage(language: Language): void {
  // Update the language in the store
  useFinanceStore.getState().updateProfile({ language });
  
  // Handle RTL languages
  const isRTL = RTL_LANGUAGES.includes(language);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // In a real app, we would reload the app here to apply RTL changes
    // For this demo, we'll just log it
    console.log(`RTL set to: ${isRTL}`);
  }
}

/**
 * Hook to use translations in components
 * @returns The translate function and current language
 */
export function useTranslation() {
  const language = useFinanceStore((state) => state.profile.language || DEFAULT_LANGUAGE);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  
  // Update current language when store changes
  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);
  
  return {
    t: (key: TranslationKey, params?: Record<string, string | number>) => {
      // Get the translation
      let translation = translations[currentLanguage]?.[key] || translations[DEFAULT_LANGUAGE][key];
      
      // If translation is not found, return the key
      if (!translation) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      
      // Replace parameters if provided
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
        });
      }
      
      return translation;
    },
    language: currentLanguage,
    setLanguage: (lang: Language) => {
      setAppLanguage(lang);
    },
    isRTL: RTL_LANGUAGES.includes(currentLanguage),
  };
}

// Language names for display
export const languageNames = {
  en: 'English',
  fr: 'Français',
  he: 'עברית',
};

// Export Language type
export { Language } from '@/translations';