This tool generates both EVM and Cosmos wallets from a mnemonic or private key. Here's how it works:

```typescript
// For EVM Wallet (using ethers.js)
import { ethers } from 'ethers';

// From mnemonic
const evmWallet = ethers.Wallet.fromPhrase(mnemonic);
const evmAddress = evmWallet.address;
const evmPrivateKey = evmWallet.privateKey;

// From private key
const evmWallet = new ethers.Wallet(privateKey);

// For Cosmos Wallet (using @cosmjs and @scure/bip32)
import { Secp256k1, sha256 } from '@cosmjs/crypto';
import { toBech32, fromHex } from '@cosmjs/encoding';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { ripemd160 } from 'hash.js';

// From mnemonic - derive using BIP44 path m/44'/118'/0'/0/0
const seed = mnemonicToSeedSync(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);
const cosmosNode = hdKey.derive("m/44'/118'/0'/0/0");
const cosmosPrivateKeyBytes = new Uint8Array(cosmosNode.privateKey);

// From private key directly
const cosmosPrivateKeyBytes = fromHex(privateKeyHex);

// Generate Cosmos address
const publicKey = await Secp256k1.makeKeypair(cosmosPrivateKeyBytes);
const pubkeyBytes = Secp256k1.compressPubkey(publicKey.pubkey);
const sha256Hash = sha256(pubkeyBytes);
const ripemd160Hash = ripemd160().update(sha256Hash).digest();
const cosmosAddress = toBech32('cosmos', new Uint8Array(ripemd160Hash));

// Note: EVM uses derivation path m/44'/60'/0'/0/0
// Cosmos uses derivation path m/44'/118'/0'/0/0
// This is why they generate different addresses from the same mnemonic
```

You can follow this code to implement the same functionality in your own project.

