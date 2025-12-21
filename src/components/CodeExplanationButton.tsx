import { useState } from 'react';

import { Button, Modal, Typography, Space } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface CodeExplanationButtonProps {
  explanation: {
    title: string;
    description: string;
    code: string;
    language?: string;
  };
}

export function CodeExplanationButton({ explanation }: CodeExplanationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsOpen(true)}
        className="floating-button-gradient"
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: '24px',
          padding: '8px 16px',
          height: 'auto',
          border: 'none',
          fontWeight: 600,
          fontSize: '13px',
        }}
      >
        How I did it?
      </Button>
      <Modal
        title={
          <Space>
            <CodeOutlined />
            {explanation.title}
          </Space>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsOpen(false)}>
            Close
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
          <Paragraph>{explanation.description}</Paragraph>

          <div>
            <Title level={5}>Implementation Code:</Title>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                lineHeight: '1.5',
              }}
            >
              <code>{explanation.code}</code>
            </pre>
          </div>

          <Paragraph>
            <Text type="secondary" italic>
              You can follow this code to implement the same functionality in your own project.
            </Text>
          </Paragraph>
        </Space>
      </Modal>
    </>
  );
}

