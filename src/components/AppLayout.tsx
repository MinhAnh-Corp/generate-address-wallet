import { useState, useEffect } from 'react';

import {
  WalletOutlined, SwapOutlined, MenuOutlined, KeyOutlined, TeamOutlined,
} from '@ant-design/icons';
import {
  Layout, Menu, Typography, theme, Drawer, Button,
} from 'antd';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import {
  selectedPageAtom,
} from '../store/navigation';
import type {
  MenuKey,
} from '../store/navigation';

import { CodeExplanationButton } from './CodeExplanationButton';
import { CosmosWalletGenerator } from './CosmosWalletGenerator';
import { Header } from './Header';
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
  const { t } = useTranslation();

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
      label: t('Mnemonic Generator'),
    },
    {
      key: 'universal',
      icon: <WalletOutlined />,
      label: t('Universal Wallet Generator'),
    },
    {
      key: 'cosmos-converter',
      icon: <SwapOutlined />,
      label: t('Cosmos Address Converter'),
    },
    {
      key: 'who-we-are',
      icon: <TeamOutlined />,
      label: t('Who We Are'),
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
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={({ key }) => handleMenuClick(key as MenuKey)}
      style={{
        borderRight: 0,
        height: isMobile ? 'auto' : 'calc(100vh - 64px)',
        overflowY: 'auto',
      }}
      theme={isDark ? 'dark' : 'light'}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header isDark={isDark} onThemeChange={onThemeChange} />

      {!isMobile && (
        <Sider
          width={250}
          style={{
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
            background: colorBgContainer,
            borderRight: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
          }}
          theme={isDark ? 'dark' : 'light'}
        >
          {sidebarContent}
        </Sider>
      )}

      <Layout style={{
        marginLeft: !isMobile ? 250 : 0, marginTop: 64,
      }}>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            onClick={() => setDrawerOpen(true)}
            style={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
            }}
          />
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
            {t('Created by')}{' '}
            <Text strong>MinhAnhCorp</Text>
            {' '}{t('with')} ❤️
          </Text>
        </Footer>
      </Layout>

      {isMobile && (
        <Drawer
          title={t('Menu')}
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

      <CodeExplanationButton />
    </Layout>
  );
}
