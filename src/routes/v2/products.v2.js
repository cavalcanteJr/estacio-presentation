const express = require("express");
const db = require("../../db");
const { authenticateV2 } = require("../../middlewares/auth");
const { requireRole } = require("../../middlewares/permissions");

const router = express.Router();

/**
 * GET /api/v2/products
 */
router.get("/", async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json({
      total: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar produtos", details: err.message });
  }
});

/**
 * GET /api/v2/products/seller/me
 */
router.get("/seller/me", authenticateV2, requireRole("SELLER", "ADMIN"), async (req, res) => {
  try {
    const myProducts = await db.getProductsBySeller(req.user.id);
    res.json({
      sellerId: req.user.id,
      products: myProducts
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos", details: err.message });
  }
});

/**
 * GET /api/v2/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto", details: err.message });
  }
});

/**
 * POST /api/v2/products
 */
router.post(
  "/",
  authenticateV2,
  requireRole("SELLER", "ADMIN"),
  async (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    try {
      const newProduct = await db.createProduct({
        name,
        description: description || "Sem descrição",
        price,
        sellerId: req.user.id,
        sellerName: req.user.name
      });

      return res.status(201).json({
        message: "Produto criado com sucesso no catálogo!",
        product: newProduct
      });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao criar produto", details: err.message });
    }
  }
);

/**
 * PUT /api/v2/products/:id/price
 * Protegido com checagem de propriedade (Ownership Check)
 */
router.put(
  "/:id/price",
  authenticateV2,
  requireRole("SELLER", "ADMIN"),
  async (req, res) => {
    const productId = req.params.id;
    const { newPrice } = req.body;

    if (newPrice === undefined || isNaN(newPrice)) {
      return res.status(400).json({ error: "Informe um preço válido" });
    }

    try {
      const product = await db.findProductById(productId);

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const isOwner = Number(product.sellerId) === Number(req.user.id);
      const isAdmin = req.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          error: "Acesso negado",
          message: "Você não tem permissão para alterar produtos de outro lojista."
        });
      }

      const updated = await db.updateProductPrice(productId, newPrice);

      return res.json({
        message: "Preço atualizado com sucesso!",
        product: updated
      });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao atualizar produto", details: err.message });
    }
  }
);

module.exports = router;
