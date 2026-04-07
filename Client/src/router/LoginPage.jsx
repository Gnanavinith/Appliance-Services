import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import axiosInstance from '../api/axiosInstance';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    console.log('🔐 Login attempt with:', values.email);
    
    try {
      // Call actual login API
      console.log('📡 Sending login request to backend...');
      const response = await axiosInstance.post('/auth/login', values);
      console.log('✅ Backend response:', response.data);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        console.log('👤 User logged in:', user.name, 'Role:', user.role);
        
        dispatch(loginSuccess({
          user: {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        }));

        message.success(`Welcome back, ${user.name}!`);
        
        // Redirect based on role
        switch (user.role) {
          case 'customer':
            console.log('🏠 Redirecting to home (customer)');
            navigate('/');
            break;
          case 'technician':
            console.log('🔧 Redirecting to technician dashboard');
            navigate('/technician');
            break;
          case 'branch-admin':
            console.log('🏢 Redirecting to branch-admin dashboard');
            navigate('/branch-admin');
            break;
          case 'super-admin':
            console.log('👑 Redirecting to super-admin dashboard');
            navigate('/admin');
            break;
          default:
            console.log('➡️ Redirecting to home (default)');
            navigate('/');
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
      padding: '20px',
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '450px',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔧</div>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to access your account</Text>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email address"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
              style={{ height: '48px' }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>OR</Divider>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button 
            icon={<GoogleOutlined />} 
            block 
            size="large"
            onClick={() => {
              // Mock Google login
              dispatch(loginSuccess({
                user: { name: 'Google User', email: 'user@gmail.com' },
                role: 'customer',
                token: 'google-token',
              }));
              navigate('/');
            }}
          >
            Continue with Google
          </Button>
          <Button 
            icon={<FacebookOutlined />} 
            block 
            size="large"
            onClick={() => {
              // Mock Facebook login
              dispatch(loginSuccess({
                user: { name: 'Facebook User', email: 'user@facebook.com' },
                role: 'customer',
                token: 'fb-token',
              }));
              navigate('/');
            }}
          >
            Continue with Facebook
          </Button>
        </div>

        <Divider />

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>Sign up</a>
          </Text>
        </div>

        {/* Demo Credentials Info */}
        <Card 
          size="small" 
          style={{ 
            marginTop: '24px', 
            background: '#f5f5f5',
            border: '1px dashed #d9d9d9',
          }}
        >
          <Title level={5} style={{ marginBottom: '12px' }}>Demo Credentials:</Title>
          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <div><strong>Customer:</strong> any email (e.g., customer@test.com)</div>
            <div><strong>Admin:</strong> admin@test.com</div>
            <div><strong>Technician:</strong> tech@test.com</div>
            <div><strong>Branch Admin:</strong> branch@test.com</div>
            <div><strong>Password:</strong> anything</div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default LoginPage;
