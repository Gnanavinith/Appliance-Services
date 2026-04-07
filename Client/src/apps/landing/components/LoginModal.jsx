import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const LoginModal = ({ open, onCancel, onLogin, onSignupClick, formInstance }) => {
  const [form] = Form.useForm();
  const actualForm = formInstance || form;

  return (
    <Modal
      title={<><UserOutlined /> Login to Your Account</>}
      open={open}
      onCancel={onCancel}
      footer={null}
      className="rounded-2xl"
    >
      <Form 
        form={actualForm} 
        onFinish={onLogin} 
        layout="vertical" 
        size="large"
        className="mt-4"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" className="h-12 rounded-lg" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" className="h-12 rounded-lg" />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
            className="h-12 text-lg rounded-lg bg-emerald-700 hover:bg-emerald-800"
            style={{ background: '#15803d' }}
          >
            Login
          </Button>
        </Form.Item>
        <div className="text-center">
          Don't have an account?{' '}
          <a onClick={onSignupClick} className="text-emerald-700 cursor-pointer font-medium hover:underline">
            Sign up
          </a>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
