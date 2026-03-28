import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Leaf,
  Flame,
  Sparkles
} from "lucide-react";
import { serverUrl } from "@/main";
import Footer from "@/pages/Footer";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("weekly");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v4/leader`, {
          credentials: "include",
        });
        const data = await res.json();
        setLeaders(data.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  const getRankIcon = (rank) => {
    if (rank === 1)
      return <Crown className="text-yellow-400 animate-bounce w-8 h-8" />;
    if (rank === 2)
      return <Medal className="text-slate-300 w-6 h-6" />;
    if (rank === 3)
      return <Medal className="text-orange-300 w-6 h-6" />;
    return (
      <span className="font-black text-gray-300 text-lg">
        #{rank}
      </span>
    );
  };

  const topThree = leaders.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0faf5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
           <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mb-4" />
           <p className="text-emerald-600 font-black uppercase tracking-widest text-sm">Loading Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faf5]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 px-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">Global Eco Champions</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Community <span className="text-emerald-500">Hall of Fame</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg mt-2 max-w-xl">
              Celebrating the small steps that make a giant difference. Where do you stand today?
            </p>
          </div>

          <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-[1.5rem] border border-emerald-100 shadow-sm self-center md:self-auto">
            {["weekly", "monthly", "alltime"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-3 rounded-[1.2rem] text-sm font-black transition-all ${
                  timeframe === tf
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : "text-gray-500 hover:text-emerald-600"
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* PODIUM - REIMAGINED */}
        {topThree.length >= 3 && (
          <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 mb-20">
            {/* Rank 2 */}
            <Card
              onClick={() => setSelectedUser(topThree[1])}
              className="cursor-pointer bg-white border-2 border-emerald-50 rounded-[3rem] hover:shadow-2xl transition-all duration-500 w-full md:w-[230px] h-[280px] order-2 md:order-1 flex flex-col items-center justify-center p-8 group relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                    <Avatar className="w-20 h-20 border-4 border-slate-100 shadow-lg">
                      <AvatarImage src={topThree[1].avatar} />
                      <AvatarFallback className="bg-slate-50 text-slate-400 font-black text-2xl">{topThree[1].name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl shadow-md p-2">
                        <Medal className="w-6 h-6 text-slate-300" />
                    </div>
                </div>
                <h3 className="text-xl font-black text-gray-800 text-center tracking-tight leading-none mb-1">{topThree[1].name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Silver Champion</p>
                <div className="bg-slate-50 px-6 py-2 rounded-2xl">
                    <p className="text-2xl font-black text-slate-600">{topThree[1].score}</p>
                </div>
              </div>
            </Card>

            {/* Rank 1 - THE KING */}
            <Card
              onClick={() => setSelectedUser(topThree[0])}
              className="cursor-pointer bg-white border-2 border-emerald-100 rounded-[3.5rem] shadow-2xl shadow-emerald-900/10 hover:shadow-3xl transition-all duration-500 w-full md:w-[280px] h-[340px] order-1 md:order-2 flex flex-col items-center justify-center p-8 group relative overflow-hidden z-20 border-b-emerald-500"
            >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-8">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg animate-pulse" />
                    </div>
                    <Avatar className="w-20 h-20 border-4 border-emerald-200 shadow-2xl">
                      <AvatarImage src={topThree[0].avatar} />
                      <AvatarFallback className="bg-emerald-50 text-emerald-400 font-black text-4xl">{topThree[0].name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl shadow-lg p-3">
                         <Sparkles className="w-8 h-8 text-yellow-500 animate-spin-slow" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 text-center tracking-tighter leading-none mb-1">{topThree[0].name}</h3>
                <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Emerald Legend</p>
                <div className="bg-emerald-500 px-10 py-3 rounded-full shadow-lg shadow-emerald-200">
                    <p className="text-3xl font-black text-white">{topThree[0].score}</p>
                </div>
              </div>
            </Card>

            {/* Rank 3 */}
            <Card
              onClick={() => setSelectedUser(topThree[2])}
              className="cursor-pointer bg-white border-2 border-emerald-50 rounded-[3rem] hover:shadow-2xl transition-all duration-500 w-full md:w-[230px] h-[250px] order-3 md:order-3 flex flex-col items-center justify-center p-8 group relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                    <Avatar className="w-20 h-20 border-4 border-orange-50 shadow-md">
                      <AvatarImage src={topThree[2].avatar} />
                      <AvatarFallback className="bg-orange-50 text-orange-400 font-black text-xl">{topThree[2].name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl shadow-md p-2">
                        <Medal className="w-5 h-5 text-orange-300" />
                    </div>
                </div>
                <h3 className="text-lg font-black text-gray-800 text-center tracking-tight leading-none mb-1">{topThree[2].name}</h3>
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4">Bronze Sentinel</p>
                <div className="bg-orange-50 px-6 py-2 rounded-2xl">
                    <p className="text-xl font-black text-orange-600">{topThree[2].score}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TABS & LIST */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white/50 backdrop-blur p-1.5 rounded-[2rem] border border-emerald-100 h-16 shadow-sm">
                <TabsTrigger value="all" className="px-8 h-full rounded-[1.6rem] data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg text-sm font-black transition-all">
                  <Users className="w-4 h-4 mr-2" /> ALL HEROES
                </TabsTrigger>
                <TabsTrigger value="individuals" className="px-8 h-full rounded-[1.6rem] data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg text-sm font-black transition-all">
                  <Flame className="w-4 h-4 mr-2" /> STREAKS
                </TabsTrigger>
                <TabsTrigger value="cities" className="px-8 h-full rounded-[1.6rem] data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg text-sm font-black transition-all">
                  <Building className="w-4 h-4 mr-2" /> CITY PRIDE
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <Card className="bg-white border-2 border-emerald-50 rounded-[3.5rem] shadow-xl shadow-emerald-900/5 overflow-hidden">
                <CardContent className="p-4 sm:p-8">
                  <div className="space-y-2">
                    {leaders.map((user, index) => (
                      <div
                        key={user._id || index}
                        onClick={() => setSelectedUser(user)}
                        className={`flex items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-[2rem] transition-all cursor-pointer group ${
                          user.rank <= 3 ? "bg-emerald-50/30 border border-emerald-100/50" : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="w-12 text-center">
                            {user.rank <= 3 ? (
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${
                                   user.rank === 1 ? "bg-yellow-400 text-white" : user.rank === 2 ? "bg-slate-300 text-white" : "bg-orange-300 text-white"
                               }`}>
                                   {user.rank}
                               </div>
                            ) : (
                                <span className="text-xl font-black text-gray-300 group-hover:text-emerald-400 transition-colors">#{user.rank}</span>
                            )}
                        </div>

                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="font-black bg-gray-50 text-gray-300">{user.name?.[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-black text-gray-800 truncate leading-tight tracking-tight uppercase">{user.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Eco Warrior</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600 tracking-tighter tabular-nums leading-none">
                            {user.score}
                          </p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[11px] font-black uppercase tracking-widest ${
                              user.change >= 0 ? "text-emerald-500" : "text-red-400"
                            }`}
                          >
                            {user.change >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {user.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* USER DETAIL DIALOG */}
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="bg-white border-none rounded-[3rem] p-10 max-w-lg shadow-2xl">
            <DialogHeader className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Avatar className="w-20 h-20 border-4 border-emerald-100 shadow-xl">
                    <AvatarImage src={selectedUser?.avatar} />
                    <AvatarFallback className="font-black text-2xl">{selectedUser?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg">
                    <Trophy className="w-5 h-5" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-black text-gray-900 tracking-tighter">
                {selectedUser?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-medium text-lg mt-2">
                User Performance Report
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Current Score</p>
                <p className="text-3xl font-black text-gray-800">{selectedUser?.score}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Growth Trend</p>
                <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <p className="text-2xl font-black text-gray-800">+{selectedUser?.change || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
                <Button onClick={() => setSelectedUser(null)} className="w-full h-14 bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-100 uppercase tracking-widest">
                    View Full Profile
                </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
