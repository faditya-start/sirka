import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/users/register", formData);
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl premium-gradient text-white text-3xl mb-4 premium-shadow">
                        🌱
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Mulai Perjalananmu</h1>
                    <p className="text-slate-500 mt-2">Daftar sekarang untuk hidup lebih sehat</p>
                </div>

                <div className="glass p-8 rounded-3xl premium-shadow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="Nama Anda"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="label@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="minimal 6 karakter"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? "Mendaftarkan..." : "Daftar Akun"}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-8 text-sm">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
