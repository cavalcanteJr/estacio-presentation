"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/config/api";
import { ShieldCheck, Store, Check, X, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";

interface Seller {
  id: number;
  username: string;
  name: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    setAccessDenied(null);

    try {
      // 1. Buscar Lojistas
      const resSellers = await fetch(`${API_BASE}/api/admin/sellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSellers = await resSellers.json();
      if (resSellers.ok) {
        setSellers(dataSellers.sellers || []);
      } else {
        setAccessDenied(dataSellers.message || dataSellers.error || "Acesso negado.");
        setLoading(false);
        return;
      }

      // 2. Buscar Métricas
      const resMetrics = await fetch(`${API_BASE}/api/admin/financials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataMetrics = await resMetrics.json();
      if (resMetrics.ok) {
        setMetrics(dataMetrics);
      }
    } catch (e: any) {
      setAccessDenied(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (token) {
      fetchAdminData();
    }
  }, [user, authLoading, token]);

  const handleApproveSeller = async (sellerId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/sellers/${sellerId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setActionFeedback(data.message || "Lojista aprovado com sucesso.");
        fetchAdminData();
      } else {
        alert(data.message || data.error || "Falha na aprovação.");
      }
    } catch (e: any) {
      alert("Erro de conexão: " + e.message);
    }
  };

  const handleRejectSeller = async (sellerId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/sellers/${sellerId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setActionFeedback(data.message || "Lojista rejeitado.");
        fetchAdminData();
      } else {
        alert(data.message || data.error || "Falha na rejeição.");
      }
    } catch (e: any) {
      alert("Erro de conexão: " + e.message);
    }
  };

  if (authLoading) {
    return <div className="py-20 text-center text-slate-500 text-sm">Carregando painel...</div>;
  }

  // Se o backend bloqueou (como no modo protegido V2)
  if (accessDenied) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">403 - Acesso Negado</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {accessDenied}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>PAINEL DE ADMINISTRAÇÃO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Gestão de Lojistas & Métricas da Plataforma
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Usuário autenticado: <strong className="text-white">{user?.name}</strong> ({user?.role})
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {actionFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-xs text-sky-300">
          {actionFeedback}
        </div>
      )}

      {/* Tabela de Vendedores */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-purple-400" />
              <span>Lojistas Cadastrados</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aprovação e homologação de contas comerciais parceiras.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            {sellers.length} lojistas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Nome da Loja</th>
                <th className="p-3.5">Login</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Nenhum lojista cadastrado no momento.
                  </td>
                </tr>
              ) : (
                sellers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400">#{s.id}</td>
                    <td className="p-3.5 font-semibold text-white">{s.name}</td>
                    <td className="p-3.5 font-mono text-sky-400">@{s.username}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        s.status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : s.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}>
                        {s.status === "APPROVED" ? "Aprovado" : s.status === "PENDING" ? "Pendente" : "Rejeitado"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {s.status !== "APPROVED" && (
                        <button
                          onClick={() => handleApproveSeller(s.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprovar</span>
                        </button>
                      )}
                      {s.status !== "REJECTED" && (
                        <button
                          onClick={() => handleRejectSeller(s.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Rejeitar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção Financeira */}
      {metrics && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Métricas Operacionais da Plataforma</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Total em Catálogo</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  metrics.confidentialData?.platformTotalInventoryValue || 0
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Receita em Taxas (10%)</span>
              <div className="text-2xl font-black font-mono text-sky-400 mt-1">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  metrics.confidentialData?.platformFeeEarned || 0
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
