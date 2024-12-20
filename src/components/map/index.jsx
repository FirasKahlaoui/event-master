import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Map = ({ events }) => {
  const getCoordinates = (location) => {
    const coordinates = {
      Tunis: [36.8065, 10.1815],
      Sousse: [35.8256, 10.636],
      Carthage: [36.8588, 10.3308],
      Bizerte: [37.2746, 9.8739],
      Hammamet: [36.4, 10.6167],
    };
    return coordinates[location] || [0, 0];
  };

  return (
    <MapContainer
      center={[34.0, 9.0]}
      zoom={7}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event) => {
        const coordinates = getCoordinates(event.location);
        return (
          <Marker key={event.id} position={coordinates}>
            <Popup>
              <strong>{event.title}</strong>
              <br />
              {event.location}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
