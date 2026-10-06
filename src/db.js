const supabase = require("./supabaseClient");

const INITIAL_USERS = [
  { id: 1, username: "alice", password: "123", name: "Alice Compradora", role: "CUSTOMER", status: "APPROVED" },
  { id: 2, username: "joao", password: "123", name: "João Tech (Loja 1)", role: "SELLER", status: "APPROVED" },
  { id: 3, username: "maria", password: "123", name: "Maria Variedades (Loja 2)", role: "SELLER", status: "APPROVED" },
  { id: 4, username: "admin", password: "admin123", name: "Carlos SysAdmin", role: "ADMIN", status: "APPROVED" }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Max",
    description: "Notebook de alta performance com chip M3 Max (16-core CPU, 40-core GPU), 36GB RAM e 1TB SSD Liquid Retina XDR.",
    price: 14999.00,
    seller_id: 2,
    seller_name: "João Tech (Loja 1)",
    category: "Notebooks",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 142,
    stock: 8,
    discountBadge: "10% OFF"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Smartphone topo de linha com Galaxy AI, câmera quádrupla de 200MP, S Pen integrada e display Dynamic AMOLED 2X 120Hz.",
    price: 7999.00,
    seller_id: 3,
    seller_name: "Maria Variedades (Loja 2)",
    category: "Smartphones",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 98,
    stock: 15,
    discountBadge: "15% OFF"
  },
  {
    id: 3,
    name: "Monitor Profissional Dell UltraSharp 4K 27\"",
    description: "Monitor IPS Black com resolução 4K UHD (3840 x 2160), 98% DCI-P3, USB-C Hub com carregamento de 90W e suporte ergonômico.",
    price: 3200.00,
    seller_id: 2,
    seller_name: "João Tech (Loja 1)",
    category: "Monitores",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 64,
    stock: 12,
    discountBadge: "Frete Grátis"
  },
  {
    id: 4,
    name: "Headset Sem Fio Sony WH-1000XM5",
    description: "Cancelamento de ruído líder do setor com dois processadores, 8 microfones, áudio Hi-Res sem fio e até 30 horas de bateria.",
    price: 2199.00,
    seller_id: 3,
    seller_name: "Maria Variedades (Loja 2)",
    category: "Áudio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 210,
    stock: 20,
    discountBadge: "Mais Vendido"
  },
  {
    id: 5,
    name: "Teclado Mecânico Wireless Keychron Q1 Pro RGB",
    description: "Teclado mecânico custom premium com estrutura em alumínio CNC usinado, switches Gateron Jupiter Brown e conexão Bluetooth 5.1.",
    price: 1150.00,
    seller_id: 2,
    seller_name: "João Tech (Loja 1)",
    category: "Periféricos",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 45,
    stock: 10,
    discountBadge: "Novo"
  },
  {
    id: 6,
    name: "Mouse Sem Fio Logitech MX Master 3S",
    description: "Mouse de precisão ergonômico com sensor Darkfield de 8.000 DPI, cliques silenciosos e roda de rolagem MagSpeed eletromagnética.",
    price: 649.00,
    seller_id: 3,
    seller_name: "Maria Variedades (Loja 2)",
    category: "Periféricos",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 312,
    stock: 25,
    discountBadge: "Recomendado"
  },
  {
    id: 7,
    name: "Apple iPad Air 11\" M2 256GB Wi-Fi",
    description: "Tablet potente com chip M2, tela Liquid Retina brilhante, compatibilidade com Apple Pencil Pro e Magic Keyboard.",
    price: 5899.00,
    seller_id: 2,
    seller_name: "João Tech (Loja 1)",
    category: "Tablets",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 78,
    stock: 6,
    discountBadge: "5% OFF"
  },
  {
    id: 8,
    name: "Placa de Vídeo GeForce RTX 4080 Super 16GB OC",
    description: "Placa gráfica de ponta para jogos em 4K e renderização 3D, arquitetura Ada Lovelace, DLSS 3 e resfriamento Triple Fan.",
    price: 7499.00,
    seller_id: 3,
    seller_name: "Maria Variedades (Loja 2)",
    category: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 52,
    stock: 4,
    discountBadge: "Top Oferta"
  }
];

// Metadados visuais para produtos
const PRODUCT_METADATA = {
  "MacBook Pro 16\" M3 Max": {
    category: "Notebooks",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 142,
    stock: 8,
    discountBadge: "10% OFF"
  },
  "Samsung Galaxy S24 Ultra 512GB": {
    category: "Smartphones",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 98,
    stock: 15,
    discountBadge: "15% OFF"
  },
  "Monitor Profissional Dell UltraSharp 4K 27\"": {
    category: "Monitores",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 64,
    stock: 12,
    discountBadge: "Frete Grátis"
  },
  "Headset Sem Fio Sony WH-1000XM5": {
    category: "Áudio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 210,
    stock: 20,
    discountBadge: "Mais Vendido"
  },
  "Teclado Mecânico Wireless Keychron Q1 Pro RGB": {
    category: "Periféricos",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 45,
    stock: 10,
    discountBadge: "Novo"
  },
  "Mouse Sem Fio Logitech MX Master 3S": {
    category: "Periféricos",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 312,
    stock: 25,
    discountBadge: "Recomendado"
  },
  "Apple iPad Air 11\" M2 256GB Wi-Fi": {
    category: "Tablets",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 78,
    stock: 6,
    discountBadge: "5% OFF"
  },
  "Placa de Vídeo GeForce RTX 4080 Super 16GB OC": {
    category: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 52,
    stock: 4,
    discountBadge: "Top Oferta"
  }
};

class Database {
  isSupabaseActive() {
    return true;
  }

  // --- Toggle Mestre de Modo (v1 / v2) ---
  async getSystemMode() {
    const { data, error } = await supabase
      .from("system_config")
      .select("value")
      .eq("key", "api_mode")
      .maybeSingle();

    if (error) {
      throw new Error(`[Supabase] Falha ao ler api_mode: ${error.message}`);
    }
    if (!data) {
      await this.setSystemMode("v1");
      return "v1";
    }
    return data.value;
  }

  async setSystemMode(mode) {
    const validMode = mode === "v2" ? "v2" : "v1";
    const { error } = await supabase
      .from("system_config")
      .upsert({ key: "api_mode", value: validMode }, { onConflict: "key" });

    if (error) {
      throw new Error(`[Supabase] Falha ao atualizar api_mode: ${error.message}`);
    }
    return validMode;
  }

  // --- Usuários ---
  async findUserByUsername(username) {
    const cleanUsername = username.toLowerCase().trim();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar usuário '${cleanUsername}': ${error.message}`);
    }
    return data;
  }

  async findUserById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle();

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar usuário #${id}: ${error.message}`);
    }
    return data;
  }

  async createUser({ username, password, name, role }) {
    const status = role === "SELLER" ? "PENDING" : "APPROVED";
    const cleanUsername = username.toLowerCase().trim();

    const { data, error } = await supabase
      .from("users")
      .insert({
        username: cleanUsername,
        password,
        name,
        role,
        status
      })
      .select()
      .single();

    if (error) {
      throw new Error(`[Supabase] Erro ao criar usuário: ${error.message}`);
    }
    return data;
  }

  async updateUserStatus(id, status) {
    const { data, error } = await supabase
      .from("users")
      .update({ status })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      throw new Error(`[Supabase] Erro ao atualizar status do usuário #${id}: ${error.message}`);
    }
    return data;
  }

  async getSellers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, name, role, status, created_at")
      .eq("role", "SELLER")
      .order("id", { ascending: false });

    if (error) {
      throw new Error(`[Supabase] Erro ao listar vendedores: ${error.message}`);
    }
    return data || [];
  }

  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, name, role, status, password")
      .order("id");

    if (error) {
      throw new Error(`[Supabase] Erro ao listar usuários: ${error.message}`);
    }
    return data || [];
  }

  // --- Produtos ---
  normalizeProduct(p) {
    const nameLower = (p.name || "").toLowerCase();
    let category = p.category || "Tecnologia";
    let imageUrl = p.image_url || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";
    let discountBadge = p.discount_badge || null;
    let rating = Number(p.rating || 4.8);
    let reviewsCount = Number(p.reviews_count || 42);

    if (nameLower.includes("macbook") || nameLower.includes("notebook")) {
      category = "Notebooks";
      imageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";
      discountBadge = "10% OFF";
      rating = 4.9;
      reviewsCount = 142;
    } else if (nameLower.includes("galaxy") || nameLower.includes("smartphone") || nameLower.includes("iphone")) {
      category = "Smartphones";
      imageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80";
      discountBadge = "15% OFF";
      rating = 4.8;
      reviewsCount = 98;
    } else if (nameLower.includes("monitor") || nameLower.includes("dell")) {
      category = "Monitores";
      imageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80";
      discountBadge = "Frete Grátis";
      rating = 4.9;
      reviewsCount = 64;
    } else if (nameLower.includes("headset") || nameLower.includes("sony") || nameLower.includes("áudio") || nameLower.includes("fone")) {
      category = "Áudio";
      imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
      discountBadge = "Mais Vendido";
      rating = 4.9;
      reviewsCount = 210;
    } else if (nameLower.includes("teclado") || nameLower.includes("keychron")) {
      category = "Periféricos";
      imageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80";
      discountBadge = "Novo";
      rating = 4.7;
      reviewsCount = 45;
    } else if (nameLower.includes("mouse") || nameLower.includes("logitech")) {
      category = "Periféricos";
      imageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80";
      discountBadge = "Recomendado";
      rating = 4.9;
      reviewsCount = 312;
    } else if (nameLower.includes("ipad") || nameLower.includes("tablet")) {
      category = "Tablets";
      imageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80";
      discountBadge = "5% OFF";
      rating = 4.8;
      reviewsCount = 78;
    } else if (nameLower.includes("rtx") || nameLower.includes("placa") || nameLower.includes("geforce")) {
      category = "Hardware";
      imageUrl = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80";
      discountBadge = "Top Oferta";
      rating = 5.0;
      reviewsCount = 52;
    }

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      sellerId: Number(p.seller_id),
      sellerName: p.seller_name,
      category,
      imageUrl,
      rating,
      reviewsCount,
      stock: Number(p.stock !== undefined ? p.stock : 10),
      discountBadge
    };
  }


  async getAllProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar produtos: ${error.message}`);
    }

    return (data || []).map((p) => this.normalizeProduct(p));
  }

  async getProductsBySeller(sellerId) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", Number(sellerId))
      .order("id");

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar produtos do lojista #${sellerId}: ${error.message}`);
    }

    return (data || []).map((p) => this.normalizeProduct(p));
  }

  async findProductById(id) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle();

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar produto #${id}: ${error.message}`);
    }

    return data ? this.normalizeProduct(data) : null;
  }

  async createProduct({ name, description, price, sellerId, sellerName, category, imageUrl, stock }) {
    const insertPayload = {
      name,
      description: description || "Sem descrição",
      price: Number(price),
      seller_id: Number(sellerId),
      seller_name: sellerName
    };

    const { data, error } = await supabase
      .from("products")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw new Error(`[Supabase] Erro ao criar produto: ${error.message}`);
    }

    return this.normalizeProduct(data);
  }

  async updateProductPrice(id, newPrice) {
    const { data, error } = await supabase
      .from("products")
      .update({ price: Number(newPrice) })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      throw new Error(`[Supabase] Erro ao atualizar preço do produto #${id}: ${error.message}`);
    }

    return this.normalizeProduct(data);
  }

  // --- Pedidos (Orders & Checkout) ---
  async createOrder({
    userId,
    customerName,
    items,
    subtotal,
    shippingCost,
    discount,
    totalAmount,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    paymentDetails
  }) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${randomSuffix}`;

    const newOrderPayload = {
      id: orderId,
      user_id: Number(userId),
      customer_name: customerName,
      items: items.map((it) => ({
        productId: it.productId || it.id,
        name: it.name,
        price: Number(it.price),
        quantity: Number(it.quantity || 1),
        sellerId: Number(it.sellerId || it.seller_id),
        sellerName: it.sellerName || it.seller_name || "Lojista Parceiro",
        imageUrl: it.imageUrl || it.image_url || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
      })),
      subtotal: Number(subtotal),
      shipping_cost: Number(shippingCost || 0),
      discount: Number(discount || 0),
      total_amount: Number(totalAmount),
      shipping_address: shippingAddress,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      payment_details: paymentDetails || {},
      status: "PREPARING",
      tracking_code: `BR${randomSuffix}99BR`
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(newOrderPayload)
      .select()
      .single();

    if (error) {
      throw new Error(`[Supabase] Erro ao gravar pedido na tabela orders: ${error.message}`);
    }

    return this.normalizeOrder(data);
  }

  normalizeOrder(o) {
    return {
      id: o.id,
      userId: Number(o.user_id),
      customerName: o.customer_name,
      items: o.items,
      subtotal: Number(o.subtotal),
      shippingCost: Number(o.shipping_cost || 0),
      discount: Number(o.discount || 0),
      totalAmount: Number(o.total_amount),
      shippingAddress: o.shipping_address,
      shippingMethod: o.shipping_method,
      paymentMethod: o.payment_method,
      paymentDetails: o.payment_details,
      status: o.status,
      trackingCode: o.tracking_code,
      createdAt: o.created_at || new Date().toISOString()
    };
  }

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", Number(userId))
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar pedidos: ${error.message}`);
    }

    return (data || []).map((o) => this.normalizeOrder(o));
  }

  async getSellerOrders(sellerId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar pedidos da loja: ${error.message}`);
    }

    const numSellerId = Number(sellerId);
    return (data || [])
      .map((o) => this.normalizeOrder(o))
      .filter((o) => o.items && o.items.some((it) => Number(it.sellerId) === numSellerId));
  }

  async getOrderById(orderId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      throw new Error(`[Supabase] Erro ao buscar pedido #${orderId}: ${error.message}`);
    }

    return data ? this.normalizeOrder(data) : null;
  }

  async getAllOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`[Supabase] Erro ao listar todos os pedidos: ${error.message}`);
    }

    return (data || []).map((o) => this.normalizeOrder(o));
  }


  // --- Reset (Cadastra e repopula todos os itens diretamente no Supabase) ---
  async reset() {
    // 1. Limpar produtos e usuários existentes no Supabase
    try {
      await supabase.from("orders").delete().neq("id", "0");
    } catch {}

    const { error: errDelP } = await supabase.from("products").delete().neq("id", 0);
    if (errDelP) console.warn("Aviso ao limpar produtos no Supabase:", errDelP.message);

    const { error: errDelU } = await supabase.from("users").delete().neq("id", 0);
    if (errDelU) console.warn("Aviso ao limpar usuários no Supabase:", errDelU.message);

    // 2. Inserir os 4 usuários no Supabase
    const { error: errUsers } = await supabase.from("users").insert(INITIAL_USERS);
    if (errUsers) throw new Error(`[Supabase] Erro ao repopular usuários: ${errUsers.message}`);

    // 3. Inserir os 8 produtos reais de tecnologia no Supabase
    const productsToInsert = INITIAL_PRODUCTS.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      seller_id: p.seller_id,
      seller_name: p.seller_name
    }));

    const { error: errProd } = await supabase.from("products").insert(productsToInsert);
    if (errProd) throw new Error(`[Supabase] Erro ao repopular produtos: ${errProd.message}`);

    // 4. Resetar modo para v1 no Supabase
    await this.setSystemMode("v1");
  }

  // --- Métricas Financeiras Direto do Supabase ---
  async getFinancialMetrics() {
    const products = await this.getAllProducts();
    const users = await this.getAllUsers();
    let orders = [];
    try {
      orders = await this.getAllOrders();
    } catch {
      orders = [];
    }

    const inventoryValue = products.reduce((acc, p) => acc + p.price, 0);
    const totalOrders = orders.length;
    const totalSalesVolume = orders.reduce((acc, o) => acc + o.totalAmount, 0);

    return {
      storageSource: "Supabase (PostgreSQL - 100% Direto)",
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders,
      totalSalesVolume,
      platformTotalInventoryValue: inventoryValue,
      platformFeeEarned: inventoryValue * 0.10 + totalSalesVolume * 0.05,
      topSellers: [
        { sellerId: 2, name: "João Tech (Loja 1)", revenue: 18199.00 },
        { sellerId: 3, name: "Maria Variedades (Loja 2)", revenue: 7999.00 }
      ]
    };
  }

  // --- Relatórios de Bugs dos Alunos / Testadores ---
  async getBugReports() {
    const { data, error } = await supabase
      .from("system_config")
      .select("value")
      .eq("key", "bug_reports_list")
      .maybeSingle();

    if (error) {
      console.warn("Aviso ao buscar bug_reports_list:", error.message);
      return [];
    }
    if (!data || !data.value) return [];
    try {
      const parsed = JSON.parse(data.value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async createBugReport({ title, description, imageData, author, pageUrl, systemMode }) {
    const currentReports = await this.getBugReports();
    const newReport = {
      id: Date.now(),
      title: title || "Bug sem título",
      description: description || "",
      imageData: imageData || null,
      author: author || "Aluno Anônimo",
      pageUrl: pageUrl || "/",
      systemMode: systemMode || "v1",
      createdAt: new Date().toISOString()
    };

    // Mantém os 50 mais recentes para gerenciar o tamanho
    const updated = [newReport, ...currentReports].slice(0, 50);

    const { error } = await supabase
      .from("system_config")
      .upsert(
        { key: "bug_reports_list", value: JSON.stringify(updated) },
        { onConflict: "key" }
      );

    if (error) {
      throw new Error(`[Supabase] Erro ao salvar bug report: ${error.message}`);
    }

    return newReport;
  }

  async deleteBugReport(id) {
    const currentReports = await this.getBugReports();
    const updated = currentReports.filter((r) => String(r.id) !== String(id));

    const { error } = await supabase
      .from("system_config")
      .upsert(
        { key: "bug_reports_list", value: JSON.stringify(updated) },
        { onConflict: "key" }
      );

    if (error) {
      throw new Error(`[Supabase] Erro ao excluir bug report: ${error.message}`);
    }
    return true;
  }
}

const db = new Database();

module.exports = db;
