# RPC Tester

This tool tests if an RPC endpoint is working by connecting to it and retrieving basic information. Here's how it works:

## For Ethereum RPC Testing

```typescript
import { ethers } from 'ethers';

// Create a provider with the RPC URL
const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
  staticNetwork: false,
});

// Test the connection by getting basic information
const [blockNumber, chainId, networkId] = await Promise.all([
  provider.getBlockNumber(),
  provider.getNetwork().then((n) => n.chainId.toString()),
  provider.send('net_version', []).catch(() => 'N/A'),
]);
```

The tool measures the response time and displays:
- Chain ID
- Latest block number
- Network ID

## For Cosmos RPC Testing

```typescript
// Test Cosmos RPC by calling the /status endpoint
const baseUrl = rpcUrl.replace(/\/$/, '');
const statusUrl = `${baseUrl}/status`;

const response = await fetch(statusUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  signal: AbortSignal.timeout(10000), // 10 second timeout
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const data = await response.json();
const nodeInfo = data.result?.node_info;
```

The tool displays:
- Network name
- Node version
- Response time

## Error Handling

Both tests include proper error handling with timeout protection and clear error messages if the RPC endpoint is unreachable or returns an error.

