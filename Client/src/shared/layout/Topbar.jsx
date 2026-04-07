import { Layout as AntLayout, Avatar, Dropdown, Badge } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const { Header } = AntLayout;

const Topbar = ({ onMenuClick, collapsed }) => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = () => dispatch(logout());

  const roleColors = {
    admin: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    manager: { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
    user: { bg: '#dcfce7', text: '#14532d', dot: '#22c55e' },
  };
  const roleStyle = roleColors[role] || roleColors.user;

  const menuItems = [
    {
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{user?.email || ''}</div>
        </div>
      ),
      key: 'info',
      disabled: true,
    },
    { type: 'divider' },
    { label: 'Profile', key: 'profile', icon: <UserOutlined /> },
    { label: 'Settings', key: 'settings', icon: <SettingOutlined /> },
    { type: 'divider' },
    { label: 'Logout', key: 'logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  return (
    <Header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuClick}
          style={{
            width: 36,
            height: 36,
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: 16,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '0 12px',
            height: 36,
            width: 240,
            cursor: 'text',
          }}
        >
          <SearchOutlined style={{ color: '#9ca3af', fontSize: 14 }} />
          <input
            placeholder="Search functionality coming soon…"
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 13,
              color: '#374151',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Notification Bell */}
        <Badge count={3} size="small" offset={[-2, 2]}>
          <button
            style={{
              width: 36,
              height: 36,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: 16,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <BellOutlined />
          </button>
        </Badge>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px' }} />

        {/* User Menu */}
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['click']}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 10,
              border: '1px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            <Avatar
              size={34}
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                flexShrink: 0,
              }}
            />
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span
                  style={{
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 20,
                    background: roleStyle.bg,
                    color: roleStyle.text,
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    letterSpacing: 0.2,
                  }}
                >
                  {role}
                </span>
              </div>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#9ca3af', marginLeft: 2 }}>
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;