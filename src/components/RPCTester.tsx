import { useState, useEffect } from 'react';

import {
  ApiOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import {
  Card, Form, Input, Button, Typography, message, Space, Radio, Alert, Spin, Select,
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
    gasPrice?: string;
    blockTime?: number;
    nodeInfo?: {
      network?: string;
      version?: string;
      [key: string]: unknown;
    };
    latestBlockHeight?: string;
    syncInfo?: {
      latest_block_height?: string;
      earliest_block_height?: string;
      catching_up?: boolean;
    };
  };
}

interface DefaultRPC {
  label: string;
  url: string;
  type: 'eth' | 'cosmos';
}

const DEFAULT_RPCS: DefaultRPC[] = [
  {
    label: 'Ethereum Mainnet',
    url: 'https://eth.llamarpc.com',
    type: 'eth',
  },
  {
    label: 'Ethereum Mainnet (Public)',
    url: 'https://rpc.ankr.com/eth',
    type: 'eth',
  },
  {
    label: 'Kaia Mainnet',
    url: 'https://public-en.node.kaia.io',
    type: 'eth',
  },
  {
    label: 'Cosmos Hub (Polkachu)',
    url: 'https://cosmos-rpc.polkachu.com',
    type: 'cosmos',
  },
  {
    label: 'STOC Mainnet',
    url: 'https://rpc-stoc-mainnet.stochainscan.io',
    type: 'cosmos',
  },
  {
    label: 'STOC Testnet',
    url: 'https://rpc-stoc-testnet.stochainscan.io',
    type: 'cosmos',
  },
];

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
        latestBlock,
        gasPrice,
      ] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork().then((n) => n.chainId.toString()),
        provider.send('net_version', []).catch(() => 'N/A'),
        provider.getBlock('latest').catch(() => null),
        provider.getFeeData().catch(() => null),
      ]);

      const responseTime = Date.now() - startTime;
      const blockTime = latestBlock?.timestamp ? Date.now() / 1000 - Number(latestBlock.timestamp) : undefined;

      return {
        success: true,
        responseTime,
        details: {
          chainId,
          blockNumber: blockNumber.toString(),
          networkId: networkId.toString(),
          gasPrice: gasPrice?.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : undefined,
          blockTime: blockTime ? Math.round(blockTime) : undefined,
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

      const nodeInfo = data.result?.node_info;
      const syncInfo = data.result?.sync_info;

      return {
        success: true,
        responseTime,
        details: {
          nodeInfo,
          latestBlockHeight: syncInfo?.latest_block_height,
          syncInfo: {
            latest_block_height: syncInfo?.latest_block_height,
            earliest_block_height: syncInfo?.earliest_block_height,
            catching_up: syncInfo?.catching_up,
          },
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
      <Alert
        message={t('How to Use')}
        description={t('If you don\'t have an RPC URL, select one from the dropdown below or paste your RPC URL in the input field.')}
        type="info"
        showIcon
        style={{
          marginBottom: 24, fontSize: '14px',
        }}
      />

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
              form.setFieldValue('rpcUrl', '');
            }}
          >
            <Radio value="eth">{t('Ethereum (ETH)')}</Radio>
            <Radio value="cosmos">{t('Cosmos')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('Quick Select (Optional)')}
        >
          <Select
            placeholder={t('Select a default RPC endpoint')}
            style={{ width: '100%' }}
            onChange={(value) => {
              if (value) {
                const selectedRPC = DEFAULT_RPCS.find((rpc) => rpc.url === value);
                if (selectedRPC) {
                  setRpcType(selectedRPC.type);
                  form.setFieldValue('rpcUrl', selectedRPC.url);
                }
              } else {
                form.setFieldValue('rpcUrl', '');
              }
            }}
            options={DEFAULT_RPCS.map((rpc) => ({
              label: `${rpc.label} (${rpc.type === 'eth' ? 'ETH' : 'Cosmos'})`,
              value: rpc.url,
            }))}
            allowClear
            showSearch
            filterOption={(input, option) => {
              if (!option) return false;
              return (
                (option.label as string)?.toLowerCase().includes(input.toLowerCase()) ||
                (option.value as string)?.toLowerCase().includes(input.toLowerCase())
              );
            }}
          />
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
                        {result.details.gasPrice && (
                          <Text>
                            {t('Gas Price')}: <Text strong code>{result.details.gasPrice} Gwei</Text>
                          </Text>
                        )}
                        {result.details.blockTime !== undefined && (
                          <Text>
                            {t('Block Age')}: <Text strong code>{result.details.blockTime}s ago</Text>
                          </Text>
                        )}
                      </>
                    )}
                    {rpcType === 'cosmos' && result.details && (
                      <>
                        {result.details.nodeInfo?.network && (
                          <Text>
                            {t('Network')}: <Text strong code>{result.details.nodeInfo.network}</Text>
                          </Text>
                        )}
                        {result.details.nodeInfo?.version && (
                          <Text>
                            {t('Version')}: <Text strong code>{result.details.nodeInfo.version}</Text>
                          </Text>
                        )}
                        {result.details.latestBlockHeight && (
                          <Text>
                            {t('Latest Block Height')}: <Text strong code>{result.details.latestBlockHeight}</Text>
                          </Text>
                        )}
                        {result.details.syncInfo?.earliest_block_height && (
                          <Text>
                            {t('Earliest Block Height')}: <Text strong code>{result.details.syncInfo.earliest_block_height}</Text>
                          </Text>
                        )}
                        {result.details.syncInfo?.catching_up !== undefined && (
                          <Text>
                            {t('Sync Status')}: <Text strong code>{result.details.syncInfo.catching_up ? t('Catching Up') : t('Synced')}</Text>
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
