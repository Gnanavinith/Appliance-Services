import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { 
  CalendarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Topbar from '../../shared/layout/Topbar';
import Sidebar from '../../shared/layout/Sidebar';

const { Content, Footer } = AntLayout;

const TechnicianLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/technician',
      icon: <CalendarOutlined />,
      label: "Today's Jobs",
    },
    {
      key: '/technician/history',
      icon: <HistoryOutlined />,
      label: 'Job History',
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
        <Topbar onMenuClick={() => setCollapsed(!collapsed)} collapsed={collapsed} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Service Platform ©{new Date().getFullYear()} Created by Service Platform Team
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default TechnicianLayout;
