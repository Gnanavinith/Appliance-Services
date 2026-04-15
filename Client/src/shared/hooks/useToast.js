import React from 'react';
import { useCallback } from 'react';
import { notification } from 'antd';
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiExclamationCircle, 
  HiInformationCircle 
} from 'react-icons/hi2';

const createToastContent = (Icon, color, title, description) => {
  return {
    message: React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
      React.createElement(Icon, { style: { fontSize: '20px', color: color, flexShrink: 0 } }),
      React.createElement('span', { style: { fontWeight: 600, fontSize: '14px', color: '#111827' } }, title)
    ),
    description: description ? React.createElement('div', { style: { marginTop: '6px', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' } }, description) : null,
  };
};

const toastStyle = {
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e5e7eb',
  padding: '16px 20px',
  minWidth: '320px',
  maxWidth: '420px',
};

export const useToast = () => {
  const [api, contextHolder] = notification.useNotification();

  const success = useCallback((title, description) => {
    const content = createToastContent(HiCheckCircle, '#10b981', title, description);
    api.open({
      ...content,
      placement: 'topRight',
      style: toastStyle,
      duration: 3,
    });
  }, [api]);

  const error = useCallback((title, description) => {
    const content = createToastContent(HiXCircle, '#ef4444', title, description);
    api.open({
      ...content,
      placement: 'topRight',
      style: toastStyle,
      duration: 4,
    });
  }, [api]);

  const warning = useCallback((title, description) => {
    const content = createToastContent(HiExclamationCircle, '#f59e0b', title, description);
    api.open({
      ...content,
      placement: 'topRight',
      style: toastStyle,
      duration: 3.5,
    });
  }, [api]);

  const info = useCallback((title, description) => {
    const content = createToastContent(HiInformationCircle, '#3b82f6', title, description);
    api.open({
      ...content,
      placement: 'topRight',
      style: toastStyle,
      duration: 3,
    });
  }, [api]);

  return {
    success,
    error,
    warning,
    info,
    contextHolder,
  };
};
