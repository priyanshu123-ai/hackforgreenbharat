import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, Clock, CheckCircle, XCircle, Play, Send, Users, Gift, ChevronRight, Hourglass, Swords, Sparkles, Filter
} from "lucide-react";
import { serverUrl } from "@/main";
import Footer from "@/pages/Footer";

const MyChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v6/my`, { credentials: "include" });
        const data = await res.json();
        setChallenges(data.challenges || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadChallenges();
  }, []);

  const statusBadge = (status) => ({
    pending: <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100"><Hourglass className="w-3 h-3" /> Pending</span>,
    active: <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100"><Play className="w-3 h-3" /> Active</span>,
    completed: <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100"><CheckCircle className="w-3 h-3" /> Done</span>,
    declined: <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100"><XCircle className="w-3 h-3" /> Declined</span>,
  }[status] || null);

  const filteredChallenges = challenges.filter((c) => activeTab === "all" ? true : c.status === activeTab);

  const handleAccept = async (id) => {
    try {
      await fetch(`${serverUrl}/api/v6/accept/${id}`, { method: "POST", credentials: "include" });
      setChallenges((prev) => prev.map((c) => (c._id === id ? { ...c, status: "active" } : c)));
    } catch (err) { console.error(err); }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(`${serverUrl}/api/v6/decline/${id}`, { method: "POST", credentials: "include" });
      setChallenges((prev) => prev.map((c) => (c._id === id ? { ...c, status: "declined" } : c)));
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0faf5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mb-4" />
          <p className="text-emerald-600 font-black uppercase tracking-widest text-xs">Syncing Battles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faf5] pb-24">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-12 max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-100/40 blur-[100px] rounded-full -z-10"></div>
            <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <Swords className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-black text-emerald-600 tracking-wide uppercase">Environmental Duels</span>
                </div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    My <span className="text-emerald-500">Challenges</span>
                </h1>
                <p className="text-gray-500 font-medium text-lg mt-2">
                    Prove your commitment. Compete with friends and earn rewards.
                </p>
            </div>
            
            <Button onClick={() => navigate("/send")} className="h-16 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-95 flex items-center gap-3">
                <Send className="w-6 h-6" /> NEW DUEL
            </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/50 backdrop-blur p-1.5 rounded-[2rem] border border-emerald-100 h-16 shadow-sm">
                <TabsList className="bg-transparent border-none">
                    {["all", "pending", "active", "completed"].map((tab) => (
                    <TabsTrigger key={tab} value={tab}
                        className="px-8 h-12 rounded-[1.6rem] data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg text-sm font-black transition-all capitalize">
                        {tab}
                    </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>

        {/* Challenges List */}
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-24 bg-white/40 border-2 border-dashed border-emerald-100 rounded-[3rem]">
            <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                <Swords className="w-10 h-10 text-emerald-200" />
            </div>
            <p className="text-emerald-900 font-black text-xl">The Arena is Empty</p>
            <p className="text-emerald-600/60 text-sm font-medium mt-1">Ready to start your first eco-challenge?</p>
            <Button onClick={() => navigate("/send")} variant="ghost" className="mt-8 text-emerald-600 font-black hover:bg-emerald-50 rounded-2xl">
                CHALLENGE A FRIEND <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge._id} className="bg-white border-none rounded-[2.5rem] p-8 shadow-xl shadow-emerald-900/5 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trophy className="w-10 h-10 text-emerald-50" />
                </div>
                <CardContent className="p-0 flex flex-col md:flex-row justify-between gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {statusBadge(challenge.status)}
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase">{challenge.title}</h3>
                    </div>
                    <p className="text-gray-500 text-base font-medium mb-6 leading-relaxed max-w-xl">"{challenge.description}"</p>
                    
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                             <Clock className="w-4 h-4 text-orange-400" />
                             <span className="text-sm font-bold text-gray-600">{challenge.durationDays} Days Left</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                             <Sparkles className="w-4 h-4 text-yellow-500" />
                             <span className="text-sm font-black text-emerald-600">+{challenge.reward} Pts Reward</span>
                        </div>
                        {challenge.challenger && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-black">{challenge.challenger.name?.[0]}</div>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">VS {challenge.challenger.name}</span>
                            </div>
                        )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                    {challenge.status === "pending" && (
                      <>
                        <Button onClick={() => handleAccept(challenge._id)}
                          className="w-full md:w-40 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest">
                            ACCEPT
                        </Button>
                        <Button onClick={() => handleDecline(challenge._id)}
                          variant="outline"
                          className="w-full md:w-40 h-14 rounded-2xl border-none bg-red-50 text-red-500 font-black text-base hover:bg-red-100 transition-all uppercase tracking-widest">
                            DECLINE
                        </Button>
                      </>
                    )}
                    {challenge.status === "active" && (
                      <Button onClick={() => navigate(`/challenge/${challenge._id}`)}
                        className="w-full md:w-48 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                        ENTER ARENA <ChevronRight className="w-5 h-5" />
                      </Button>
                    )}
                    {challenge.status === "completed" && (
                         <Button onClick={() => navigate(`/challenge/${challenge._id}`)}
                         variant="outline"
                         className="w-full md:w-48 h-14 rounded-2xl border-emerald-100 bg-white text-emerald-600 font-black text-base hover:bg-emerald-50 transition-all uppercase tracking-widest">
                            VIEW SUMMARY
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyChallenges;
