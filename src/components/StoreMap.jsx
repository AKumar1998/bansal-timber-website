import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function StoreMap() {
  useEffect(() => {
    const storeCoords = [28.6139, 77.2090]; // New Delhi
    const map = L.map("store-map", {
      center: storeCoords,
      zoom: 13,
      zoomControl: true, // enable default zoom (+/-) buttons
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const markerIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [35, 35],
      iconAnchor: [17, 34],
      popupAnchor: [0, -28],
    });

    const marker = L.marker(storeCoords, { icon: markerIcon })
      .addTo(map)
      .bindPopup("<b>Our Store</b><br/>New Delhi, India")
      .openPopup();

    // Create a Leaflet-style button
    const locateControl = L.Control.extend({
      options: { position: "topleft" }, // same position as zoom buttons
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control leaflet-control-custom"
        );
        container.style.backgroundColor = "#fff";
        container.style.width = "34px";
        container.style.height = "34px";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.cursor = "pointer";
        container.style.fontSize = "18px";
        container.title = "Re-center map";

        container.innerHTML = "📍"; // pin emoji or you can use SVG

        container.onclick = () => {
          map.setView(storeCoords, 13, { animate: true });
          marker.openPopup();
        };

        return container;
      },
    });

    map.addControl(new locateControl());

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full my-10">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Find us on the Map
      </h2>

      {/* Card Container */}
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200">
        {/* Map */}
        <div id="store-map" className="h-[400px] w-full"></div>

        {/* Footer Info Bar */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-700">📍 Address: Connaught Place, New Delhi</p>
          <p className="text-gray-500 text-sm">Open: 9:00 AM – 9:00 PM</p>
        </div>
      </div>
    </div>
  );
}

