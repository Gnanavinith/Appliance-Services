import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HiOutlineMapPin } from 'react-icons/hi2';

// Fix default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon (amber color to match theme)
const amberIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Function to get address from coordinates using Nominatim (free reverse geocoding)
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    if (data && data.display_name) {
      return {
        fullAddress: data.display_name,
        addressComponents: data.address || {}
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Function to parse address components into structured fields
const parseAddressComponents = (addressComponents) => {
  if (!addressComponents) return null;
  
  // Extract relevant fields from Nominatim address components
  const house = addressComponents.house_number || '';
  const road = addressComponents.road || addressComponents.pedestrian || '';
  const suburb = addressComponents.suburb || addressComponents.neighbourhood || '';
  const cityDistrict = addressComponents.city_district || addressComponents.district || '';
  const city = addressComponents.city || addressComponents.town || addressComponents.village || addressComponents.municipality || cityDistrict;
  const state = addressComponents.state || '';
  const pincode = addressComponents.postcode || '';
  const county = addressComponents.county || '';
  
  // Combine house/flat/street information with more comprehensive fields
  const houseFlatStreet = [house, road, suburb, county].filter(Boolean).join(', ');
  
  return {
    houseFlatStreet: houseFlatStreet,
    city: city,
    pincode: pincode
  };
};

// Component to handle map click events
function LocationMarker({ onLocationSelect, externalPosition }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const map = useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      setLoading(true);
      setAddress('Fetching address...');
      
      // Get address from coordinates
      const addressData = await reverseGeocode(e.latlng.lat, e.latlng.lng);
      const addressText = addressData?.fullAddress || 'Address not found';
      const parsedAddress = parseAddressComponents(addressData?.addressComponents);
      setAddress(addressText);
      setLoading(false);
      
      onLocationSelect?.({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address: addressText,
        ...parsedAddress
      });
    },
    async locationfound(e) {
      setPosition(e.latlng);
      setLoading(true);
      setAddress('Fetching address...');
      
      // Get address from coordinates
      const addressData = await reverseGeocode(e.latlng.lat, e.latlng.lng);
      const addressText = addressData?.fullAddress || 'Address not found';
      const parsedAddress = parseAddressComponents(addressData?.addressComponents);
      setAddress(addressText);
      setLoading(false);
      
      onLocationSelect?.({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address: addressText,
        ...parsedAddress
      });
      
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null && !externalPosition ? null : (
    <Marker position={externalPosition || position} icon={amberIcon}>
      <Popup>
        <div style={{ minWidth: '200px', maxWidth: '300px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: '600', fontSize: '13px', color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiOutlineMapPin style={{ fontSize: '16px', color: '#d97706' }} />
            Selected Location
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
            {loading ? 'Fetching address...' : address}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

// Component to add a locate me button on the map
function LocateControl({ onLocate }) {
  const map = useMap();
  
  const handleLocate = () => {
    console.log('🗺️ Map locate button clicked');
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    onLocate?.();
  };
  
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '12px', marginRight: '12px' }}>
      <div 
        onClick={handleLocate}
        style={{
          background: '#fff',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          fontWeight: '700',
          color: '#374151'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f9fafb';
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
        title="Use my current location"
      >
        Locate
      </div>
    </div>
  );
}

// Component to update map view when center changes
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      console.log('🗺️ Updating map view to:', center);
      map.flyTo(center, map.getZoom() || 15, {
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
}

const MapPicker = ({ onLocationSelect }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Default to a major city center (can be adjusted)
  const defaultCenter = [28.6139, 77.2090]; // New Delhi coordinates
  const defaultZoom = 13;

  // Handle location found from map locate
  const handleLocationFound = (e) => {
    console.log('✅ Location found by map:', e.latlng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please click on the map to select manually.');
      return;
    }

    setIsGeocoding(true);
    console.log('🔍 Requesting location access...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('✅ Location received:', position.coords);
        const { latitude, longitude } = position.coords;
        const latLng = [latitude, longitude];
        setCurrentLocation(latLng);
        setMarkerPosition({ lat: latitude, lng: longitude });
        
        // Get address
        console.log('🌐 Fetching address from coordinates...');
        const addressData = await reverseGeocode(latitude, longitude);
        const addressText = addressData?.fullAddress || 'Address not found';
        const parsedAddress = parseAddressComponents(addressData?.addressComponents);
        console.log('📍 Address:', addressText);
        console.log('📋 Parsed address:', parsedAddress);
        
        setSelectedAddress(addressText);
        setIsGeocoding(false);
        
        onLocationSelect?.({
          lat: latitude,
          lng: longitude,
          address: addressText,
          ...parsedAddress
        });
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        setIsGeocoding(false);
        
        let errorMessage = 'Unable to get your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location permission denied. Please enable location access in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable. Please try clicking on the map instead.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again or click on the map.';
            break;
          default:
            errorMessage += 'Please try clicking on the map to select your location.';
        }
        
        alert(errorMessage);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  // Update address when location is selected from map click
  const handleLocationSelected = async (locationData) => {
    setMarkerPosition({ lat: locationData.lat, lng: locationData.lng });
    setSelectedAddress(locationData.address || '');
    onLocationSelect?.(locationData);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Map Container */}
      <div style={{ 
        width: '100%',
        height: '350px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '2px solid #f0f0f0',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
      }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={handleLocationSelected} externalPosition={markerPosition} />
          <LocateControl onLocate={handleGetCurrentLocation} />
          <MapUpdater center={currentLocation} />
        </MapContainer>
      </div>
      
      {/* Display selected address */}
      {selectedAddress && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '16px',
          border: '2px solid #e5e7eb',
          background: '#f9fafb',
          marginBottom: '16px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <p style={{
            margin: '0 0 6px',
            fontSize: '11px',
            fontWeight: '800',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: "'Inter', sans-serif"
          }}>
            Detected Address
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#111827',
            lineHeight: '1.6',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif"
          }}>
            {selectedAddress}
          </p>
        </div>
      )}
      
      {/* Use Current Location Button */}
      <button
        onClick={handleGetCurrentLocation}
        disabled={isGeocoding}
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: '14px',
          border: '2px solid #e5e7eb',
          background: isGeocoding ? '#f3f4f6' : '#ffffff',
          color: isGeocoding ? '#9ca3af' : '#111827',
          fontSize: '14px',
          fontWeight: '700',
          cursor: isGeocoding ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: isGeocoding ? 0.7 : 1,
          fontFamily: "'Inter', sans-serif"
        }}
        onMouseEnter={(e) => {
          if (!isGeocoding) {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
        onMouseLeave={(e) => {
          if (!isGeocoding) {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }
        }}
      >
        {isGeocoding ? (
          <span>Detecting Your Location...</span>
        ) : (
          <>
            <HiOutlineMapPin style={{ fontSize: '18px' }} />
            <span>Use My Current Location</span>
          </>
        )}
      </button>
      
      {/* Help Text */}
      <p style={{
        margin: '12px 0 0',
        fontSize: '12px',
        color: '#9ca3af',
        textAlign: 'center',
        fontWeight: '600',
        fontFamily: "'Inter', sans-serif"
      }}>
        Click anywhere on the map to pin your location
      </p>
    </div>
  );
};

export default MapPicker;
