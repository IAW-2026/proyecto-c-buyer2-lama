export type Buyer = {
  clerk_user_id_comprador: string;
  email: string;
  nombre_comprador: string;
  DNI: string | null;
  telefono: string | null;
  direccion_envio: string | null;
  esta_activo: boolean;
  fecha_desactivacion: Date | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
};

export type BuyerPreferences = {
  preferencia_id: string;
  clerk_user_id_comprador: string;
  talles_preferidos: string[];
  categorias_preferidas: string[];
  vendedores_preferidos: string[];
};

export type BuyerWithPreferences = Buyer & {
  preferencias: BuyerPreferences | null;
};

export type ProductSort = "price_asc" | "price_desc" | "recent";

export type Category = {
  categoria_producto_id: string;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
};

export type Seller = {
  vendedor_id: string;
  clerk_user_id_vendedor: string;
  nombre_vendedor: string;
};

export type Product = {
  producto_id: string;
  vendedor_id: string;
  clerk_user_id_vendedor: string;
  categoria_id: string;
  imagenes: string[];
  titulo: string;
  descripcion: string;
  precio: number;
  estado_prenda: string;
  talle: string;
  marca: string;
  genero: string;
  estado_publicacion: "activa" | "inactiva" | "vendida";
  fecha_creacion: string;
};

export type CatalogResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  categorias: Category[];
  vendedores: Seller[];
};

export type OrderStatus = {
  orden_id: string;
  estado_general: "pendiente" | "pendiente de pago" | "pagada" | "en preparacion" | "enviada" | "cancelada";
  estado_pago: "pendiente" | "aprobado" | "rechazado";
  estado_envio: "pendiente" | "en preparacion" | "despachado" | "entregado" | "cancelado";
  fecha_actualizacion: string;
};

export type SalesOrderItem = {
  producto_id: string;
  precio_unitario: number;
};

export type SalesOrder = OrderStatus & {
  comprador_id: string;
  clerk_user_id_comprador: string;
  items: SalesOrderItem[];
  producto_ids: string[];
  total: number;
  direccion_envio: string;
  fecha_creacion: string;
};

export type ShippingInfo = {
  envio_id: string;
  orden_id: string;
  codigo_seguimiento: string;
  empresa_logistica: string;
  estado: "pendiente" | "en preparacion" | "despachado" | "entregado" | "cancelado";
  historial_estados: Array<{
    estado: string;
    fecha: string;
    descripcion: string;
  }>;
};
