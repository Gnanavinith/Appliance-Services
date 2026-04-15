import React from 'react';
import { HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineDevicePhoneMobile } from 'react-icons/hi2';

const PaymentOptions = ({ onSelect }) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: HiOutlineCreditCard },
    { id: 'cash', name: 'Cash on Service', icon: HiOutlineBanknotes },
    { id: 'wallet', name: 'Digital Wallet', icon: HiOutlineDevicePhoneMobile },
  ];

  return (
    <div>
      <h3>Select Payment Method</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
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
              <div style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconComponent style={{ width: '32px', height: '32px' }} />
              </div>
              <div>{method.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentOptions;
