import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Activity, ArrowRight, CloudRain, Wind } from "lucide-react";

const PathwayListener = () => {
  const [pollutionData, setPollutionData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Stream Location to Pathway
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const user_id = "user_" + Math.floor(Math.random() * 1000); // Mock User ID

          // Send to Pathway (Directly to Python Service)
          // Note: In production, this might go through a backend proxy to avoid CORS if not configured
          // For hackathon, we assume direct access or proxy via vite
          axios.post("https://hackforgreenbharat-1.onrender.com/v1/inputs", {
            user_id,
            lat: latitude,
            lon: longitude,
          }).catch(err => console.error("Pathway push failed", err));
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }, 5000); // Every 5 seconds

    // 2. Poll Backend for Live Data
    const pollInterval = setInterval(async () => {
      try {
        const res = await axios.get("https://hackforgreenbharat.onrender.com/api/v9/alert");
        if (res.data.success && res.data.data) {
          setPollutionData(res.data.data);
          
          // Toast only on High pollution changes to avoid spam
          if (res.data.data.level === "High" && (!pollutionData || pollutionData.level !== "High")) {
            toast.error(`⚠️ High Pollution: AQI ${res.data.data.aqi}`);
          }
        }
      } catch (err) {
        // console.error("Poll failed", err);
      }
    }, 2000); // Faster polling for "live" feel

    return () => {
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, [pollutionData]);

  const simulateHighPollution = () => {
    const highPollutionLocation = {
      user_id: "test_user_sim",
      lat: 28.7041,
      lon: 77.1025
    };
    axios.post("https://hackforgreenbharat-1.onrender.com/v1/inputs", highPollutionLocation)
      .then(() => toast.success("Simulated: Moved to Delhi (High Pollution) 🚀"))
      .catch(err => toast.error("Simulation Failed"));
  };

  const simulateCleanZone = () => {
     const cleanLocation = {
      user_id: "test_user_sim",
      lat: 12.9716, // Bangalore approx
      lon: 77.5946
    };
    axios.post("https://hackforgreenbharat-1.onrender.com/v1/inputs", cleanLocation)
      .then(() => toast.success("Simulated: Moved to Bangalore (Clean) 🌿"))
      .catch(err => toast.error("Simulation Failed"));
  }

  if (!pollutionData) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#0f1a15]/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-green-500/30 z-[9999] w-72 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]">
      <h3 className="font-bold text-green-400 text-sm mb-4 flex items-center justify-between tracking-wide">
        <span className="flex items-center gap-2">
            <Activity size={16} />
            LIVE STREAM
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-black/40 px-2 py-1 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            CONNECTED
        </span>
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-3">
           <div>
               <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Air Quality</p>
               <span className={`text-3xl font-black tracking-tight ${pollutionData.level === 'High' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}>
                 {pollutionData.aqi}
               </span>
           </div>
           <div className="text-right">
               <span className={`px-2 py-1 rounded text-[10px] font-bold border ${pollutionData.level === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                   {pollutionData.level} Risk
               </span>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
            <div className="text-gray-500 mb-1 flex items-center gap-1"><CloudRain size={10} /> CO2</div>
            <div className="font-bold text-gray-200">{pollutionData.co2} <span className="text-[10px] text-gray-600 font-normal">ppm</span></div>
          </div>
          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
            <div className="text-gray-500 mb-1 flex items-center gap-1"><Wind size={10} /> NO2</div>
            <div className="font-bold text-gray-200">{pollutionData.no2} <span className="text-[10px] text-gray-600 font-normal">µg</span></div>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
            <button 
                onClick={simulateHighPollution}
                className="flex-1 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg transition-colors font-medium"
            >
                🔥 Spike
            </button>
            <button 
                onClick={simulateCleanZone}
                className="flex-1 text-[10px] bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-2 rounded-lg transition-colors font-medium"
            >
                🌿 Clean
            </button>
        </div>
        
        <div className="pt-2 text-center">
            <button 
                onClick={() => navigate('/pathway-demo')}
                className="group flex items-center justify-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors w-full"
            >
                Open Full Dashboard <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default PathwayListener;
