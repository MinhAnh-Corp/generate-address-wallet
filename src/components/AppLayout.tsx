import { useState, useEffect } from 'react';

import {
  WalletOutlined, SwapOutlined, MoonOutlined, SunOutlined, MenuOutlined,
} from '@ant-design/icons';
import {
  Layout, Menu, Switch, Space, Typography, theme, Drawer, Button,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { token: { colorBgContainer } } = theme.useToken();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleMenuClick = (key: MenuKey) => {
    setSelectedKey(key);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

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

  const sidebarContent = (
    <>
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
        onClick={({ key }) => handleMenuClick(key as MenuKey)}
        style={{
          borderRight: 0, height: isMobile ? 'auto' : 'calc(100vh - 120px)',
        }}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          width={250}
          style={{
            background: colorBgContainer,
            borderRight: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
          }}
          theme={isDark ? 'dark' : 'light'}
        >
          {sidebarContent}
        </Sider>
      )}

      <Layout>
        {isMobile && (
          <div style={{
            padding: '12px 16px',
            background: colorBgContainer,
            borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text strong style={{ fontSize: '16px' }}>
              Wallet Tools
            </Text>
            <Space>
              <Switch
                checked={isDark}
                onChange={onThemeChange}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                size="small"
              />
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ fontSize: '18px' }}
              />
            </Space>
          </div>
        )}

        <Content
          style={{
            margin: isMobile ? '12px' : '24px',
            padding: 0,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={250}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </Layout>
  );
}
