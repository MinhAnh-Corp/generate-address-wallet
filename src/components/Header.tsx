import { useState } from 'react';

import { SafetyOutlined } from '@ant-design/icons';
import { Expand } from '@theme-toggles/react';
import '@theme-toggles/react/css/Expand.css';
import {
  Button, Layout, Space, Typography, theme,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { LanguageSelector } from './LanguageSelector';
import { PrivacyModal } from './PrivacyModal';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export function Header({
  isDark, onThemeChange,
}: HeaderProps) {
  const { t } = useTranslation();
  const { token: { colorBgContainer } } = theme.useToken();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <>
      <AntHeader
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '64px',
          padding: '0 24px',
          background: colorBgContainer,
          borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text strong style={{ fontSize: '18px' }}>
          {t('Wallet Tools')}
        </Text>

        <Space size="middle" align="center">
          <Button
            type="text"
            icon={<SafetyOutlined />}
            onClick={() => setPrivacyModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={t('Privacy & Security Notice')}
          />
          <LanguageSelector />
          {/* @ts-expect-error - Expand component type definition issue */}
          <Expand
            toggled={isDark}
            onToggle={onThemeChange}
            duration={750}
            className={`theme-toggle-expand ${isDark ? 'theme-dark' : 'theme-light'}`}
          />
        </Space>
      </AntHeader>

      <PrivacyModal
        open={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        autoOpen={false}
      />
    </>
  );
}
