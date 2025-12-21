import { useState } from 'react';

import { CodeOutlined } from '@ant-design/icons';
import {
  Button, Modal, Typography, Space,
} from 'antd';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import { explanationsAtom, EXPLANATION_KEYS } from '../store/explanations';
import { selectedPageAtom } from '../store/navigation';
import type { MenuKey } from '../store/navigation';

const {
  Paragraph, Title,
} = Typography;

const MENU_KEY_TO_EXPLANATION_KEY: Record<MenuKey, keyof typeof EXPLANATION_KEYS> = {
  'mnemonic-generator': 'MNEMONIC_GENERATOR',
  'universal': 'UNIVERSAL_WALLET',
  'cosmos-converter': 'COSMOS_CONVERTER',
  'who-we-are': 'WHO_WE_ARE',
};

export function CodeExplanationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPage = useAtomValue(selectedPageAtom);
  const explanations = useAtomValue(explanationsAtom);
  const { t } = useTranslation();

  const explanationKey = MENU_KEY_TO_EXPLANATION_KEY[selectedPage];
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
        width="90%"
        style={{
          maxWidth: '800px',
        }}
        styles={{
          body: {
            maxHeight: '70vh',
            overflow: 'auto',
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
