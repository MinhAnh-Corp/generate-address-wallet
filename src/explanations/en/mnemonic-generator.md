# How to Generate BIP39 Mnemonic

This tool generates BIP39-compliant mnemonic phrases for wallet creation. Here's how it works:

```typescript
// Generate mnemonic using @scure/bip39
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

// Calculate strength based on word count
// 12 words = 128 bits, 15 words = 160 bits, 18 words = 192 bits,
// 21 words = 224 bits, 24 words = 256 bits
const wordCount = 12; // or 15, 18, 21, 24
const strength = (wordCount / 3) * 32;

// Generate mnemonic
const mnemonic = generateMnemonic(wordlist, strength);

// Example output:
// "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
```

## Valid Word Counts

BIP39 supports the following word counts:
- **12 words** (128 bits entropy) - Most common
- **15 words** (160 bits entropy)
- **18 words** (192 bits entropy)
- **21 words** (224 bits entropy)
- **24 words** (256 bits entropy) - Highest security

The strength parameter is calculated as: `(wordCount / 3) * 32` bits.

You can follow this code to implement the same functionality in your own project.

