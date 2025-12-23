import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import { useAuthStore, type AuthState } from "../store/authStore";

export default function Onboarding() {
    const { user, updateUser, isAuthenticated } = useAuthStore((state: AuthState) => state);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        age: "",
        gender: "pria",
        height: "",
        weight: "",
        activityLevel: 1.2,
        goal: "Maintain",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

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
        setError("");

        try {
            const response = await api.put("/users/profile", formData);
            updateUser(response.data.data);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal memperbarui profil. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Mari Kenalan Lebih Dekat</h1>
                    <p className="text-slate-500 mt-2">Data ini diperlukan untuk menghitung target nutrisi harianmu secara akurat.</p>
                </div>

                <div className="glass p-8 rounded-3xl premium-shadow">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {error && (
                            <div className="md:col-span-2 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Usia (Tahun)</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="Contoh: 25"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="input-premium appearance-none"
                                required
                            >
                                <option value="pria">Pria</option>
                                <option value="wanita">Wanita</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tinggi Badan (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="Contoh: 170"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Berat Badan Sekarang (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="Contoh: 65"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tingkat Aktivitas Harian</label>
                            <select
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleChange}
                                className="input-premium appearance-none"
                                required
                            >
                                <option value={1.2}>Sedentary (Jarang olahraga)</option>
                                <option value={1.375}>Lightly Active (Olahraga 1-3 hari/minggu)</option>
                                <option value={1.55}>Moderately Active (Olahraga 3-5 hari/minggu)</option>
                                <option value={1.725}>Very Active (Olahraga 6-7 hari/minggu)</option>
                                <option value={1.9}>Extra Active (Olahraga berat/atlet setiap hari)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tujuan Kesehatan</label>
                            <select
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                className="input-premium appearance-none"
                                required
                            >
                                <option value="Turun Berat Badan">Turunkan Berat Badan</option>
                                <option value="Maintain">Pertahankan Berat Badan</option>
                                <option value="Naik Berat Badan">Naikkan Berat Badan</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                {loading ? "Menyimpan Data..." : "Selesai & Lihat Dashboard"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
