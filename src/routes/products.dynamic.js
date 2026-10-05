const express = require("express");
const db = require("../db");
const productsV1 = require("./v1/products.v1");
const productsV2 = require("./v2/products.v2");

const router = express.Router();

/**
 * Roteamento dinâmico de Produtos baseado no modo ativo salvo no backend/Supabase
 */
router.use(async (req, res, next) => {
  const mode = await db.getSystemMode();
  if (mode === "v2") {
    return productsV2(req, res, next);
  }
  return productsV1(req, res, next);
});

module.exports = router;
