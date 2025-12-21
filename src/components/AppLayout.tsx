import { useState } from 'react';

import {
  WalletOutlined, SwapOutlined, MoonOutlined, SunOutlined,
} from '@ant-design/icons';
import {
  Layout, Menu, Switch, Space, Typography, theme,
} from 'antd';

import { CosmosWalletGenerator } from './CosmosWalletGenerator';
import { UniversalWalletGenerator } from './UniversalWalletGenerator';

const {
  Sider, Content,
} = Layout;
const { Text } = Typography;

type MenuKey = 'universal' | 'cosmos-converter';

interface AppLayoutProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export function AppLayout({
  isDark, onThemeChange,
}: AppLayoutProps) {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('universal');

  const { token: { colorBgContainer } } = theme.useToken();

  const menuItems = [
    {
      key: 'universal',
      icon: <WalletOutlined />,
      label: 'Universal Wallet Generator',
    },
    {
      key: 'cosmos-converter',
      icon: <SwapOutlined />,
      label: 'Cosmos Address Converter',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'universal':
        return <UniversalWalletGenerator />;
      case 'cosmos-converter':
        return <CosmosWalletGenerator />;
      default:
        return <UniversalWalletGenerator />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        style={{
          background: colorBgContainer,
          borderRight: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
        }}
        theme={isDark ? 'dark' : 'light'}
      >
        <div style={{
          padding: '20px 16px', borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
        }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Text strong style={{ fontSize: '18px' }}>
              Wallet Tools
            </Text>
            <Space>
              <SunOutlined style={{ color: isDark ? '#888' : '#1890ff' }} />
              <Switch
                checked={isDark}
                onChange={onThemeChange}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
              <MoonOutlined style={{ color: isDark ? '#1890ff' : '#888' }} />
            </Space>
          </Space>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key as MenuKey)}
          style={{
            borderRight: 0, height: 'calc(100vh - 120px)',
          }}
          theme={isDark ? 'dark' : 'light'}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
