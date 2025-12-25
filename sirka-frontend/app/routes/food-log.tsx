import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";
import { useAuthStore, type AuthState } from "../store/authStore";

interface FoodEntry {
    _id: string;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealTime: "Pagi" | "Siang" | "Malam" | "Cemilan";
    portion: string;
    date: string;
}

export default function FoodLog() {
    const { isAuthenticated } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [logs, setLogs] = useState<FoodEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        foodName: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        mealTime: "Pagi",
        portion: "1 porsi",
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
            const response = await api.get("/foodlogs");
            const allLogs = response.data.data || [];

            // Filter only for today
            const todaysLogs = allLogs.filter((log: any) =>
                new Date(log.date).toLocaleDateString('en-CA') === todayShort
            );

            setLogs(todaysLogs);
        } catch (err) {
            console.error("Gagal mengambil logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFood = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/foodlogs", {
                ...formData,
                calories: parseFloat(formData.calories),
                protein: parseFloat(formData.protein || "0"),
                carbs: parseFloat(formData.carbs || "0"),
                fat: parseFloat(formData.fat || "0"),
            });
            setLogs([response.data.data, ...logs]);
            setShowAddModal(false);
            setFormData({
                foodName: "",
                calories: "",
                protein: "",
                carbs: "",
                fat: "",
                mealTime: "Pagi",
                portion: "1 porsi",
            });
        } catch (err) {
            console.error("Gagal menambah makanan:", err);
        }
    };

    const openDeleteModal = (id: string) => {
        setSelectedLogId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedLogId) return;
        try {
            await api.delete(`/foodlogs/${selectedLogId}`);
            setLogs(logs.filter(log => log._id !== selectedLogId));
            setShowDeleteModal(false);
            setSelectedLogId(null);
        } catch (err) {
            console.error("Gagal menghapus log:", err);
        }
    };

    const meals = ["Pagi", "Siang", "Malam", "Cemilan"];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <i className="lni lni-chevron-left font-bold text-slate-700"></i>
                    <span className="font-bold text-slate-700">Kembali</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Catatan Makanan</h1>
                <div className="w-10"></div>
            </nav>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Quick Summary Card */}
                <div className="p-6 rounded-3xl">
                    <p className="text-green-600 text-xl font-medium">Total Kalori Hari Ini</p>
                    <div className="text-4xl font-black mt-1">
                        {logs.reduce((sum, log) => sum + log.calories, 0)} <span className="text-lg font-normal">kcal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                        <div className="text-center">
                            <p className="text-sm text-green-600 font-medium">Protein</p>
                            <p className="font-bold">{logs.reduce((sum, log) => sum + (log.protein || 0), 0)}g</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-green-600 font-medium">Karbo</p>
                            <p className="font-bold">{logs.reduce((sum, log) => sum + (log.carbs || 0), 0)}g</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-green-600 font-medium">Lemak</p>
                            <p className="font-bold">{logs.reduce((sum, log) => sum + (log.fat || 0), 0)}g</p>
                        </div>
                    </div>
                </div>

                {/* Meal Sections */}
                {meals.map(mealType => (
                    <section key={mealType} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {mealType === "Pagi" ? <i className="lni lni-sun"></i> : mealType === "Siang" ? <i className="lni lni-restaurant"></i> : mealType === "Malam" ? <i className="lni lni-night"></i> : <i className="lni lni-coffee-cup"></i>}
                                {mealType}
                            </h2>
                            <span className="text-sm font-medium text-slate-400">
                                {logs.filter(l => l.mealTime === mealType).reduce((sum, l) => sum + l.calories, 0)} kcal
                            </span>
                        </div>

                        <div className="space-y-3">
                            {logs.filter(l => l.mealTime === mealType).length > 0 ? (
                                logs.filter(l => l.mealTime === mealType).map(log => (
                                    <div key={log._id} className="glass p-4 rounded-2xl flex items-center justify-between group">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{log.foodName}</h3>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs text-slate-500">{log.portion}</span>
                                                <span className="text-xs px-2 bg-slate-100 text-slate-600 rounded-full font-medium">{log.calories} kcal</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openDeleteModal(log._id)}
                                            className="text-slate-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <i className="lni lni-trash-can"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm">
                                    Belum ada catatan {mealType.toLowerCase()}
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-emerald-600 text-white text-3xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
                <i className="lni lni-plus"></i>
            </button>

            {/* Add Food Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">Tambah Makanan</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 text-2xl">
                                <i className="lni lni-close"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddFood} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Makanan</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="Misal: Nasi Goreng"
                                    value={formData.foodName}
                                    onChange={e => setFormData({ ...formData, foodName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Kalori (kcal)</label>
                                    <input
                                        type="number"
                                        className="input-premium"
                                        placeholder="250"
                                        value={formData.calories}
                                        onChange={e => setFormData({ ...formData, calories: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Makan</label>
                                    <select
                                        className="input-premium appearance-none"
                                        value={formData.mealTime}
                                        onChange={e => setFormData({ ...formData, mealTime: e.target.value as any })}
                                    >
                                        {meals.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Protein (g)</label>
                                    <input
                                        type="number"
                                        className="input-premium py-2 text-sm"
                                        placeholder="0"
                                        value={formData.protein}
                                        onChange={e => setFormData({ ...formData, protein: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Karbo (g)</label>
                                    <input
                                        type="number"
                                        className="input-premium py-2 text-sm"
                                        placeholder="0"
                                        value={formData.carbs}
                                        onChange={e => setFormData({ ...formData, carbs: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Lemak (g)</label>
                                    <input
                                        type="number"
                                        className="input-premium py-2 text-sm"
                                        placeholder="0"
                                        value={formData.fat}
                                        onChange={e => setFormData({ ...formData, fat: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full py-4 mt-4">Simpan Catatan</button>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 text-center premium-shadow">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
                            <i className="lni lni-warning"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Hapus Catatan?</h2>
                            <p className="text-slate-500 mt-2">Data yang sudah dihapus tidak dapat dikembalikan lagi.</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={confirmDelete}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Ya, Hapus Sekarang
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
