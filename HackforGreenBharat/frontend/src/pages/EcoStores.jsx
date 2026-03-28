import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Filter,
  Leaf,
  Store,
  Package,
  RefreshCw,
  ShoppingBag,
  Info
} from "lucide-react";
import Navbar from "@/components/Navbar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ecoIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const categoryConfig = {
  organic: { label: "Organic", icon: Leaf, color: "text-green-400" },
  zero_waste: { label: "Zero Waste", icon: RefreshCw, color: "text-teal-400" },
  farm: { label: "Farm Shop", icon: Package, color: "text-yellow-400" },
  second_hand: { label: "Second Hand", icon: RefreshCw, color: "text-blue-400" },
  vegan: { label: "Vegan", icon: Leaf, color: "text-lime-400" },
  sustainable: { label: "Sustainable", icon: Store, color: "text-emerald-400" },
};

const EcoStores = () => {
  const [city, setCity] = useState("");
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(categoryConfig)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);

 
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [28.6139, 77.209], 
        11
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19
      }).addTo(mapRef.current);
    }
  }, []);


  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredStores.forEach((store) => {
      const marker = L.marker(
        [store.location.lat, store.location.lng],
        { icon: ecoIcon }
      ).addTo(mapRef.current);

      marker.bindPopup(`
        <div class="p-2">
          <strong class="text-base">${store.name}</strong><br/>
          <span class="text-xs text-gray-500">${store.categories.map(c => categoryConfig[c]?.label || c).join(", ")}</span>
        </div>
      `);

      marker.on("click", () => setSelectedStore(store));
      markersRef.current.push(marker);
    });
  }, [filteredStores]);

  /* FETCH FROM BACKEND */
  const fetchStores = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setSelectedStore(null);

    try {
      // Updated API endpoint
      const res = await fetch(
        `http://localhost:3000/api/v10/store?city=${city}`
      );
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch");

      setStores(data.stores);
      setFilteredStores(data.stores);

      // Center map on City (even if no stores found)
      if (data.location) {
         mapRef.current.setView([data.location.lat, data.location.lon], 13);
      } else if (data.stores.length > 0) {
        mapRef.current.setView(
          [data.stores[0].location.lat, data.stores[0].location.lng],
          13
        );
      }
    } catch (err) {
      setError(err.message || "Failed to fetch eco-friendly stores");
      setStores([]);
      setFilteredStores([]);
    } finally {
      setLoading(false);
    }
  };

  /* FILTER LOGIC */
  const toggleFilter = (category) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredStores(stores);
    } else {
      setFilteredStores(
        stores.filter((s) =>
          s.categories.some((c) => activeFilters.includes(c))
        )
      );
    }
  }, [activeFilters, stores]);

  return (
    <div className="min-h-screen bg-[#050505] text-green-100 flex flex-col">
      <Navbar />
      
      {/* HEADER & SEARCH */}
      <div className="pt-24 px-6 pb-6 border-b border-green-900/30 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2 mb-6">
            <Leaf className="w-8 h-8" /> Eco-Friendly Stores
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-green-500/50 w-5 h-5" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchStores()}
                placeholder="Search city (e.g., Delhi, Mumbai, Bangalore)"
                className="w-full pl-12 pr-4 py-3 bg-green-900/10 border border-green-800/50 rounded-xl outline-none focus:border-green-500 transition-colors text-white placeholder-green-700/50"
              />
            </div>
            <button
              onClick={fetchStores}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              {loading ? "Searching..." : "Find Stores"}
            </button>
          </div>

          {/* FILTERS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5
                  ${activeFilters.includes(key) 
                    ? "bg-green-900/30 border-green-500 text-green-300" 
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"}`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            ))}
          </div>
          
          {error && <p className="text-red-400 mt-4 flex items-center gap-2"><Info className="w-4 h-4"/> {error}</p>}
        </div>
      </div>

      {/* CONTENT: MAP & LIST */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LIST SIDEBAR */}
        <div className="w-full md:w-[400px] bg-[#0a0a0a] border-r border-green-900/30 flex flex-col h-[50vh] md:h-auto overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-green-900/20 sticky top-0 bg-[#0a0a0a] z-10 flex justify-between items-center">
            <span className="text-gray-400 text-sm">{filteredStores.length} stores found</span>
          </div>

          {filteredStores.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center p-10 text-gray-500 text-center">
              <Store className="w-12 h-12 mb-3 opacity-20" />
              <p>No stores found.</p>
              <p className="text-sm">Try a different city or check filters.</p>
            </div>
          )}

          {filteredStores.map((store) => (
            <div 
              key={store.id}
              onClick={() => {
                setSelectedStore(store);
                mapRef.current?.flyTo([store.location.lat, store.location.lng], 16);
              }}
              className={`p-4 border-b border-green-900/10 cursor-pointer hover:bg-green-900/10 transition-colors
                ${selectedStore?.id === store.id ? "bg-green-900/20 border-l-4 border-l-green-500" : ""}`}
            >
              <h3 className="font-semibold text-lg text-green-200">{store.name}</h3>
              <p className="text-sm text-gray-400 mt-1 truncate">{store.address}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {store.categories.map(cat => {
                  const config = categoryConfig[cat];
                  return config ? (
                    <span key={cat} className={`text-xs flex items-center gap-1 ${config.color}`}>
                      <config.icon className="w-3 h-3" /> {config.label}
                    </span>
                  ) : (
                    <span key={cat} className="text-xs text-gray-500 capitalize">{cat}</span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div className="flex-1 relative">
           <div ref={mapContainerRef} className="h-full w-full z-0" />
           
           {/* FLOATING CARD FOR MOBILE/MAP */}
           {selectedStore && (
             <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-[#111] border border-green-900/50 p-4 rounded-xl shadow-2xl z-[1000] md:bottom-auto md:top-6 animate-in slide-in-from-bottom-4 fade-in">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-white">{selectedStore.name}</h3>
                 <button onClick={() => setSelectedStore(null)} className="text-gray-400 hover:text-white">&times;</button>
               </div>
               <p className="text-sm text-gray-400 mb-3">{selectedStore.address}</p>
               <div className="flex flex-wrap gap-2">
                 {selectedStore.categories.map(cat => (
                   <span key={cat} className="px-2 py-1 rounded bg-green-900/30 text-green-300 text-xs border border-green-700/30">
                     {categoryConfig[cat]?.label || cat}
                   </span>
                 ))}
               </div>
               <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedStore.location.lat},${selectedStore.location.lng}`, '_blank')}
                className="w-full mt-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
               >
                 Get Directions
               </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default EcoStores;