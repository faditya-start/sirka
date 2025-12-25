import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [todayCalories, setTodayCalories] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [todayWater, setTodayWater] = useState(0);

  // Calculate goal based on user data or default to 2000
  // For maintain weight, simple BMR approximation: Weight * 24 * 1.2
  const calorieGoal = user?.weight
    ? Math.round(user.weight * 24 * (user.activityLevel || 1.2))
    : 2000;

  const waterGoal = 2500;

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const todayShort = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

      // 1. Fetch Food Logs & Filter for Today
      const foodResponse = await api.get("/foodlogs");
      const foodLogs: any[] = foodResponse.data.data || [];
      const todaysFood = foodLogs.filter((log: any) =>
        new Date(log.date).toLocaleDateString('en-CA') === todayShort
      );
      setTodayCalories(todaysFood.reduce((sum, log) => sum + (log.calories || 0), 0));

      // 2. Fetch Water Logs & Filter for Today
      const waterResponse = await api.get("/waterlogs");
      const waterLogs: any[] = waterResponse.data.data || [];
      const todaysWater = waterLogs.filter((log: any) =>
        new Date(log.date).toLocaleDateString('en-CA') === todayShort
      );
      setTodayWater(todaysWater.reduce((sum, log) => sum + (log.amount || 0), 0));

      // 3. Fetch Activity Logs & Filter for Today
      const activityResponse = await api.get("/activitylogs");
      const activityLogs: any[] = activityResponse.data.data || [];
      const todaysActivity = activityLogs.filter((log: any) =>
        new Date(log.date).toLocaleDateString('en-CA') === todayShort
      );
      setBurnedCalories(todaysActivity.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0));

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const addWater = async (amount: number) => {
    try {
      setTodayWater(prev => prev + amount); // Optimistic Update
      await api.post("/waterlogs", { amount, date: new Date().toISOString() });
    } catch (error) {
      console.error("Gagal menambah air:", error);
      setTodayWater(prev => prev - amount); // Rollback
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto p-6 pt-12">
        {isAuthenticated ? (
          <div className="space-y-8">
            <header className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Anda</h1>
                <p className="text-slate-500 mt-1">Pantau progres kesehatan harian Anda di sini.</p>
              </div>
              <Link to="/history" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group">
                <i className="lni lni-stats-up group-hover:-translate-y-0.5 transition-transform"></i>
                Lihat Laporan
              </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl premium-shadow border-emerald-100 bg-emerald-50/30 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100/50 rounded-bl-[100px] -mr-6 -mt-6 z-0 pointer-events-none"></div>
                <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2 relative z-10">
                  <i className="lni lni-fire"></i> Kalori Hari Ini
                </h2>
                <div className="flex items-baseline justify-between relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-emerald-600">{todayCalories}</span>
                    <span className="text-slate-500 font-medium">/ {calorieGoal} kcal</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-600 font-bold">Bakar: {burnedCalories} kcal</p>
                    <p className="text-[10px] text-slate-400">Netto: {todayCalories - burnedCalories} kcal</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-emerald-100 rounded-full h-3 relative z-10">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((todayCalories / calorieGoal) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-emerald-700 mt-2 font-medium relative z-10">
                  {todayCalories >= calorieGoal ? "Target tercapai!" : `Kurang ${calorieGoal - todayCalories} kcal lagi`}
                </p>
              </div>

              <div className="glass p-8 rounded-3xl premium-shadow border-blue-100 bg-blue-50/30 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/50 rounded-bl-[100px] -mr-6 -mt-6 z-0 pointer-events-none"></div>
                <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2 relative z-10">
                  <i className="lni lni-drop"></i> Air Minum
                </h2>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-4xl font-extrabold text-blue-600">{todayWater}</span>
                  <span className="text-slate-500 font-medium">/ {waterGoal} ml</span>
                </div>
                <div className="mt-4 w-full bg-blue-100 rounded-full h-3 relative z-10 mb-4">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min((todayWater / waterGoal) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex gap-2 relative z-10">
                  <button
                    onClick={() => addWater(250)}
                    className="flex-1 bg-white hover:bg-blue-50 text-blue-600 py-3 rounded-xl text-sm font-bold transition-all shadow-sm border border-blue-100 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <i className="lni lni-plus"></i> 250ml
                  </button>
                  <button
                    onClick={() => addWater(600)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-200 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <i className="lni lni-plus"></i> 600ml
                  </button>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl premium-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Akses Cepat</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link to="/food-log" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-emerald-600">
                    <i className="lni lni-knife-fork-1"></i>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Makan</span>
                </Link>

                {['Olahraga', 'Berat', 'Profil'].map((item) => (
                  item === 'Berat' ? (
                    <Link key={item} to="/weight-progress" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-emerald-600">
                        <i className="lni lni-bar-chart-4"></i>
                      </div>
                      <span className="text-sm font-medium text-slate-600">{item}</span>
                    </Link>
                  ) : item === 'Profil' ? (
                    <Link key={item} to="/profile" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-emerald-600">
                        <i className="lni lni-user-4"></i>
                      </div>
                      <span className="text-sm font-medium text-slate-600">{item}</span>
                    </Link>
                  ) : (
                    <Link key={item} to="/exercise" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-emerald-600">
                        <i className="lni lni-dumbbell-1"></i>
                      </div>
                      <span className="text-sm font-medium text-slate-600">{item}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl premium-gradient text-white text-5xl mb-8 premium-shadow animate-bounce">
              <i className="lni lni-service-bell-1 text-emerald-600" style={{ fontSize: "4rem" }}></i>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Kesehatanmu adalah <br />
              <span className="">Investasi Terbaik.</span>
            </h1>
            <p className="text-xl text-slate-500 mt-6 max-w-2xl mx-auto">
              Pantau nutrisi, aktivitas fisik, dan progres berat badanmu dengan cara yang cerdas dan menyenangkan.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary px-10 py-4 text-lg w-full sm:w-auto">
                Mulai Sekarang
              </Link>
              <Link to="/login" className="px-10 py-4 text-lg font-bold text-slate-600 hover:text-emerald-600 transition-colors w-full sm:w-auto">
                Sudah punya akun?
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
