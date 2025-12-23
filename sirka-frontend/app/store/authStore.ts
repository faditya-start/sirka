import { create } from "zustand";

interface User {
    _id: string;
    name: string;
    email: string;
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("sirka_token") : null,
    isAuthenticated: false,

    setAuth: (user, token) => {
        localStorage.setItem("sirka_token", token);
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("sirka_token");
        set({ user: null, token: null, isAuthenticated: false });
    },

    updateUser: (user) => {
        set({ user });
    },
}));
