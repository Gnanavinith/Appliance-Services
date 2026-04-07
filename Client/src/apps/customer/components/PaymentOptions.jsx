import React from 'react';

const PaymentOptions = ({ onSelect }) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'cash', name: 'Cash on Service', icon: '💵' },
    { id: 'wallet', name: 'Digital Wallet', icon: '📱' },
  ];

  return (
    <div>
      <h3>Select Payment Method</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onSelect?.(method.id)}
            style={{
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{method.icon}</div>
            <div>{method.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;
