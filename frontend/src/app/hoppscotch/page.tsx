"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Shield,
  Layers,
  ArrowLeft,
  Sparkles,
  Zap,
  Key,
  Binary
} from "lucide-react";

export default function HoppscotchGuidePage() {
  const [copied, setCopied] = useState(false);
  const gistUrl = "https://gist.github.com/cavalcanteJr/07f2097d8fec43894afc9cc806b5a764";
  const gistId = "07f2097d8fec43894afc9cc806b5a764";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Bar de Navegação */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Marketplace
          </Link>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Guia do Aluno / Participante
          </span>
        </div>

        {/* Header Principal */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 border border-sky-500/30 text-sky-400 shadow-xl shadow-sky-950/40">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Como Usar o <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Hoppscotch</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Siga os 3 passos simples abaixo para importar todos os 26 endpoints da nossa API ao vivo e participar dos testes de ataque e defesa.
          </p>
        </div>

        {/* CARD DO PASSO A PASSO (3 PASSOS) */}
        <div className="space-y-4">
          
          {/* PASSO 1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-slate-700/80 transition-all shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-base shrink-0">
                1
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Acessar o Hoppscotch
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    O Hoppscotch é uma ferramenta web gratuita para envio de requisições HTTP (sem necessidade de instalar nada).
                  </p>
                </div>
                <div>
                  <a
                    href="https://hoppscotch.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-900/30 transition-all"
                  >
                    <span>Abrir hoppscotch.io</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* PASSO 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-slate-700/80 transition-all shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
                2
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Copiar o Link da Coleção
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Copie a URL do Gist abaixo que contém todos os endpoints e payloads pré-configurados:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                  <input
                    type="text"
                    readOnly
                    value={gistUrl}
                    className="bg-transparent px-3 py-2 text-xs text-slate-300 font-mono flex-1 focus:outline-none select-all"
                  />
                  <button
                    onClick={() => handleCopy(gistUrl)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  💡 Caso o campo no Hoppscotch peça apenas o ID:{" "}
                  <code
                    onClick={() => handleCopy(gistId)}
                    className="text-sky-400 underline cursor-pointer hover:text-sky-300"
                    title="Clique para copiar apenas o ID"
                  >
                    {gistId}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* PASSO 3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-slate-700/80 transition-all shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-base shrink-0">
                3
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Importar no Hoppscotch
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dentro da interface do Hoppscotch, faça a importação em 3 cliques:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Aba 1</span>
                    <h3 className="text-xs font-bold text-slate-200">1. Vá em Collections</h3>
                    <p className="text-[11px] text-slate-400">
                      Na barra lateral esquerda do Hoppscotch, clique no ícone de pastinhas (Collections).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Aba 2</span>
                    <h3 className="text-xs font-bold text-slate-200">2. Import / Export</h3>
                    <p className="text-[11px] text-slate-400">
                      Clique no botão <strong>Import</strong> (ou nos 3 pontinhos <code className="text-slate-300">...</code> no topo da coluna).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Aba 3</span>
                    <h3 className="text-xs font-bold text-slate-200">3. Import from Gist</h3>
                    <p className="text-[11px] text-slate-400">
                      Selecione <strong>Import from Gist</strong>, cole o link copiado no passo 2 e clique em salvar.
                    </p>
                  </div>
                </div>

                {/* Dica importante do Interceptor */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                  <Shield className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block text-white">
                      ⚠️ Atenção para o Interceptor (Evitar bloqueio de CORS do Navegador):
                    </span>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      No canto inferior direito da tela do Hoppscotch, certifique-se de que o seletor está marcado como <strong>"Proxy"</strong>. O modo Proxy permite disparar requisições para a API sem que as regras de segurança do seu navegador impeçam a chamada.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Decoder Base64 Suporte */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Decoder Base64 suporte</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Ferramenta de Apoio
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Utilize o decodificador online para inspecionar strings e senhas codificadas em Base64 obtidas durante os testes de API.
              </p>
            </div>
          </div>
          <a
            href="https://decoder.tools/base64-decoder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            Abrir Decoder Base64 <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Rodapé / Chamada para o Marketplace */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 underline font-semibold"
          >
            Ir para a loja e testar os produtos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
