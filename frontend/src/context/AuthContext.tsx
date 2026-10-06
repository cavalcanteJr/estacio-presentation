"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number;
  username: string;
  name: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  systemMode: "v1" | "v2";
  systemStorage: string;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; username: string; password: string; role: "CUSTOMER" | "SELLER" }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  toggleSystemMode: (target?: "v1" | "v2") => Promise<void>;
  resetDatabase: () => Promise<void>;
}

import {
  API_BASE,
  getStoredSystemMode,
  getStoredSystemStorage,
  setStoredSystemMode,
  SystemMode
} from "@/config/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [systemMode, setSystemModeState] = useState<"v1" | "v2">("v1");
  const [systemStorage, setSystemStorage] = useState<string>("Supabase (PostgreSQL)");

  const fetchSystemMode = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/system/mode`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const mode: SystemMode = data.mode === "v2" ? "v2" : "v1";
        setStoredSystemMode(mode, data.storage);
        setSystemModeState(mode);
        setSystemStorage(data.storage);
      }
    } catch (e) {
      console.warn("Erro ao buscar modo do sistema:", e);
    }
  };

  const toggleSystemMode = async (target?: "v1" | "v2") => {
    const nextMode = target || (systemMode === "v1" ? "v2" : "v1");
    try {
      const res = await fetch(`${API_BASE}/api/system/mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });
      if (res.ok) {
        const data = await res.json();
        const mode: SystemMode = data.mode === "v2" ? "v2" : "v1";
        setStoredSystemMode(mode, data.storage);
        setSystemModeState(mode);
      }
    } catch (e) {
      console.error("Erro ao alterar modo:", e);
    }
  };

  const resetDatabase = async () => {
    try {
      await fetch(`${API_BASE}/api/reset`, { method: "POST" });
      await fetchSystemMode();
    } catch (e) {
      console.error("Erro ao resetar banco:", e);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || data.error || "Falha ao realizar login.",
        };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const register = async (formData: { name: string; username: string; password: string; role: "CUSTOMER" | "SELLER" }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error || "Erro no cadastro." };
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  useEffect(() => {
    // Carrega modo pré-salvo no storage imediatamente (sem esperar resposta de rede)
    setSystemModeState(getStoredSystemMode());
    setSystemStorage(getStoredSystemStorage());

    // Valida com o backend ao abrir a página
    fetchSystemMode();

    // Carregar sessão salva no localStorage
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        logout();
      }
    }

    setLoading(false);

    // Ouve alterações de modo disparadas por pré-validações de requisições ou outras abas
    const handleModeChanged = (e: any) => {
      if (e.detail?.mode) {
        setSystemModeState(e.detail.mode);
        if (e.detail.storage) setSystemStorage(e.detail.storage);
      }
    };

    const handleFocus = () => fetchSystemMode();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("system-mode-changed", handleModeChanged);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("system-mode-changed", handleModeChanged);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        systemMode,
        systemStorage,
        login,
        register,
        logout,
        toggleSystemMode,
        resetDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
