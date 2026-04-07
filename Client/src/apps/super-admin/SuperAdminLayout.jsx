import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Badge } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  AppstoreOutlined, 
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Topbar from '../../shared/layout/Topbar';
import Sidebar from '../../shared/layout/Sidebar';

const { Content, Footer } = AntLayout;

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/branches',
      icon: <AppstoreOutlined />,
      label: 'Branches',
    },
    {
      key: '/admin/technicians',
      icon: <TeamOutlined />,
      label: 'Technicians',
    },
    {
      key: '/admin/bookings',
      icon: <CalendarOutlined />,
      label: 'Bookings',
    },
    {
      key: '/admin/services',
      icon: <FileTextOutlined />,
      label: 'Services',
    },
    {
      key: '/admin/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar 
        menuItems={menuItems} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      <AntLayout>
        <Topbar onMenuClick={() => setCollapsed(!collapsed)} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Service Platform ©{new Date().getFullYear()} Created by Service Platform Team
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default SuperAdminLayout;
