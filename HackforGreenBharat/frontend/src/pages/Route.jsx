import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import RouteMap from "@/components/RouteMap";
import AQIBadge from "../components/AQIBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Navigation,
  Search,
  Clock,
  Route as RouteIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { serverUrl } from "@/main";
import { getCachedRoute, setCachedRoute } from "@/utils/routeCache";
import { toast } from "react-toastify";

/* AQI color helper */
const getAQIColor = (aqi) => {
  if (aqi === null) return "#9CA3AF";
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#FACC15";
  if (aqi <= 150) return "#FB923C";
  if (aqi <= 200) return "#EF4444";
  return "#991B1B";
};

const unlockSpeech = () => {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance("Audio enabled");
  msg.volume = 1; // MUST be audible once
  msg.rate = 1;
  msg.lang = "en-IN";

  window.speechSynthesis.speak(msg);
};


const speak = (text) => {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";
  msg.rate = 0.95;
  msg.volume = 1;

  window.speechSynthesis.speak(msg);
};


const Routes = () => {
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const lastAlertRef = useRef(null);
  const voiceEnabledRef = useRef(true);

  /* 🔊 POLLUTION ALERT (VOICE + TOAST) */


  useEffect(() => {
    if (!routes.length) return;

    const segments = routes[selectedRoute]?.pollutionSegments;
    if (!segments?.length) return;

    const high = segments.find((s) => s.aqi >= 150);
    if (!high) return;

    const level = high.aqi >= 200 ? "SEVERE" : "HIGH";
    if (lastAlertRef.current === level) return;

    lastAlertRef.current = level;

    const message =
      level === "SEVERE"
        ? "Severe pollution ahead. Close windows and enable air recirculation."
        : "High pollution detected ahead. Please wear a mask.";

    toast.warn(message, { position: "top-center", autoClose: 8000 });

    if (voiceEnabledRef.current) {
      speak(message);
    }
  }, [routes, selectedRoute]);

  const handleSearch = async () => {
     unlockSpeech(); 
  if (window.speechSynthesis) {
  const unlock = new SpeechSynthesisUtterance("Starting route");
  unlock.volume = 0;
  window.speechSynthesis.speak(unlock);
}


    lastAlertRef.current = null; // reset alerts on new search

    if (!destination) return;
    setLoading(true);

    try {
      const cached = getCachedRoute(origin, destination);
      if (cached) {
        setRoutes(cached.routes || []);
        setSelectedRoute(cached.routes?.[0]?.id || 0);
        setOriginCoords(cached.origin);
        setDestinationCoords(cached.destination);
        return;
      }

      const res = await axios.post(`${serverUrl}/api/v2/routes`, {
        originCity: origin,
        destinationCity: destination,
      });

      setCachedRoute(origin, destination, res.data);
      setRoutes(res.data.routes || []);
      setSelectedRoute(res.data.routes?.[0]?.id || 0);
      setOriginCoords(res.data.origin);
      setDestinationCoords(res.data.destination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  window.stopPollutionVoice = () => {
    window.speechSynthesis.cancel();
    voiceEnabledRef.current = false;
  };


  return (
    <div className="min-h-screen" style={{ background: "#0a0f0d" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header - Humanized */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-emerald-400">Your Journey,</span>{" "}
            <span className="text-white">Your Air.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
            "Every breath counts. Let's find the path that cares for you."
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card className="border-0 bg-[rgba(15,25,23,0.9)]">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <Input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="My starting point..."
                      className="pl-10 h-12 bg-white/5 border-emerald-500/20 text-white rounded-xl focus:border-emerald-500"
                    />
                  </div>

                  <div className="relative flex-1">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Where should we go?"
                      className="pl-10 h-12 bg-white/5 border-amber-500/20 text-white rounded-xl focus:border-amber-500"
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finding…
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find Routes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-0 bg-[rgba(15,25,23,0.9)]">
              <CardContent className="p-4">
                {routes.length > 0 && originCoords && destinationCoords ? (
                  <RouteMap
                    routes={routes}
                    selectedRouteId={selectedRoute}
                    origin={originCoords}
                    destination={destinationCoords}
                  />
                ) : (
                  <div className="h-[450px] flex items-center justify-center border-2 border-dashed border-emerald-500/20">
                    <RouteIcon className="w-16 h-16 text-emerald-500/30" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Available Routes
            </h2>

            {routes.map((route) => (
              <Card
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border-2 ${
                  selectedRoute === route.id
                    ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "border-white/5 bg-white/5"
                } rounded-[2rem]`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-lg font-bold ${selectedRoute === route.id ? 'text-emerald-400' : 'text-white'}`}>
                        {route.name}
                      </h3>
                      <div className="flex gap-2 mt-1">
                         {route.avgAQI < 60 && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase font-bold">Purest Air</span>}
                         {route.name.includes("Swift") && <span className="bg-amber-500/20 text-amber-400 text-[9px] px-2 py-0.5 rounded-full border border-amber-500/30 uppercase font-bold">Time Saver</span>}
                      </div>
                    </div>
                    <AQIBadge value={route.avgAQI} size="lg" />
                  </div>

                  {/* Travel Stats */}
                  <div className="flex gap-6 text-gray-400 text-sm my-4 bg-black/20 p-3 rounded-2xl">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {route.duration}
                    </span>
                    <span className="flex items-center gap-2">
                      <RouteIcon className="w-4 h-4 text-emerald-400" />
                      {route.distance}
                    </span>
                  </div>

                  {/* Visual AQI Gradient */}
                  <div className="space-y-1 mb-4">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Air consistency along path</p>
                    <div className="flex gap-1.5 h-1.5">
                      {route.pollutionSegments?.slice(0, 10).map((s, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full"
                          style={{
                            backgroundColor: getAQIColor(s.aqi),
                            opacity: s.aqi ? 1 : 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Human Tip Card */}
                  {selectedRoute === route.id && (
                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex gap-3">
                        <div className="bg-emerald-500 p-2 rounded-xl h-fit">
                          <AlertTriangle className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold mb-1">Travel Advice</p>
                          <p className="text-emerald-100/70 text-xs leading-relaxed">
                            {route.healthAdvice}
                          </p>
                          <p className="text-amber-400 text-[10px] mt-2 italic">
                            💡 {route.travelTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pollution Table */}
        {/* {routes[selectedRoute]?.pollutionSegments && (
          <div className="mt-6 bg-black/30 p-4 rounded-lg">
            <h3 className="text-white mb-3 font-semibold">
              Pollution Zones Along Route
            </h3>

            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr>
                  <th className="text-left">Segment</th>
                  <th>AQI</th>
                  <th>Zone</th>
                </tr>
              </thead>
            <tbody>
  {routes[selectedRoute].pollutionSegments.map((s, i) => (
    <tr key={i}>
      <td className="text-left">
        {s.area || `Segment ${i + 1}`}
      </td>
      <td>{s.aqi ?? "N/A"}</td>
      <td
        className={
          s.zone === "High"
            ? "text-red-400"
            : s.zone === "Medium"
            ? "text-yellow-400"
            : "text-green-400"
        }
      >
        {s.zone}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )} */}

        {routes[selectedRoute]?.pollutionSegments &&
          routes[selectedRoute]?.pollutionSegments.length > 0 && (
            <div className="mt-8 rounded-2xl border border-[rgba(16,185,129,0.2)] bg-[rgba(15,25,23,0.95)] p-6">
              {/* Header */}
              <h3 className="mb-6 text-xl font-semibold text-white">
                Pollution Zones Along Route (
                {routes[selectedRoute]?.pollutionSegments.length} segments)
              </h3>

              {/* Segments */}
              <div className="space-y-4">
                {routes[selectedRoute]?.pollutionSegments.map((s, i) => {
                  const zoneColor =
                    s.zone === "High"
                      ? "text-red-500"
                      : s.zone === "Medium"
                        ? "text-yellow-400"
                        : "text-green-400";

                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[rgba(17,34,30,0.9)] p-4 md:flex-row md:items-center md:justify-between"
                    >
                      {/* Left side */}
                      <div className="flex items-start gap-4">
                        <div className="text-sm text-gray-400">{i + 1}.</div>

                        <div>
                          <p className="font-medium text-white">
                            {s.area || s.name || `Segment ${i + 1}`}
                          </p>
                          <p className="text-sm text-gray-400">
                            Lat: {s.lat ? s.lat.toFixed(4) : "-"}, Lon:{" "}
                            {s.lon ? s.lon.toFixed(4) : "-"}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-4">
                        {/* AQI badge */}
                        <span
                          className="rounded-full px-3 py-1 text-sm font-semibold"
                          style={{
                            backgroundColor: getAQIColor(s.aqi),
                            color: s.aqi <= 100 ? "#000" : "#fff",
                          }}
                        >
                          AQI {s.aqi || "N/A"}
                        </span>

                        {/* Zone */}
                        <span className={`text-sm font-medium ${zoneColor}`}>
                          {s.zone || "-"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Human Touch - Eco Tip Footer */}
        <div className="mt-16 text-center pb-20">
           <div className="inline-block p-8 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 border border-white/5 rounded-[3rem] max-w-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
             <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3">Today's Mindfulness</p>
             <p className="text-gray-300 text-lg leading-relaxed italic">
               "Choosing the cleaner path isn't just about your health—it's a small vote for a greener planet. Every kilometer where you breathe clean air is a win for everyone."
             </p>
           </div>
        </div>

        {/* Google Navigation */}
        {routes.length > 0 && (
          <div className="fixed bottom-8 right-6">
            <Button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
                  "_blank",
                )
              }
              className="bg-emerald-500 px-8 py-6 rounded-full shadow-lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Start Navigation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Routes;
