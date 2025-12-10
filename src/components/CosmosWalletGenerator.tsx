import { useState, useEffect } from 'react';
import { bech32 } from 'bech32';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { CopyOutlined, WalletOutlined, SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;

export function CosmosWalletGenerator() {
  const [form] = Form.useForm();
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [hasError, setHasError] = useState(false);

  // Initialize form values if needed
  useEffect(() => {
    form.setFieldsValue({
      networkPrefix: 'stoc'
    });
  }, [form]);

  const handleValuesChange = (_: any, allValues: any) => {
    const { existingAddress, networkPrefix } = allValues;
    generateAddress(existingAddress, networkPrefix);
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

  return (
    <Card 
      title={<Space><WalletOutlined /> Cosmos Address Converter</Space>} 
      style={{ maxWidth: 600, margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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

        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <SwapOutlined rotate={90} style={{ fontSize: '20px', color: '#1890ff' }} />
        </div>

        <Form.Item
          label="Network Prefix"
          name="networkPrefix"
          rules={[{ required: true, message: 'Please input network prefix!' }]}
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
              style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', color: '#000' }}
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

        <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
                Converts any Bech32 address to a new prefix while preserving the underlying public key hash.
            </Text>
        </div>
      </Form>
    </Card>
  );
}
