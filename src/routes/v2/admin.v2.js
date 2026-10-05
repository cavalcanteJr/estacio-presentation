const express = require("express");
const db = require("../../db");
const { authenticateV2 } = require("../../middlewares/auth");
const { requireRole } = require("../../middlewares/permissions");

const router = express.Router();

/**
 * GET /api/v2/admin/sellers
 */
router.get("/sellers", authenticateV2, requireRole("ADMIN"), async (req, res) => {
  const sellers = await db.getSellers();
  res.json({
    total: sellers.length,
    sellers
  });
});

/**
 * PUT /api/v2/admin/sellers/:id/approve
 * 🛡️ CORREÇÃO BFLA: Protegido com requireRole("ADMIN")
 */
router.put(
  "/sellers/:id/approve",
  authenticateV2,
  requireRole("ADMIN"),
  async (req, res) => {
    const sellerId = req.params.id;
    const seller = await db.findUserById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Vendedor não encontrado" });
    }

    const updated = await db.updateUserStatus(sellerId, "APPROVED");

    return res.json({
      message: `Vendedor '${seller.name}' foi APROVADO com sucesso por Administrador legítimo!`,
      seller: {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        status: updated.status
      }
    });
  }
);

/**
 * PUT /api/v2/admin/sellers/:id/reject
 * 🛡️ CORREÇÃO BFLA: Protegido com requireRole("ADMIN")
 */
router.put(
  "/sellers/:id/reject",
  authenticateV2,
  requireRole("ADMIN"),
  async (req, res) => {
    const sellerId = req.params.id;
    const seller = await db.findUserById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Vendedor não encontrado" });
    }

    const updated = await db.updateUserStatus(sellerId, "REJECTED");

    return res.json({
      message: `Cadastro do vendedor '${seller.name}' foi REJEITADO por Administrador.`,
      seller: updated
    });
  }
);

/**
 * GET /api/v2/admin/financials
 * 🛡️ CORREÇÃO BFLA: Protegido com requireRole("ADMIN")
 */
router.get(
  "/financials",
  authenticateV2,
  requireRole("ADMIN"),
  async (req, res) => {
    const metrics = await db.getFinancialMetrics();

    return res.json({
      message: "Relatório financeiro acessado com sucesso por Administrador.",
      accessedBy: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      confidentialData: metrics
    });
  }
);

module.exports = router;
