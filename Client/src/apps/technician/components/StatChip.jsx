import React from 'react';

const StatChip = ({ label, value, color = '#1890ff' }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: '12px', opacity: 0.9 }}>{label}</div>
    </div>
  );
};

export default StatChip;
