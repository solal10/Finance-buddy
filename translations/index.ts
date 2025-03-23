import { en } from './en';
import { fr } from './fr';
import { he } from './he';

export type Language = 'en' | 'fr' | 'he';

export const translations = {
  en,
  fr,
  he,
};

export const languageNames = {
  en: 'English',
  fr: 'Français',
  he: 'עברית',
};

export type TranslationKey = keyof typeof en;