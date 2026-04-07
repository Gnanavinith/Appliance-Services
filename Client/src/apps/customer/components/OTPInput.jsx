import React, { useState } from 'react';
import { Input } from 'antd';

const OTPInput = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      {otp.map((_, index) => (
        <Input
          key={index}
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onFocus={(e) => e.target.select()}
          style={{
            width: '48px',
            height: '48px',
            textAlign: 'center',
            fontSize: '20px',
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
