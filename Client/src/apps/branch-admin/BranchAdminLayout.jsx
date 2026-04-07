import React, { useState } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Topbar from '../../shared/layout/Topbar';
import Sidebar from '../../shared/layout/Sidebar';

const { Content, Footer } = AntLayout;

const BranchAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/branch-admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/branch-admin/bookings',
      icon: <CalendarOutlined />,
      label: 'Bookings',
    },
    {
      key: '/branch-admin/technicians',
      icon: <TeamOutlined />,
      label: 'My Technicians',
    },
    {
      key: '/branch-admin/schedule',
      icon: <FileTextOutlined />,
      label: 'Schedule',
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

export default BranchAdminLayout;
