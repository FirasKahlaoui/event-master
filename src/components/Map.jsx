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

// Custom icons for created and joined events
const createdEventIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const joinedEventIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = ({ createdEvents, joinedEvents }) => {
  const getCoordinates = (location) => {
    const coordinates = {
      Tunis: [36.8065, 10.1815],
      Sousse: [35.8256, 10.636],
      Carthage: [36.8588, 10.3308],
      // Add more locations as needed
    };
    return coordinates[location] || [0, 0]; // Return [0, 0] if location is not found
  };

  return (
    <MapContainer
      center={[36.8065, 10.1815]}
      zoom={7}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {createdEvents.map((event) => {
        const coordinates = getCoordinates(event.location);
        return (
          <Marker key={event.id} position={coordinates} icon={createdEventIcon}>
            <Popup>
              <h3>{event.title}</h3>
              <p>{event.shortDescription}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </Popup>
          </Marker>
        );
      })}
      {joinedEvents.map((event) => {
        const coordinates = getCoordinates(event.location);
        return (
          <Marker key={event.id} position={coordinates} icon={joinedEventIcon}>
            <Popup>
              <h3>{event.title}</h3>
              <p>{event.shortDescription}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
