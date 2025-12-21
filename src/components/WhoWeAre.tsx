import {
  Card, Space, Typography, Divider,
} from 'antd';
import { TeamOutlined, GlobalOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text, Link } = Typography;

const COMPANY_LINK = import.meta.env.VITE_COMPANY_LINK || 'https://xclusivecorp.io/en';

export function WhoWeAre() {
  const [isMobile, setIsMobile] = useState(false);

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
          Who We Are
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
            <GlobalOutlined /> About Xclusive Corporation
          </Title>
          <Paragraph style={{ marginBottom: 12 }}>
            <Text strong>Xclusive Corporation</Text> is a pioneer in providing integrated technology
            solutions in Vietnam. Established in 2021, we take pride in delivering high-quality
            software and hardware products that meet the diverse needs of modern businesses.
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            With a team of experienced experts and a vision for innovation, Xclusive Corporation is
            committed to partnering with our clients in their growth, contributing to building a
            sustainable digital future.
          </Paragraph>
        </div>

        <Divider />

        <div>
          <Title level={4}>Our Services</Title>
          <ul>
            <li>
              <Text strong>Outsource:</Text> Website, Application, Dapp, Game development
            </li>
            <li>
              <Text strong>Product:</Text> Custom software solutions and products
            </li>
            <li>
              <Text strong>Investment:</Text> XC token, XC products, XC hotels, XC Real Estate
            </li>
            <li>
              <Text strong>Assistance:</Text> Business consulting and technical assistance
            </li>
          </ul>
        </div>

        <Divider />

        <div>
          <Title level={4}>Our Team</Title>
          <Paragraph style={{ marginBottom: 12 }}>
            <Text strong>MinhAnhCorp</Text> is our dedicated development team, crafting innovative
            solutions with passion and expertise. We specialize in blockchain technology, web
            development, and cutting-edge software engineering.
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            <Text strong>XclusiveCorp</Text> represents our business team and company operations,
            focusing on client relationships, strategic partnerships, and business growth.
          </Paragraph>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ marginBottom: 0 }}>
            <Text type="secondary">
              Learn more about us:
            </Text>
            <br />
            <Link
              href={COMPANY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '16px' }}
            >
              <GlobalOutlined /> Visit Xclusive Corporation
            </Link>
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
}

