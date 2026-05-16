import type { OrderStatus, PaymentMethod, Product, ShippingInfo } from "@/lib/types";

type DemoOrder = OrderStatus & {
  nro_orden: string;
  clerk_user_id_comprador: string;
  producto_id: string;
  total: number;
  direccion_envio: string;
  fecha_creacion: string;
};

type CreateOrderInput = {
  clerkUserId: string;
  productoId: string;
  total: number;
  direccionEnvio: string;
};

const globalForMockExternal = globalThis as unknown as {
  lamaOrders?: DemoOrder[];
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
  }
];

export const products: Product[] = [
  {
    producto_id: "prod_001",
    clerk_user_id_vendedor: "user_seller_lama_001",
    categoria_id: "cat_camperas",
    imagenes: ["/products/campera-denim.svg"],
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
    imagenes: ["/products/vestido-floreado.svg"],
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
    imagenes: ["/products/jean-recto.svg"],
    titulo: "Jean recto tiro alto",
    descripcion: "Jean azul oscuro de calce recto, con desgaste leve propio del uso.",
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
    imagenes: ["/products/remera-basica.svg"],
    titulo: "Remera basica algodon",
    descripcion: "Remera blanca de algodon grueso, sin manchas visibles.",
    precio: 12800,
    estado_prenda: "usado",
    talle: "M",
    marca: "Uniqlo",
    estado_publicacion: "activa",
    fecha_creacion: "2026-05-01T10:45:00.000Z"
  },
  {
    producto_id: "prod_005",
    clerk_user_id_vendedor: "user_seller_lama_003",
    categoria_id: "cat_camperas",
    imagenes: ["/products/blazer-negro.svg"],
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
    imagenes: ["/products/pantalon-cargo.svg"],
    titulo: "Pantalon cargo verde",
    descripcion: "Pantalon cargo con bolsillos laterales y cintura regulable.",
    precio: 31900,
    estado_prenda: "usado",
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
    metodo_pago: "billetera virtual",
    descripcion: "Pago con saldo disponible en billetera virtual.",
    esta_activo: true
  },
  {
    metodo_pago_id: "mp_debito",
    metodo_pago: "tarjeta de debito",
    descripcion: "Pago con tarjeta de debito en modo sandbox.",
    esta_activo: true
  },
  {
    metodo_pago_id: "mp_credito",
    metodo_pago: "tarjeta de credito",
    descripcion: "Pago con tarjeta de credito en modo sandbox.",
    esta_activo: true
  }
];

export function getProductById(productId: string) {
  return products.find((product) => product.producto_id === productId);
}

export function getCatalogProducts({
  search = "",
  categoria,
  talle,
  page = 1,
  pageSize = 6
}: {
  search?: string;
  categoria?: string | null;
  talle?: string | null;
  page?: number;
  pageSize?: number;
}) {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedPage = Math.max(page, 1);
  const normalizedPageSize = Math.min(Math.max(pageSize, 1), 20);

  const filtered = products.filter((product) => {
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

  return {
    items: filtered.slice((normalizedPage - 1) * normalizedPageSize, normalizedPage * normalizedPageSize),
    total: filtered.length,
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
  const order: DemoOrder = {
    orden_id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    nro_orden: `LAMA-${String(sequence).padStart(4, "0")}`,
    clerk_user_id_comprador: input.clerkUserId,
    producto_id: input.productoId,
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
    empresa_logistica: "lama Logistica",
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
