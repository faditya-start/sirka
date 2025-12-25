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
    const { isAuthenticated, user } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
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
            let response;
            if (period === "daily") {
                const today = new Date().toLocaleDateString('en-CA');
                response = await api.get(`/history/daily?date=${today}`);
                setSummary(response.data.summary);
                setLogs(response.data.details);
            } else if (period === "weekly") {
                response = await api.get("/history/weekly");
                setSummary(response.data.weeklySummary);
                setLogs(response.data.logs);
            } else if (period === "monthly") {
                response = await api.get("/history/monthly");
                setSummary(response.data.monthlySummary);
                setLogs(response.data.logs);
            } else if (period === "yearly") {
                response = await api.get("/history/yearly");
                setSummary(response.data.yearlySummary);
                setLogs(response.data.logs);
            }
        } catch (err) {
            console.error("Gagal mengambil data histori:", err);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        if (!logs) return { calories: { labels: [], datasets: [] }, water: { labels: [], datasets: [] } };

        if (period === "daily") {
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
                    labels: ["Pagi", "Siang", "Malam"],
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

        if (period === "yearly") {
            // Group by month for last 12 months
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            const now = new Date();
            const last12Months = [...Array(12)].map((_, i) => {
                const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
                return {
                    label: months[d.getMonth()] + " " + d.getFullYear().toString().slice(-2),
                    month: d.getMonth(),
                    year: d.getFullYear()
                };
            });

            const foodList = logs.foodLogs || logs.foods || [];
            const activityList = logs.activityLogs || logs.activities || [];

            const calsIn = last12Months.map(m => {
                return foodList
                    .filter((l: any) => {
                        const d = new Date(l.date);
                        return d.getMonth() === m.month && d.getFullYear() === m.year;
                    })
                    .reduce((sum: number, l: any) => sum + (l.calories || 0), 0);
            });

            const calsOut = last12Months.map(m => {
                return activityList
                    .filter((l: any) => {
                        const d = new Date(l.date);
                        return d.getMonth() === m.month && d.getFullYear() === m.year;
                    })
                    .reduce((sum: number, l: any) => sum + (l.caloriesBurned || 0), 0);
            });

            const water = last12Months.map(m => {
                return (logs.waterLogs || logs.water || [])
                    .filter((l: any) => {
                        const d = new Date(l.date);
                        return d.getMonth() === m.month && d.getFullYear() === m.year;
                    })
                    .reduce((sum: number, l: any) => sum + (l.amount || 0), 0);
            });

            return {
                calories: {
                    labels: last12Months.map(m => m.label),
                    datasets: [
                        {
                            label: 'Asupan',
                            data: calsIn,
                            backgroundColor: '#10b981',
                            borderRadius: 4,
                        },
                        {
                            label: 'Bakar',
                            data: calsOut,
                            backgroundColor: '#f59e0b',
                            borderRadius: 4,
                        },
                        {
                            label: 'Netto',
                            data: calsIn.map((inc, idx) => inc - calsOut[idx]),
                            type: 'line' as const,
                            borderColor: '#3b82f6',
                            borderWidth: 2,
                            fill: false,
                            pointRadius: 0,
                            tension: 0.4
                        }
                    ]
                },
                water: {
                    labels: last12Months.map(m => m.label),
                    datasets: [{
                        label: 'Air (ml)',
                        data: water,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                    }]
                }
            };
        }

        // Weekly or Monthly (by days)
        const daysCount = period === "weekly" ? 7 : 30;
        const dateLabels = [...Array(daysCount)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (daysCount - 1 - i));
            return d.toLocaleDateString('en-CA');
        });

        const foodList = logs.foodLogs || logs.foods || [];
        const activityList = logs.activityLogs || logs.activities || [];

        const dailyCalsIn = dateLabels.map(date => {
            return foodList
                .filter((l: any) => new Date(l.date).toLocaleDateString('en-CA') === date)
                .reduce((sum: number, l: any) => sum + (l.calories || 0), 0);
        });

        const dailyCalsOut = dateLabels.map(date => {
            return activityList
                .filter((l: any) => new Date(l.date).toLocaleDateString('en-CA') === date)
                .reduce((sum: number, l: any) => sum + (l.caloriesBurned || 0), 0);
        });

        const dailyWater = dateLabels.map(date => {
            return (logs.waterLogs || logs.water || [])
                .filter((l: any) => new Date(l.date).toLocaleDateString('en-CA') === date)
                .reduce((sum: number, l: any) => sum + (l.amount || 0), 0);
        });

        return {
            calories: {
                labels: dateLabels.map(d => d.split('-').slice(1).reverse().join('/')),
                datasets: [
                    {
                        label: 'Asupan',
                        data: dailyCalsIn,
                        backgroundColor: '#10b981',
                        borderRadius: period === "weekly" ? 8 : 2,
                    },
                    {
                        label: 'Bakar',
                        data: dailyCalsOut,
                        backgroundColor: '#f59e0b',
                        borderRadius: period === "weekly" ? 8 : 2,
                    },
                    {
                        label: 'Netto',
                        data: dailyCalsIn.map((inc, idx) => inc - dailyCalsOut[idx]),
                        type: 'line' as const,
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4
                    }
                ]
            },
            water: {
                labels: dateLabels.map(d => d.split('-').slice(1).reverse().join('/')),
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
                <div className="flex p-1 bg-slate-100 rounded-2xl w-full">
                    {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all capitalize ${period === p ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {p === "daily" ? "Harian" : p === "weekly" ? "7 Hari" : p === "monthly" ? "30 Hari" : "Tahunan"}
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl premium-shadow border-emerald-50 bg-white">
                        <p className="text-slate-500 text-sm font-medium">Kalori (Asupan vs Bakar)</p>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {summary?.totalCaloriesIn?.toLocaleString('id-ID') || 0} <span className="text-xs font-normal text-slate-400">vs</span> {summary?.totalCaloriesOut?.toLocaleString('id-ID') || 0}
                        </div>
                        <div className={`text-xs font-bold mt-2 flex items-center gap-1 ${summary?.netCalories <= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                            <i className="lni lni-calculator"></i>
                            Netto: {summary?.netCalories?.toLocaleString('id-ID') || 0} kcal
                        </div>
                    </div>
                    <div className="glass p-6 rounded-3xl premium-shadow border-blue-50 bg-white">
                        <p className="text-slate-500 text-sm font-medium">Asupan Air</p>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {((summary?.totalWater || 0) / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Liter</span>
                        </div>
                        <div className="text-blue-500 text-xs font-bold mt-2 flex items-center gap-1">
                            <i className="lni lni-drop"></i> Total {summary?.totalWater || 0} ml
                        </div>
                    </div>
                    <div className="glass p-6 rounded-3xl premium-shadow border-orange-50 bg-white">
                        <p className="text-slate-500 text-sm font-medium">Berat Badan</p>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {summary?.latestWeight || summary?.endWeight || user?.weight || "-"} <span className="text-xs font-normal text-slate-400">kg</span>
                        </div>
                        {summary?.startWeight && summary?.endWeight && (
                            <div className={`${summary.endWeight <= summary.startWeight ? 'text-emerald-500' : 'text-red-500'} text-xs font-bold mt-2 flex items-center gap-1`}>
                                <i className={`lni ${summary.endWeight <= summary.startWeight ? 'lni-arrow-down' : 'lni-arrow-up'}`}></i>
                                {Math.abs(summary.endWeight - summary.startWeight).toFixed(1)} kg selisih
                            </div>
                        )}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-6 rounded-3xl premium-shadow bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <i className="lni lni-fire text-emerald-500"></i> Tren Kalori
                        </h3>
                        <div className="h-64">
                            <Bar data={charts.calories as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 10 } } } } }} />
                        </div>
                    </div>
                    <div className="glass p-6 rounded-3xl premium-shadow bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <i className="lni lni-drop text-blue-500"></i> Tren Air
                        </h3>
                        <div className="h-64">
                            <Line data={charts.water} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-emerald-600 rounded-3xl p-8 text-white premium-shadow relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Analisis Kesehatan</h3>
                        <p className="opacity-90 text-sm leading-relaxed max-w-lg">
                            {period === 'daily'
                                ? "Laporan hari ini menunjukkan aktivitas asupan makanan dan air Anda secara mendalam. Pastikan untuk mencatat setiap makanan untuk presisi maksimal."
                                : `Dalam periode ${period === 'weekly' ? '7 hari' : period === 'monthly' ? '30 hari' : 'setahun'}, Anda telah melacak progres secara konsisten. Pertahankan momentum ini untuk mencapai target kesehatan Anda.`}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
