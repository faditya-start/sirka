import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

export default function Gamification() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myStats, setMyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const [leaderboardRes, meRes] = await Promise.all([
        api.get("/gamification/leaderboard"),
        api.get("/gamification/me"),
      ]);

      setLeaderboard(leaderboardRes.data.data);
      setMyStats(meRes.data.data);
    } catch (error) {
      console.error("Gagal memuat data gamifikasi", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <main className="max-w-xl mx-auto p-6 space-y-8">
        
        {/* Header - My Stats */}
        <div className="glass p-8 rounded-[32px] premium-shadow text-center relative overflow-hidden bg-emerald-600 border border-emerald-500">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="flex gap-4">
               {myStats?.badges?.map((badge: string, idx: number) => (
                 <div key={idx} className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform rotate-12 border-2 border-white" title={badge}>
                   <i className="lni lni-star-filled text-white text-xl"></i>
                 </div>
               ))}
               {(!myStats?.badges || myStats.badges.length === 0) && (
                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50 border-dashed" title="Belum ada Badge">
                    <i className="lni lni-lock text-white/50 text-xl"></i>
                 </div>
               )}
            </div>

            <h1 className="text-white text-3xl font-extrabold mt-4 mb-1">
              Level {myStats?.level || 1}
            </h1>
            <p className="text-emerald-100 font-medium">Peringkat Kamu: #{myStats?.rank || '-'}</p>

            <div className="mt-6 flex bg-white/20 p-2 rounded-2xl w-full justify-around backdrop-blur-md">
              <div className="text-center p-2">
                <p className="text-white text-sm opacity-80">🔥 Streak</p>
                <p className="text-white font-bold text-xl">{myStats?.currentStreak || 0} Hari</p>
              </div>
              <div className="w-px bg-white/20 my-2"></div>
              <div className="text-center p-2">
                <p className="text-white text-sm opacity-80">💎 Poin</p>
                <p className="text-white font-bold text-xl">{myStats?.points || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <i className="lni lni-cup text-yellow-500"></i> Leaderboard
            </h2>
          </div>

          <div className="glass rounded-[32px] premium-shadow overflow-hidden">
            {leaderboard.map((user, idx) => (
              <div 
                key={user._id} 
                className={`flex items-center p-5 border-b border-slate-100 last:border-0 transition-all ${myStats?._id === user._id ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm border-2 ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-600 border-yellow-200' :
                  idx === 1 ? 'bg-slate-100 text-slate-500 border-slate-200' :
                  idx === 2 ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white text-slate-400 border-slate-100'
                }`}>
                  #{idx + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{user.name}</h3>
                  <p className="text-xs text-slate-500">Level {user.level} {user.badges?.length > 0 && `• ${user.badges.length} Badges`}</p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-emerald-600">{user.points}</span>
                  <span className="text-xs text-slate-400 block">pts</span>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Belum ada data kompetisi. Ayo mulai catat kesehatanmu!
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
