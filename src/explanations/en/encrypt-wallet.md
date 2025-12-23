# How to Encrypt/Decrypt Wallet

This tool encrypts and decrypts private keys or mnemonic phrases using AES encryption. Here's how it works:

```typescript
// Install crypto-js: npm install crypto-js
import * as CryptoJS from 'crypto-js';

// Generate a random encryption key (32 bytes)
const encryptionKey = CryptoJS.lib.WordArray.random(32).toString();
console.log('Encryption Key:', encryptionKey);

// Encrypt private key or mnemonic
const privateKey = 'your-private-key-or-mnemonic-here';
const encrypted = CryptoJS.AES.encrypt(privateKey, encryptionKey).toString();
console.log('Encrypted:', encrypted);

// Decrypt the encrypted data
const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey);
const plainText = decrypted.toString(CryptoJS.enc.Utf8);
console.log('Decrypted:', plainText);
```

## Important Security Notes

1. **Always store your encryption key securely** - If you lose it, you cannot decrypt your data
2. **All encryption/decryption happens in the browser** - Your private keys are never sent to any server
3. **Use a strong encryption key** - The tool can generate a random 32-byte key for you
4. **Keep your encrypted data safe** - Store it securely along with your encryption key

## How It Works

- **AES Encryption**: Uses Advanced Encryption Standard (AES) symmetric encryption
- **CryptoJS Library**: Provides AES encryption implementation for JavaScript
- **Client-side only**: All operations are performed locally in your browser
- **UTF-8 encoding**: Plain text is encoded as UTF-8 before encryption

You can follow this code to implement the same functionality in your own project.

