"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi, User } from "@/lib/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    student_id?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }

    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => refresh(), 0);
    const safety = setTimeout(() => {
      if (!ready) setReady(true);
    }, 9000);
    return () => {
      clearTimeout(timer);
      clearTimeout(safety);
    };
  }, [ready, refresh]);

  const login = async (email: string, password: string) => {
    const { token } = await authApi.login(email, password);
    localStorage.setItem("token", token);
    const me = await authApi.me();
    setUser(me);
    setReady(true);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    student_id?: string;
  }) => {
    const { token } = await authApi.register(payload);
    localStorage.setItem("token", token);
    const me = await authApi.me();
    setUser(me);
    setReady(true);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore when API offline */
    }
    localStorage.removeItem("token");
    setUser(null);
    setReady(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading: !ready, ready, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
