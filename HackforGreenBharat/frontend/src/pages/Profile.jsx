import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Trophy, 
  Leaf, 
  Zap, 
  Car, 
  ShoppingBag,
  Award,
  Target,
  Calendar,
  MapPin,
  Edit,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
  PieChart,
  FastForward,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { serverUrl } from "@/main";
import Footer from "./Footer";

const staticData = {
  maxScore: 900,
  rank: 4,
  totalUsers: 15000,
  streakDays: 12,
  carbonSaved: "245 kg",
  treesPlanted: 8,
};

const scoreBreakdown = [
  { category: "Electricity", score: 185, maxScore: 225, icon: Zap, color: "#F59E0B" },
  { category: "Transport", score: 210, maxScore: 225, icon: Car, color: "#3B82F6" },
  { category: "Shopping", score: 165, maxScore: 225, icon: ShoppingBag, color: "#14B8A6" },
  { category: "Lifestyle", score: 160, maxScore: 225, icon: Leaf, color: "#22C55E" },
];

const recentActivities = [
  { action: "Completed 'Plastic-Free Week' challenge", points: "+50", time: "2 hours ago", type: "challenge" },
  { action: "Used public transport for 5 days", points: "+30", time: "1 day ago", type: "transport" },
  { action: "Scanned eco-friendly product", points: "+10", time: "2 days ago", type: "scan" },
  { action: "Joined family competition", points: "+20", time: "3 days ago", type: "family" },
  { action: "Reduced electricity by 15%", points: "-25", time: "5 days ago", type: "electricity" },
];

const badges = [
  { name: "Eco Warrior", description: "Complete 10 challenges", icon: Trophy, earned: true },
  { name: "Green Streak", description: "7-day eco streak", icon: Zap, earned: true },
  { name: "Carbon Crusher", description: "Save 100kg CO₂", icon: Leaf, earned: true },
  { name: "Public Hero", description: "Use public transport 20 times", icon: Car, earned: false },
  { name: "Smart Shopper", description: "Scan 50 eco products", icon: ShoppingBag, earned: false },
  { name: "Family Champ", description: "Win 5 family competitions", icon: Award, earned: false },
];

const Profile = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v4/eco/latest`, {
          credentials: "include",
        });
        const data = await res.json();
        setAssessment(data.assessment);
      } catch (err) {
        console.error("Failed to fetch assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0faf5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
           <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mb-4" />
           <p className="text-emerald-600 font-black uppercase tracking-widest text-xs">Accessing Profile Vault...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#f0faf5]">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <Card className="bg-white border-none rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/10 max-w-md text-center">
            <div className="w-20 h-20 rounded-[2.5rem] bg-red-50 flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Vault Locked</h2>
            <p className="text-gray-500 font-medium mb-8">We couldn't retrieve your environmental records. Please sign in or complete an assessment.</p>
            <Button onClick={() => window.location.reload()} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg">RETRY AUTHENTICATION</Button>
          </Card>
        </div>
      </div>
    );
  }

  const userProfile = {
    name: assessment.userId?.name || "Eco Warrior",
    email: assessment.userId?.email || "warrior@ecosense.ai",
    location: assessment.userId?.profile?.location || "India",
    joinedDate: assessment.userId?.createdAt 
      ? new Date(assessment.userId.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : "March 2024",
    avatar: assessment.userId?.profile?.profilePhoto,
    pollutionScore: assessment.score || 0,
    maxScore: staticData.maxScore,
    rank: staticData.rank,
    totalUsers: staticData.totalUsers,
    streakDays: staticData.streakDays,
    carbonSaved: staticData.carbonSaved,
    treesPlanted: staticData.treesPlanted,
  };

  const scorePercentage = (userProfile.pollutionScore / userProfile.maxScore) * 100;
  const strokeDashoffset = 565 - (scorePercentage / 100) * 565;

  return (
    <div className="min-h-screen bg-[#f0faf5] pb-24">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-12 max-w-6xl">
        {/* Profile Header Hero */}
        <Card className="mb-12 overflow-hidden border-none rounded-[3.5rem] shadow-2xl shadow-emerald-900/5 bg-white relative">
           <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-400 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none grayscale contrast-125 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
                <div className="absolute top-10 right-10 flex gap-4">
                    <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
           </div>
           
           <CardContent className="px-10 pb-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 relative z-10 text-center md:text-left">
                  <div className="relative group">
                    <Avatar className="h-40 w-40 border-8 border-white shadow-2xl rounded-[3.5rem] bg-white overflow-hidden">
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} className="object-cover" />
                        <AvatarFallback className="text-4xl font-black bg-emerald-500 text-white rounded-[3.5rem]">
                        {userProfile.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 text-white border-4 border-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                        <Edit className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full mb-3">
                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Master Guardian</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-3 uppercase">
                                {userProfile.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-sm">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                    <MapPin className="h-4 w-4 text-emerald-500" /> {userProfile.location}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                    <Calendar className="h-4 w-4 text-emerald-500" /> Joined {userProfile.joinedDate}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="text-center bg-emerald-500 px-6 py-4 rounded-[1.8rem] shadow-xl shadow-emerald-100 min-w-[120px]">
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Global Rank</p>
                                <p className="text-3xl font-black text-white leading-none">#{userProfile.rank}</p>
                            </div>
                            <div className="text-center bg-orange-500 px-6 py-4 rounded-[1.8rem] shadow-xl shadow-orange-100 min-w-[120px]">
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Day Streak</p>
                                <p className="text-3xl font-black text-white leading-none">{userProfile.streakDays}</p>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
           </CardContent>
        </Card>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Impact Mastery Ring */}
            <Card className="border-none bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 p-10 flex flex-col items-center justify-center relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <Leaf size={180} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-8 self-start flex items-center gap-3 uppercase tracking-tight">
                    <PieChart className="w-5 h-5 text-emerald-500" /> Mastery
                </h3>
                
                <div className="relative w-48 h-48 mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="16" fill="none" />
                    <circle
                      cx="96" cy="96" r="88" stroke="url(#profileScoreGradient)" strokeWidth="16" fill="none" strokeDasharray="552"
                      style={{ strokeDashoffset: 552 - (scorePercentage / 100) * 552, transition: "stroke-dashoffset 1.5s ease" }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="profileScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-emerald-500 tracking-tighter">{userProfile.pollutionScore}</span>
                    <span className="text-gray-300 font-black text-xs uppercase tracking-widest mt-1">Impact pts</span>
                  </div>
                </div>
                
                <div className="w-full bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-900 font-black text-xs text-center uppercase tracking-widest leading-none">Top 8% Performance</p>
                </div>
            </Card>

            {/* Score Breakdown Bars */}
            <Card className="border-none bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 p-10 group overflow-hidden">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                    <Target className="w-5 h-5 text-emerald-500" /> Segments
                </h3>
                <div className="space-y-6">
                  {scoreBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                             <item.icon className="h-4 w-4" style={{ color: item.color }} />
                          </div>
                          <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{item.category}</span>
                        </div>
                        <span className="text-xs font-black text-gray-400 tracking-tighter uppercase">{item.score} / {item.maxScore}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 shadow-sm"
                          style={{ width: `${(item.score / item.maxScore) * 100}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
            </Card>

            {/* Badges Display */}
            <Card className="border-none bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 p-10 group overflow-hidden">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                    <Award className="w-5 h-5 text-emerald-500" /> Badges
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div 
                      key={badge.name}
                      className={`flex flex-col items-center justify-center p-3 rounded-[1.8rem] transition-all duration-500 ${badge.earned ? 'bg-emerald-50 border border-emerald-100 scale-100 opacity-100 hover:-translate-y-1' : 'bg-gray-50 opacity-40grayscale'}`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${badge.earned ? 'bg-white' : 'bg-gray-100'}`}>
                            <badge.icon className={`w-6 h-6 ${badge.earned ? 'text-emerald-500' : 'text-gray-400'}`} />
                        </div>
                        <span className="text-[9px] font-black text-center text-gray-500 uppercase leading-tight tracking-tight">{badge.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">3 New Trophies Available</p>
                </div>
            </Card>
        </div>

        {/* BOTTOM SECTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-8">
                <Card className="border-none bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 p-10">
                    <div className="flex items-center justify-between mb-10">
                         <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 uppercase tracking-tighter">
                            <Clock className="w-6 h-6 text-emerald-500" /> Historic Logs
                        </h3>
                        <Button variant="ghost" className="text-emerald-600 font-black text-xs hover:bg-emerald-50 rounded-xl">VIEW ALL</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-500 group"
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ${activity.points.startsWith('+') ? 'bg-emerald-500 shadow-emerald-100' : 'bg-red-400 shadow-red-100'}`}>
                               <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-black text-lg tracking-tight uppercase leading-none mb-2">{activity.action}</p>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{activity.time}</p>
                          </div>
                          <div className={`px-5 py-2 rounded-2xl font-black text-lg shadow-sm ${activity.points.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
                            {activity.points}
                          </div>
                        </div>
                      ))}
                    </div>
                </Card>
            </div>

            {/* Sidebar Tools */}
            <div className="lg:col-span-4 space-y-8">
                 <Card className="border-none bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 p-10 text-center relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                     <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 border border-emerald-100 group-hover:rotate-12 transition-transform">
                        <Leaf className="w-8 h-8 text-emerald-600" />
                     </div>
                     <h4 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Eco Mastery Course</h4>
                     <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">Upgrade your sustainability skills with our elite masterclass series.</p>
                     <Button className="w-full h-14 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
                        LEARN MORE <ArrowRight className="w-5 h-5" />
                     </Button>
                 </Card>

                 <Card className="border-none bg-[#111827] rounded-[3rem] shadow-2xl p-10 text-white relative overflow-hidden">
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full"></div>
                     <Zap className="w-10 h-10 text-emerald-400 mb-6" />
                     <h4 className="text-2xl font-black mb-4 uppercase leading-none tracking-tighter">Premium<br/>Guardian</h4>
                     <p className="text-gray-400 font-medium text-xs mb-8 uppercase tracking-[0.2em]">Unlock elite rewards & detailed pollution heatmaps.</p>
                     <Button className="w-full h-14 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20">
                        UPGRADE NOW
                     </Button>
                 </Card>
            </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
