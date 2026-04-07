import { Layout as AntLayout, Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = AntLayout;

const Logo = ({ collapsed }) => (
  <div
    style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      padding: collapsed ? '0 20px' : '0 20px',
      borderBottom: '1px solid #f0f0f0',
      gap: 10,
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    {/* Icon mark */}
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(16,185,129,0.25)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>

    {/* Wordmark — hidden when collapsed */}
    <div
      style={{
        opacity: collapsed ? 0 : 1,
        transform: collapsed ? 'translateX(-8px)' : 'translateX(0)',
        transition: 'opacity 0.2s, transform 0.2s',
        whiteSpace: 'nowrap',
        pointerEvents: collapsed ? 'none' : 'auto',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: -0.3 }}>
        Service
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: 0.3, marginTop: -1 }}>
        PLATFORM
      </div>
    </div>
  </div>
);

const Sidebar = ({ menuItems, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => navigate(key);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      width={220}
      collapsedWidth={64}
      theme="light"
      style={{
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '1px 0 0 #f0f0f0',
      }}
    >
      <Logo collapsed={collapsed} />

      {/* Menu area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 13,
          }}
        />
      </div>

      {/* Collapse toggle at bottom */}
      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
        }}
      >
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 28,
              height: 28,
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              background: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.borderColor = '#d1d5db'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            >
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Tooltip>
      </div>
    </Sider>
  );
};

export default Sidebar;