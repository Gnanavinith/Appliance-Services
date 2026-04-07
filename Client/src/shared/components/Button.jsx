import { Button as AntButton } from 'antd';

const Button = ({ children, variant = 'primary', htmlType = 'button', ...props }) => {
  const getButtonType = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'default':
        return 'default';
      case 'dashed':
        return 'dashed';
      case 'text':
        return 'text';
      case 'link':
        return 'link';
      default:
        return 'primary';
    }
  };

  return (
    <AntButton type={getButtonType()} htmlType={htmlType} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;