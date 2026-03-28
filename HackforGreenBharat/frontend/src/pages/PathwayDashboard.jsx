import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowRight, Activity, Wind, CloudRain, MapPin, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import Navbar from "@/components/Navbar";

const PathwayDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v9/alert");
        if (res.data.success && res.data.data) {
          const newData = res.data.data;
          setMetrics(newData);
          setStatus('connected');
          
          setLogs(prev => {
             const newLog = { 
                 time: new Date().toLocaleTimeString(), 
                 ...newData 
             };
             return [newLog, ...prev].slice(0, 50); // Keep more logs
          });
        }
      } catch (err) {
        setStatus('error');
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, []);

  const simulateLocation = (type) => {
    const loc = type === 'danger' 
      ? { user_id: 'demo_user', lat: 28.7041, lon: 77.1025 }
      : { user_id: 'demo_user', lat: 12.9716, lon: 77.5946 };
      
    axios.post("http://localhost:8081/v1/inputs", loc)
      .then(() => toast.success(`Simulated ${type === 'danger' ? 'High Pollution Point' : 'Clean Point'}`))
      .catch((e) => toast.error("Failed to send: " + e.message));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0c1210_0%,#060908_100%)] text-[#f0f5f2]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <header className="mb-12 text-center relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Pathway Real-Time Intelligence
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Live demonstration of Pathway's high-throughput streaming engine processing your location data to detect environmental risks instantly.
          </p>
        </header>

        {/* Architecture Diagram */}
        <div className="bg-[#0f1a15] rounded-3xl p-8 mb-12 border border-green-800/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={200} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-8 text-green-400 flex items-center gap-2">
            <Activity className="w-5 h-5" /> System Architecture
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center relative z-10">
             {/* Step 1 */}
             <div className="flex-1 p-6 bg-[#0a1310] rounded-2xl border border-green-900/50 hover:border-green-500/50 transition-all duration-300">
               <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MapPin className="text-blue-400" />
               </div>
               <h3 className="font-bold text-blue-200">User Frontend</h3>
               <p className="text-xs text-blue-400/70 mt-1">Streams GPS Data (Lat/Lon)</p>
             </div>
             
             <ArrowRight className="text-gray-600 hidden md:block" />
             
             {/* Step 2 */}
             <div className="flex-1 p-6 bg-[#0a1310] rounded-2xl border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden group">
               <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
               <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                 <Activity className="text-purple-400" />
               </div>
               <h3 className="font-bold text-purple-200 relative z-10">Pathway Service (Python)</h3>
               <p className="text-xs text-purple-400/70 mt-1 relative z-10">Real-time Join & Risk Detection</p>
               <span className="absolute top-2 right-2 text-[10px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-700/50">CORE ENGINE</span>
             </div>
             
             <ArrowRight className="text-gray-600 hidden md:block" />
             
             {/* Step 3 */}
             <div className="flex-1 p-6 bg-[#0a1310] rounded-2xl border border-green-900/50 hover:border-green-500/50 transition-all duration-300">
               <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CloudRain className="text-green-400" />
               </div>
               <h3 className="font-bold text-green-200">Node.js Backend</h3>
               <p className="text-xs text-green-400/70 mt-1">Stores Live State & Alerts</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Metrics */}
          <div className="bg-[#0f1a15] rounded-3xl p-8 border border-green-800/30 flex flex-col relative overflow-hidden">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 blur-3xl rounded-full"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-xl font-semibold flex items-center gap-3 text-white">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                Live Environment Data
              </h2>
              {metrics && (
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                  metrics.level === 'High' 
                    ? 'bg-red-500/20 text-red-200 border-red-500/30' 
                    : 'bg-green-500/20 text-green-200 border-green-500/30'
                }`}>
                  {metrics.level} Risk
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
              {metrics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 p-8 rounded-2xl bg-gradient-to-br from-[#1a2e25] to-[#0a1310] border border-green-800/30 text-center relative overflow-hidden">
                    {metrics.level === 'High' && (
                        <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                    )}
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-2 font-medium">Air Quality Index</p>
                    <div className={`text-7xl font-black tracking-tighter ${metrics.level === 'High' ? 'text-red-400' : 'text-green-400'}`}>
                        {metrics.aqi}
                    </div>
                    <p className="text-sm text-gray-400 mt-3 flex items-center justify-center gap-2">
                        {metrics.level === 'High' ? <AlertTriangle size={16} className="text-red-400"/> : <CheckCircle size={16} className="text-green-400"/>}
                        {metrics.description}
                    </p>
                  </div>
                  <div className="p-6 bg-[#0a1310] rounded-2xl border border-green-800/20 text-center">
                    <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide">CO2 Levels</p>
                    <div className="text-2xl font-bold text-white">{metrics.co2} <span className="text-xs font-normal text-gray-500">ppm</span></div>
                  </div>
                  <div className="p-6 bg-[#0a1310] rounded-2xl border border-green-800/20 text-center">
                    <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide">NO2 Levels</p>
                    <div className="text-2xl font-bold text-white">{metrics.no2} <span className="text-xs font-normal text-gray-500">µg</span></div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 flex-col border border-dashed border-gray-700 rounded-2xl">
                  <Activity className="mb-4 animate-bounce text-green-500" />
                  <p>Waiting for data stream...</p>
                  <p className="text-xs mt-2 text-gray-600">Ensure Pathway Service is running</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 relative z-10">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Simulation Controls</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => simulateLocation('danger')}
                  className="flex-1 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-all border border-red-500/20 hover:border-red-500/40 flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={18} />
                  Simulate Pollution Spike
                </button>
                <button 
                  onClick={() => simulateLocation('clean')}
                  className="flex-1 py-3 px-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl text-sm font-semibold transition-all border border-green-500/20 hover:border-green-500/40 flex items-center justify-center gap-2"
                >
                  <Leaf size={18} />
                  Simulate Clean Air
                </button>
              </div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="bg-[#0f1a15] rounded-3xl p-8 border border-green-800/30 h-[600px] flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Processing Log
            </h2>
            <div className="flex-1 overflow-y-auto bg-[#050a08] rounded-2xl p-6 font-mono text-xs border border-green-900/30 custom-scrollbar shadow-inner">
              {logs.length === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-600 italic">
                      No logs received yet...
                  </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="mb-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 font-medium">
                  <div className="flex items-center gap-3 mb-1.5 opacity-70">
                    <span className="text-green-500">[{log.time}]</span>
                    <span className="text-blue-400">ID: {log.user_id}</span>
                  </div>
                  <div className="pl-0 text-gray-400 mb-1">
                    📍 LOC: <span className="text-yellow-500/80">{log.lat.toFixed(4)}, {log.lon.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded ${log.level === 'High' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-green-900/30 text-green-400 border border-green-800/50'}`}>
                      &gt;&gt;&gt; Detected AQI: {log.aqi} ({log.level})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayDashboard;
