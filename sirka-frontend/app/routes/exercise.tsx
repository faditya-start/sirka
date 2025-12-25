import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuthStore, type AuthState } from "../store/authStore";

interface ActivityEntry {
    _id: string;
    activityName: string;
    duration: number; // in minutes
    caloriesBurned: number;
    activityType: "Cardio" | "Strength" | "Flexibility" | "Sport";
    date: string;
}

export default function Exercise() {
    const { isAuthenticated } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [logs, setLogs] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        activityName: "",
        duration: "",
        caloriesBurned: "",
        activityType: "Cardio",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchLogs();
    }, [isAuthenticated, navigate]);

    const fetchLogs = async () => {
        try {
            const todayShort = new Date().toLocaleDateString('en-CA');
            const response = await api.get("/activitylogs");
            const allLogs = response.data.data || [];

            const todaysLogs = allLogs.filter((log: any) =>
                new Date(log.date).toLocaleDateString('en-CA') === todayShort
            );

            setLogs(todaysLogs);
        } catch (err) {
            console.error("Gagal mengambil data aktivitas:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/activitylogs", {
                ...formData,
                duration: parseFloat(formData.duration),
                caloriesBurned: parseFloat(formData.caloriesBurned),
                date: new Date().toISOString()
            });

            setLogs([response.data.data, ...logs]);
            setShowAddModal(false);
            setFormData({
                activityName: "",
                duration: "",
                caloriesBurned: "",
                activityType: "Cardio",
            });
        } catch (err) {
            console.error("Gagal menambah aktivitas:", err);
        }
    };

    const openDeleteModal = (id: string) => {
        setSelectedLogId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedLogId) return;
        try {
            await api.delete(`/activitylogs/${selectedLogId}`);
            setLogs(logs.filter(log => log._id !== selectedLogId));
            setShowDeleteModal(false);
            setSelectedLogId(null);
        } catch (err) {
            console.error("Gagal menghapus log:", err);
        }
    };

    const activityTypes = ["Cardio", "Strength", "Flexibility", "Sport"];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <i className="lni lni-chevron-left font-bold text-slate-700"></i>
                    <span className="font-bold text-slate-700">Kembali</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Aktivitas Fisik</h1>
                <div className="w-10"></div>
            </nav>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Summary Card */}
                <div className="p-6 rounded-3xl bg-white premium-shadow relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-orange-100 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>
                    <div className="relative z-10">
                        <p className="text-orange-600 text-xl font-medium flex items-center gap-2">
                            <i className="lni lni-fire"></i> Total Bakar Kalori
                        </p>
                        <div className="text-5xl font-black mt-2 text-slate-900">
                            {logs.reduce((sum, log) => sum + log.caloriesBurned, 0)} <span className="text-lg font-normal text-slate-500">kcal</span>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-bold">
                            <i className="lni lni-timer"></i>
                            {logs.reduce((sum, log) => sum + log.duration, 0)} Menit Aktivitas
                        </div>
                    </div>
                </div>

                {/* Activity List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <i className="lni lni-list"></i> Riwayat Hari Ini
                    </h2>

                    <div className="space-y-3">
                        {logs.length > 0 ? (
                            logs.map(log => (
                                <div key={log._id} className="glass p-5 rounded-2xl flex items-center justify-between group transition-all hover:scale-[1.01]">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
                                            ${log.activityType === 'Cardio' ? 'bg-blue-100 text-blue-600' :
                                                log.activityType === 'Strength' ? 'bg-purple-100 text-purple-600' :
                                                    log.activityType === 'Sport' ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'
                                            }`}>
                                            {log.activityType === 'Cardio' ? <i className="lni lni-run"></i> :
                                                log.activityType === 'Strength' ? <i className="lni lni-dumbbell"></i> :
                                                    log.activityType === 'Sport' ? <i className="lni lni-basketball"></i> : <i className="lni lni-emoji-happy"></i>}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{log.activityName}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><i className="lni lni-timer"></i> {log.duration} m</span>
                                                <span className="flex items-center gap-1 text-orange-500 font-medium"><i className="lni lni-fire"></i> {log.caloriesBurned} kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openDeleteModal(log._id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <i className="lni lni-trash-can"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-slate-300">
                                    <i className="lni lni-dumbbell"></i>
                                </div>
                                <p className="text-slate-500 font-medium">Belum ada aktivitas hari ini.</p>
                                <p className="text-slate-400 text-xs mt-1">Yuk, mulai bergerak!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* FAB */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-emerald-600 text-white text-3xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
                <i className="lni lni-plus"></i>
            </button>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-8 space-y-6 max-h-[90vh] overflow-y-auto premium-shadow">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">Tambah Aktivitas</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 text-2xl">
                                <i className="lni lni-close"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddActivity} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Olahraga</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {activityTypes.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, activityType: type })}
                                            className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2
                                                ${formData.activityType === type
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                                        >
                                            {type === 'Cardio' && <i className="lni lni-run"></i>}
                                            {type === 'Strength' && <i className="lni lni-dumbbell"></i>}
                                            {type === 'Flexibility' && <i className="lni lni-emoji-happy"></i>}
                                            {type === 'Sport' && <i className="lni lni-basketball"></i>}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Aktivitas</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="Misal: Lari Pagi, Push Up"
                                    value={formData.activityName}
                                    onChange={e => setFormData({ ...formData, activityName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Durasi (menit)</label>
                                    <input
                                        type="number"
                                        className="input-premium"
                                        placeholder="30"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Kalori (kcal)</label>
                                    <input
                                        type="number"
                                        className="input-premium"
                                        placeholder="150"
                                        value={formData.caloriesBurned}
                                        onChange={e => setFormData({ ...formData, caloriesBurned: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full py-4 mt-2">
                                Simpan Aktivitas
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 text-center premium-shadow">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
                            <i className="lni lni-warning"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Hapus Aktivitas?</h2>
                            <p className="text-slate-500 mt-2">Data ini akan dihapus permanen dari riwayat Anda.</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={confirmDelete}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Ya, Hapus
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
