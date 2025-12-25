import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  // For demo: if not authenticated, we still show the home but with "Guest" view
  // In a real app, you might redirect from here or use a protected route wrapper

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="lni lni-service-bell-1 text-emerald-600" style={{ fontSize: "1.5rem" }}></i>
          <span className="text-xl font-bold">SIRKA</span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-slate-600">Halo, {user?.name}</span>
              <button onClick={() => logout()} className="text-sm font-semibold text-red-500 hover:text-red-600">
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="btn-primary text-sm px-5 py-2">
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 pt-12">
        {isAuthenticated ? (
          <div className="space-y-8">
            <header>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Anda</h1>
              <p className="text-slate-500 mt-1">Pantau progres kesehatan harian Anda di sini.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl premium-shadow border-emerald-100 bg-emerald-50/30">
                <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <i className="lni lni-fire-alt"></i> Kalori Hari Ini
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-emerald-600">0</span>
                  <span className="text-slate-500 font-medium">/ 2,000 kcal</span>
                </div>
                <div className="mt-4 w-full bg-emerald-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-0"></div>
                </div>
              </div>

              <div className="glass p-8 rounded-3xl premium-shadow border-blue-100 bg-blue-50/30">
                <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <i className="lni lni-drop"></i> Air Minum
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-blue-600">0</span>
                  <span className="text-slate-500 font-medium">/ 2,500 ml</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-xl text-sm font-bold transition-colors">
                    + 250ml
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-bold transition-colors">
                    + 600ml
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
                  <button key={item} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-slate-600">
                      {item === 'Olahraga' ? <i className="lni lni-dumbbell-1"></i> : item === 'Berat' ? <i className="lni lni-bar-chart-4"></i> : <i className="lni lni-user-4"></i>}
                    </div>
                    <span className="text-sm font-medium text-slate-600">{item}</span>
                  </button>
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
