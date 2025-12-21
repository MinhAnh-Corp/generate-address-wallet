import { atom } from 'jotai';

import cosmosConverterExplanation from '../explanations/cosmos-converter.md?raw';
import mnemonicGeneratorExplanation from '../explanations/mnemonic-generator.md?raw';
import universalWalletExplanation from '../explanations/universal-wallet.md?raw';

export const EXPLANATION_KEYS = {
  MNEMONIC_GENERATOR: 'mnemonic-generator',
  UNIVERSAL_WALLET: 'universal-wallet',
  COSMOS_CONVERTER: 'cosmos-converter',
} as const;

export type ExplanationKey = typeof EXPLANATION_KEYS[keyof typeof EXPLANATION_KEYS];

export const explanationsAtom = atom<Record<ExplanationKey, string>>({
  [EXPLANATION_KEYS.MNEMONIC_GENERATOR]: mnemonicGeneratorExplanation,
  [EXPLANATION_KEYS.UNIVERSAL_WALLET]: universalWalletExplanation,
  [EXPLANATION_KEYS.COSMOS_CONVERTER]: cosmosConverterExplanation,
});
