import { atom } from 'jotai';

import i18n from '../i18n/config';
import type { Language } from '../i18n/config';

const STORAGE_KEY = 'language';

const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'vi') {
    return stored;
  }

  return 'en';
};

const baseLanguageAtom = atom<Language>(getStoredLanguage());

export const languageAtom = atom(
  (get) => get(baseLanguageAtom),
  (_get, set, newValue: Language) => {
    set(baseLanguageAtom, newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newValue);
      void i18n.changeLanguage(newValue);
    }
  },
);
