import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuthStore, type AuthState } from "../store/authStore";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function HistorySummary() {
    const { isAuthenticated } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [period, setPeriod] = useState<"daily" | "weekly">("weekly");
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [logs, setLogs] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchHistoryData();
    }, [isAuthenticated, period, navigate]);

    const fetchHistoryData = async () => {
        setLoading(true);
        try {
            if (period === "daily") {
                const today = new Date().toLocaleDateString('en-CA');
                const response = await api.get(`/history/daily?date=${today}`);
                setSummary(response.data.summary);
                setLogs(response.data.details);
            } else {
                const response = await api.get("/history/weekly");
                setSummary(response.data.weeklySummary);
                setLogs(response.data.logs);
            }
        } catch (err) {
            console.error("Gagal mengambil data histori:", err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to group logs by date for charts
    const getChartData = () => {
        if (!logs || period === "daily") {
            // Daily breakdown (by meal time or simple stats)
            return {
                calories: {
                    labels: ["Asupan", "Bakar", "Netto"],
                    datasets: [{
                        label: 'Kalori (kcal)',
                        data: [summary?.totalCaloriesIn || 0, summary?.totalCaloriesOut || 0, summary?.netCalories || 0],
                        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
                        borderRadius: 8,
                    }]
                },
                water: {
                    labels: ["Pagi", "Siang", "Malam"], // Simplified
                    datasets: [{
                        label: 'Air (ml)',
                        data: [summary?.totalWater || 0, 0, 0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                    }]
                }
            };
        }

        // Weekly logic: group by last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-CA');
        });

        const dailyCals = last7Days.map(date => {
            const dayLogs = logs.foodLogs.filter((l: any) => new Date(l.date).toLocaleDateString('en-CA') === date);
            return dayLogs.reduce((sum: number, l: any) => sum + (l.calories || 0), 0);
        });

        const dailyWater = last7Days.map(date => {
            const dayLogs = logs.waterLogs.filter((l: any) => new Date(l.date).toLocaleDateString('en-CA') === date);
            return dayLogs.reduce((sum: number, l: any) => sum + (l.amount || 0), 0);
        });

        return {
            calories: {
                labels: last7Days.map(d => d.split('-').slice(1).reverse().join('/')),
                datasets: [{
                    label: 'Kalori (kcal)',
                    data: dailyCals,
                    backgroundColor: '#10b981',
                    borderRadius: 8,
                }]
            },
            water: {
                labels: last7Days.map(d => d.split('-').slice(1).reverse().join('/')),
                datasets: [{
                    label: 'Air (ml)',
                    data: dailyWater,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            }
        };
    };

    const charts = getChartData();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <i className="lni lni-chevron-left font-bold text-slate-700"></i>
                    <span className="font-bold text-slate-700">Kembali</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Histori & Laporan</h1>
                <div className="w-10"></div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Period Selector */}
                <div className="flex p-1 bg-slate-100 rounded-2xl w-full max-w-sm mx-auto">
                    {(["daily", "weekly"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all capitalize ${period === p ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {p === "daily" ? "Hari Ini" : "7 Hari Terakhir"}
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl premium-shadow border-emerald-50 bg-white">
                        <p className="text-slate-500 text-sm font-medium">
                            {period === 'daily' ? 'Total Kalori Masuk' : 'Total Kalori (7 Hari)'}
                        </p>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {summary?.totalCaloriesIn?.toLocaleString('id-ID') || 0} <span className="text-xs font-normal text-slate-400">kcal</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            {period === 'daily' ? 'Bakar: ' : 'Rata-rata: '}
                            {Math.round(summary?.totalCaloriesOut / (period === 'weekly' ? 7 : 1)) || 0} kcal
                        </p>
                    </div>
                    <div className="glass p-6 rounded-3xl premium-shadow border-blue-50 bg-white">
                        <p className="text-slate-500 text-sm font-medium">Asupan Air</p>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {(summary?.totalWater / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Liter</span>
                        </div>
                        <div className="text-blue-500 text-xs font-bold mt-2 flex items-center gap-1">
                            <i className="lni lni-drop"></i> {summary?.totalWater || 0} ml
                        </div>
                    </div>
                    <div className="glass p-6 rounded-3xl premium-shadow border-orange-50 bg-white">
                        <p className="text-slate-500 text-sm font-medium">Informasi Berat</p>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {summary?.latestWeight || summary?.endWeight || "-"} <span className="text-xs font-normal text-slate-400">kg</span>
                        </div>
                        {period === 'weekly' && summary?.startWeight && summary?.endWeight && (
                            <div className={`${summary.endWeight <= summary.startWeight ? 'text-emerald-500' : 'text-red-500'} text-xs font-bold mt-2 flex items-center gap-1`}>
                                <i className={`lni ${summary.endWeight <= summary.startWeight ? 'lni-arrow-down' : 'lni-arrow-up'}`}></i>
                                {Math.abs(summary.endWeight - summary.startWeight).toFixed(1)} kg perubahan
                            </div>
                        )}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-6 rounded-3xl premium-shadow bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <i className="lni lni-fire text-emerald-500"></i> {period === 'daily' ? 'Ringkasan Kalori' : 'Tren Kalori'}
                        </h3>
                        <div className="h-64">
                            <Bar data={charts.calories} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                    <div className="glass p-6 rounded-3xl premium-shadow bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <i className="lni lni-drop text-blue-500"></i> Tren Hidrasi
                        </h3>
                        <div className="h-64">
                            <Line data={charts.water} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                </div>

                {/* Detailed Logs (Food) */}
                {period === 'daily' && logs?.foods?.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Makanan Hari Ini</h2>
                        <div className="space-y-3">
                            {logs.foods.map((food: any) => (
                                <div key={food._id} className="glass p-4 rounded-2xl flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <i className="lni lni-pizza"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{food.foodName}</h4>
                                            <p className="text-xs text-slate-500">{food.mealTime} • {food.portion}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-slate-900">{food.calories}</span>
                                        <span className="text-xs text-slate-400 block">kcal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(!logs || (period === 'daily' && logs?.foods?.length === 0)) && (
                    <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <i className="lni lni-empty-file text-4xl mb-2"></i>
                        <p>Tidak ada data untuk periode ini.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
