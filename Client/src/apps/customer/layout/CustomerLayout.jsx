import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../../../shared/layout/Navbar';

const { Content, Footer } = Layout;

const CustomerLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <Layout>
        <Content style={{ padding: '24px', minHeight: 280 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', background: '#f8fafc', padding: '24px 0' }}>
          <div style={{ color: '#737373', fontSize: '14px' }}>
            FixIt ©{new Date().getFullYear()} - Your Trusted Home Service Platform
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CustomerLayout;
