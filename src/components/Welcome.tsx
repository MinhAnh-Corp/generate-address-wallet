import {
  HomeOutlined,
  KeyOutlined, WalletOutlined, SwapOutlined, ApiOutlined, TeamOutlined,
} from '@ant-design/icons';
import {
  Card, Typography, Space, Row, Col, Button,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const {
  Title, Paragraph,
} = Typography;

export function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tools = [
    {
      key: 'mnemonic-generator',
      icon: <KeyOutlined style={{ fontSize: '32px' }} />,
      title: t('Mnemonic Generator'),
      description: t('Generate a BIP39-compliant mnemonic phrase for wallet creation.'),
      path: '/mnemonic-generator',
    },
    {
      key: 'universal',
      icon: <WalletOutlined style={{ fontSize: '32px' }} />,
      title: t('Universal Wallet Generator'),
      description: t('Generate both EVM and Cosmos wallets from a single mnemonic or private key.'),
      path: '/universal',
    },
    {
      key: 'cosmos-converter',
      icon: <SwapOutlined style={{ fontSize: '32px' }} />,
      title: t('Cosmos Address Converter'),
      description: t('Convert a Cosmos Bech32 address to a different prefix while preserving the underlying public key hash.'),
      path: '/cosmos-converter',
    },
    {
      key: 'rpc-tester',
      icon: <ApiOutlined style={{ fontSize: '32px' }} />,
      title: t('RPC Tester'),
      description: t('Test if an RPC endpoint is working by connecting to it and retrieving basic information.'),
      path: '/rpc-tester',
    },
    {
      key: 'who-we-are',
      icon: <TeamOutlined style={{ fontSize: '32px' }} />,
      title: t('Who We Are'),
      description: t('Learn more about Xclusive Corporation and our team.'),
      path: '/who-we-are',
    },
  ];

  return (
    <Card
      style={{
        maxWidth: 1200,
        margin: '40px auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{
          textAlign: 'center', marginBottom: '32px',
        }}>
          <HomeOutlined style={{
            fontSize: '48px', color: '#1890ff', marginBottom: '16px',
          }} />
          <Title level={1}>{t('Wallet Tools')}</Title>
          <Paragraph style={{
            fontSize: '16px', maxWidth: '600px', margin: '0 auto',
          }}>
            {t('A collection of powerful tools for wallet generation, address conversion, and RPC testing.')}
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {tools.map((tool) => (
            <Col xs={24} sm={12} lg={8} key={tool.key}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(tool.path)}
                bodyStyle={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                }}
              >
                <div style={{
                  marginBottom: '16px', color: '#1890ff',
                }}>
                  {tool.icon}
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  {tool.title}
                </Title>
                <Paragraph
                  type="secondary"
                  style={{
                    marginBottom: '16px',
                    minHeight: '48px',
                  }}
                >
                  {tool.description as string}
                </Paragraph>
                <Button type="primary" onClick={(e) => {
                  e.stopPropagation();
                  navigate(tool.path);
                }}>
                  {t('Open')}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
}
