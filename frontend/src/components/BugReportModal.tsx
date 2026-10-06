"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bug, X, Camera, Crop, Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { API_BASE, getStoredSystemMode } from "@/config/api";
import { useAuth } from "@/context/AuthContext";
import html2canvas from "html2canvas";

export default function BugReportModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSnipping, setIsSnipping] = useState(false);
  const [snipSelecting, setSnipSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [selectionRect, setSelectionRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const snipOverlayRef = useRef<HTMLDivElement>(null);

  // Preenche autor se usuário estiver logado
  useEffect(() => {
    if (user?.name) {
      setAuthor(user.name);
    }
  }, [user]);

  // Iniciar modo de recorte de tela
  const handleStartSnip = () => {
    setIsOpen(false);
    setIsSnipping(true);
    setSelectionRect(null);
  };

  // Mouse Down no Overlay de Snip
  const handleSnipMouseDown = (e: React.MouseEvent) => {
    setSnipSelecting(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    setSelectionRect({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
  };

  // Mouse Move durante o arraste da caixa de seleção
  const handleSnipMouseMove = (e: React.MouseEvent) => {
    if (!snipSelecting || !startPoint) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const x = Math.min(startPoint.x, currentX);
    const y = Math.min(startPoint.y, currentY);
    const w = Math.abs(currentX - startPoint.x);
    const h = Math.abs(currentY - startPoint.y);

    setSelectionRect({ x, y, w, h });
  };

  // Mouse Up ao finalizar a demarcação da área
  const handleSnipMouseUp = async () => {
    if (!snipSelecting || !selectionRect) {
      setIsSnipping(false);
      setSnipSelecting(false);
      setIsOpen(true);
      return;
    }

    setSnipSelecting(false);
    setIsSnipping(false);

    try {
      // Captura a tela inteira com html2canvas
      const fullCanvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      // Recorta a caixa delimitada se tiver dimensão razoável
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const cropX = Math.max(0, selectionRect.x + scrollX);
      const cropY = Math.max(0, selectionRect.y + scrollY);
      const cropW = Math.max(10, selectionRect.w);
      const cropH = Math.max(10, selectionRect.h);

      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const ctx = croppedCanvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(fullCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        const base64Data = croppedCanvas.toDataURL("image/png", 0.9);
        setImageData(base64Data);
      }
    } catch (err) {
      console.warn("Falha ao recortar tela:", err);
    } finally {
      setSelectionRect(null);
      setIsOpen(true);
    }
  };

  // Capturar tela inteira automática
  const handleCaptureFullScreen = async () => {
    try {
      setIsOpen(false);
      // Breve delay para fechar o modal antes do print
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      setImageData(canvas.toDataURL("image/png", 0.85));
    } catch (err) {
      console.warn("Falha ao capturar tela:", err);
    } finally {
      setIsOpen(true);
    }
  };

  // Submeter o bug report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Por favor, preencha o título do bug.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const currentMode = getStoredSystemMode();
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageData,
          author: author || (user ? user.name : "Aluno Anônimo"),
          pageUrl: typeof window !== "undefined" ? window.location.pathname : "/",
          systemMode: currentMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar relatório.");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        setTitle("");
        setDescription("");
        setImageData(null);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante (Floating Bug Button) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
        <button
          onClick={() => {
            setErrorMsg("");
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-rose-900/50 hover:shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-rose-400/40"
          title="Reportar Bug ou Falha Encontrada"
        >
          <div className="relative">
            <Bug className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="text-sm font-semibold tracking-wide hidden sm:inline">
            Reportar Bug
          </span>
        </button>
      </div>

      {/* OVERLAY DE RECORTE / SELEÇÃO NA TELA */}
      {isSnipping && (
        <div
          ref={snipOverlayRef}
          onMouseDown={handleSnipMouseDown}
          onMouseMove={handleSnipMouseMove}
          onMouseUp={handleSnipMouseUp}
          className="fixed inset-0 z-50 cursor-crosshair bg-black/40 select-none overflow-hidden"
        >
          {/* Instrução flutuante no topo */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white border border-rose-500/50 px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 pointer-events-none">
            <Crop className="w-4 h-4 text-rose-400" />
            <span>Clique e arraste o mouse para marcar a área do bug na tela</span>
          </div>

          {/* Caixa de Seleção Demarcada */}
          {selectionRect && (
            <div
              className="absolute border-2 border-rose-500 bg-rose-500/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none"
              style={{
                left: selectionRect.x,
                top: selectionRect.y,
                width: selectionRect.w,
                height: selectionRect.h,
              }}
            >
              <div className="absolute top-1 left-2 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {Math.round(selectionRect.w)} x {Math.round(selectionRect.h)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL PRINCIPAL DE FORMULÁRIO */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Reportar Vulnerabilidade / Bug
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sua descoberta será enviada em tempo real para o telão do palestrante!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Formulário */}
            {success ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Bug Reportado com Sucesso!</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Parabéns! Sua captura e descrição foram registradas no Supabase e já aparecem no painel do backstage.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Título do Bug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Título do Bug / Vulnerabilidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Consegui alterar o preço de um iPhone para R$ 1,00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>

                {/* Seu Nome */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Seu Nome ou Usuário (para reconhecimento na palestra)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex: Lucas Silva ou @lucas"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Descrição Detalhada */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Como você encontrou esse bug? (Passos ou endpoint)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Abri o DevTools / Hoppscotch e enviei um PUT direto com price=1..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none transition-all"
                  />
                </div>

                {/* Anexo de Print / Captura de Tela */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Evidência Visual (Print da Tela)
                  </label>

                  {imageData ? (
                    <div className="relative group border border-slate-700 rounded-2xl overflow-hidden bg-slate-950">
                      <img
                        src={imageData}
                        alt="Evidência do bug"
                        className="w-full max-h-48 object-contain bg-slate-950"
                      />
                      <button
                        type="button"
                        onClick={() => setImageData(null)}
                        className="absolute top-2 right-2 bg-rose-600/90 hover:bg-rose-500 text-white p-1.5 rounded-lg text-xs font-medium transition-all shadow-lg"
                        title="Remover print"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleStartSnip}
                        className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-dashed border-rose-500/40 bg-rose-950/10 hover:bg-rose-900/20 text-rose-300 hover:text-white transition-all text-xs gap-1.5 text-center group"
                      >
                        <Crop className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Recortar Área na Tela</span>
                        <span className="text-[10px] text-slate-400">Marque a caixa com o mouse</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCaptureFullScreen}
                        className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs gap-1.5 text-center group"
                      >
                        <Camera className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Capturar Tela Cheia</span>
                        <span className="text-[10px] text-slate-400">Print completo do site</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer / Submit */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Descoberta</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
