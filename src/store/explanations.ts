import { atom } from 'jotai';

import cosmosConverterEn from '../explanations/en/cosmos-converter.md?raw';
import mnemonicGeneratorEn from '../explanations/en/mnemonic-generator.md?raw';
import universalWalletEn from '../explanations/en/universal-wallet.md?raw';
import whoWeAreEn from '../explanations/en/who-we-are.md?raw';
import cosmosConverterVi from '../explanations/vi/cosmos-converter.md?raw';
import mnemonicGeneratorVi from '../explanations/vi/mnemonic-generator.md?raw';
import universalWalletVi from '../explanations/vi/universal-wallet.md?raw';
import whoWeAreVi from '../explanations/vi/who-we-are.md?raw';
import type { Language } from '../i18n/config';

import { languageAtom } from './language';

export const EXPLANATION_KEYS = {
  MNEMONIC_GENERATOR: 'mnemonic-generator',
  UNIVERSAL_WALLET: 'universal-wallet',
  COSMOS_CONVERTER: 'cosmos-converter',
  WHO_WE_ARE: 'who-we-are',
} as const;

export type ExplanationKey = typeof EXPLANATION_KEYS[keyof typeof EXPLANATION_KEYS];

const explanationsByLanguage: Record<Language, Record<ExplanationKey, string>> = {
  en: {
    [EXPLANATION_KEYS.MNEMONIC_GENERATOR]: mnemonicGeneratorEn,
    [EXPLANATION_KEYS.UNIVERSAL_WALLET]: universalWalletEn,
    [EXPLANATION_KEYS.COSMOS_CONVERTER]: cosmosConverterEn,
    [EXPLANATION_KEYS.WHO_WE_ARE]: whoWeAreEn,
  },
  vi: {
    [EXPLANATION_KEYS.MNEMONIC_GENERATOR]: mnemonicGeneratorVi,
    [EXPLANATION_KEYS.UNIVERSAL_WALLET]: universalWalletVi,
    [EXPLANATION_KEYS.COSMOS_CONVERTER]: cosmosConverterVi,
    [EXPLANATION_KEYS.WHO_WE_ARE]: whoWeAreVi,
  },
};

export const explanationsAtom = atom((get) => {
  const language = get(languageAtom);
  return explanationsByLanguage[language];
});
