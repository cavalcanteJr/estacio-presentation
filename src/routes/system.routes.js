const express = require("express");
const db = require("../db");

const router = express.Router();

/**
 * GET /api/system/mode
 * Retorna o modo ativo da API (v1 vulnerável ou v2 seguro) salvo no Supabase.
 */
router.get("/mode", async (req, res) => {
  try {
    const mode = await db.getSystemMode();
    return res.json({
      mode,
      label: mode === "v2" ? "Protegido (V2)" : "Vulnerável (V1)",
      storage: "Supabase (PostgreSQL - estacio-presentation)"
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao obter modo do sistema", details: err.message });
  }
});

/**
 * POST /api/system/mode
 * Rota acionada pelo Toggle da tela escondida (/backstage) para alterar o modo global no Supabase.
 * Body: { mode: "v1" | "v2" }
 */
router.post("/mode", async (req, res) => {
  try {
    const { mode } = req.body;
    if (!mode || (mode !== "v1" && mode !== "v2")) {
      return res.status(400).json({ error: "Modo inválido. Envie 'v1' ou 'v2'" });
    }

    const updatedMode = await db.setSystemMode(mode);
    return res.json({
      message: `Modo do laboratório alterado com sucesso para ${updatedMode.toUpperCase()}!`,
      mode: updatedMode,
      label: updatedMode === "v2" ? "Protegido (V2)" : "Vulnerável (V1)",
      storage: "Supabase (PostgreSQL - estacio-presentation)"
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao salvar modo do sistema", details: err.message });
  }
});

module.exports = router;
