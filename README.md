# Cosmos Wallet Address Generator

> A privacy-focused web application for generating and converting Cosmos SDK wallet addresses across different networks

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://generate-address-wallet-xclusive-io.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-70.3%25-blue)](https://www.typescriptlang.org/)

## Features

### 🔐 Privacy First
- **100% Client-Side**: All cryptographic operations run locally in your browser
- **No Data Transmission**: No private keys, mnemonics, or addresses are ever sent to any server
- **Open Source**: Fully transparent and auditable code

### 🛠️ Core Functionality

#### 1. Address Converter
Convert existing Cosmos SDK addresses between different network prefixes using bech32 encoding.

**Example:**
- Input: `cosmos1abc...xyz` (Cosmos Hub)
- Output: `osmo1abc...xyz` (Osmosis) with the same underlying public key

#### 2. Mnemonic Generator
Generate secure BIP39 mnemonic phrases for creating new wallets.

**Features:**
- Support for 12, 15, 18, 21, and 24-word mnemonics
- Cryptographically secure random generation
- One-click copy to clipboard

#### 3. Universal Wallet Generator
Generate both EVM and Cosmos SDK addresses from a single mnemonic or private key.

**Supports:**
- **EVM Chains**: Ethereum, Polygon, BSC, and other EVM-compatible networks
- **Cosmos Chains**: Cosmos Hub, Osmosis, Juno, and 100+ other chains
- **Dual Output**: Get both address types simultaneously from one seed

**Input Methods:**
- BIP39 mnemonic phrase (12-24 words)
- Private key (hex format)

**Derivation Paths:**
- EVM: `m/44'/60'/0'/0/0` (Ethereum standard)
- Cosmos: `m/44'/118'/0'/0/0` (Cosmos standard)

### 🌍 International Support
- English (en)
- Tiếng Việt (vi)

### 🎨 User Experience
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Code Explanations**: Built-in educational tooltips explaining cryptographic operations
- **Copy Support**: One-click copy for all generated addresses and keys

## Live Demo

Try it now: **[https://generate-address-wallet-xclusive-io.vercel.app/](https://generate-address-wallet-xclusive-io.vercel.app/)**

## Tech Stack

### Core Libraries
- **[React 19](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vite.dev/)** - Build tool with HMR

### Cryptography
- **[@cosmjs/crypto](https://github.com/cosmos/cosmjs)** - Cosmos SDK cryptographic operations
- **[@cosmjs/encoding](https://github.com/cosmos/cosmjs)** - Bech32 encoding/decoding
- **[@scure/bip39](https://github.com/paulmillr/scure-bip39)** - BIP39 mnemonic generation
- **[@scure/bip32](https://github.com/paulmillr/scure-bip32)** - HD key derivation
- **[ethers.js](https://docs.ethers.org/)** - EVM wallet operations
- **[bech32](https://github.com/bitcoinjs/bech32)** - Address encoding

### UI & State Management
- **[Ant Design](https://ant.design/)** - Component library
- **[Jotai](https://jotai.org/)** - Atomic state management
- **[i18next](https://www.i18next.com/)** - Internationalization

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- pnpm 9+ (package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/MinhAnh-Corp/generate-address-wallet.git
cd generate-address-wallet

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues

# Dependencies
pnpm update:check     # Check for outdated packages
pnpm update:latest    # Update all to latest versions
pnpm update:interactive  # Interactive package updates
```

## Usage Examples

### 1. Converting Addresses Between Networks

```
Input Address: cosmos1xyz...abc (Cosmos Hub)
Target Prefix: osmo

Output: osmo1xyz...abc (Osmosis)
```

Both addresses share the same public key and can be controlled by the same private key.

### 2. Generating a New Mnemonic

1. Select word count (12, 15, 18, 21, or 24)
2. Click "Generate Mnemonic"
3. Securely save the generated phrase
4. Use it to create wallets on any compatible network

### 3. Deriving Wallets from Mnemonic

```
Input: abandon abandon abandon ... (12-word mnemonic)
Cosmos Prefix: osmo

Output:
  EVM Address: 0x1234...5678
  EVM Private Key: 0xabcd...ef01
  Cosmos Address: osmo1qwer...tyui
  Cosmos Private Key: 1234abcd...ef56
```

## Security Best Practices

⚠️ **IMPORTANT WARNINGS:**

1. **Never share your mnemonic or private key** with anyone
2. **Store mnemonics offline** in a secure location (consider hardware wallets)
3. **This tool is for educational and development purposes** - for significant funds, use hardware wallets
4. **Double-check addresses** before sending transactions
5. **Use this tool on a trusted device** - avoid public computers or unsecured networks

### How This Tool Maintains Privacy

- ✅ All operations run in your browser (client-side only)
- ✅ No network requests are made with sensitive data
- ✅ No analytics or tracking
- ✅ No logs or data storage on servers
- ✅ Open source code - verify yourself

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

## Project Structure

```
test-generate-address/
├── src/
│   ├── components/         # React components
│   │   ├── AppLayout.tsx           # Main layout wrapper
│   │   ├── CosmosWalletGenerator.tsx    # Address converter
│   │   ├── MnemonicGenerator.tsx        # Mnemonic generator
│   │   ├── UniversalWalletGenerator.tsx # Multi-chain wallet
│   │   ├── Header.tsx               # Navigation header
│   │   ├── LanguageSelector.tsx     # i18n selector
│   │   └── ...
│   ├── store/              # Jotai state atoms
│   ├── i18n/               # Translation files
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (enforced by ESLint)
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes before submitting PR

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Cosmos SDK](https://github.com/cosmos/cosmos-sdk) - Blockchain framework
- [CosmJS](https://github.com/cosmos/cosmjs) - JavaScript library for Cosmos
- [Ant Design](https://ant.design/) - UI component library
- [Vercel](https://vercel.com/) - Deployment platform

## Disclaimer

This tool is provided "as is" without warranty of any kind. The developers are not responsible for any losses incurred through the use of this software. Always verify generated addresses and practice safe key management.

For production use cases involving significant funds, we strongly recommend using hardware wallets like Ledger or Trezor.

## Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/MinhAnh-Corp/generate-address-wallet/issues)
- **Live Demo**: [https://generate-address-wallet-xclusive-io.vercel.app/](https://generate-address-wallet-xclusive-io.vercel.app/)

---

Made with ❤️ for the Cosmos ecosystem
