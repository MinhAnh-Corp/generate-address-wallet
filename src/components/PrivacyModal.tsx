import { useState } from 'react';

import { SafetyOutlined, GithubOutlined } from '@ant-design/icons';
import {
  Modal, Button, Space, Typography,
} from 'antd';

const {
  Text, Paragraph, Link,
} = Typography;

const REPOSITORY_LINK = import.meta.env.VITE_REPOSITORY_LINK || 'https://github.com/your-repo';

export function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(() => {
    const hasSeenNotice = localStorage.getItem('privacy-notice-seen');
    return !hasSeenNotice;
  });

  const handleOk = () => {
    localStorage.setItem('privacy-notice-seen', 'true');
    setIsOpen(false);
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyOutlined />
          Privacy & Security Notice
        </Space>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleOk}
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          I Understand
        </Button>,
      ]}
      closable={false}
      maskClosable={false}
      width={600}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>This page does NOT collect, store, or send your information anywhere.</Text>
        </Paragraph>

        <Paragraph>
          All wallet generation happens entirely in your browser. No data is transmitted to any server.
        </Paragraph>

        <Paragraph>
          <Text strong>To verify this yourself:</Text>
        </Paragraph>
        <ul>
          <li>Save this page offline and test - everything will still work</li>
          <li>Check your browser's network tab - no requests are sent</li>
          <li>Disconnect from the internet - the page functions normally</li>
        </ul>

        <Paragraph>
          <Text type="warning" strong>
            For safety, please use a new/test wallet when testing this tool.
            Never use your main wallet's mnemonic or private key.
          </Text>
        </Paragraph>

        <Paragraph>
          If you have questions or want to contribute, please create an issue at:
          <br />
          <Link href={REPOSITORY_LINK} target="_blank" rel="noopener noreferrer">
            <GithubOutlined /> {REPOSITORY_LINK}
          </Link>
        </Paragraph>
      </Space>
    </Modal>
  );
}
