"use client";
import { create } from "zustand";

interface User {
    _id: string;
    name: string;
    email: string;
    [key: string]: any;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const initialToken = typeof window !== "undefined" ? localStorage.getItem("sirka_token") : null;
const initialIsAuthenticated = !!initialToken;

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: initialToken,
    isAuthenticated: initialIsAuthenticated,

    setAuth: (user, token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("sirka_token", token);
        }
        set((state) => ({ ...state, user, token, isAuthenticated: true }));
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("sirka_token");
        }
        set((state) => ({ ...state, user: null, token: null, isAuthenticated: false }));
    },

    updateUser: (user) => {
        set((state) => ({ ...state, user }));
    },
}));
