export type TranslationKey = keyof typeof import('../locales/en.json');

interface I18nWindow extends Window {
  __i18n__?: {
    t: (key: string, options?: Record<string, string | number>) => string;
  };
}

export function t(key: TranslationKey, options?: Record<string, string | number>): string {
  const i18n = (window as I18nWindow).__i18n__;
  if (!i18n) {
    return key;
  }
  return i18n.t(key, options) || key;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof import('../locales/en.json');
    };
  }
}
