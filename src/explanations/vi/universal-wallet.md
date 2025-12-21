Công cụ này tạo cả ví EVM và Cosmos từ mnemonic hoặc khóa riêng. Đây là cách nó hoạt động:

```typescript
// Cho ví EVM (sử dụng ethers.js)
import { ethers } from 'ethers';

// Từ mnemonic
const evmWallet = ethers.Wallet.fromPhrase(mnemonic);
const evmAddress = evmWallet.address;
const evmPrivateKey = evmWallet.privateKey;

// Từ khóa riêng
const evmWallet = new ethers.Wallet(privateKey);

// Cho ví Cosmos (sử dụng @cosmjs và @scure/bip32)
import { Secp256k1, sha256 } from '@cosmjs/crypto';
import { toBech32, fromHex } from '@cosmjs/encoding';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { ripemd160 } from 'hash.js';

// Từ mnemonic - derive sử dụng BIP44 path m/44'/118'/0'/0/0
const seed = mnemonicToSeedSync(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);
const cosmosNode = hdKey.derive("m/44'/118'/0'/0/0");
const cosmosPrivateKeyBytes = new Uint8Array(cosmosNode.privateKey);

// Từ khóa riêng trực tiếp
const cosmosPrivateKeyBytes = fromHex(privateKeyHex);

// Tạo địa chỉ Cosmos
const publicKey = await Secp256k1.makeKeypair(cosmosPrivateKeyBytes);
const pubkeyBytes = Secp256k1.compressPubkey(publicKey.pubkey);
const sha256Hash = sha256(pubkeyBytes);
const ripemd160Hash = ripemd160().update(sha256Hash).digest();
const cosmosAddress = toBech32('cosmos', new Uint8Array(ripemd160Hash));

// Lưu ý: EVM sử dụng derivation path m/44'/60'/0'/0/0
// Cosmos sử dụng derivation path m/44'/118'/0'/0/0
// Đây là lý do tại sao chúng tạo ra các địa chỉ khác nhau từ cùng một mnemonic
```

Bạn có thể làm theo code này để triển khai chức năng tương tự trong dự án của mình.

