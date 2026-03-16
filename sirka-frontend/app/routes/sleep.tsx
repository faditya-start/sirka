/**
 * ARCHITECTURE ROLE: Sleep Route
 * Halaman untuk mencatat dan melihat riwayat tidur.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import BottomModal from "../components/ui/BottomModal";

export default function Sleep() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [duration, setDuration] = useState("");
  const [quality, setQuality] = useState("Good");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sleeplogs");
      setLogs(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data tidur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/sleeplogs", {
        duration: Number(duration),
        quality,
        notes,
        date: new Date(date).toISOString(),
      });
      setIsModalOpen(false);
      setDuration("");
      setQuality("Good");
      setNotes("");
      fetchLogs();
    } catch (err) {
      console.error("Gagal mencatat tidur:", err);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm("Hapus catatan ini?")) return;
    try {
      await api.delete(`/sleeplogs/${id}`);
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
            <h1 className="text-3xl font-bold text-slate-900">Catatan Tidur</h1>
            <p className="text-slate-500 mt-1">Pantau kualitas istirahat harian Anda.</p>
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
          <div className="grid grid-cols-1 gap-4">
            {logs.map((log) => (
              <div key={log._id} className="glass p-6 rounded-2xl premium-shadow flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    log.quality === 'Excellent' ? 'bg-emerald-100 text-emerald-600' :
                    log.quality === 'Good' ? 'bg-blue-100 text-blue-600' :
                    log.quality === 'Fair' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <i className="lni lni-timer"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{log.duration} Jam Tidur</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} • {log.quality}
                    </p>
                    {log.notes && <p className="text-xs text-slate-400 mt-1 italic">"{log.notes}"</p>}
                  </div>
                </div>
                <button 
                  onClick={() => deleteLog(log._id)}
                  className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
                >
                  <i className="lni lni-trash-1"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
              <i className="lni lni-timer"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum ada catatan</h3>
            <p className="text-slate-500">Mulai catat waktu istirahat Anda hari ini.</p>
          </div>
        )}
      </main>

      <BottomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catat Tidur">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Durasi Tidur (Jam)</label>
            <input 
              type="number" 
              step="0.5"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="Contoh: 7.5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Kualitas Tidur</label>
            <div className="grid grid-cols-2 gap-2">
              {['Poor', 'Fair', 'Good', 'Excellent'].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                    quality === q 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {q}
                </button>
              ))}
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
            <label className="text-sm font-bold text-slate-700 ml-1">Catatan (Opsional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
              placeholder="Bagaimana perasaan Anda saat bangun?"
              rows={3}
            />
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-lg">
            Simpan Catatan
          </button>
        </form>
      </BottomModal>
    </div>
  );
}
