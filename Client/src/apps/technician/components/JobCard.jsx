import React from 'react';

const JobCard = ({ job, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(job)}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong>Job #{job.id}</strong>
        <span>{job.time}</span>
      </div>
      <div style={{ marginBottom: '8px' }}>{job.customerName}</div>
      <div style={{ color: '#666' }}>{job.serviceType}</div>
      <div style={{ marginTop: '8px' }}>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            backgroundColor: job.status === 'completed' ? '#52c41a' : '#1890ff',
            color: 'white',
          }}
        >
          {job.status}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
