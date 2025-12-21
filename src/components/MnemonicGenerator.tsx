import { useState, useEffect } from 'react';

import {
  CopyOutlined, KeyOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
  Card, Form, Button, Typography, message, Space, Radio, Input, Alert,
} from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { TextArea } = Input;

type WordCount = 12 | 15 | 18 | 21 | 24;

interface FormValues {
  wordCount?: WordCount;
}

const VALID_WORD_COUNTS: WordCount[] = [
  12,
  15,
  18,
  21,
  24,
];

export function MnemonicGenerator() {
  const [form] = Form.useForm();
  const [mnemonic, setMnemonic] = useState('');
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

  const generateNewMnemonic = (wordCount: WordCount = 12) => {
    try {
      const strength = (wordCount / 3) * 32;
      const newMnemonic = generateMnemonic(wordlist, strength);
      setMnemonic(newMnemonic);
      message.success(t('Generated {count}-word mnemonic successfully!', { count: wordCount }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(t('Error generating mnemonic: {error}', { error: errorMessage }));
      console.error(error);
    }
  };

  const handleSubmit = (values: FormValues) => {
    const wordCount = values.wordCount || 12;
    generateNewMnemonic(wordCount);
  };

  const copyToClipboard = () => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic);
      message.success(t('Mnemonic copied to clipboard!'));
    }
  };

  return (
    <Card
      title={<Space><KeyOutlined /> {t('Mnemonic Generator')}</Space>}
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
        initialValues={{ wordCount: 12 }}
      >
        <Form.Item
          label={t('Number of Words')}
          name="wordCount"
          rules={[
            {
              required: true, message: t('Please select number of words!'),
            },
          ]}
        >
          <Radio.Group>
            {VALID_WORD_COUNTS.map((count) => (
              <Radio key={count} value={count}>
                {count} {t('words')}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Alert
          message={t('Valid word counts')}
          description={t('BIP39 supports the following word counts: 12, 15, 18, 21, 24 words. These correspond to entropy strengths of 128, 160, 192, 224, and 256 bits respectively.')}
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block icon={<ReloadOutlined />}>
            {t('Generate Mnemonic')}
          </Button>
        </Form.Item>
      </Form>

      {mnemonic && (
        <>
          <div style={{ marginTop: 24 }}>
            <Text strong>{t('Generated Mnemonic:')}</Text>
            <Space.Compact style={{
              width: '100%', marginTop: 8,
            }}>
              <TextArea
                value={mnemonic}
                readOnly
                rows={4}
                style={{
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5',
                  fontSize: '14px',
                }}
              />
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={copyToClipboard}
                style={{ height: 'auto' }}
              >
                {t('Copy')}
              </Button>
            </Space.Compact>
          </div>

          <div style={{
            marginTop: 16, textAlign: 'center',
          }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <Text type="warning" strong>⚠️ Security Warning:</Text>
              {' '}
              Keep this mnemonic phrase secure and never share it with anyone.
              Anyone with access to this phrase can control your wallet.
            </Text>
          </div>
        </>
      )}

      <div style={{
        marginTop: 20, textAlign: 'center',
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('Generate a BIP39-compliant mnemonic phrase for wallet creation.')}
        </Text>
      </div>
    </Card>
  );
}
