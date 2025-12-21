This tool converts a Cosmos Bech32 address to a different prefix while preserving the underlying public key hash. Here's how it works:

```typescript
// Convert Cosmos address prefix using bech32
import { bech32 } from 'bech32';

// Decode the existing address to get the data words
const decoded = bech32.decode(existingAddress);
// decoded.words contains the address data

// Encode with new prefix
const newAddress = bech32.encode(newPrefix, decoded.words);

// Example:
// Input:  cosmos1abc123...
// Decode: [words array]
// Encode with 'stoc': stoc1abc123...

// The underlying public key hash remains the same,
// only the human-readable prefix changes.
// This allows the same wallet to work across different Cosmos chains.
```

You can follow this code to implement the same functionality in your own project.

