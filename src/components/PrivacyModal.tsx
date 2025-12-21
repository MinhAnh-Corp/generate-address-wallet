import { useState } from 'react';

import { SafetyOutlined, GithubOutlined } from '@ant-design/icons';
import {
  Modal, Button, Space, Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';

const {
  Text, Paragraph, Link,
} = Typography;

const REPOSITORY_LINK = import.meta.env.VITE_REPOSITORY_LINK || 'https://github.com/MinhAnh-Corp/generate-address-wallet';

interface PrivacyModalProps {
  open?: boolean;
  onClose?: () => void;
  autoOpen?: boolean;
}

export function PrivacyModal({
  open: controlledOpen, onClose, autoOpen = true,
}: PrivacyModalProps = {}) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(() => {
    if (controlledOpen !== undefined) {
      return controlledOpen;
    }
    if (!autoOpen) {
      return false;
    }
    const hasSeenNotice = localStorage.getItem('privacy-notice-seen');
    return !hasSeenNotice;
  });

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOk = () => {
    localStorage.setItem('privacy-notice-seen', 'true');
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const handleCancel = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyOutlined />
          {t('Privacy & Security Notice')}
        </Space>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          {t('I Understand')}
        </Button>,
      ]}
      closable={!autoOpen || isControlled}
      maskClosable={!autoOpen || isControlled}
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
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>{t('This page does NOT collect, store, or send your information anywhere.')}</Text>
        </Paragraph>

        <Paragraph>
          {t('All wallet generation happens entirely in your browser. No data is transmitted to any server.')}
        </Paragraph>

        <Paragraph>
          <Text strong>{t('To verify this yourself:')}</Text>
        </Paragraph>
        <ul>
          <li>{t('Save this page offline and test - everything will still work')}</li>
          <li>{t("Check your browser's network tab - no requests are sent")}</li>
          <li>{t('Disconnect from the internet - the page functions normally')}</li>
        </ul>

        <Paragraph>
          <Text type="warning" strong>
            {t('For safety, please use a new/test wallet when testing this tool. Never use your main wallet\'s mnemonic or private key.')}
          </Text>
        </Paragraph>

        <Paragraph>
          {t('If you have questions or want to contribute, please create an issue at:')}
          <br />
          <Link href={REPOSITORY_LINK} target="_blank" rel="noopener noreferrer">
            <GithubOutlined /> {REPOSITORY_LINK}
          </Link>
        </Paragraph>
      </Space>
    </Modal>
  );
}
