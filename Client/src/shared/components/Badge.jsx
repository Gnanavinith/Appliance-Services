import { Badge as AntBadge } from 'antd';

const Badge = ({ count, dot, color, children, ...props }) => {
  return (
    <AntBadge count={count} dot={dot} color={color} {...props}>
      {children}
    </AntBadge>
  );
};

export default Badge;
