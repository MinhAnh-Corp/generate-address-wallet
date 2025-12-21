import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../locales/en.json';
import viTranslations from '../locales/vi.json';

export type Language = 'en' | 'vi';

export const LANGUAGES: Record<Language, { label: string; flag: string }> = {
  en: {
    label: 'English', flag: '🇺🇸',
  },
  vi: {
    label: 'Tiếng Việt', flag: '🇻🇳',
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      vi: {
        translation: viTranslations,
      },
    },
    lng: (() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('language');
        if (saved === 'en' || saved === 'vi') {
          return saved;
        }
      }
      return 'en';
    })(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
