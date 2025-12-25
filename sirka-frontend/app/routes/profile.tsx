import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuthStore, type AuthState } from "../store/authStore";

export default function Profile() {
    const { user, token, logout, updateUser } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        gender: "pria",
        height: "",
        weight: "",
        activityLevel: 1.2,
        goal: "Maintain",
    });

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                age: user.age || "",
                gender: user.gender || "pria",
                height: user.height || "",
                weight: user.weight || "",
                activityLevel: user.activityLevel || 1.2,
                goal: user.goal || "Maintain",
            });
        }
    }, [user, token, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "age" || name === "height" || name === "weight" || name === "activityLevel"
                ? parseFloat(value)
                : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await api.put("/users/profile", formData);
            updateUser(response.data.data);
            setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
            setIsEditing(false);
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.message || "Gagal memperbarui profil." });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <i className="lni lni-chevron-left font-bold text-slate-700"></i>
                    <span className="font-bold text-slate-700">Kembali</span>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">Profil Saya</h1>
                <div className="w-10"></div>
            </nav>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Profile Card */}
                <div className="glass p-8 rounded-3xl premium-shadow text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="relative z-10 -mt-4">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto p-1 shadow-lg flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl text-slate-400">
                                <i className="lni lni-user-4"></i>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mt-4">{user?.name}</h2>
                        <p className="text-slate-500">{user?.email}</p>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="glass p-8 rounded-3xl premium-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <i className="lni lni-cog"></i> Pengaturan
                        </h3>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-emerald-600 font-semibold text-sm flex items-center gap-1 hover:text-emerald-700"
                            >
                                <i className="lni lni-pencil-alt"></i> Edit
                            </button>
                        )}
                    </div>

                    {message.text && (
                        <div className={`p-4 mb-6 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <fieldset disabled={!isEditing} className="space-y-6 group disabled:opacity-80">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Usia</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="input-premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="input-premium appearance-none"
                                    >
                                        <option value="pria">Pria</option>
                                        <option value="wanita">Wanita</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Tinggi (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        className="input-premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Berat (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="input-premium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Aktivitas</label>
                                <select
                                    name="activityLevel"
                                    value={formData.activityLevel}
                                    onChange={handleChange}
                                    className="input-premium appearance-none"
                                >
                                    <option value={1.2}>Sedentary (Jarang olahraga)</option>
                                    <option value={1.375}>Lightly Active (1-3 hari/minggu)</option>
                                    <option value={1.55}>Moderately Active (3-5 hari/minggu)</option>
                                    <option value={1.725}>Very Active (6-7 hari/minggu)</option>
                                    <option value={1.9}>Extra Active (Atlet pro)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tujuan</label>
                                <select
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    className="input-premium appearance-none"
                                >
                                    <option value="Turun Berat Badan">Turun Berat Badan</option>
                                    <option value="Maintain">Maintain</option>
                                    <option value="Naik Berat Badan">Naik Berat Badan</option>
                                </select>
                            </div>
                        </fieldset>

                        {isEditing && (
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-3"
                                >
                                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form to current user data
                                        if (user) {
                                            setFormData({
                                                name: user.name || "",
                                                email: user.email || "",
                                                age: user.age || "",
                                                gender: user.gender || "pria",
                                                height: user.height || "",
                                                weight: user.weight || "",
                                                activityLevel: user.activityLevel || 1.2,
                                                goal: user.goal || "Maintain",
                                            });
                                        }
                                    }}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                                >
                                    Batal
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full p-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                    <i className="lni lni-exit"></i>
                    Keluar dari Aplikasi
                </button>

                <p className="text-center text-slate-400 text-sm">
                    Sirka v1.0.0
                </p>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 text-center premium-shadow">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
                            <i className="lni lni-exit"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Ingin Keluar?</h2>
                            <p className="text-slate-500 mt-2">Anda perlu masuk kembali untuk mengakses akun Anda.</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={confirmLogout}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Ya, Keluar Sekarang
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
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
