"use client";

import React, { useState } from "react";
import { useLab } from "@/context/LabContext";
import { X, Copy, Check, Key } from "lucide-react";

interface JwtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JwtModal({ isOpen, onClose }: JwtModalProps) {
  const { token, currentUser } = useLab();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !token) return null;

  const parts = token.split(".");
  const headerRaw = parts[0] || "";
  const payloadRaw = parts[1] || "";
  const signatureRaw = parts[2] || "";

  let headerJson = "";
  let payloadJson = "";

  try {
    headerJson = JSON.stringify(JSON.parse(atob(headerRaw)), null, 2);
  } catch {
    headerJson = headerRaw;
  }

  try {
    payloadJson = JSON.stringify(JSON.parse(atob(payloadRaw)), null, 2);
  } catch {
    payloadJson = payloadRaw;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Anatomia do JWT Ativo ({currentUser?.name})</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Token String Colorized */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Token Codificado (Base64URL):</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copiado!" : "Copiar Token"}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs break-all leading-relaxed">
              <span className="text-rose-400 font-semibold">{headerRaw}</span>
              <span className="text-slate-500">.</span>
              <span className="text-pink-400 font-semibold">{payloadRaw}</span>
              <span className="text-slate-500">.</span>
              <span className="text-sky-400 font-semibold">{signatureRaw}</span>
            </div>
          </div>

          {/* Decoded Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Header */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <span className="text-xs font-bold text-rose-400 block mb-2">🔴 Header (Metadados):</span>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">{headerJson}</pre>
            </div>

            {/* Payload */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-pink-500/30">
              <span className="text-xs font-bold text-pink-400 block mb-2">🟣 Payload (Claims Decodificadas):</span>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">{payloadJson}</pre>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300 flex items-start gap-2">
            <span className="font-bold text-sky-400">💡 Dica da Palestra:</span>
            <span>
              O Payload é facilmente legível usando um simples `atob()` no navegador. Nunca armazene senhas ou dados ultra-sensíveis no payload do JWT!
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
