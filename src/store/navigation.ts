import { atom } from 'jotai';

export type MenuKey = 'universal' | 'cosmos-converter' | 'mnemonic-generator';

const STORAGE_KEY = 'last-visited-page';

const getStoredPage = (): MenuKey => {
  if (typeof window === 'undefined') {
    return 'mnemonic-generator';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  const validKeys: MenuKey[] = [
    'mnemonic-generator',
    'universal',
    'cosmos-converter',
  ];

  if (stored && validKeys.includes(stored as MenuKey)) {
    return stored as MenuKey;
  }

  return 'mnemonic-generator';
};

const baseSelectedPageAtom = atom<MenuKey>(getStoredPage());

export const selectedPageAtom = atom(
  (get) => get(baseSelectedPageAtom),
  (_get, set, newValue: MenuKey) => {
    set(baseSelectedPageAtom, newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newValue);
    }
  },
);
