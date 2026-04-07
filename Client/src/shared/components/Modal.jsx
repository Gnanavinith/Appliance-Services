import { Modal as AntModal } from 'antd';

const Modal = ({ open, isOpen, onClose, title, children, footer, ...props }) => {
  // Support both 'open' and 'isOpen' props for compatibility
  const isVisible = open !== undefined ? open : isOpen;
  
  console.log('🟦 Modal rendering, isVisible:', isVisible, 'open:', open, 'isOpen:', isOpen);
  
  return (
    <AntModal
      open={isVisible}
      onCancel={onClose}
      title={title}
      footer={footer}
      {...props}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
