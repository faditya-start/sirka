/**
 * ARCHITECTURE ROLE: Mood Route
 * Halaman untuk mencatat dan melihat riwayat suasana hati (mood) dan tingkat stres.
 */
import { useEffect, useState } from "react";
import api from "../services/api";
import BottomModal from "../components/ui/BottomModal";

const moodEmojis: Record<string, string> = {
  Happy: "😊",
  Calm: "😌",
  Neutral: "😐",
  Sad: "😢",
  Stressed: "😫",
  Energetic: "🤩",
};

export default function Mood() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [mood, setMood] = useState("Happy");
  const [stressLevel, setStressLevel] = useState(3);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/moodlogs/my");
      setLogs(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data mood:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/moodlogs", {
        mood,
        stressLevel,
        notes,
        date: new Date(date).toISOString(),
      });
      setIsModalOpen(false);
      setMood("Happy");
      setStressLevel(3);
      setNotes("");
      fetchLogs();
    } catch (err) {
      console.error("Gagal mencatat mood:", err);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm("Hapus catatan ini?")) return;
    try {
      await api.delete(`/moodlogs/${id}`);
      fetchLogs();
    } catch (err) {
      console.error("Gagal menghapus log:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <main className="max-w-4xl mx-auto p-6 pt-12">
        <header className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mood & Stress</h1>
            <p className="text-slate-500 mt-1">Pantau kesehatan mental dan emosional Anda.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <i className="lni lni-plus"></i>
            Tambah Log
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : logs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logs.map((log) => (
              <div key={log._id} className="glass p-6 rounded-2xl premium-shadow flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{moodEmojis[log.mood] || "😶"}</div>
                  <div>
                    <h3 className="font-bold text-slate-900">{log.mood}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-slate-400">Stress:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div 
                            key={s} 
                            className={`w-3 h-1 rounded-full ${s <= log.stressLevel ? 'bg-orange-400' : 'bg-slate-200'}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                    {log.notes && <p className="text-sm text-slate-600 mt-2 border-l-2 border-emerald-100 pl-3 py-1 italic">"{log.notes}"</p>}
                  </div>
                </div>
                <button 
                  onClick={() => deleteLog(log._id)}
                  className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center shrink-0"
                >
                  <i className="lni lni-trash-1"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
              <i className="lni lni-emoji-smile"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum ada catatan</h3>
            <p className="text-slate-500">Ceritakan bagaimana perasaan Anda hari ini.</p>
          </div>
        )}
      </main>

      <BottomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catat Suasana Hati">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Bagaimana perasaan Anda?</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(moodEmojis).map(([name, emoji]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setMood(name)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                    mood === name 
                      ? 'bg-emerald-50 border-emerald-500 scale-105 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between">
              <span>Tingkat Stres</span>
              <span className="text-emerald-600">{stressLevel}/5</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>Rendah</span>
              <span>Tinggi</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Tanggal</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Catatan</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
              placeholder="Ada hal menarik hari ini?"
              rows={3}
            />
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-xl">
            Simpan Mood
          </button>
        </form>
      </BottomModal>
    </div>
  );
}
