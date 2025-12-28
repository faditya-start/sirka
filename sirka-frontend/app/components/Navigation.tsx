import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function Navigation() {
    const { isAuthenticated, logout } = useAuthStore();
    const location = useLocation();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    if (!isAuthenticated) return null;

    const navItems = [
        { label: "Beranda", path: "/", icon: "lni-home-2" },
        { label: "Makan", path: "/food-log", icon: "lni-knife-fork-1" },
        { label: "Olahraga", path: "/exercise", icon: "lni-dumbbell-1" },
        { label: "Laporan", path: "/history", icon: "lni-bar-chart-4" },
        { label: "Profil", path: "/profile", icon: "lni-user-4" },
    ];

    const isActive = (path: string) => location.pathname === path;

    // Desktop center nav exclude Profile
    const desktopNavItems = navItems.filter(item => item.label !== "Profil");

    return (
        <>
            {/* Mobile Topbar */}
            <nav className="fixed top-0 left-0 right-0 z-[110] md:hidden glass border-b border-slate-100 px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <i className="lni lni-service-bell-1 text-emerald-600 text-2xl"></i>
                    <span className="text-xl font-bold tracking-tight text-emerald-600">SIRKA</span>
                </div>
            </nav>

            {/* Desktop Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[110] hidden md:block glass border-b border-slate-100 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                    {/* Brand Left */}
                    <Link to="/" className="flex items-center gap-2">
                        <i className="lni lni-service-bell-1 text-emerald-600 text-2xl"></i>
                        <span className="text-xl font-bold tracking-tight">SIRKA</span>
                    </Link>

                    {/* Nav Center */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
                        {desktopNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-bold transition-all px-2 py-1 relative ${isActive(item.path)
                                    ? "text-emerald-600 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Profile Right */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowProfileDropdown(true)}
                        onMouseLeave={() => setShowProfileDropdown(false)}
                    >
                        <button className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-600 transition-all hover:bg-emerald-50">
                            <i className="lni lni-user-4 font-bold"></i>
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 top-full pt-2 w-48 transition-all animate-in fade-in slide-in-from-top-2">
                                <div className="glass rounded-2xl premium-shadow overflow-hidden border border-slate-100">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                    >
                                        <i className="lni lni-user-4"></i>
                                        Profil
                                    </Link>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all border-t border-slate-50"
                                    >
                                        <i className="lni lni-exit"></i>
                                        Keluar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation - Floating Pill Design */}
            <div className="fixed bottom-6 left-0 right-0 z-[100] md:hidden px-4">
                <nav className="glass mx-auto max-w-sm rounded-[32px] px-2 py-2 flex items-center justify-around premium-shadow border border-white/50 bg-white/90 shadow-2xl shadow-emerald-900/10">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-center transition-all duration-500 ease-in-out ${active
                                    ? "bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-200"
                                    : "text-slate-600 w-12 h-12 hover:text-slate-900"
                                    }`}
                            >
                                <i className={`lni ${item.icon} ${active ? "text-xl" : "text-2xl"}`}></i>
                                <span className={`overflow-hidden transition-all duration-500 ease-in-out font-bold text-xs tracking-wide whitespace-nowrap ${active ? "ml-2 max-w-[100px] opacity-100" : "max-w-0 opacity-0"
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Spacer for navbar on top */}
            <div className="h-[72px]"></div>
        </>
    );
}
