import { useEffect, Fragment } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===== ICONS ===== */
const originIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-pushpin.png",
  iconSize: [32, 32],
  iconAnchor: [10, 32],
});

const destIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-pushpin.png",
  iconSize: [32, 32],
  iconAnchor: [10, 32],
});

/* ===== HELPERS ===== */
const getAQIColor = (aqi) => {
  if (aqi === null || aqi === undefined) return "#9CA3AF";
  if (aqi <= 50) return "#16a34a";   // green
  if (aqi <= 100) return "#ca8a04";  // yellow
  if (aqi <= 150) return "#ea580c";  // orange
  if (aqi <= 200) return "#dc2626";  // red
  return "#7c3aed";                  // purple
};

const getLabelCount = (distanceKm) => {
  if (distanceKm < 50) return 2;
  if (distanceKm < 200) return 3;
  return 5;
};

/* ===== AUTO FIT MAP ===== */
const FitBounds = ({ origin, destination }) => {
  const map = useMap();
  useEffect(() => {
    if (!origin || !destination) return;
    const bounds = L.latLngBounds(
      [origin.lat, origin.lon],
      [destination.lat, destination.lon]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, origin, destination]);
  return null;
};

/* ===== MAIN MAP ===== */
const RouteMap = ({ routes, selectedRouteId, origin, destination }) => {
  if (!origin || !destination) return null;

  const originPos = [origin.lat, origin.lon];
  const destPos = [destination.lat, destination.lon];

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);
  const labelIndexes = new Set();

  if (selectedRoute?.pollutionSegments?.length) {
    const total = selectedRoute.pollutionSegments.length;
    const distanceKm = parseFloat(selectedRoute.distance);
    const labelsToShow = getLabelCount(distanceKm);
    for (let i = 0; i < labelsToShow; i++) {
      labelIndexes.add(Math.floor((i * total) / labelsToShow));
    }
  }

  return (
    <MapContainer
      center={originPos}
      zoom={6}
      className="h-[500px] w-full rounded-xl"
      style={{ zIndex: 1 }}
    >
      {/* 🗺️ LIGHT MAP TILE — CartoDB Positron (Google Maps style) */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <FitBounds origin={origin} destination={destination} />

      {/* Markers */}
      <Marker position={originPos} icon={originIcon}>
        <Popup><strong>Origin:</strong> {origin.name}</Popup>
      </Marker>
      <Marker position={destPos} icon={destIcon}>
        <Popup><strong>Destination:</strong> {destination.name}</Popup>
      </Marker>

      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;

        if (isSelected && route.pollutionSegments?.length > 1) {
          return route.pollutionSegments.map((seg, i) => {
            if (i === route.pollutionSegments.length - 1) return null;
            const segColor = getAQIColor(seg.aqi);
            const nextSeg = route.pollutionSegments[i + 1];

            return (
              <Fragment key={`${route.id}-seg-${i}`}>
                <Polyline
                  positions={[[seg.lat, seg.lon], [nextSeg.lat, nextSeg.lon]]}
                  pathOptions={{ color: segColor, weight: 8, opacity: 0.85, lineCap: "round" }}
                >
                  {labelIndexes.has(i) && (
                    <Tooltip permanent direction="top" opacity={1}>
                      <div style={{
                        background: "#fff",
                        border: `3px solid ${segColor}`,
                        borderRadius: "10px",
                        padding: "6px 12px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#111",
                        minWidth: "100px",
                        textAlign: "center",
                      }}>
                        <div style={{ color: segColor, fontWeight: 800 }}>{seg.zone || "Unknown"}</div>
                        <div style={{ color: "#555", fontWeight: 600 }}>AQI: {seg.aqi ?? "N/A"}</div>
                      </div>
                    </Tooltip>
                  )}
                </Polyline>
              </Fragment>
            );
          });
        }

        /* Non-selected routes */
        const positions = route.geometry?.map((p) => [p.lat, p.lon]) || [];
        const colors = ["#3b82f6", "#8b5cf6", "#f59e0b"];
        const routeColor = colors[route.id % colors.length] || "#9CA3AF";

        return (
          <Polyline
            key={route.id}
            positions={positions}
            pathOptions={{ color: routeColor, weight: 5, opacity: 0.45, dashArray: "8 4" }}
          />
        );
      })}
    </MapContainer>
  );
};

export default RouteMap;
