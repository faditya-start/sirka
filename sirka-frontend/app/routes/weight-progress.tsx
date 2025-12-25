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
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface WeightEntry {
    _id: string;
    weight: number;
    date: string;
}

export default function WeightProgress() {
    const { isAuthenticated, user, updateUser } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [logs, setLogs] = useState<WeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentWeight, setCurrentWeight] = useState("");
    const [bmi, setBmi] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchLogs();
    }, [isAuthenticated, navigate]);

    const fetchLogs = async () => {
        try {
            const response = await api.get("/weightprogress"); // Assuming this endpoint exists and returns array
            // Sort logs by date ascending for chart
            const sortedLogs = response.data.data.sort((a: WeightEntry, b: WeightEntry) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setLogs(sortedLogs);
            if (sortedLogs.length > 0) {
                setBmi(calculateBMI(sortedLogs[sortedLogs.length - 1].weight, user?.height || 170));
            }
        } catch (err) {
            console.error("Gagal mengambil logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWeight = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/weightprogress", {
                weight: parseFloat(currentWeight),
                date: new Date().toISOString()
            });

            const newLog = response.data.data;
            const updatedLogs = [...logs, newLog].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            setLogs(updatedLogs);
            setBmi(response.data.currentBMI || calculateBMI(parseFloat(currentWeight), user?.height || 170));
            setShowAddModal(false);

            // Update local user state with new weight if needed
            if (user) {
                updateUser({ ...user, weight: parseFloat(currentWeight) });
            }

            setCurrentWeight("");
        } catch (err) {
            console.error("Gagal menambah berat badan:", err);
        }
    };

    const calculateBMI = (weight: number, height: number) => {
        const hInMeters = height / 100;
        return parseFloat((weight / (hInMeters * hInMeters)).toFixed(1));
    };

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-100" };
        if (bmi < 24.9) return { label: "Normal", color: "text-emerald-500", bg: "bg-emerald-100" };
        if (bmi < 29.9) return { label: "Overweight", color: "text-orange-500", bg: "bg-orange-100" };
        return { label: "Obesity", color: "text-red-500", bg: "bg-red-100" };
    };

    const bmiInfo = getBMICategory(bmi);

    const chartData = {
        labels: logs.map(log => new Date(log.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Berat Badan (kg)',
                data: logs.map(log => log.weight),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: {
                    color: '#f1f5f9',
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between md:hidden">
                <Link to="/" className="flex items-center gap-2">
                    <i className="lni lni-chevron-left font-bold text-slate-700"></i>
                    <span className="font-bold text-slate-700">Kembali</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Progres Berat Badan</h1>
                <div className="w-10"></div>
            </nav>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                <header className="hidden md:block">
                    <h1 className="text-3xl font-bold text-slate-900">Progres Berat Badan</h1>
                    <p className="text-slate-500 mt-1">Pantau perjalanan berat badan dan BMI Anda.</p>
                </header>
                {/* BMI Card */}
                <div className="glass p-8 rounded-3xl premium-shadow flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-10 ${bmiInfo.bg}`}></div>
                    <p className="text-slate-500 font-medium mb-1 relative z-10">BMI Anda Saat Ini</p>
                    <div className="text-6xl font-black text-slate-900 mb-2 relative z-10">{bmi || "-"}</div>
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${bmiInfo.bg} ${bmiInfo.color} relative z-10`}>
                        {bmiInfo.label}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="glass p-6 rounded-3xl premium-shadow">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <i className="lni lni-stats-up text-emerald-600"></i> Grafik Perjalanan
                    </h2>
                    <div className="h-64 w-full">
                        {logs.length > 0 ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Belum ada data berat badan yang tercatat.
                            </div>
                        )}
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <i className="lni lni-list"></i> Riwayat Pencatatan
                    </h2>
                    <div className="space-y-3">
                        {[...logs].reverse().map((log) => (
                            <div key={log._id} className="glass p-4 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">
                                    {log.weight} <span className="text-sm font-normal text-slate-500">kg</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-28 md:bottom-8 right-8 w-16 h-16 rounded-full bg-emerald-600 text-white text-3xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-[90]"
            >
                <i className="lni lni-plus"></i>
            </button>

            {/* Add Weight Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 premium-shadow">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Catat Berat Baru</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 text-2xl">
                                <i className="lni lni-close"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddWeight} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full text-center text-5xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 placeholder-slate-200 p-0"
                                    placeholder="00.0"
                                    value={currentWeight}
                                    onChange={(e) => setCurrentWeight(e.target.value)}
                                    autoFocus
                                    required
                                />
                                <p className="text-center text-slate-400 mt-2 font-medium">Kilogram (kg)</p>
                            </div>

                            <button type="submit" className="btn-primary w-full py-4 text-lg">
                                Simpan Progress
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
