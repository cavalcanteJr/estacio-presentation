const express = require("express");
const db = require("../db");

const router = express.Router();

/**
 * GET /api/reports
 * Retorna lista de bugs reportados (para exibir no /backstage)
 */
router.get("/", async (req, res) => {
  try {
    const reports = await db.getBugReports();
    return res.json({
      total: reports.length,
      reports
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar relatórios de bugs", details: err.message });
  }
});

/**
 * POST /api/reports
 * Salva um novo bug/vulnerabilidade reportado pelo usuário
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, imageData, author, pageUrl, systemMode } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "O título do bug é obrigatório." });
    }

    const newReport = await db.createBugReport({
      title: title.trim(),
      description: description ? description.trim() : "",
      imageData: imageData || null,
      author: author ? author.trim() : "Participante Anônimo",
      pageUrl: pageUrl || "/",
      systemMode: systemMode || "v1"
    });

    return res.status(201).json({
      message: "Bug reportado com sucesso! Obrigado pela colaboração.",
      report: newReport
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao salvar relatório de bug", details: err.message });
  }
});

/**
 * DELETE /api/reports/:id
 * Remove um relatório específico
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteBugReport(id);
    return res.json({ message: "Relatório removido com sucesso." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao excluir relatório", details: err.message });
  }
});

module.exports = router;
