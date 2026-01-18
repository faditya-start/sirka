/**
 * ARCHITECTURE ROLE: API Service
 * Konfigurasi utama Axios untuk komunikasi dengan Backend.
 * Menangani base URL dan interceptor token otentikasi.
 */
import axios from "axios";

// Create Axios Instance
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("sirka_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
