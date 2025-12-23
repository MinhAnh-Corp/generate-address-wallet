import { useState } from 'react';

import { CodeOutlined } from '@ant-design/icons';
import {
  Button, Modal, Typography, Space,
} from 'antd';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import { explanationsAtom, EXPLANATION_KEYS } from '../store/explanations';

const {
  Paragraph, Title,
} = Typography;

type RouteKey = 'mnemonic-generator' | 'universal' | 'cosmos-converter' | 'rpc-tester' | 'who-we-are';

const ROUTE_TO_EXPLANATION_KEY: Record<RouteKey, keyof typeof EXPLANATION_KEYS> = {
  'mnemonic-generator': 'MNEMONIC_GENERATOR',
  'universal': 'UNIVERSAL_WALLET',
  'cosmos-converter': 'COSMOS_CONVERTER',
  'rpc-tester': 'RPC_TESTER',
  'who-we-are': 'WHO_WE_ARE',
};

export function CodeExplanationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const explanations = useAtomValue(explanationsAtom);
  const { t } = useTranslation();

  const getRouteKey = (): RouteKey | null => {
    const path = location.pathname.slice(1) || 'welcome';
    if (path === 'welcome' || path === '') {
      return 'who-we-are';
    }
    return path as RouteKey;
  };

  const routeKey = getRouteKey();

  if (!routeKey || !ROUTE_TO_EXPLANATION_KEY[routeKey]) {
    return null;
  }

  const explanationKey = ROUTE_TO_EXPLANATION_KEY[routeKey];
  const markdown = explanations[EXPLANATION_KEYS[explanationKey]];

  const extractedTitle = markdown.split('\n').find((line) => line.startsWith('# '))?.replace(/^# /, '').trim() || t('Code Explanation');

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsOpen(true)}
        className="floating-button-gradient"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: '24px',
          padding: '8px 16px',
          height: 'auto',
          border: 'none',
          fontWeight: 600,
          fontSize: '13px',
        }}
      >
        {t('How I did it?')}
      </Button>
      <Modal
        title={
          <Space>
            <CodeOutlined />
            {extractedTitle}
          </Space>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsOpen(false)}>
            {t('Close')}
          </Button>,
        ]}
        centered
        width="calc(100vw - 32px)"
        style={{
          maxWidth: '700px',
        }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
          },
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <Paragraph>{children}</Paragraph>,
              h1: () => null,
              h2: ({ children }) => <Title level={5}>{children}</Title>,
              code(props) {
                const {
                  className, children,
                } = props;
                const inline = !className || !className.startsWith('language-');
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                return !inline && language ? (
                  <div style={{ marginTop: '8px' }}>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        borderRadius: '4px',
                        fontSize: '12px',
                        lineHeight: '1.5',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className={className}
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '2px 4px',
                      borderRadius: '2px',
                      fontSize: '12px',
                    }}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </Space>
      </Modal>
    </>
  );
}
