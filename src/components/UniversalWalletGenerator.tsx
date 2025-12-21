import { useState } from 'react';

import {
  CopyOutlined, WalletOutlined, KeyOutlined,
} from '@ant-design/icons';
import { Secp256k1, sha256 } from '@cosmjs/crypto';
import { toBech32, fromHex } from '@cosmjs/encoding';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import {
  Card, Form, Input, Button, Typography, message, Space, Tabs, Radio, Divider,
} from 'antd';
import { ethers } from 'ethers';
import { ripemd160 } from 'hash.js';

import { CodeExplanationButton } from './CodeExplanationButton';

const { Text } = Typography;
const { TextArea } = Input;

interface WalletResult {
  evmAddress: string;
  evmPrivateKey: string;
  cosmosAddress: string;
  cosmosPrivateKey: string;
  cosmosAddressHash: Uint8Array;
  cosmosPrefix: string;
}

interface FormValues {
  input?: string;
  cosmosPrefix?: string;
}

export function UniversalWalletGenerator() {
  const [form] = Form.useForm();
  const [inputType, setInputType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [walletResult, setWalletResult] = useState<WalletResult | null>(null);
  const [cosmosPrefix, setCosmosPrefix] = useState('cosmos');

  const generateWallets = async (input: string, type: 'mnemonic' | 'privateKey', prefix?: string) => {
    const currentPrefix = prefix || cosmosPrefix;
    try {
      let evmWallet: ethers.Wallet | ethers.HDNodeWallet;
      let cosmosPrivateKeyHex: string;

      if (type === 'mnemonic') {
        if (!ethers.Mnemonic.isValidMnemonic(input.trim())) {
          message.error('Invalid mnemonic phrase');
          return;
        }
        const mnemonic = input.trim();

        evmWallet = ethers.Wallet.fromPhrase(mnemonic);

        const seed = mnemonicToSeedSync(mnemonic);
        const hdKey = HDKey.fromMasterSeed(seed);
        const cosmosHdPath = "m/44'/118'/0'/0/0";
        const cosmosNode = hdKey.derive(cosmosHdPath);
        if (!cosmosNode.privateKey) {
          throw new Error('Failed to derive Cosmos private key');
        }
        const privateKeyArray = new Uint8Array(cosmosNode.privateKey);
        cosmosPrivateKeyHex = Array.from(privateKeyArray)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } else {
        const privateKey = input.trim().startsWith('0x') ? input.trim() : `0x${input.trim()}`;
        if (!ethers.isHexString(privateKey) || privateKey.length !== 66) {
          message.error('Invalid private key. Must be 64 hex characters (with or without 0x prefix)');
          return;
        }
        evmWallet = new ethers.Wallet(privateKey);
        cosmosPrivateKeyHex = privateKey.slice(2);
      }

      const evmAddress = evmWallet.address;
      const evmPrivateKey = evmWallet.privateKey;

      const cosmosPrivateKeyBytes = fromHex(cosmosPrivateKeyHex);
      const cosmosPublicKey = await Secp256k1.makeKeypair(cosmosPrivateKeyBytes);
      const cosmosPubkeyBytes = Secp256k1.compressPubkey(cosmosPublicKey.pubkey);
      const sha256Hash = sha256(cosmosPubkeyBytes);
      const ripemd160HashArray = ripemd160().update(sha256Hash).digest();
      const ripemd160Hash = new Uint8Array(ripemd160HashArray);
      const cosmosAddress = toBech32(currentPrefix, ripemd160Hash);

      setWalletResult({
        evmAddress,
        evmPrivateKey,
        cosmosAddress,
        cosmosPrivateKey: `0x${cosmosPrivateKeyHex}`,
        cosmosAddressHash: ripemd160Hash,
        cosmosPrefix: currentPrefix,
      });

      message.success('Wallets generated successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(`Error generating wallets: ${errorMessage}`);
      console.error(error);
    }
  };

  const handleSubmit = (values: FormValues) => {
    const input = values.input?.trim();
    const prefix = values.cosmosPrefix || cosmosPrefix;
    if (!input) {
      message.error('Please enter mnemonic or private key');
      return;
    }
    setCosmosPrefix(prefix);
    generateWallets(input, inputType, prefix);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} copied to clipboard!`);
  };

  const codeExplanation = {
    title: 'How to Generate EVM and Cosmos Wallets',
    description: 'This tool generates both EVM and Cosmos wallets from a mnemonic or private key. Here\'s how it works:',
    code: `// For EVM Wallet (using ethers.js)
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
// This is why they generate different addresses from the same mnemonic`,
    language: 'typescript',
  };

  return (
    <Card
      title={<Space><WalletOutlined /> Universal Wallet Generator</Space>}
      style={{
        maxWidth: 800, margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item label="Input Type">
          <Radio.Group
            value={inputType}
            onChange={(e) => {
              setInputType(e.target.value);
              form.setFieldValue('input', '');
              setWalletResult(null);
            }}
          >
            <Radio value="mnemonic">Mnemonic</Radio>
            <Radio value="privateKey">Private Key</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={inputType === 'mnemonic' ? 'Mnemonic Phrase' : 'Private Key'}
          name="input"
          rules={[
            {
              required: true, message: `Please input ${inputType === 'mnemonic' ? 'mnemonic phrase' : 'private key'}!`,
            },
          ]}
        >
          <TextArea
            placeholder={inputType === 'mnemonic' ? 'Enter your 12 or 24 word mnemonic phrase' : 'Enter private key (hex format, with or without 0x prefix)'}
            rows={inputType === 'mnemonic' ? 3 : 2}
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item
          label="Cosmos Address Prefix"
          name="cosmosPrefix"
          initialValue="cosmos"
        >
          <Input
            placeholder="e.g. cosmos, stoc, osmo"
            onChange={(e) => {
              setCosmosPrefix(e.target.value);
            }}
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            <KeyOutlined /> Generate Wallets
          </Button>
        </Form.Item>
      </Form>

      {walletResult && (
        <>
          <Divider>Generated Wallets</Divider>

          <Tabs
            items={[
              {
                key: 'evm',
                label: 'EVM Wallet',
                children: (
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                      <Text strong>Address:</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.evmAddress}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.evmAddress, 'EVM Address')}
                        >
                          Copy
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>Private Key:</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.evmPrivateKey}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.evmPrivateKey, 'EVM Private Key')}
                        >
                          Copy
                        </Button>
                      </Space.Compact>
                    </div>
                  </Space>
                ),
              },
              {
                key: 'cosmos',
                label: 'Cosmos Wallet',
                children: (
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                      <Text strong>Address ({walletResult.cosmosPrefix}):</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.cosmosAddress}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.cosmosAddress, 'Cosmos Address')}
                        >
                          Copy
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>Private Key:</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.cosmosPrivateKey}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.cosmosPrivateKey, 'Cosmos Private Key')}
                        >
                          Copy
                        </Button>
                      </Space.Compact>
                    </div>
                  </Space>
                ),
              },
            ]}
          />
        </>
      )}

      <div style={{
        marginTop: 20, textAlign: 'center',
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Generate both EVM and Cosmos wallets from a single mnemonic or private key.
        </Text>
      </div>

      <CodeExplanationButton explanation={codeExplanation} />
    </Card>
  );
}
