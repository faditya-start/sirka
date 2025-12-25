import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuthStore, type AuthState } from "../store/authStore";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const setAuth = useAuthStore((state: AuthState) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/users/login", { email, password });
            const { data } = response.data;

            setAuth(data, data.token);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login gagal. Cek email dan password Anda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl premium-gradient text-white text-3xl mb-4 premium-shadow">
                        <i className="lni lni-locked-2 text-4xl"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Selamat Datang</h1>
                    <p className="text-slate-500 mt-2">Masuk untuk memantau kesehatan Anda</p>
                </div>

                <div className="glass p-8 rounded-3xl premium-shadow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-premium"
                                placeholder="label@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-premium"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? "Memproses..." : "Masuk Sekarang"}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-8 text-sm">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                            Daftar Gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
