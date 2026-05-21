import type { BuyerPreferences, PaymentMethod, Product, SalesOrder, ShippingInfo } from "@/lib/types";

type CreateOrderInput = {
  clerkUserId: string;
  productIds: string[];
  total: number;
  direccionEnvio: string;
};

export type ProductSort = "price_asc" | "price_desc" | "recent";

const globalForMockExternal = globalThis as unknown as {
  lamaOrders?: SalesOrder[];
};

export const sellers = [
  {
    clerk_user_id_vendedor: "user_seller_lama_001",
    nombre_vendedor: "Ana Vintage",
    DNI: "33111222",
    email: "ana.vintage@lama.test",
    telefono: "1122334455",
    fecha_creacion: "2026-02-10T10:00:00.000Z"
  },
  {
    clerk_user_id_vendedor: "user_seller_lama_002",
    nombre_vendedor: "Ropa Circular",
    DNI: "34888999",
    email: "circular@lama.test",
    telefono: "1133221100",
    fecha_creacion: "2026-02-12T14:30:00.000Z"
  },
  {
    clerk_user_id_vendedor: "user_seller_lama_003",
    nombre_vendedor: "Archivo Denim",
    DNI: "36555666",
    email: "denim@lama.test",
    telefono: "1144556677",
    fecha_creacion: "2026-03-01T11:45:00.000Z"
  }
];

export const categories = [
  {
    categoria_producto_id: "cat_camperas",
    nombre: "Camperas",
    descripcion: "Abrigos usados y vintage.",
    fecha_creacion: "2026-02-01T09:00:00.000Z"
  },
  {
    categoria_producto_id: "cat_vestidos",
    nombre: "Vestidos",
    descripcion: "Vestidos de segunda mano seleccionados.",
    fecha_creacion: "2026-02-01T09:10:00.000Z"
  },
  {
    categoria_producto_id: "cat_pantalones",
    nombre: "Pantalones",
    descripcion: "Jeans, pantalones sastreros y prendas casuales.",
    fecha_creacion: "2026-02-01T09:20:00.000Z"
  },
  {
    categoria_producto_id: "cat_remeras",
    nombre: "Remeras",
    descripcion: "Remeras y tops en buen estado.",
    fecha_creacion: "2026-02-01T09:30:00.000Z"
  },
  {
    categoria_producto_id: "cat_zapatillas",
    nombre: "Zapatillas",
    descripcion: "Zapatillas en buen estado.",
    fecha_creacion: "2026-02-01T09:40:00.000Z"
  },
  {
    categoria_producto_id: "cat_carteras",
    nombre: "Carteras",
    descripcion: "Carteras en buen estado.",
    fecha_creacion: "2026-02-01T09:50:00.000Z"
  }
];

export const products: Product[] = [
  {
    producto_id: "prod_001",
    clerk_user_id_vendedor: "user_seller_lama_001",
    categoria_id: "cat_camperas",
    imagenes: ["/products/campera_denim.webp","/products/campera_denim_back.webp"],
    titulo: "Campera denim vintage",
    descripcion: "Campera de jean celeste con corte clasico, sin roturas y con botones originales.",
    precio: 38500,
    estado_prenda: "vintage",
    talle: "M",
    marca: "Levi's",
    estado_publicacion: "activa",
    fecha_creacion: "2026-04-20T12:00:00.000Z"
  },
  {
    producto_id: "prod_002",
    clerk_user_id_vendedor: "user_seller_lama_002",
    categoria_id: "cat_vestidos",
    imagenes: ["/products/vestido_floreado.webp","/products/vestido_floreado_back.webp"],
    titulo: "Vestido floreado midi",
    descripcion: "Vestido liviano con estampa floral, ideal para media estacion.",
    precio: 29600,
    estado_prenda: "usado",
    talle: "S",
    marca: "Maria Cher",
    estado_publicacion: "activa",
    fecha_creacion: "2026-04-24T16:20:00.000Z"
  },
  {
    producto_id: "prod_003",
    clerk_user_id_vendedor: "user_seller_lama_003",
    categoria_id: "cat_pantalones",
    imagenes: ["/products/jean_recto.webp","/products/jean_recto_back.webp","/products/jean_recto_lado.webp"],
    titulo: "Jean recto tiro alto",
    descripcion: "Jean gris de calce recto, con desgaste leve propio del uso.",
    precio: 34200,
    estado_prenda: "usado",
    talle: "L",
    marca: "Lee",
    estado_publicacion: "activa",
    fecha_creacion: "2026-04-28T09:10:00.000Z"
  },
  {
    producto_id: "prod_004",
    clerk_user_id_vendedor: "user_seller_lama_001",
    categoria_id: "cat_remeras",
    imagenes: ["/products/remera_blanca.webp","/products/remera_blanca2.webp","/products/remera_blanca_back.webp"],
    titulo: "Remera basica algodon",
    descripcion: "Remera blanca de algodon grueso, sin manchas visibles.",
    precio: 12800,
    estado_prenda: "usado",
    talle: "M",
    marca: "Uniqlo",
    estado_publicacion: "vendida",
    fecha_creacion: "2026-05-01T10:45:00.000Z"
  },
  {
    producto_id: "prod_005",
    clerk_user_id_vendedor: "user_seller_lama_003",
    categoria_id: "cat_camperas",
    imagenes: ["/products/blazer_negro.webp", "/products/blazer_negro_back.webp", "/products/blazer_negro2.webp"],
    titulo: "Blazer negro sastrero",
    descripcion: "Blazer forrado, corte recto, excelente estado.",
    precio: 45100,
    estado_prenda: "nuevo",
    talle: "S",
    marca: "Zara",
    estado_publicacion: "activa",
    fecha_creacion: "2026-05-04T13:30:00.000Z"
  },
  {
    producto_id: "prod_006",
    clerk_user_id_vendedor: "user_seller_lama_002",
    categoria_id: "cat_pantalones",
    imagenes: ["/products/pantalon_cargo.jpg","/products/pantalon_cargo_back.jpg", "/products/pantalon_cargo_lado.jpg"],
    titulo: "Pantalon cargo verde",
    descripcion: "Pantalon cargo con bolsillos laterales y cintura regulable.",
    precio: 31900,
    estado_prenda: "usado",
    talle: "M",
    marca: "Complot",
    estado_publicacion: "activa",
    fecha_creacion: "2026-05-06T18:00:00.000Z"
  },
  {
    producto_id: "prod_007",
    clerk_user_id_vendedor: "user_seller_lama_001",
    categoria_id: "cat_zapatillas",
    imagenes: ["/products/zapatillas.webp", "/products/zapatillas2.webp"],
    titulo: "Zapatillas negras",
    descripcion: "Zapatillas deportivas en buen estado.",
    precio: 28500,
    estado_prenda: "usado como nuevo",
    talle: "38",
    marca: "Adidas",
    estado_publicacion: "activa",
    fecha_creacion: "2026-05-04T13:20:00.000Z"
  },
  {
    producto_id: "prod_008",
    clerk_user_id_vendedor: "user_seller_lama_003",
    categoria_id: "cat_carteras",
    imagenes: ["/products/cartera.jpg", "/products/cartera2.jpg"],
    titulo: "Cartera de cuero",
    descripcion: "Cartera de cuero vintage en buen estado.",
    precio: 15000,
    estado_prenda: "usada",
    talle: "unico",
    marca: "Prune",
    estado_publicacion: "activa",
    fecha_creacion: "2026-04-28T09:10:00.000Z"
  },
    {
    producto_id: "prod_009",
    clerk_user_id_vendedor: "user_seller_lama_001",
    categoria_id: "cat_zapatillas",
    imagenes: ["/products/zapatillas.webp", "/products/zapatillas2.webp"],
    titulo: "Zapatillas negras",
    descripcion: "Zapatillas deportivas en buen estado.",
    precio: 28500,
    estado_prenda: "nuevo",
    talle: "38",
    marca: "Adidas",
    estado_publicacion: "activa",
    fecha_creacion: "2026-05-04T13:20:00.000Z"
  },
    {
    producto_id: "prod_010",
    clerk_user_id_vendedor: "user_seller_lama_002",
    categoria_id: "cat_pantalones",
    imagenes: ["/products/pantalon_cargo.jpg","/products/pantalon_cargo_back.jpg", "/products/pantalon_cargo_lado.jpg"],
    titulo: "Pantalon cargo verde",
    descripcion: "Pantalon cargo con bolsillos laterales y cintura regulable.",
    precio: 31900,
    estado_prenda: "nuevo",
    talle: "M",
    marca: "Complot",
    estado_publicacion: "activa",
    fecha_creacion: "2026-05-06T18:00:00.000Z"
  }
];

const orders = globalForMockExternal.lamaOrders ?? [];
globalForMockExternal.lamaOrders = orders;

export const paymentMethods: PaymentMethod[] = [
  {
    metodo_pago_id: "mp_mercadopago_wallet",
    metodo_pago: "Billetera Virtual",
    descripcion: "Pago con saldo disponible en billetera virtual.",
    esta_activo: true
  },
  {
    metodo_pago_id: "mp_debito",
    metodo_pago: "Tarjeta de Débito",
    descripcion: "Pago con tarjeta de débito en modo sandbox.",
    esta_activo: true
  },
  {
    metodo_pago_id: "mp_credito",
    metodo_pago: "Tarjeta de Crédito",
    descripcion: "Pago con tarjeta de crédito en modo sandbox.",
    esta_activo: true
  }
];

export function getProductById(productId: string) {
  return products.find((product) => product.producto_id === productId);
}

function getFilteredProducts({
  search = "",
  categoria,
  talle
}: {
  search?: string;
  categoria?: string | null;
  talle?: string | null;
}) {
  const normalizedSearch = search.trim().toLowerCase();

  return products.filter((product) => {
    const seller = sellers.find((item) => item.clerk_user_id_vendedor === product.clerk_user_id_vendedor);
    const categoryName = categories.find((item) => item.categoria_producto_id === product.categoria_id)?.nombre;
    const matchesSearch = normalizedSearch
      ? [product.titulo, product.descripcion, product.marca, seller?.nombre_vendedor, categoryName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))
      : true;
    const matchesCategory = categoria ? product.categoria_id === categoria : true;
    const matchesSize = talle ? product.talle === talle : true;

    return product.estado_publicacion === "activa" && matchesSearch && matchesCategory && matchesSize;
  });
}

export function normalizeProductSort(sort?: string | null): ProductSort {
  if (sort === "price_asc" || sort === "price_desc" || sort === "recent") {
    return sort;
  }

  return "recent";
}

function sortProducts(items: Product[], sort?: string | null) {
  const normalizedSort = normalizeProductSort(sort);

  return [...items].sort((a, b) => {
    if (normalizedSort === "price_asc") {
      return a.precio - b.precio;
    }

    if (normalizedSort === "price_desc") {
      return b.precio - a.precio;
    }

    return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
  });
}

export function hasBuyerPreferences(preferences?: BuyerPreferences | null): preferences is BuyerPreferences {
  return Boolean(
    preferences &&
      [
        preferences.talles_preferidos,
        preferences.categorias_preferidas,
        preferences.vendedores_preferidos
      ].some((values) => values.length > 0)
  );
}

function preferenceScore(product: Product, preferences: BuyerPreferences) {
  let score = 0;

  if (preferences.talles_preferidos.includes(product.talle)) {
    score += 1;
  }

  if (preferences.categorias_preferidas.includes(product.categoria_id)) {
    score += 1;
  }

  if (preferences.vendedores_preferidos.includes(product.clerk_user_id_vendedor)) {
    score += 1;
  }

  return score;
}

export function matchesAnyPreference(product: Product, preferences?: BuyerPreferences | null) {
  return preferences ? preferenceScore(product, preferences) > 0 : false;
}

function sortByPreferenceRelevance(items: Product[], preferences: BuyerPreferences) {
  return [...items].sort((a, b) => {
    const scoreDifference = preferenceScore(b, preferences) - preferenceScore(a, preferences);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
  });
}

export function getCatalogProducts({
  search = "",
  categoria,
  talle,
  sort = "recent",
  page = 1,
  pageSize = 8
}: {
  search?: string;
  categoria?: string | null;
  talle?: string | null;
  sort?: ProductSort | string | null;
  page?: number;
  pageSize?: number;
}) {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedPage = Math.max(page, 1);
  const normalizedPageSize = Math.min(Math.max(pageSize, 1), 20);
  const filtered = getFilteredProducts({ search: normalizedSearch, categoria, talle });
  const sorted = sortProducts(filtered, sort);

  return {
    items: sorted.slice((normalizedPage - 1) * normalizedPageSize, normalizedPage * normalizedPageSize),
    total: sorted.length,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    categorias: categories,
    vendedores: sellers
  };
}

export function getPersonalizedCatalogProducts({
  preferences,
  search = "",
  categoria,
  talle,
  page = 1,
  pageSize = 6,
  recommendedLimit = 6
}: {
  preferences: BuyerPreferences;
  search?: string;
  categoria?: string | null;
  talle?: string | null;
  page?: number;
  pageSize?: number;
  recommendedLimit?: number;
}) {
  const normalizedPage = Math.max(page, 1);
  const normalizedPageSize = Math.min(Math.max(pageSize, 1), 20);
  const filtered = getFilteredProducts({ search, categoria, talle });
  const personalizedItems = sortByPreferenceRelevance(
    filtered.filter((product) => matchesAnyPreference(product, preferences)),
    preferences
  ).slice(0, Math.max(recommendedLimit, 0));
  const personalizedIds = new Set(personalizedItems.map((product) => product.producto_id));
  const remainingItems = filtered.filter((product) => !personalizedIds.has(product.producto_id));

  return {
    personalizedItems,
    items: remainingItems.slice(
      (normalizedPage - 1) * normalizedPageSize,
      normalizedPage * normalizedPageSize
    ),
    total: remainingItems.length,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    categorias: categories,
    vendedores: sellers
  };
}

export function getOrderStatus(orderId: string) {
  return orders.find((order) => order.orden_id === orderId);
}

export function createOrder(input: CreateOrderInput) {
  const createdAt = new Date().toISOString();
  const sequence = orders.length + 1;
  const order: SalesOrder = {
    orden_id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    nro_orden: `#ORD-${String(sequence).padStart(4, "0")}`,
    clerk_user_id_comprador: input.clerkUserId,
    producto_id: input.productIds[0],
    producto_ids: input.productIds,
    total: input.total,
    estado_general: "pagada",
    estado_pago: "aprobado",
    estado_envio: "pendiente",
    direccion_envio: input.direccionEnvio,
    fecha_creacion: createdAt,
    fecha_actualizacion: createdAt
  };

  orders.unshift(order);
  return order;
}

export function getShippingForOrder(orderId: string): ShippingInfo | null {
  const order = getOrderStatus(orderId);

  if (!order) {
    return null;
  }

  return {
    envio_id: `env_${order.orden_id}`,
    orden_id: order.orden_id,
    codigo_seguimiento: `LMA-${order.orden_id.toUpperCase()}`,
    empresa_logistica: "Lama Logística",
    estado: order.estado_envio,
    historial_estados: [
      {
        estado: order.estado_envio,
        fecha: order.fecha_actualizacion,
        descripcion: "Envio generado al confirmar la compra."
      }
    ]
  };
}

export function getOrdersForBuyer(buyerId: string) {
  return orders.filter((order) => order.clerk_user_id_comprador === buyerId);
}
