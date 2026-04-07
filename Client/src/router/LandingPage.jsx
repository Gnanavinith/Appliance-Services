import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { useToast } from '../shared/hooks/useToast';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../shared/layout/Navbar';
import HeroSection from '../apps/landing/components/HeroSection';
import ServicesSection from '../apps/landing/components/ServicesSection';
import HowItWorksSection from '../apps/landing/components/HowItWorksSection';
import FAQSection from '../apps/landing/components/FAQSection';
import ContactSection from '../apps/landing/components/ContactSection';
import Footer from '../apps/landing/components/Footer';
import LoginModal from '../apps/landing/components/LoginModal';
import SignupModal from '../apps/landing/components/SignupModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error, contextHolder } = useToast();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Redirect authenticated users to their respective dashboards (except customers)
  useEffect(() => {
    if (isAuthenticated && role) {
      switch (role) {
        case 'super-admin':
        case 'branch-admin':
          navigate('/admin');
          break;
        case 'technician':
          navigate('/technician');
          break;
        // Customers stay on the landing page
        default:
          break;
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (values) => {
    try {
      const response = await axiosInstance.post('/auth/login', values);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        dispatch(loginSuccess({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          role: user.role,
          token,
        }));
        
        success('Welcome back!', `Logged in as ${user.name}`);
        setLoginModalOpen(false);
        loginForm.resetFields();
        // Stay on current page, don't navigate
      }
    } catch (err) {
      // Handle validation errors
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        error('Validation Error', errors[0].msg);
      } else {
        const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
        error('Login Failed', errorMessage);
      }
    }
  };

  const handleSignup = async (values) => {
    try {
      const response = await axiosInstance.post('/auth/signup', values);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        dispatch(loginSuccess({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          role: user.role,
          token,
        }));
        
        success('Account created!', 'Welcome to FixIt!');
        setSignupModalOpen(false);
        signupForm.resetFields();
        // Stay on current page, don't navigate
      }
    } catch (err) {
      // Handle validation errors
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        // Show first validation error
        error('Validation Error', errors[0].msg);
      } else {
        const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
        error('Signup Failed', errorMessage);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {contextHolder}
      
      {/* Navigation */}
      <Navbar 
        onLoginClick={() => setLoginModalOpen(true)}
        onSignupClick={() => setSignupModalOpen(true)}
      />

      {/* Page Sections */}
      <main className="w-full">
        <HeroSection onCtaClick={() => setSignupModalOpen(true)} />
        <ServicesSection onServiceClick={(service) => setSignupModalOpen(true)} />
        <HowItWorksSection />
        <FAQSection />
        <ContactSection />
      </main>
      
      <Footer />

      {/* Auth Modals */}
      <LoginModal
        open={loginModalOpen}
        onCancel={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        onSignupClick={() => {
          setLoginModalOpen(false);
          setSignupModalOpen(true);
        }}
        formInstance={loginForm}
      />
      <SignupModal
        open={signupModalOpen}
        onCancel={() => setSignupModalOpen(false)}
        onSignup={handleSignup}
        onLoginClick={() => {
          setSignupModalOpen(false);
          setLoginModalOpen(true);
        }}
        formInstance={signupForm}
      />
    </div>
  );
};

export default LandingPage;
