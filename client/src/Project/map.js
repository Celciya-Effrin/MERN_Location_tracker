import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';


// Fix default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const DriverMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/active-locations');
        setLocations(res.data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 5000); // Refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleDriverLogin = () => {
    navigate('/driverlog');
  };

  return (
    <>
      <header className="bg-purple-800 py-4 shadow-md">
        <h1 className="text-center text-white text-3xl font-bold">
          Location Tracker
        </h1>
      </header>
      <div className="flex justify-center mt-2 mb-2">
        <button
          onClick={handleDriverLogin}
          className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-10 rounded-lg w-3/4 max-w-md shadow-lg transition duration-300"
        >
          Driver Login
        </button>
      </div>

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {locations.map((driver) => (
          <Marker key={driver.driverId} position={[driver.location.lat, driver.location.lng]}>
            <Popup>
              <strong>{driver.name}</strong><br />
              {driver.email}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default DriverMap;
