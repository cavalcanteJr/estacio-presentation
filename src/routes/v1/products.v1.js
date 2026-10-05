const express = require("express");
const db = require("../../db");
const { authenticateV1 } = require("../../middlewares/auth");

const router = express.Router();

/**
 * GET /api/v1/products
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
 * GET /api/v1/products/seller/me
 */
router.get("/seller/me", authenticateV1, async (req, res) => {
  try {
    const myProducts = await db.getProductsBySeller(req.user.id);
    res.json({
      sellerId: req.user.id,
      products: myProducts
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos do lojista", details: err.message });
  }
});

/**
 * GET /api/v1/products/:id
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
 * POST /api/v1/products
 * Falha de autorização (BFLA): não valida se a role é SELLER
 */
router.post("/", authenticateV1, async (req, res) => {
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
    return res.status(500).json({ error: "Falha ao criar produto", details: err.message });
  }
});

/**
 * PUT /api/v1/products/:id/price
 * Falha de autorização (BOLA): não valida se product.sellerId === req.user.id
 */
router.put("/:id/price", authenticateV1, async (req, res) => {
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

    const updatedProduct = await db.updateProductPrice(productId, newPrice);

    return res.json({
      message: "Preço atualizado com sucesso!",
      product: updatedProduct
    });
  } catch (err) {
    return res.status(500).json({ error: "Falha ao atualizar preço", details: err.message });
  }
});

module.exports = router;
