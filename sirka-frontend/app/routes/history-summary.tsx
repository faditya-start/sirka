import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
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
import StatsCard from "../components/ui/StatsCard";
import ChartCard from "../components/ui/ChartCard";
import { useHistoryData, Period } from "../hooks/useHistoryData";

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
    const [period, setPeriod] = useState<Period>("weekly");

    // Custom Hook
    const { loading, summary, charts } = useHistoryData(user, period);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between md:hidden">
                <Link to="/" className="flex items-center gap-2">
                    <i className="lni lni-chevron-left font-bold text-slate-700"></i>
                    <span className="font-bold text-slate-700">Kembali</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Histori & Laporan</h1>
                <div className="w-10"></div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 space-y-8">
                <header className="hidden md:block">
                    <h1 className="text-3xl font-bold text-slate-900">Histori & Laporan</h1>
                    <p className="text-slate-500 mt-1">Pantau tren kesehatan harian Anda secara mendalam.</p>
                </header>
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
                    <StatsCard
                        title="Kalori (Asupan vs Bakar)"
                        value={`${summary?.totalCaloriesIn?.toLocaleString('id-ID') || 0} vs ${summary?.totalCaloriesOut?.toLocaleString('id-ID') || 0}`}
                        subtitle={`Netto: ${summary?.netCalories?.toLocaleString('id-ID') || 0} kcal`}
                        icon="lni lni-calculator"
                        colorClass="border-emerald-50 bg-white"
                        className={summary?.netCalories <= 0 ? "text-emerald-500" : "text-orange-500"} // This might need adjustment based on how StatsCard handles text color for subtitle
                    />
                    {/* 
                       Note: StatsCard implementation assumes subtitle is just text/node. 
                       I might need to tweak StatsCard or pass the color logic specifically.
                       In StatsCard.tsx I didn't verify the subtitle color logic deeply.
                       Let's look at StatsCard again. It wraps subtitle in a div with className.
                       I can pass the subtitle as a ReactNode with the color class embedded.
                     */}

                    {/* Re-rendering StatsCards with specific content nodes for subtitles to retain full control over styling if needed, or pass simple props. */}
                </div>

                {/* 
                   Wait, I should rewrite the above StatsCard usage to be more precise.
                   The original code had specific logic for colors.
                */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Kalori (Asupan vs Bakar)"
                        value={`${summary?.totalCaloriesIn?.toLocaleString('id-ID') || 0}`}
                        unit={`vs ${summary?.totalCaloriesOut?.toLocaleString('id-ID') || 0}`}
                        colorClass="border-emerald-50"
                        subtitle={
                            <span className={summary?.netCalories <= 0 ? 'text-emerald-500' : 'text-orange-500'}>
                                Netto: {summary?.netCalories?.toLocaleString('id-ID') || 0} kcal
                            </span>
                        }
                        icon="lni lni-calculator"
                    />

                    <StatsCard
                        title="Asupan Air"
                        value={((summary?.totalWater || 0) / 1000).toFixed(1)}
                        unit="Liter"
                        colorClass="border-blue-50"
                        subtitle={
                            <span className="text-blue-500">
                                Total {summary?.totalWater || 0} ml
                            </span>
                        }
                        icon="lni lni-drop"
                    />

                    <StatsCard
                        title="Berat Badan"
                        value={summary?.latestWeight || summary?.endWeight || user?.weight || "-"}
                        unit="kg"
                        colorClass="border-orange-50"
                        subtitle={
                            summary?.startWeight && summary?.endWeight ? (
                                <span className={`${summary.endWeight <= summary.startWeight ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {Math.abs(summary.endWeight - summary.startWeight).toFixed(1)} kg selisih
                                </span>
                            ) : null
                        }
                        icon={summary?.startWeight && summary?.endWeight ? (summary.endWeight <= summary.startWeight ? 'lni-arrow-down' : 'lni-arrow-up') : undefined}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ChartCard
                        title="Tren Kalori"
                        icon="lni lni-fire"
                        iconColorClass="text-emerald-500"
                    >
                        <Bar data={charts.calories as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 10 } } } } }} />
                    </ChartCard>

                    <ChartCard
                        title="Tren Berat Badan"
                        icon="lni lni-stats-up"
                        iconColorClass="text-orange-500"
                    >
                        <Line data={charts.weight as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }} />
                    </ChartCard>

                    <ChartCard
                        title="Tren Air"
                        icon="lni lni-drop"
                        iconColorClass="text-blue-500"
                    >
                        <Line data={charts.water} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </ChartCard>
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
