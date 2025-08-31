import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons not showing correctly in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function StoreMap() {
  // Placeholder coordinates (New Delhi, India)
  const position = [28.6139, 77.2090];

  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      {/* 
        MapContainer is the main wrapper for the map.
        center → where the map starts (your store’s coordinates).
        zoom → how close the map should be.
        style → setting height and width explicitly so it renders properly.
      */}
      <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
        {/* TileLayer defines the actual map tiles (here we’re using OpenStreetMap). */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker shows a pin on your store location */}
        <Marker position={position}>
          <Popup>
            Your Store Location <br /> New Delhi, India
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

