# Cách Mã Hóa/Giải Mã Ví

Công cụ này mã hóa và giải mã khóa riêng hoặc cụm từ mnemonic bằng cách sử dụng mã hóa AES. Đây là cách nó hoạt động:

```typescript
// Cài đặt crypto-js: npm install crypto-js
import * as CryptoJS from 'crypto-js';

// Tạo khóa mã hóa ngẫu nhiên (32 bytes)
const encryptionKey = CryptoJS.lib.WordArray.random(32).toString();
console.log('Encryption Key:', encryptionKey);

// Mã hóa khóa riêng hoặc mnemonic
const privateKey = 'your-private-key-or-mnemonic-here';
const encrypted = CryptoJS.AES.encrypt(privateKey, encryptionKey).toString();
console.log('Encrypted:', encrypted);

// Giải mã dữ liệu đã mã hóa
const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey);
const plainText = decrypted.toString(CryptoJS.enc.Utf8);
console.log('Decrypted:', plainText);
```

## Lưu Ý Bảo Mật Quan Trọng

1. **Luôn lưu trữ khóa mã hóa của bạn một cách an toàn** - Nếu bạn mất nó, bạn không thể giải mã dữ liệu của mình
2. **Tất cả mã hóa/giải mã đều diễn ra trong trình duyệt** - Khóa riêng của bạn không bao giờ được gửi đến bất kỳ server nào
3. **Sử dụng khóa mã hóa mạnh** - Công cụ có thể tạo khóa ngẫu nhiên 32 byte cho bạn
4. **Giữ dữ liệu đã mã hóa của bạn an toàn** - Lưu trữ nó một cách an toàn cùng với khóa mã hóa của bạn

## Cách Hoạt Động

- **Mã hóa AES**: Sử dụng mã hóa đối xứng Advanced Encryption Standard (AES)
- **Thư viện CryptoJS**: Cung cấp triển khai mã hóa AES cho JavaScript
- **Chỉ ở phía client**: Tất cả các thao tác được thực hiện cục bộ trong trình duyệt của bạn
- **Mã hóa UTF-8**: Văn bản thuần được mã hóa dưới dạng UTF-8 trước khi mã hóa

Bạn có thể làm theo mã này để triển khai chức năng tương tự trong dự án của riêng mình.

