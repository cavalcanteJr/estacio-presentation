/**
 * Configuração centralizada da URL base da API
 * e gerenciamento de persistência e pré-validação do modo da API (V1 / V2).
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "");

export const STORAGE_KEY_MODE = "techmarket_system_mode";
export const STORAGE_KEY_STORAGE = "techmarket_system_storage";

export type SystemMode = "v1" | "v2";

/**
 * Lê o modo do sistema atualmente salvo no storage local
 */
export function getStoredSystemMode(): SystemMode {
  if (typeof window === "undefined") return "v1";
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    return saved === "v2" ? "v2" : "v1";
  } catch {
    return "v1";
  }
}

/**
 * Lê a informação de storage do banco salva no storage local
 */
export function getStoredSystemStorage(): string {
  if (typeof window === "undefined") return "Supabase (PostgreSQL)";
  try {
    return localStorage.getItem(STORAGE_KEY_STORAGE) || "Supabase (PostgreSQL)";
  } catch {
    return "Supabase (PostgreSQL)";
  }
}

/**
 * Salva o modo e o provedor no storage local e notifica a aplicação
 */
export function setStoredSystemMode(mode: SystemMode, storageDesc?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
    if (storageDesc) {
      localStorage.setItem(STORAGE_KEY_STORAGE, storageDesc);
    }
    // Emite evento para que todos os contextos e componentes reajam instantaneamente
    window.dispatchEvent(
      new CustomEvent("system-mode-changed", {
        detail: { mode, storage: storageDesc || getStoredSystemStorage() }
      })
    );
  } catch (e) {
    console.warn("Erro ao salvar modo no storage:", e);
  }
}

// Promessa para evitar chamadas duplicadas simultâneas de pré-validação
let pendingValidation: Promise<SystemMode> | null = null;

/**
 * Pré-validação sob demanda: consulta o backend imediatamente antes de cada requisição
 * para confirmar o modo ativo, atualizando o storage.
 */
export async function validateSystemMode(): Promise<SystemMode> {
  if (typeof window === "undefined") return "v1";

  if (pendingValidation) {
    return pendingValidation;
  }

  pendingValidation = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/system/mode`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (res.ok) {
        const data = await res.json();
        const mode: SystemMode = data.mode === "v2" ? "v2" : "v1";
        setStoredSystemMode(mode, data.storage);
        return mode;
      }
    } catch (e) {
      console.warn("Pré-validação de modo falhou, mantendo modo do storage:", e);
    } finally {
      pendingValidation = null;
    }
    return getStoredSystemMode();
  })();

  return pendingValidation;
}

/**
 * Cliente HTTP unificado (apiFetch):
 * Executa a pré-validação do modo da API antes de realizar a chamada ao backend,
 * garantindo que a aplicação e o storage estejam sempre sincronizados.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlString = typeof input === "string" ? input : input.toString();

  // Se não for a própria rota de consulta de modo, pré-valida antes da requisição
  if (!urlString.includes("/api/system/mode")) {
    await validateSystemMode();
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      "Cache-Control": "no-cache",
      ...(init?.headers || {})
    }
  });

  // Se o backend retornou o cabeçalho X-System-Mode, atualiza o storage imediatamente
  const returnedMode = response.headers.get("x-system-mode") as SystemMode | null;
  if (returnedMode && (returnedMode === "v1" || returnedMode === "v2")) {
    if (returnedMode !== getStoredSystemMode()) {
      setStoredSystemMode(returnedMode);
    }
  }

  return response;
}
