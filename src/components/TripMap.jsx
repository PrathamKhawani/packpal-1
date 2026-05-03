import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map view updates
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
}

export default function TripMap({ activities }) {
  // Extract coordinates from activities
  const coords = activities
    .filter(a => a.lat && a.lng)
    .map(a => ({ lat: a.lat, lng: a.lng, title: a.activity }));

  // Default to a fallback if no coordinates
  const center = coords.length > 0 ? [coords[0].lat, coords[0].lng] : [20, 0];

  return (
    <div className="trip-map-wrapper" style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords.map((c, i) => (
          <Marker key={i} position={[c.lat, c.lng]}>
            <Popup>
              <div style={{ fontWeight: 'bold' }}>{c.title}</div>
            </Popup>
          </Marker>
        ))}
        <RecenterMap coords={coords} />
      </MapContainer>
    </div>
  );
}
