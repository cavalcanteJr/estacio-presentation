"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/config/api";
import { Shield, ShieldAlert, RotateCcw, ArrowLeft, ExternalLink, Database, Check, X, Store, RefreshCw, Bug, Trash2, Image as ImageIcon, LayoutList, LayoutGrid } from "lucide-react";

interface Seller {
  id: number;
  username: string;
  name: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface BugReportItem {
  id: number;
  title: string;
  description: string;
  imageData?: string | null;
  author: string;
  pageUrl: string;
  systemMode: string;
  createdAt: string;
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
  const [autoSync, setAutoSync] = useState(false);

  // Estados de Bug Reports
  const [bugReports, setBugReports] = useState<BugReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reportViewMode, setReportViewMode] = useState<"list" | "cards">("list");

  const isV2 = systemMode === "v2";

  const fetchBugReports = async () => {
    try {
      setLoadingReports(true);
      const res = await fetch(`${API_BASE}/api/reports`);
      const data = await res.json();
      if (res.ok && data.reports) {
        setBugReports(data.reports);
      }
    } catch (e) {
      console.warn("Erro ao buscar bug reports:", e);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!confirm("Deseja realmente remover este bug report?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBugReports();
      }
    } catch (e: any) {
      alert("Erro ao remover: " + e.message);
    }
  };

  const fetchSellers = async (isBackground = false) => {
    try {
      if (!isBackground) setLoadingSellers(true);
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
      if (!isBackground) setLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchBugReports();
  }, [token, systemMode]);

  // Auto-sync a cada 1 segundo quando ativado
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchSellers(true);
      fetchBugReports();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoSync, token]);

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
            <div className="flex items-center gap-3">
              {/* Toggle Auto Sync 1s */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950/60 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all select-none">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-4 rounded-full transition-colors relative ${
                    autoSync ? "bg-indigo-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                      autoSync ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className={autoSync ? "text-indigo-300 font-semibold" : "text-slate-400"}>
                    Auto Sync (1s)
                  </span>
                  {autoSync && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              </label>

              <button
                onClick={() => fetchSellers(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Recarregar tabela manualmente"
              >
                <RefreshCw className={`w-4 h-4 ${loadingSellers ? "animate-spin" : ""}`} />
              </button>
            </div>
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

        {/* Tabela / Mural de Bugs Reportados pelos Alunos */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-500" />
                <span>Lista de Vulnerabilidades e Bugs Reportados</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold border border-rose-500/30">
                  {bugReports.length} {bugReports.length === 1 ? "report" : "reports"}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submissões enviadas pelos alunos e participantes pelo botão flutuante em tempo real.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Toggle de Visualização: Lista vs Cards */}
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setReportViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reportViewMode === "list"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Visualização em Lista / Tabela"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Lista</span>
                </button>
                <button
                  onClick={() => setReportViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reportViewMode === "cards"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Visualização em Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>

              <button
                onClick={fetchBugReports}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Recarregar bugs reportados"
              >
                <RefreshCw className={`w-4 h-4 ${loadingReports ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {bugReports.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <Bug className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">
                Nenhum bug reportado até o momento. Incentive a plateia a testar a API!
              </p>
            </div>
          ) : reportViewMode === "list" ? (
            /* VISUALIZAÇÃO EM LISTA / TABELA COMPLETA */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Horário</th>
                    <th className="p-3">Modo</th>
                    <th className="p-3">Participante</th>
                    <th className="p-3">Título & Descrição</th>
                    <th className="p-3">Print Anexo</th>
                    <th className="p-3">Rota</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {bugReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          report.systemMode === "v2"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}>
                          {report.systemMode ? report.systemMode.toUpperCase() : "V1"}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-sky-400 whitespace-nowrap">
                        👤 {report.author || "Anônimo"}
                      </td>
                      <td className="p-3 max-w-md">
                        <div className="font-bold text-white text-xs mb-0.5">{report.title}</div>
                        {report.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-2">
                            {report.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {report.imageData ? (
                          <button
                            onClick={() => setSelectedImage(report.imageData || null)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-semibold border border-slate-700 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Ver Print</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Sem anexo</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                        {report.pageUrl || "/"}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Remover report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* VISUALIZAÇÃO EM CARDS / GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bugReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          report.systemMode === "v2"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}>
                          {report.systemMode ? report.systemMode.toUpperCase() : "V1"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(report.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
                        title="Remover este report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Título do Bug */}
                    <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-2">
                      {report.title}
                    </h3>

                    {/* Descrição */}
                    {report.description && (
                      <p className="text-xs text-slate-400 mb-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60 whitespace-pre-wrap line-clamp-4">
                        {report.description}
                      </p>
                    )}

                    {/* Print Capturado */}
                    {report.imageData && (
                      <div className="mt-2 mb-3">
                        <div
                          onClick={() => setSelectedImage(report.imageData || null)}
                          className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-zoom-in"
                        >
                          <img
                            src={report.imageData}
                            alt={report.title}
                            className="w-full h-32 object-contain bg-black/60 group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold gap-1">
                            <ImageIcon className="w-3.5 h-3.5" /> Clique para ampliar
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rodapé com autor e página */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-sky-400">👤 {report.author || "Anônimo"}</span>
                    <span className="font-mono text-slate-500">{report.pageUrl || "/"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Zoom da Imagem */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage}
                alt="Zoom do print"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}

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
