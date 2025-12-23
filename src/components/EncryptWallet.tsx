import { useState, useEffect } from 'react';

import {
  LockOutlined, UnlockOutlined, CopyOutlined, KeyOutlined,
} from '@ant-design/icons';
import {
  Card, Form, Input, Button, Typography, message, Space, Tabs, Alert,
} from 'antd';
import * as CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { TextArea } = Input;

export function EncryptWallet() {
  const [encryptForm] = Form.useForm();
  const [decryptForm] = Form.useForm();
  const [encryptedResult, setEncryptedResult] = useState<string>('');
  const [decryptedResult, setDecryptedResult] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const generateEncryptionKey = () => {
    try {
      const key = CryptoJS.lib.WordArray.random(32).toString();
      encryptForm.setFieldValue('encryptionKey', key);
      message.success(t('Encryption key generated successfully!'));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.error(t('Error generating key: {error}', { error: errorMessage }));
    }
  };

  const handleEncrypt = async (values: { privateKey: string; encryptionKey: string }) => {
    const {
      privateKey, encryptionKey: key,
    } = values;
    if (!privateKey || !key) {
      message.error(t('Please enter both private key and encryption key'));
      return;
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(privateKey, key).toString();
      setEncryptedResult(encrypted);
      message.success(t('Encryption successful!'));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.error(t('Encryption failed: {error}', { error: errorMessage }));
    }
  };

  const handleDecrypt = async (values: { encryptedKey: string; encryptionKey: string }) => {
    const {
      encryptedKey, encryptionKey: key,
    } = values;
    if (!encryptedKey || !key) {
      message.error(t('Please enter both encrypted key and encryption key'));
      return;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedKey, key);
      const plainText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plainText) {
        throw new Error(t('Decryption failed - wrong key or corrupted data'));
      }

      setDecryptedResult(plainText);
      message.success(t('Decryption successful!'));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.error(t('Decryption failed: {error}', { error: errorMessage }));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(t('{label} copied to clipboard!', { label }));
  };

  return (
    <Card
      title={<Space><KeyOutlined /> {t('Encrypt Wallet')}</Space>}
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
      <Alert
        message={t('Security Notice')}
        description={t('All encryption and decryption happens in your browser. Your private keys are never sent to any server.')}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Tabs
        items={[
          {
            key: 'encrypt',
            label: (
              <Space>
                <LockOutlined />
                {t('Encrypt')}
              </Space>
            ),
            children: (
              <Form
                form={encryptForm}
                layout="vertical"
                onFinish={handleEncrypt}
              >
                <Form.Item
                  label={t('Encryption Key')}
                  name="encryptionKey"
                  rules={[
                    {
                      required: true,
                      message: t('Please enter encryption key'),
                    },
                  ]}
                  extra={
                    <Button
                      type="link"
                      size="small"
                      onClick={generateEncryptionKey}
                      style={{ padding: 0 }}
                    >
                      {t('Generate New Key')}
                    </Button>
                  }
                >
                  <Input.Password
                    placeholder={t('Enter or generate encryption key')}
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>

                <Form.Item
                  label={t('Private Key or Mnemonic')}
                  name="privateKey"
                  rules={[
                    {
                      required: true,
                      message: t('Please enter private key or mnemonic'),
                    },
                  ]}
                >
                  <TextArea
                    placeholder={t('Enter private key or mnemonic phrase to encrypt')}
                    rows={4}
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block icon={<LockOutlined />}>
                    {t('Encrypt')}
                  </Button>
                </Form.Item>

                {encryptedResult && (
                  <>
                    <Alert
                      message={t('Encrypted Result')}
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>{t('Save this encrypted value:')}</Text>
                          <Space.Compact style={{ width: '100%' }}>
                            <Input
                              value={encryptedResult}
                              readOnly
                              style={{
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f5f5',
                              }}
                            />
                            <Button
                              icon={<CopyOutlined />}
                              onClick={() => copyToClipboard(encryptedResult, t('Encrypted Key'))}
                            >
                              {t('Copy')}
                            </Button>
                          </Space.Compact>
                        </Space>
                      }
                      type="success"
                      showIcon
                      style={{ marginTop: 16 }}
                    />
                  </>
                )}
              </Form>
            ),
          },
          {
            key: 'decrypt',
            label: (
              <Space>
                <UnlockOutlined />
                {t('Decrypt')}
              </Space>
            ),
            children: (
              <Form
                form={decryptForm}
                layout="vertical"
                onFinish={handleDecrypt}
              >
                <Form.Item
                  label={t('Encryption Key')}
                  name="encryptionKey"
                  rules={[
                    {
                      required: true,
                      message: t('Please enter encryption key'),
                    },
                  ]}
                >
                  <Input.Password
                    placeholder={t('Enter the encryption key used for encryption')}
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>

                <Form.Item
                  label={t('Encrypted Private Key')}
                  name="encryptedKey"
                  rules={[
                    {
                      required: true,
                      message: t('Please enter encrypted private key'),
                    },
                  ]}
                >
                  <TextArea
                    placeholder={t('Enter encrypted private key to decrypt')}
                    rows={4}
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block icon={<UnlockOutlined />}>
                    {t('Decrypt')}
                  </Button>
                </Form.Item>

                {decryptedResult && (
                  <>
                    <Alert
                      message={t('Decrypted Result')}
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>{t('Your decrypted private key:')}</Text>
                          <Space.Compact style={{ width: '100%' }}>
                            <Input
                              value={decryptedResult}
                              readOnly
                              type="password"
                              style={{
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f5f5',
                              }}
                            />
                            <Button
                              icon={<CopyOutlined />}
                              onClick={() => copyToClipboard(decryptedResult, t('Decrypted Key'))}
                            >
                              {t('Copy')}
                            </Button>
                          </Space.Compact>
                          <Text type="danger" style={{ fontSize: '12px' }}>
                            {t('⚠️ Keep this private key secure and never share it with anyone!')}
                          </Text>
                        </Space>
                      }
                      type="warning"
                      showIcon
                      style={{ marginTop: 16 }}
                    />
                  </>
                )}
              </Form>
            ),
          },
        ]}
      />

      <div style={{
        marginTop: 20, textAlign: 'center',
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('Encrypt and decrypt private keys or mnemonic phrases using AES encryption. All operations are performed locally in your browser.')}
        </Text>
      </div>
    </Card>
  );
}
