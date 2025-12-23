import {
  useState, useRef, useEffect,
} from 'react';

import {
  CopyOutlined, WalletOutlined, KeyOutlined,
} from '@ant-design/icons';
import { Secp256k1, sha256 } from '@cosmjs/crypto';
import { toBech32, fromHex, toHex } from '@cosmjs/encoding';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import {
  Card, Form, Input, Button, Typography, message, Space, Tabs, Radio, Divider, Alert, AutoComplete,
} from 'antd';
import { ethers } from 'ethers';
import { ripemd160 } from 'hash.js';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { TextArea } = Input;

interface WalletResult {
  evmAddress: string;
  evmPrivateKey: string;
  evmPublicKey: string;
  evmPublicKeyUncompressed: string;
  cosmosAddress: string;
  cosmosAddressHex: string;
  cosmosPrivateKey: string;
  cosmosPublicKey: string;
  cosmosPublicKeyUncompressed: string;
  cosmosPrefix: string;
  evmHdPath: string;
  cosmosHdPath: string;
}

interface FormValues {
  input?: string;
  cosmosPrefix?: string;
  hdPath?: string;
}

const validateHdPath = (path: string): boolean => {
  if (!path) return false;
  const hdPathRegex = /^m(\/\d+'?)*$/;
  return hdPathRegex.test(path);
};

interface HdPathOption {
  value: string;
  label: string;
  coinType: number;
}

const COMMON_HD_PATHS: HdPathOption[] = [
  { value: "m/44'/60'/0'/0/0", label: "Ethereum (60) - Wallet 1", coinType: 60 },
  { value: "m/44'/60'/0'/0/1", label: "Ethereum (60) - Wallet 2", coinType: 60 },
  { value: "m/44'/60'/0'/0/2", label: "Ethereum (60) - Wallet 3", coinType: 60 },
  { value: "m/44'/118'/0'/0/0", label: "Cosmos Hub (118) - Wallet 1", coinType: 118 },
  { value: "m/44'/118'/0'/0/1", label: "Cosmos Hub (118) - Wallet 2", coinType: 118 },
  { value: "m/44'/118'/0'/0/2", label: "Cosmos Hub (118) - Wallet 3", coinType: 118 },
  { value: "m/44'/330'/0'/0/0", label: "Terra Classic (330) - Wallet 1", coinType: 330 },
  { value: "m/44'/330'/0'/0/1", label: "Terra Classic (330) - Wallet 2", coinType: 330 },
  { value: "m/44'/330'/0'/0/2", label: "Terra Classic (330) - Wallet 3", coinType: 330 },
  { value: "m/44'/529'/0'/0/0", label: "Terra 2.0 / Secret (529) - Wallet 1", coinType: 529 },
  { value: "m/44'/529'/0'/0/1", label: "Terra 2.0 / Secret (529) - Wallet 2", coinType: 529 },
  { value: "m/44'/529'/0'/0/2", label: "Terra 2.0 / Secret (529) - Wallet 3", coinType: 529 },
  { value: "m/44'/714'/0'/0/0", label: "Binance Chain (714) - Wallet 1", coinType: 714 },
  { value: "m/44'/714'/0'/0/1", label: "Binance Chain (714) - Wallet 2", coinType: 714 },
  { value: "m/44'/501'/0'/0/0", label: "Solana (501) - Wallet 1", coinType: 501 },
  { value: "m/44'/354'/0'/0/0", label: "Polkadot (354) - Wallet 1", coinType: 354 },
  { value: "m/44'/9000'/0'/0/0", label: "Avalanche C-Chain (9000) - Wallet 1", coinType: 9000 },
  { value: "m/44'/0'/0'/0/0", label: "Bitcoin (0) - Wallet 1", coinType: 0 },
  { value: "m/44'/2'/0'/0/0", label: "Litecoin (2) - Wallet 1", coinType: 2 },
  { value: "m/44'/3'/0'/0/0", label: "Dogecoin (3) - Wallet 1", coinType: 3 },
];

export function UniversalWalletGenerator() {
  const [form] = Form.useForm();
  const [inputType, setInputType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [walletResult, setWalletResult] = useState<WalletResult | null>(null);
  const [cosmosPrefix, setCosmosPrefix] = useState('cosmos');
  const [hdPath, setHdPath] = useState("m/44'/118'/0'/0/0");
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const lastSubmittedValues = useRef<{
    input: string;
    inputType: 'mnemonic' | 'privateKey';
    prefix: string;
    hdPath: string;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const deriveEvmWalletFromHdPath = (mnemonic: string, hdPath: string): ethers.Wallet => {
    const seed = mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const node = hdKey.derive(hdPath);
    
    if (!node.privateKey) {
      throw new Error('Failed to derive EVM private key from HD path');
    }

    const privateKeyArray = new Uint8Array(node.privateKey);
    const privateKeyHex = Array.from(privateKeyArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    
    return new ethers.Wallet(`0x${privateKeyHex}`);
  };

  const generateWallets = async (
    input: string,
    type: 'mnemonic' | 'privateKey',
    prefix?: string,
    path?: string,
  ) => {
    const currentPrefix = prefix || cosmosPrefix;
    const currentHdPath = path || hdPath;

    try {
      let evmWallet: ethers.Wallet;
      let cosmosPrivateKeyHex: string;

      if (type === 'mnemonic') {
        if (!ethers.Mnemonic.isValidMnemonic(input.trim())) {
          message.error(t('Invalid mnemonic phrase'));
          return;
        }
        const mnemonic = input.trim();

        if (!validateHdPath(currentHdPath)) {
          message.error(t('Invalid HD path format'));
          return;
        }

        // Use the same HD path for both EVM and Cosmos
        evmWallet = deriveEvmWalletFromHdPath(mnemonic, currentHdPath);

        const seed = mnemonicToSeedSync(mnemonic);
        const hdKey = HDKey.fromMasterSeed(seed);
        const node = hdKey.derive(currentHdPath);
        if (!node.privateKey) {
          throw new Error('Failed to derive private key');
        }
        const privateKeyArray = new Uint8Array(node.privateKey);
        cosmosPrivateKeyHex = Array.from(privateKeyArray)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } else {
        const privateKey = input.trim().startsWith('0x') ? input.trim() : `0x${input.trim()}`;
        if (!ethers.isHexString(privateKey) || privateKey.length !== 66) {
          message.error(t('Invalid private key. Must be 64 hex characters (with or without 0x prefix)'));
          return;
        }
        evmWallet = new ethers.Wallet(privateKey);
        cosmosPrivateKeyHex = privateKey.slice(2);
      }

      const evmAddress = evmWallet.address;
      const evmPrivateKey = evmWallet.privateKey;
      const evmPublicKey = evmWallet.publicKey;
      const evmPublicKeyUncompressed = evmWallet.signingKey.publicKey;

      const cosmosPrivateKeyBytes = fromHex(cosmosPrivateKeyHex);
      const cosmosPublicKey = await Secp256k1.makeKeypair(cosmosPrivateKeyBytes);
      const cosmosPubkeyBytes = Secp256k1.compressPubkey(cosmosPublicKey.pubkey);
      const cosmosPubkeyUncompressed = cosmosPublicKey.pubkey;
      
      const sha256Hash = sha256(cosmosPubkeyBytes);
      const ripemd160HashArray = ripemd160().update(sha256Hash).digest();
      const ripemd160Hash = new Uint8Array(ripemd160HashArray);
      const cosmosAddress = toBech32(currentPrefix, ripemd160Hash);
      const cosmosAddressHex = toHex(ripemd160Hash);

      setWalletResult({
        evmAddress,
        evmPrivateKey,
        evmPublicKey,
        evmPublicKeyUncompressed,
        cosmosAddress,
        cosmosAddressHex,
        cosmosPrivateKey: `0x${cosmosPrivateKeyHex}`,
        cosmosPublicKey: toHex(cosmosPubkeyBytes),
        cosmosPublicKeyUncompressed: toHex(cosmosPubkeyUncompressed),
        cosmosPrefix: currentPrefix,
        evmHdPath: currentHdPath,
        cosmosHdPath: currentHdPath,
      });

      message.success(t('Wallets generated successfully!'));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(t('Error generating wallets: {error}', { error: errorMessage }));
      console.error(error);
    }
  };

  const handleSubmit = (values: FormValues) => {
    const input = values.input?.trim();
    const prefix = values.cosmosPrefix || cosmosPrefix;
    const path = values.hdPath || hdPath;

    if (!input) {
      message.error(t('Please enter mnemonic or private key'));
      return;
    }

    if (inputType === 'mnemonic') {
      if (!validateHdPath(path)) {
        message.error(t('Invalid HD path format'));
        return;
      }
    }

    const currentValues = {
      input,
      inputType,
      prefix,
      hdPath: path,
    };

    if (lastSubmittedValues.current) {
      const {
        input: lastInput,
        inputType: lastInputType,
        prefix: lastPrefix,
        hdPath: lastPath,
      } = lastSubmittedValues.current;

      if (
        lastInput === input
        && lastInputType === inputType
        && lastPrefix === prefix
        && lastPath === path
      ) {
        message.warning(t('No changes detected. Please modify the input or prefix before submitting again.'));
        return;
      }
    }

    lastSubmittedValues.current = currentValues;
    setCosmosPrefix(prefix);
    setHdPath(path);
    generateWallets(input, inputType, prefix, path);
  };

  const copyToClipboard = (
    text: string,
    labelKey: string,
  ) => {
    navigator.clipboard.writeText(text);
    message.success(t('{label} copied to clipboard!', { label: t(labelKey) }));
  };

  return (
    <Card
      title={<Space><WalletOutlined /> {t('Universal Wallet Generator')}</Space>}
      style={{
        maxWidth: 800,
        margin: isMobile ? '20px auto' : '40px auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
      styles={{
        body: {
          padding: isMobile ? '16px' : '24px',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          cosmosPrefix: 'cosmos',
          hdPath: "m/44'/118'/0'/0/0",
        }}
      >
        <Form.Item label={t('Input Type')}>
          <Radio.Group
            value={inputType}
            onChange={(e) => {
              setInputType(e.target.value);
              form.setFieldValue('input', '');
              setWalletResult(null);
              lastSubmittedValues.current = null;
            }}
          >
            <Radio value="mnemonic">{t('Mnemonic')}</Radio>
            <Radio value="privateKey">{t('Private Key')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={inputType === 'mnemonic' ? t('Mnemonic Phrase') : t('Private Key')}
          name="input"
          rules={[
            {
              required: true, message: inputType === 'mnemonic' ? t('Please input mnemonic phrase!') : t('Please input private key!'),
            },
          ]}
        >
          <TextArea
            placeholder={inputType === 'mnemonic' ? t('Enter your 12 or 24 word mnemonic phrase') : t('Enter private key (hex format, with or without 0x prefix)')}
            rows={inputType === 'mnemonic' ? 3 : 2}
            style={{ fontFamily: 'monospace' }}
            onChange={() => {
              lastSubmittedValues.current = null;
            }}
          />
        </Form.Item>

        {inputType === 'mnemonic' && (
          <>
            <Alert
              message={t('Important: HD Path Information')}
              description={t('This HD path will be used for both EVM and Cosmos wallets. MetaMask uses m/44\'/60\'/0\'/0/0 by default for Ethereum. Cosmos chains typically use m/44\'/118\'/0\'/0/0.')}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form.Item
              label={t('HD Derivation Path')}
              name="hdPath"
              initialValue="m/44'/118'/0'/0/0"
              rules={[
                {
                  required: true,
                  message: t('Please enter HD path'),
                },
                {
                  validator: (_, value) => {
                    if (!value || validateHdPath(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('Invalid HD path format. Example: m/44\'/118\'/0\'/0/0')));
                  },
                },
              ]}
            >
              <AutoComplete
                options={COMMON_HD_PATHS.map((path) => ({
                  value: path.value,
                  label: path.label,
                }))}
                placeholder="m/44'/118'/0'/0/0"
                filterOption={(inputValue, option) =>
                  option?.value?.toUpperCase().includes(inputValue.toUpperCase()) ||
                  option?.label?.toUpperCase().includes(inputValue.toUpperCase())
                }
                onChange={(value) => {
                  setHdPath(value);
                  lastSubmittedValues.current = null;
                }}
                style={{ fontFamily: 'monospace' }}
                allowClear
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          label={t('Cosmos Address Prefix')}
          name="cosmosPrefix"
          initialValue="cosmos"
        >
          <Input
            placeholder={t('e.g. cosmos, stoc, osmo')}
            onChange={(e) => {
              setCosmosPrefix(e.target.value);
              lastSubmittedValues.current = null;
            }}
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            <KeyOutlined /> {t('Generate Wallets')}
          </Button>
        </Form.Item>
      </Form>

      {walletResult && (
        <>
          <Divider>{t('Generated Wallets')}</Divider>

          <Tabs
            items={[
              {
                key: 'evm',
                label: t('EVM Wallet'),
                children: (
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {inputType === 'mnemonic' && (
                      <Alert
                        message={t('HD Path')}
                        description={walletResult.evmHdPath}
                        type="info"
                        showIcon
                        style={{ fontFamily: 'monospace' }}
                      />
                    )}
                    <div>
                      <Text strong>{t('Address:')}</Text>
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
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Private Key:')}</Text>
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
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Public Key (Compressed):')}</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.evmPublicKey}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.evmPublicKey, 'EVM Public Key')}
                        >
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Public Key (Uncompressed):')}</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.evmPublicKeyUncompressed}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.evmPublicKeyUncompressed, 'EVM Public Key Uncompressed')}
                        >
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                  </Space>
                ),
              },
              {
                key: 'cosmos',
                label: t('Cosmos Wallet'),
                children: (
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {inputType === 'mnemonic' && (
                      <Alert
                        message={t('HD Path')}
                        description={walletResult.cosmosHdPath}
                        type="info"
                        showIcon
                        style={{ fontFamily: 'monospace' }}
                      />
                    )}
                    <div>
                      <Text strong>{t('Address (Bech32):')} ({walletResult.cosmosPrefix})</Text>
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
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Address (Hex):')}</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.cosmosAddressHex}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.cosmosAddressHex, 'Cosmos Address Hex')}
                        >
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Private Key:')}</Text>
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
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Public Key (Compressed):')}</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.cosmosPublicKey}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.cosmosPublicKey, 'Cosmos Public Key')}
                        >
                          {t('Copy')}
                        </Button>
                      </Space.Compact>
                    </div>
                    <div>
                      <Text strong>{t('Public Key (Uncompressed):')}</Text>
                      <Space.Compact style={{
                        width: '100%', marginTop: 8,
                      }}>
                        <Input
                          value={walletResult.cosmosPublicKeyUncompressed}
                          readOnly
                          style={{
                            fontFamily: 'monospace', backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(walletResult.cosmosPublicKeyUncompressed, 'Cosmos Public Key Uncompressed')}
                        >
                          {t('Copy')}
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
          {t('Generate both EVM and Cosmos wallets from a single mnemonic or private key.')}
        </Text>
      </div>
    </Card>
  );
}
