"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const res = await login(username, password);

    if (res.success) {
      router.push("/");
    } else {
      setErrorMessage(res.message || "Erro ao autenticar.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 mb-3 border border-sky-500/20">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Acesse sua Conta</h1>
          <p className="text-xs text-slate-400 mt-1">
            Entre para comprar ou gerenciar sua loja no TechMarket.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nome de Usuário (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: alice, joao, maria..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-sky-400 hover:text-sky-300 font-bold underline">
            Cadastre-se aqui
          </Link>
        </div>

        {/* Dica para o palestrante lembrar as credenciais na hora */}
        <div className="mt-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <span className="font-semibold text-slate-300 block">💡 Contas Pré-cadastradas:</span>
          <div>• <strong>alice</strong> (Cliente) &bull; Senha: <code className="text-sky-400">123</code></div>
          <div>• <strong>joao</strong> / <strong>maria</strong> (Lojistas) &bull; Senha: <code className="text-sky-400">123</code></div>
          <div>• <strong>admin</strong> (Administrador) &bull; Senha: <code className="text-sky-400">admin123</code></div>
        </div>

      </div>
    </div>
  );
}
