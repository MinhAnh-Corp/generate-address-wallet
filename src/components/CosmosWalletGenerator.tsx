import { useState, useEffect } from 'react';

import {
  CopyOutlined, WalletOutlined, SwapOutlined,
} from '@ant-design/icons';
import {
  Card, Form, Input, Button, Typography, message, Space,
} from 'antd';
import { bech32 } from 'bech32';
import { useAtomValue } from 'jotai';

import {
  explanationsAtom, EXPLANATION_KEYS,
} from '../store/explanations';

import { CodeExplanationButton } from './CodeExplanationButton';

const { Text } = Typography;

interface FormValues {
  existingAddress?: string;
  networkPrefix?: string;
}

export function CosmosWalletGenerator() {
  const [form] = Form.useForm();
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const explanations = useAtomValue(explanationsAtom);

  const handleValuesChange = (_: unknown, allValues: FormValues) => {
    const {
      existingAddress, networkPrefix,
    } = allValues;
    generateAddress(existingAddress || '', networkPrefix || '');
  };

  const generateAddress = (existingAddress: string, networkPrefix: string) => {
    setGeneratedAddress('');
    setHasError(false);

    if (!existingAddress) return;

    try {
      const decoded = bech32.decode(existingAddress);

      if (!networkPrefix) {
        // Just silent return if prefix is empty, form validation will handle visual error if submitted (though we calculate inline)
        return;
      }

      const newAddress = bech32.encode(networkPrefix, decoded.words);
      setGeneratedAddress(newAddress);
    } catch {
      if (existingAddress.length > 5) { // Only flag error if user has typed something substantial
        setHasError(true);
      }
    }
  };

  const copyToClipboard = () => {
    if (generatedAddress) {
      navigator.clipboard.writeText(generatedAddress);
      message.success('Address copied to clipboard!');
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      networkPrefix: 'stoc',
    });
  }, [form]);

  return (
    <Card
      title={<Space><WalletOutlined /> Cosmos Address Converter</Space>}
      style={{
        maxWidth: 600,
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
        onValuesChange={handleValuesChange}
        initialValues={{ networkPrefix: 'stoc' }}
      >
        <Form.Item
          label="Existing Cosmos Address"
          name="existingAddress"
          validateStatus={hasError ? 'error' : ''}
          help={hasError ? 'Invalid bech32 address' : null}
        >
          <Input
            placeholder="cosmos1..."
            size="large"
            allowClear
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <div style={{
          display: 'flex', justifyContent: 'center', margin: '10px 0',
        }}>
            <SwapOutlined rotate={90} style={{
              fontSize: '20px', color: '#1890ff',
            }} />
        </div>

        <Form.Item
          label="Network Prefix"
          name="networkPrefix"
          rules={[
            {
              required: true, message: 'Please input network prefix!',
            },
          ]}
        >
          <Input
            placeholder="e.g. stoc"
            size="large"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item label="Generated Address">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={generatedAddress}
              readOnly
              size="large"
              style={{
                fontFamily: 'monospace', backgroundColor: '#f5f5f5', color: '#000',
              }}
              placeholder="Generated address will appear here"
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              disabled={!generatedAddress}
              size="large"
            >
              Copy
            </Button>
          </Space.Compact>
        </Form.Item>

        <div style={{
          marginTop: 20, textAlign: 'center',
        }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
                Converts any Bech32 address to a new prefix while preserving the underlying public key hash.
            </Text>
        </div>
      </Form>

      <CodeExplanationButton
        markdown={explanations[EXPLANATION_KEYS.COSMOS_CONVERTER]}
      />
    </Card>
  );
}
