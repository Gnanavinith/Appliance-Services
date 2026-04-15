import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { store } from './store';
import { queryClient } from './queries/queryClient';
import AppRouter from './router/AppRouter';
import './styles/globals.css';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1a365d',
              colorLink: '#1a365d',
              borderRadius: 8,
            },
          }}
        >
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
