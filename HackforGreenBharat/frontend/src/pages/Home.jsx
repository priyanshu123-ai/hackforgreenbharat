import Navbar from "@/components/Navbar";
import { ChevronRight, Leaf, Sparkles, Map, Route, BarChart3, Bell, Trophy, Globe, Zap, ArrowRight, Star } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import LiveAQISection from "@/components/LiveAQISection";

const Home = () => {
  const navigation = useNavigate('');

  const features = [
    { title: "Real-Time AQI Mapping", desc: "Visualize pollution exposure across different routes in real time.", icon: <Map className="w-8 h-8" /> },
    { title: "Smart Route Suggestions", desc: "Choose routes that balance speed and air quality seamlessly.", icon: <Route className="w-8 h-8" /> },
    { title: "Personal Impact Score", desc: "Track how daily travel and habits impact your respiratory health.", icon: <BarChart3 className="w-8 h-8" /> },
    { title: "Eco-Friendly Alternatives", desc: "Get recommendations for greener transport and lifestyle choices.", icon: <Leaf className="w-8 h-8" /> },
    { title: "Predictive AQI Alerts", desc: "Know high-pollution zones before you reach them with AI.", icon: <Bell className="w-8 h-8" /> },
    { title: "Gamification & Rewards", desc: "Challenges, leaderboards, and rewards for greener choices.", icon: <Trophy className="w-8 h-8" /> },
  ];

  const reviews = [
    { name: "Priya Sharma", role: "Daily Office Commuter", text: "EcoSense completely changed how I travel. I now avoid high-pollution routes without adding much time." },
    { name: "Rahul Mehta", role: "Fitness Enthusiast", text: "The pollution score made me aware of my habits. Small changes are making a big difference." },
    { name: "Ananya Verma", role: "College Student", text: "The challenges and leaderboard keep me motivated. Going green finally feels fun!" },
  ];

  const aqiStates = [
    { state: "Delhi", aqi: 142, max: 300, status: "Unhealthy for Sensitive", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { state: "Maharashtra", aqi: 88, max: 300, status: "Moderate", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { state: "Karnataka", aqi: 54, max: 300, status: "Good", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  ];

  const stats = [
    { value: "40%", label: "Less Pollution Exposure" },
    { value: "25%", label: "Lower Carbon Footprint" },
    { value: "3×", label: "Higher Engagement" },
    { value: "85%", label: "Behavior Change" },
  ];

  return (
    <div className="min-h-screen bg-[#f0faf5] text-gray-900 font-sans selection:bg-emerald-200">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center text-center px-6 pt-40 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-100/30 blur-[150px] rounded-full -z-10"></div>
        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
            <Sparkles className="w-4 h-4" /> AI-Powered Sustainability Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-gray-900 uppercase">
            Track Your Impact.<br />
            <span className="text-emerald-500">
              Breathe Clean.
            </span>
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            EcoSense calculates your personal <span className="text-gray-900 font-bold">Resilience score</span>, optimizes your travel for air quality, and rewards every green step.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              className="h-20 px-12 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-200 active:scale-95"
              onClick={() => navigation('/dashboard')}
            >
              GET YOUR SCORE <ArrowRight className="w-6 h-6" />
            </button>
            <button
              className="h-20 px-12 rounded-[2rem] border-none bg-white text-gray-600 hover:text-emerald-600 font-black text-xl transition-all shadow-xl active:scale-95"
              onClick={() => navigation('/pitch')}
            >
              VIEW LIVE DEMO
            </button>
          </div>
        </div>
      </section>

      {/* LIVE AQI DATA */}
      <div className="px-6 mb-24">
         <LiveAQISection />
      </div>

      {/* STATS STRIP */}
      <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 blur-[100px] rounded-full"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center px-6 relative z-10">
            {stats.map((s, i) => (
              <div key={i} className="group">
                <h3 className="text-6xl font-black text-emerald-500 tracking-tighter group-hover:scale-110 transition-transform">{s.value}</h3>
                <p className="text-gray-400 mt-2 text-xs font-black uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
      </section>

      {/* AQI STATES OVERVIEW */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Live Regional <span className="text-emerald-500">Pulse</span></h2>
                <div className="h-1.5 w-24 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {aqiStates.map((item, index) => {
                const percentage = (item.aqi / item.max) * 100;
                return (
                <div key={index} className="bg-white rounded-[3.5rem] p-10 border border-emerald-50 text-center shadow-xl shadow-emerald-900/5 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-8">{item.state} Atmosphere</p>
                    <div className="relative w-48 h-48 mx-auto mb-10">
                    <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="96" cy="96" r="84" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                        <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="none"
                        className={`${item.color}`}
                        strokeDasharray="527" strokeDashoffset={527 - (527 * percentage) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-black tracking-tighter ${item.color}`}>{item.aqi}</span>
                        <span className="text-xs font-black text-gray-300 uppercase mt-1">AQI MAX</span>
                    </div>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${item.bg} border ${item.border} ${item.color} shadow-sm`}>
                    <Zap className="w-3.5 h-3.5" /> {item.status}
                    </span>
                </div>
                );
            })}
            </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Everything You <span className="text-emerald-500">Need</span></h2>
            <p className="text-gray-400 font-medium text-lg mt-4 max-w-xl mx-auto">A comprehensive ecosystem designed to make sustainability second nature.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div key={index} className="p-10 rounded-[3rem] border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all group-hover:rotate-12">
                    {item.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 font-medium text-base leading-relaxed tracking-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER SECTION */}
      <section className="py-32 px-6 bg-[#f0faf5]">
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-24">
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Warrior <span className="text-emerald-500">Voices</span></h2>
                <div className="flex justify-center gap-1 mt-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />)}
                </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, index) => (
                <div key={index} className="bg-white p-10 rounded-[3rem] border border-emerald-50 hover:shadow-2xl transition-all duration-500 group">
                    <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                        <Globe size={40} />
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-10 leading-relaxed italic">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-600">{review.name[0]}</div>
                    <div>
                        <h4 className="text-gray-900 font-black text-sm uppercase">{review.name}</h4>
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{review.role}</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center bg-gray-900 rounded-[4rem] px-12 py-20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <Leaf className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Ready to Impact?</h2>
            <p className="text-gray-400 mb-12 text-xl max-w-md font-medium">Join thousands of conscious citizens mapping a cleaner, greener future.</p>
            <Link to="/register">
                <button className="h-20 px-12 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl flex items-center gap-4 transition-all shadow-2xl shadow-emerald-900/40 active:scale-95">
                    START YOUR JOURNEY <ChevronRight className="h-8 w-8" />
                </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
