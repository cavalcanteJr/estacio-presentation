const express = require("express");
const db = require("../db");
const ordersV1 = require("./v1/orders.v1");
const ordersV2 = require("./v2/orders.v2");

const router = express.Router();

/**
 * Roteador dinâmico de Pedidos:
 * Direciona para ordersV1 (Vulnerável) ou ordersV2 (Blindado)
 * de acordo com a configuração ativa no Supabase (system_config.api_mode).
 */
router.use(async (req, res, next) => {
  try {
    const mode = await db.getSystemMode();
    if (mode === "v2") {
      return ordersV2(req, res, next);
    }
    return ordersV1(req, res, next);
  } catch (err) {
    // Em caso de falha de consulta, assume V1 por segurança de demonstração
    return ordersV1(req, res, next);
  }
});

module.exports = router;
