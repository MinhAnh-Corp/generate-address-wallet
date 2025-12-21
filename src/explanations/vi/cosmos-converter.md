Công cụ này chuyển đổi địa chỉ Cosmos Bech32 sang tiền tố khác trong khi giữ nguyên hash khóa công khai cơ bản. Đây là cách nó hoạt động:

```typescript
// Chuyển đổi tiền tố địa chỉ Cosmos sử dụng bech32
import { bech32 } from 'bech32';

// Giải mã địa chỉ hiện có để lấy data words
const decoded = bech32.decode(existingAddress);
// decoded.words chứa dữ liệu địa chỉ

// Mã hóa với tiền tố mới
const newAddress = bech32.encode(newPrefix, decoded.words);

// Ví dụ:
// Đầu vào:  cosmos1abc123...
// Giải mã: [mảng words]
// Mã hóa với 'stoc': stoc1abc123...

// Hash khóa công khai cơ bản vẫn giữ nguyên,
// chỉ có tiền tố dễ đọc thay đổi.
// Điều này cho phép cùng một ví hoạt động trên các chuỗi Cosmos khác nhau.
```

Bạn có thể làm theo code này để triển khai chức năng tương tự trong dự án của mình.

