import { useState, useEffect } from 'react';

import {
  WalletOutlined, SwapOutlined, MoonOutlined, SunOutlined, MenuOutlined, KeyOutlined, TeamOutlined,
} from '@ant-design/icons';
import { Expand } from '@theme-toggles/react';
import '@theme-toggles/react/css/Expand.css';
import {
  Layout, Menu, Switch, Space, Typography, theme, Drawer, Button,
} from 'antd';
import { useAtom } from 'jotai';

import {
  selectedPageAtom,
} from '../store/navigation';
import type {
  MenuKey,
} from '../store/navigation';

import { CosmosWalletGenerator } from './CosmosWalletGenerator';
import { MnemonicGenerator } from './MnemonicGenerator';
import { UniversalWalletGenerator } from './UniversalWalletGenerator';
import { WhoWeAre } from './WhoWeAre';

const {
  Sider, Content, Footer,
} = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export function AppLayout({
  isDark, onThemeChange,
}: AppLayoutProps) {
  const [selectedKey, setSelectedKey] = useAtom(selectedPageAtom);
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
      key: 'mnemonic-generator',
      icon: <KeyOutlined />,
      label: 'Mnemonic Generator',
    },
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
    {
      key: 'who-we-are',
      icon: <TeamOutlined />,
      label: 'Who We Are',
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
      case 'mnemonic-generator':
        return <MnemonicGenerator />;
      case 'universal':
        return <UniversalWalletGenerator />;
      case 'cosmos-converter':
        return <CosmosWalletGenerator />;
      case 'who-we-are':
        return <WhoWeAre />;
      default:
        return <MnemonicGenerator />;
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
          borderRight: 0,
          height: isMobile ? 'auto' : 'calc(100vh - 120px)',
          overflowY: 'auto',
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
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: colorBgContainer,
            borderRight: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
            overflow: 'auto',
            height: '100vh',
          }}
          theme={isDark ? 'dark' : 'light'}
        >
          {sidebarContent}
        </Sider>
      )}

      <Layout style={{ marginLeft: !isMobile ? 250 : 0 }}>
        {isMobile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
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
            <Space align="center" size="middle">
              {/* @ts-expect-error - Expand component type definition issue */}
              <Expand
                toggled={isDark}
                onToggle={onThemeChange}
                duration={750}
                className={`theme-toggle-expand ${isDark ? 'theme-dark' : 'theme-light'}`}
              />
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px',
                }}
              />
            </Space>
          </div>
        )}

        <Content
          style={{
            margin: isMobile ? '12px' : '24px',
            padding: 0,
            paddingTop: isMobile ? '56px' : 0,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {renderContent()}
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            padding: isMobile ? '16px' : '24px',
            background: colorBgContainer,
            borderTop: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
            position: 'relative',
            zIndex: 1000,
          }}
        >
          <Text type="secondary">
            Created by{' '}
            <Text strong>MinhAnhCorp</Text>
            {' '}with ❤️
          </Text>
        </Footer>
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
              background: colorBgContainer,
            },
            header: {
              background: colorBgContainer,
              borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </Layout>
  );
}
