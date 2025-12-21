# Cách Tạo BIP39 Mnemonic

Công cụ này tạo các cụm từ mnemonic tuân thủ BIP39 để tạo ví. Đây là cách nó hoạt động:

```typescript
// Tạo mnemonic sử dụng @scure/bip39
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

// Tính toán độ mạnh dựa trên số lượng từ
// 12 từ = 128 bits, 15 từ = 160 bits, 18 từ = 192 bits,
// 21 từ = 224 bits, 24 từ = 256 bits
const wordCount = 12; // hoặc 15, 18, 21, 24
const strength = (wordCount / 3) * 32;

// Tạo mnemonic
const mnemonic = generateMnemonic(wordlist, strength);

// Ví dụ kết quả:
// "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
```

## Số Lượng Từ Hợp Lệ

BIP39 hỗ trợ các số lượng từ sau:
- **12 từ** (128 bits entropy) - Phổ biến nhất
- **15 từ** (160 bits entropy)
- **18 từ** (192 bits entropy)
- **21 từ** (224 bits entropy)
- **24 từ** (256 bits entropy) - Bảo mật cao nhất

Tham số strength được tính như sau: `(wordCount / 3) * 32` bits.

Bạn có thể làm theo code này để triển khai chức năng tương tự trong dự án của mình.

