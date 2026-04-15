import { Layout as AntLayout, Avatar, Dropdown, Badge, Popover } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../queries/useNotifications';
import { useState } from 'react';

const { Header } = AntLayout;

const Topbar = ({ onMenuClick, collapsed }) => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [notifOpen, setNotifOpen] = useState(false);
  
  // Fetch notifications
  const { data: notifData } = useNotifications({ limit: 10, unreadOnly: false }, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  const notifications = notifData?.data || [];
  const unreadCount = notifData?.unreadCount || 0;
  
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleLogout = () => dispatch(logout());

  const handleMarkAsRead = (notifId) => {
    markAsReadMutation.mutate(notifId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const notificationContent = (
    <div style={{ width: 360, maxHeight: 480, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Notifications</span>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{ border: 'none', background: 'none', color: '#10b981', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
          >
            Mark all read
          </button>
        )}
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 400 }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af' }}>
            <BellOutlined style={{ fontSize: 32, marginBottom: 8, display: 'block' }} />
            <div>No notifications yet</div>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f5f5f5',
                background: notif.isRead ? '#ffffff' : '#f0fdf9',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: notif.isRead ? 500 : 600, fontSize: 13, color: '#111827', flex: 1 }}>
                  {!notif.isRead && <span style={{ display: 'inline-block', width: 6, height: 6, background: '#10b981', borderRadius: '50%', marginRight: 6 }} />}
                  {notif.title}
                </div>
                <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>{formatTime(notif.createdAt)}</span>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, lineHeight: 1.5 }}>
                {notif.message}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!notif.isRead && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif._id); }}
                    style={{ border: 'none', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <CheckOutlined /> Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const roleColors = {
    'super-admin': { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    'branch-admin': { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
    'technician': { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    'customer': { bg: '#dcfce7', text: '#14532d', dot: '#22c55e' },
  };
  const roleStyle = roleColors[role] || roleColors.customer;

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
        <Popover
          content={notificationContent}
          trigger="click"
          placement="bottomRight"
          open={notifOpen}
          onOpenChange={setNotifOpen}
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={unreadCount} size="small" offset={[-2, 2]}>
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
        </Popover>

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