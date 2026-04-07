import { Input as AntInput } from 'antd';

const Input = ({ error, label, helperText, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
          }}
        >
          {label}
        </label>
      )}
      <AntInput status={error ? 'error' : ''} {...props} />
      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
      {helperText && !error && (
        <span style={{ color: '#666', fontSize: '12px' }}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;
