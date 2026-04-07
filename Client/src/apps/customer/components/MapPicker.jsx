import React from 'react';

const MapPicker = ({ location, onLocationSelect }) => {
  return (
    <div>
      <h3>Select Location on Map</h3>
      <div
        style={{
          width: '100%',
          height: '400px',
          background: '#f0f0f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>Map Integration Placeholder (Google Maps / Leaflet)</p>
      </div>
      <button
        onClick={() => {
          // Get current location logic here
          onLocationSelect?.({ latitude: 0, longitude: 0 });
        }}
      >
        Use Current Location
      </button>
    </div>
  );
};

export default MapPicker;
