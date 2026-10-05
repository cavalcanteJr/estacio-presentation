"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/config/api";
import { Shield, ShieldAlert, RotateCcw, ArrowLeft, ExternalLink, Database, Check, X, Store, RefreshCw } from "lucide-react";

interface Seller {
  id: number;
  username: string;
  name: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function BackstagePage() {
  const {
    systemMode,
    systemStorage,
    toggleSystemMode,
    resetDatabase,
    user,
    token,
  } = useAuth();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  const isV2 = systemMode === "v2";

  const fetchSellers = async () => {
    try {
      setLoadingSellers(true);
      const res = await fetch(`${API_BASE}/api/admin/sellers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.sellers) {
        setSellers(data.sellers);
      }
    } catch (e) {
      console.warn("Erro ao buscar vendedores no backstage:", e);
    } finally {
      setLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [token, systemMode]);

  const handleToggle = async () => {
    setLoadingToggle(true);
    await toggleSystemMode();
    setLoadingToggle(false);
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/sellers/${id}/approve`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        fetchSellers();
      } else {
        alert("Falha ao aprovar no modo atual.");
      }
    } catch (e: any) {
      alert("Erro: " + e.message);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/sellers/${id}/reject`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        fetchSellers();
      }
    } catch (e: any) {
      alert("Erro: " + e.message);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Marketplace
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">
              🔒 ROTA OCULTA DO PALESTRANTE (/backstage)
            </span>
          </div>

          <a
            href={`${API_BASE}/slides/presentation.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 underline font-medium"
          >
            Abrir Slides da Palestra <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Title */}
        <div className="mt-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Painel de Rigor & Controle Mestre
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Nesta rota secreta, você controla o rigor de segurança da API (V1 vs V2) e aprova os lojistas cadastrados em tempo real durante a demonstração.
          </p>
        </div>

        {/* Super Toggle Switch Card */}
        <div className={`mt-8 p-8 rounded-3xl border transition-all duration-300 backdrop-blur-md ${
          isV2
            ? "bg-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-950/30"
            : "bg-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-950/30"
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${isV2 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                {isV2 ? <Shield className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
                    Modo Ativo no Backend:
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    isV2 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                  }`}>
                    {isV2 ? "VERSÃO 2 (RIGOR / PROTEGIDO)" : "VERSÃO 1 (VULNERÁVEL)"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {isV2 ? "🛡️ Sistema Blindado Ativo" : "🚨 Vulnerabilidades Habilitadas"}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {isV2
                    ? "Defesas ativas: Validação de Ownership nos produtos, RBAC estrito e bloqueios 403 Forbidden."
                    : "Falhas ativas: Vendedores podem alterar preços rivais (BOLA) e rotas administrativas vazam dados (BFLA)."}
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleToggle}
                disabled={loadingToggle}
                className={`relative w-24 h-12 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  isV2 ? "bg-emerald-500 focus:ring-emerald-400" : "bg-rose-600 focus:ring-rose-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center font-bold text-xs ${
                    isV2 ? "translate-x-12 text-emerald-700" : "translate-x-0 text-rose-700"
                  }`}
                >
                  {isV2 ? "V2" : "V1"}
                </div>
              </button>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                {loadingToggle ? "Salvando..." : "Alternar rigor"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabela de Aprovação Imediata de Vendedores */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                <span>Tabela de Aprovação Rápida de Lojistas</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aprove qualquer vendedor pendente diretamente aqui para permitir que ele entre na plataforma.
              </p>
            </div>
            <button
              onClick={fetchSellers}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Recarregar tabela"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSellers ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Loja</th>
                  <th className="p-3">Login</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação Direta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sellers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      Nenhum vendedor cadastrado.
                    </td>
                  </tr>
                ) : (
                  sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono text-slate-400">#{s.id}</td>
                      <td className="p-3 font-semibold text-white">{s.name}</td>
                      <td className="p-3 font-mono text-sky-400">@{s.username}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : s.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}>
                          {s.status === "APPROVED" ? "Aprovado" : s.status === "PENDING" ? "Pendente" : "Rejeitado"}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {s.status !== "APPROVED" && (
                          <button
                            onClick={() => handleApprove(s.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprovar</span>
                          </button>
                        )}
                        {s.status !== "REJECTED" && (
                          <button
                            onClick={() => handleReject(s.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors inline-flex items-center gap-1"
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

        {/* Database & Reset Actions */}
        <div className="mt-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Persistência Ativa</h3>
              <p className="text-xs text-slate-400">{systemStorage}</p>
            </div>
          </div>

          <button
            onClick={resetDatabase}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Base de Dados</span>
          </button>
        </div>

      </div>

      <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        Lab de Segurança em REST APIs &bull; Rota Oculta de Controle do Palestrante
      </footer>
    </main>
  );
}
