import React from 'react';
import { Steps } from 'antd';

const StatusStepper = ({ currentStatus }) => {
  const steps = [
    { title: 'Assigned', status: 'assigned' },
    { title: 'In Progress', status: 'in_progress' },
    { title: 'Completed', status: 'completed' },
  ];

  const getCurrentStep = () => {
    switch (currentStatus) {
      case 'assigned':
        return 0;
      case 'in_progress':
        return 1;
      case 'completed':
        return 2;
      default:
        return 0;
    }
  };

  return <Steps current={getCurrentStep()} items={steps} size="small" />;
};

export default StatusStepper;
