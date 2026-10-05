"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number;
  username: string;
  name: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sellerId: number;
  sellerName: string;
}

export interface HttpLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number;
  requestBody?: any;
  responseBody?: any;
  isError?: boolean;
}

interface LabContextType {
  currentUser: User | null;
  token: string | null;
  usersList: User[];
  systemMode: "v1" | "v2";
  systemStorage: string;
  loadingMode: boolean;
  products: Product[];
  logs: HttpLog[];
  switchUser: (username: string) => Promise<void>;
  toggleSystemMode: (targetMode?: "v1" | "v2") => Promise<void>;
  resetDatabase: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  addLog: (log: Omit<HttpLog, "id" | "timestamp">) => void;
  clearLogs: () => void;
}

import { API_BASE } from "@/config/api";


const DEFAULT_USERS: User[] = [
  { id: 1, username: "alice", name: "Alice Compradora", role: "CUSTOMER" },
  { id: 2, username: "joao", name: "João Tech (Loja 1)", role: "SELLER" },
  { id: 3, username: "maria", name: "Maria Variedades (Loja 2)", role: "SELLER" },
  { id: 4, username: "admin", name: "Carlos SysAdmin", role: "ADMIN" },
];

const LabContext = createContext<LabContextType | undefined>(undefined);

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_USERS[0]);
  const [token, setToken] = useState<string | null>(null);
  const [systemMode, setSystemModeState] = useState<"v1" | "v2">("v1");
  const [systemStorage, setSystemStorage] = useState<string>("In-Memory Fallback");
  const [loadingMode, setLoadingMode] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<HttpLog[]>([]);

  const addLog = (logData: Omit<HttpLog, "id" | "timestamp">) => {
    const newLog: HttpLog = {
      ...logData,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      isError: logData.status >= 400,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]); // guarda os 20 últimos
  };

  const clearLogs = () => setLogs([]);

  // Buscar modo do sistema do backend/Supabase
  const fetchSystemMode = async () => {
    try {
      setLoadingMode(true);
      const res = await fetch(`${API_BASE}/api/system/mode`);
      if (res.ok) {
        const data = await res.json();
        setSystemModeState(data.mode);
        setSystemStorage(data.storage);
      }
    } catch (err) {
      console.warn("Não foi possível conectar ao backend:", err);
    } finally {
      setLoadingMode(false);
    }
  };

  // Login de usuário
  const switchUser = async (username: string) => {
    try {
      const userObj = DEFAULT_USERS.find((u) => u.username === username);
      const password = username === "admin" ? "admin123" : "123";

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, version: systemMode }),
      });

      const data = await res.json();

      addLog({
        method: "POST",
        url: "/api/auth/login",
        status: res.status,
        requestBody: { username, password: "***", version: systemMode },
        responseBody: { message: data.message, user: data.user },
      });

      if (res.ok) {
        setCurrentUser(data.user);
        setToken(data.token);
      }
    } catch (err: any) {
      addLog({
        method: "POST",
        url: "/api/auth/login",
        status: 500,
        responseBody: { error: err.message },
      });
    }
  };

  // Alternar o toggle mestre no backend/Supabase
  const toggleSystemMode = async (targetMode?: "v1" | "v2") => {
    const nextMode = targetMode || (systemMode === "v1" ? "v2" : "v1");
    try {
      setLoadingMode(true);
      const res = await fetch(`${API_BASE}/api/system/mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });

      const data = await res.json();

      addLog({
        method: "POST",
        url: "/api/system/mode",
        status: res.status,
        requestBody: { mode: nextMode },
        responseBody: data,
      });

      if (res.ok) {
        setSystemModeState(data.mode);
        // Atualiza token para a nova versão se necessário
        if (currentUser) {
          await switchUser(currentUser.username);
        }
      }
    } catch (err: any) {
      addLog({
        method: "POST",
        url: "/api/system/mode",
        status: 500,
        responseBody: { error: err.message },
      });
    } finally {
      setLoadingMode(false);
    }
  };

  // Atualizar produtos
  const refreshProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  // Resetar o banco
  const resetDatabase = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reset`, { method: "POST" });
      const data = await res.json();
      addLog({
        method: "POST",
        url: "/api/reset",
        status: res.status,
        responseBody: data,
      });
      await fetchSystemMode();
      await refreshProducts();
      if (currentUser) {
        await switchUser(currentUser.username);
      }
    } catch (err: any) {
      addLog({
        method: "POST",
        url: "/api/reset",
        status: 500,
        responseBody: { error: err.message },
      });
    }
  };

  // Inicialização
  useEffect(() => {
    fetchSystemMode();
    refreshProducts();
    switchUser("alice");

    // Polling sutil a cada 3s para sincronizar caso o palestrante mude de outra aba
    const interval = setInterval(() => {
      fetchSystemMode();
      refreshProducts();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LabContext.Provider
      value={{
        currentUser,
        token,
        usersList: DEFAULT_USERS,
        systemMode,
        systemStorage,
        loadingMode,
        products,
        logs,
        switchUser,
        toggleSystemMode,
        resetDatabase,
        refreshProducts,
        addLog,
        clearLogs,
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) {
    throw new Error("useLab must be used within a LabProvider");
  }
  return ctx;
}
