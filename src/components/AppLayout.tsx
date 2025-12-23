import {
  useState, useEffect, type ReactNode,
} from 'react';

import {
  WalletOutlined, SwapOutlined, MenuOutlined, KeyOutlined, TeamOutlined, ApiOutlined, HomeOutlined,
} from '@ant-design/icons';
import {
  Layout, Menu, Typography, theme, Drawer, Button,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { CodeExplanationButton } from './CodeExplanationButton';
import { Header } from './Header';

const {
  Sider, Content, Footer,
} = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
  children: ReactNode;
}

export function AppLayout({
  isDark, onThemeChange, children,
}: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
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

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/' || path === '/welcome') return 'welcome';
    return path.slice(1) || 'welcome';
  };

  const selectedKey = getSelectedKey();

  const menuItems = [
    {
      key: 'welcome',
      icon: <HomeOutlined />,
      label: t('Welcome'),
      path: '/',
    },
    {
      key: 'mnemonic-generator',
      icon: <KeyOutlined />,
      label: t('Mnemonic Generator'),
      path: '/mnemonic-generator',
    },
    {
      key: 'universal',
      icon: <WalletOutlined />,
      label: t('Universal Wallet Generator'),
      path: '/universal',
    },
    {
      key: 'cosmos-converter',
      icon: <SwapOutlined />,
      label: t('Cosmos Address Converter'),
      path: '/cosmos-converter',
    },
    {
      key: 'rpc-tester',
      icon: <ApiOutlined />,
      label: t('RPC Tester'),
      path: '/rpc-tester',
    },
    {
      key: 'who-we-are',
      icon: <TeamOutlined />,
      label: t('Who We Are'),
      path: '/who-we-are',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find((i) => i.key === key);
    if (item) {
      navigate(item.path);
      if (isMobile) {
        setDrawerOpen(false);
      }
    }
  };

  const sidebarContent = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={handleMenuClick}
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
          {children}
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
