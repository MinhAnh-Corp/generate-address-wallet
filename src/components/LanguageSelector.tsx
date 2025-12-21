import { GlobalOutlined } from '@ant-design/icons';
import {
  Dropdown, Space, theme,
} from 'antd';
import { useAtom } from 'jotai';

import { LANGUAGES, type Language } from '../i18n/config';
import { languageAtom } from '../store/language';

import type { MenuProps } from 'antd';

export function LanguageSelector() {
  const [language, setLanguage] = useAtom(languageAtom);
  const { token: { colorBorder } } = theme.useToken();

  const items: MenuProps['items'] = (['en', 'vi'] as Language[]).map((lang) => ({
    key: lang,
    label: LANGUAGES[lang].label,
  }));

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setLanguage(key as Language);
  };

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [language],
        onClick: handleMenuClick,
      }}
      placement="bottomRight"
      trigger={['click']}
      dropdownRender={(menu) => (
        <div
          style={{
            border: `1px solid ${colorBorder || '#d9d9d9'}`,
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          {menu}
        </div>
      )}
    >
      <Space
        style={{
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          border: `1px solid ${colorBorder || '#d9d9d9'}`,
          transition: 'all 0.2s',
          height: '32px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        className="language-selector"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#1890ff';
          e.currentTarget.style.backgroundColor = 'rgba(24, 144, 255, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colorBorder || '#d9d9d9';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <GlobalOutlined style={{ fontSize: '14px' }} />
        <span style={{ fontSize: '13px' }}>{LANGUAGES[language].label}</span>
      </Space>
    </Dropdown>
  );
}
