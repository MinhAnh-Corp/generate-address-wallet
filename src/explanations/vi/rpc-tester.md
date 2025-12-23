# Trình Kiểm tra RPC

Công cụ này kiểm tra xem một endpoint RPC có hoạt động hay không bằng cách kết nối và lấy thông tin cơ bản. Đây là cách nó hoạt động:

## Kiểm tra RPC Ethereum

```typescript
import { ethers } from 'ethers';

// Tạo provider với URL RPC
const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
  staticNetwork: false,
});

// Kiểm tra kết nối bằng cách lấy thông tin cơ bản
const [blockNumber, chainId, networkId] = await Promise.all([
  provider.getBlockNumber(),
  provider.getNetwork().then((n) => n.chainId.toString()),
  provider.send('net_version', []).catch(() => 'N/A'),
]);
```

Công cụ đo thời gian phản hồi và hiển thị:
- Chain ID
- Số block mới nhất
- Network ID

## Kiểm tra RPC Cosmos

```typescript
// Kiểm tra RPC Cosmos bằng cách gọi endpoint /status
const baseUrl = rpcUrl.replace(/\/$/, '');
const statusUrl = `${baseUrl}/status`;

const response = await fetch(statusUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  signal: AbortSignal.timeout(10000), // Timeout 10 giây
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const data = await response.json();
const nodeInfo = data.result?.node_info;
```

Công cụ hiển thị:
- Tên mạng
- Phiên bản node
- Thời gian phản hồi

## Xử lý Lỗi

Cả hai bài kiểm tra đều bao gồm xử lý lỗi phù hợp với bảo vệ timeout và thông báo lỗi rõ ràng nếu endpoint RPC không thể truy cập hoặc trả về lỗi.

