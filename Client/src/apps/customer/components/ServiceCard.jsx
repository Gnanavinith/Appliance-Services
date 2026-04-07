import React from 'react';
import { Card, Rate, Typography } from 'antd';

const { Text } = Typography;

const ServiceCard = ({ service, onSelect }) => {
  return (
    <Card
      hoverable
      onClick={() => onSelect?.(service)}
      style={{
        height: '100%',
        borderRadius: '12px',
        border: '1px solid #e8e8e8',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '48px', 
          marginRight: '16px',
          background: '#f5f5f5',
          borderRadius: '12px',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {service.image || '🔧'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
            {service.name}
          </h3>
          <Text type="secondary" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            {service.description}
          </Text>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #f0f0f0',
      }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a365d' }}>
            ₹{service.price}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>Starting from</Text>
        </div>
        
        {service.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Rate disabled defaultValue={service.rating} style={{ fontSize: '12px' }} />
            <Text style={{ fontSize: '14px', fontWeight: '500' }}>{service.rating}</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;
