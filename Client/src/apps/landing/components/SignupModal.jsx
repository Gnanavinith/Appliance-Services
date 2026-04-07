import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const SignupModal = ({ open, onCancel, onSignup, onLoginClick, formInstance }) => {
  const [form] = Form.useForm();
  const actualForm = formInstance || form;

  return (
    <Modal
      title={<><UserOutlined /> Create Your Account</>}
      open={open}
      onCancel={onCancel}
      footer={null}
      className="rounded-2xl"
    >
      <Form 
        form={actualForm} 
        onFinish={onSignup} 
        layout="vertical" 
        size="large"
        className="mt-4"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Full Name" className="h-12 rounded-lg" />
        </Form.Item>
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
          name="phone"
          rules={[
            { required: true, message: 'Please input your phone number!' },
            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Phone Number" 
            maxLength={10}
            className="h-12 rounded-lg"
          />
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
            Sign Up
          </Button>
        </Form.Item>
        <div className="text-center">
          Already have an account?{' '}
          <a onClick={onLoginClick} className="text-emerald-700 cursor-pointer font-medium hover:underline">
            Login
          </a>
        </div>
      </Form>
    </Modal>
  );
};

export default SignupModal;
