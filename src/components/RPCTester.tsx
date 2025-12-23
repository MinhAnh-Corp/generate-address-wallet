import { useState, useEffect } from 'react';

import {
  ApiOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import {
  Card, Form, Input, Button, Typography, message, Space, Radio, Alert, Spin,
} from 'antd';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { TextArea } = Input;

interface RPCResult {
  success: boolean;
  responseTime: number;
  error?: string;
  details?: {
    chainId?: string;
    blockNumber?: string;
    networkId?: string;
    nodeInfo?: {
      network?: string;
      version?: string;
      [key: string]: unknown;
    };
  };
}

export function RPCTester() {
  const [form] = Form.useForm();
  const [rpcType, setRpcType] = useState<'eth' | 'cosmos'>('eth');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<RPCResult | null>(null);
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

  const testETHRPC = async (rpcUrl: string): Promise<RPCResult> => {
    const startTime = Date.now();
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
        staticNetwork: false,
      });

      const [
        blockNumber,
        chainId,
        networkId,
      ] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork().then((n) => n.chainId.toString()),
        provider.send('net_version', []).catch(() => 'N/A'),
      ]);

      const responseTime = Date.now() - startTime;

      return {
        success: true,
        responseTime,
        details: {
          chainId,
          blockNumber: blockNumber.toString(),
          networkId: networkId.toString(),
        },
      };
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        responseTime,
        error: errorMessage,
      };
    }
  };

  const testCosmosRPC = async (rpcUrl: string): Promise<RPCResult> => {
    const startTime = Date.now();
    try {
      const baseUrl = rpcUrl.replace(/\/$/, '');
      const statusUrl = `${baseUrl}/status`;

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        responseTime,
        details: {
          nodeInfo: data.result?.node_info,
        },
      };
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        responseTime,
        error: errorMessage,
      };
    }
  };

  const handleTest = async (values: { rpcUrl: string }) => {
    const { rpcUrl } = values;
    if (!rpcUrl || !rpcUrl.trim()) {
      message.error(t('Please enter RPC URL'));
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const testResult = rpcType === 'eth'
        ? await testETHRPC(rpcUrl.trim())
        : await testCosmosRPC(rpcUrl.trim());

      setResult(testResult);

      if (testResult.success) {
        message.success(t('RPC is working!'));
      } else {
        message.error(t('RPC test failed'));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({
        success: false,
        responseTime: 0,
        error: errorMessage,
      });
      message.error(t('Error testing RPC: {error}', { error: errorMessage }));
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card
      title={<Space><ApiOutlined /> {t('RPC Tester')}</Space>}
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
        onFinish={handleTest}
        initialValues={{
          rpcType: 'eth',
        }}
      >
        <Form.Item label={t('RPC Type')}>
          <Radio.Group
            value={rpcType}
            onChange={(e) => {
              setRpcType(e.target.value);
              setResult(null);
            }}
          >
            <Radio value="eth">{t('Ethereum (ETH)')}</Radio>
            <Radio value="cosmos">{t('Cosmos')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('RPC URL')}
          name="rpcUrl"
          rules={[
            {
              required: true,
              message: t('Please enter RPC URL'),
            },
            {
              type: 'url',
              message: t('Please enter a valid URL'),
            },
          ]}
        >
          <TextArea
            placeholder={rpcType === 'eth'
              ? t('Enter Ethereum RPC URL (e.g., https://eth.llamarpc.com)')
              : t('Enter Cosmos RPC URL (e.g., https://rpc.cosmos.network)')}
            rows={2}
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={testing}
            icon={<ApiOutlined />}
          >
            {testing ? t('Testing...') : t('Test RPC')}
          </Button>
        </Form.Item>
      </Form>

      {testing && (
        <div style={{
          textAlign: 'center', padding: '20px',
        }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">{t('Testing RPC connection...')}</Text>
          </div>
        </div>
      )}

      {result && !testing && (
        <>
          <Alert
            message={result.success ? t('RPC is Working') : t('RPC Test Failed')}
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  {t('Response Time')}: <Text strong>{result.responseTime}ms</Text>
                </Text>
                {result.success ? (
                  <>
                    {rpcType === 'eth' && result.details && (
                      <>
                        {result.details.chainId && (
                          <Text>
                            {t('Chain ID')}: <Text strong code>{result.details.chainId}</Text>
                          </Text>
                        )}
                        {result.details.blockNumber && (
                          <Text>
                            {t('Latest Block')}: <Text strong code>{result.details.blockNumber}</Text>
                          </Text>
                        )}
                        {result.details.networkId && (
                          <Text>
                            {t('Network ID')}: <Text strong code>{result.details.networkId}</Text>
                          </Text>
                        )}
                      </>
                    )}
                    {rpcType === 'cosmos' && result.details?.nodeInfo && (
                      <>
                        {result.details.nodeInfo.network && (
                          <Text>
                            {t('Network')}: <Text strong code>{result.details.nodeInfo.network}</Text>
                          </Text>
                        )}
                        {result.details.nodeInfo.version && (
                          <Text>
                            {t('Version')}: <Text strong code>{result.details.nodeInfo.version}</Text>
                          </Text>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <Text type="danger">
                    {t('Error')}: {result.error}
                  </Text>
                )}
              </Space>
            }
            type={result.success ? 'success' : 'error'}
            icon={result.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      )}

      <div style={{
        marginTop: 20, textAlign: 'center',
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('Test if an RPC endpoint is working by connecting to it and retrieving basic information.')}
        </Text>
      </div>
    </Card>
  );
}
