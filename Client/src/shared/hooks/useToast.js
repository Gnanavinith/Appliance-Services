import { useCallback } from 'react';
import { notification } from 'antd';

export const useToast = () => {
  const [api, contextHolder] = notification.useNotification();

  const success = useCallback((title, description) => {
    api.success({
      title: title,
      description,
      placement: 'topRight',
    });
  }, [api]);

  const error = useCallback((title, description) => {
    api.error({
      title: title,
      description,
      placement: 'topRight',
    });
  }, [api]);

  const warning = useCallback((title, description) => {
    api.warning({
      title: title,
      description,
      placement: 'topRight',
    });
  }, [api]);

  const info = useCallback((title, description) => {
    api.info({
      title: title,
      description,
      placement: 'topRight',
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
