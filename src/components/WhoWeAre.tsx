import { useState, useEffect } from 'react';

import {
  GithubOutlined, GlobalOutlined, TeamOutlined,
} from '@ant-design/icons';
import {
  Card, Divider, Space, Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';

const {
  Link, Paragraph, Text, Title,
} = Typography;

const REPOSITORY_LINK = import.meta.env.VITE_REPOSITORY_LINK || 'https://github.com/MinhAnh-Corp/generate-address-wallet';
const COMPANY_LINK = import.meta.env.VITE_COMPANY_LINK || 'https://xclusivecorp.io/en';
const GITHUB_CORP_LINK = import.meta.env.VITE_GITHUB_CORP || 'https://github.com/MinhAnh-Corp/';

export function WhoWeAre() {
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Card
      title={
        <Space>
          <TeamOutlined />
          {t('Who We Are')}
        </Space>
      }
      style={{
        maxWidth: 800,
        margin: isMobile ? '20px auto' : '40px auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
      styles={{
        body: {
          padding: isMobile ? '16px' : '24px',
        },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            <GlobalOutlined /> {t('About Xclusive Corporation')}
          </Title>
          <Paragraph style={{ marginBottom: 12 }}>
            <Text strong>Xclusive Corporation</Text> {t('Xclusive Corporation is a pioneer in providing integrated technology solutions in Vietnam. Established in 2021, we take pride in delivering high-quality software and hardware products that meet the diverse needs of modern businesses.')}
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            {t('With a team of experienced experts and a vision for innovation, Xclusive Corporation is committed to partnering with our clients in their growth, contributing to building a sustainable digital future.')}
          </Paragraph>
        </div>

        <Divider />

        <div>
          <Title level={4}>{t('Our Services')}</Title>
          <ul>
            <li>
              <Text strong>{t('Outsource:')}</Text> {t('Website, Application, Dapp, Game development')}
            </li>
            <li>
              <Text strong>{t('Product:')}</Text> {t('Custom software solutions and products')}
            </li>
            <li>
              <Text strong>{t('Investment:')}</Text> {t('XC token, XC products, XC hotels, XC Real Estate')}
            </li>
            <li>
              <Text strong>{t('Assistance:')}</Text> {t('Business consulting and technical assistance')}
            </li>
          </ul>
        </div>

        <Divider />

        <div>
          <Title level={4}>{t('Our Team')}</Title>
          <Paragraph style={{ marginBottom: 12 }}>
            <Text strong>MinhAnhCorp</Text> {t('MinhAnhCorp is our dedicated development team, crafting innovative solutions with passion and expertise. We specialize in blockchain technology, web development, and cutting-edge software engineering.')}
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            <Text strong>XclusiveCorp</Text> {t('XclusiveCorp represents our business team and company operations, focusing on client relationships, strategic partnerships, and business growth.')}
          </Paragraph>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ marginBottom: 0 }}>
            <Text type="secondary">
              {t('Learn more about us:')}
            </Text>
            <br />
            <Space direction="vertical" size="small" style={{ marginTop: 12 }}>
              <Link
                href={REPOSITORY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '14px' }}
              >
                <GithubOutlined /> Repository
              </Link>
              <Link
                href={COMPANY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '14px' }}
              >
                <GlobalOutlined /> {t('Visit Xclusive Corporation')}
              </Link>
              <Link
                href={GITHUB_CORP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '14px' }}
              >
                <GithubOutlined /> GitHub Organization
              </Link>
            </Space>
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
}
