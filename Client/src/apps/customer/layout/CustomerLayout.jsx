import React, { useState } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from '../../../shared/layout/Topbar';

const { Content, Footer } = Layout;

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: 'My Bookings',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Topbar />
      <Layout>
        <Content style={{ padding: '0 24px', background: '#fff' }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Service Platform ©{new Date().getFullYear()} Created by Service Platform Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CustomerLayout;
