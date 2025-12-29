import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { type AuthState } from "../store/authStore";

export type Period = "daily" | "weekly" | "monthly" | "yearly";

export function useHistoryData(user: AuthState['user'], period: Period) {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [logs, setLogs] = useState<any>(null);

    const fetchHistoryData = useCallback(async () => {
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
    }, [period]);

    useEffect(() => {
        fetchHistoryData();
    }, [fetchHistoryData]);

    const getChartData = () => {
        if (!logs) return { calories: { labels: [], datasets: [] }, water: { labels: [], datasets: [] }, weight: { labels: [], datasets: [] } };

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
                },
                weight: {
                    labels: ["Saat Ini"],
                    datasets: [{
                        label: 'Berat (kg)',
                        data: [summary?.latestWeight || user?.weight || 0],
                        backgroundColor: '#f59e0b',
                        borderRadius: 8,
                    }]
                }
            };
        }

        if (period === "yearly") {
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
                },
                weight: {
                    labels: last12Months.map(m => m.label),
                    datasets: [{
                        label: 'Berat (kg)',
                        data: last12Months.map(m => {
                            const weights = (logs.weightLogs || [])
                                .filter((l: any) => {
                                    const d = new Date(l.date);
                                    return d.getMonth() === m.month && d.getFullYear() === m.year;
                                });
                            return weights.length > 0 ? weights[weights.length - 1].weight : null;
                        }),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: true,
                        tension: 0.4,
                        spanGaps: true
                    }]
                }
            };
        }

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
            },
            weight: {
                labels: dateLabels.map(d => d.split('-').slice(1).reverse().join('/')),
                datasets: [{
                    label: 'Berat (kg)',
                    data: dateLabels.map(date => {
                        const entry = (logs.weightLogs || [])
                            .find((l: any) => new Date(l.date).toLocaleDateString('en-CA') === date);
                        return entry ? entry.weight : null;
                    }),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4,
                    spanGaps: true
                }]
            }
        };
    };

    return { loading, summary, logs, charts: getChartData() };
}
