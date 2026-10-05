const express = require("express");
const db = require("../../db");
const { authenticateV1 } = require("../../middlewares/auth");

const router = express.Router();

/**
 * GET /api/v1/admin/sellers
 */
router.get("/sellers", async (req, res) => {
  try {
    const sellers = await db.getSellers();
    res.json({
      total: sellers.length,
      sellers
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar lojistas", details: err.message });
  }
});

/**
 * PUT /api/v1/admin/sellers/:id/approve
 * Falha BFLA: não valida role ADMIN
 */
router.put("/sellers/:id/approve", authenticateV1, async (req, res) => {
  const sellerId = req.params.id;

  try {
    const seller = await db.findUserById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Lojista não encontrado" });
    }

    const updated = await db.updateUserStatus(sellerId, "APPROVED");

    return res.json({
      message: `Lojista '${seller.name}' foi aprovado com sucesso!`,
      seller: {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        status: updated.status
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao aprovar lojista", details: err.message });
  }
});

/**
 * PUT /api/v1/admin/sellers/:id/reject
 */
router.put("/sellers/:id/reject", authenticateV1, async (req, res) => {
  const sellerId = req.params.id;

  try {
    const seller = await db.findUserById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Lojista não encontrado" });
    }

    const updated = await db.updateUserStatus(sellerId, "REJECTED");
    return res.json({
      message: `Cadastro do lojista '${seller.name}' foi rejeitado.`,
      seller: updated
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao rejeitar lojista", details: err.message });
  }
});

/**
 * GET /api/v1/admin/financials
 * Falha BFLA: não valida role ADMIN
 */
router.get("/financials", authenticateV1, async (req, res) => {
  try {
    const metrics = await db.getFinancialMetrics();
    return res.json({
      message: "Relatório financeiro gerado com sucesso.",
      confidentialData: metrics
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao gerar métricas", details: err.message });
  }
});

router.post("/reset-db", async (req, res) => {
  try {
    await db.reset();
    return res.json({ message: "Base de dados restaurada com sucesso!" });
  } catch (err) {
    return res.status(500).json({ error: "Erro no reset", details: err.message });
  }
});

module.exports = router;
