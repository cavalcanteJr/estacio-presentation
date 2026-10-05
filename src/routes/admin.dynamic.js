const express = require("express");
const db = require("../db");
const adminV1 = require("./v1/admin.v1");
const adminV2 = require("./v2/admin.v2");

const router = express.Router();

/**
 * Roteamento dinâmico de Admin baseado no modo ativo salvo no backend/Supabase
 */
router.use(async (req, res, next) => {
  const mode = await db.getSystemMode();
  if (mode === "v2") {
    return adminV2(req, res, next);
  }
  return adminV1(req, res, next);
});

module.exports = router;
