export type Buyer = {
  clerk_user_id_comprador: string;
  email: string;
  nombre_comprador: string;
  DNI: string | null;
  telefono: string | null;
  direccion_envio: string | null;
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

export type Product = {
  producto_id: string;
  clerk_user_id_vendedor: string;
  categoria_id: string;
  imagenes: string[];
  titulo: string;
  descripcion: string;
  precio: number;
  estado_prenda: string;
  talle: string;
  marca: string;
  estado_publicacion: "activa" | "inactiva" | "vendida";
  fecha_creacion: string;
};

export type OrderStatus = {
  orden_id: string;
  estado_general: "pendiente de pago" | "pagada" | "en preparacion" | "enviada" | "cancelada";
  estado_pago: "pendiente" | "aprobado" | "rechazado";
  estado_envio: "pendiente" | "en preparacion" | "despachado" | "entregado" | "cancelado";
  fecha_actualizacion: string;
};

export type SalesOrder = OrderStatus & {
  nro_orden: string;
  clerk_user_id_comprador: string;
  producto_id: string;
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

export type PaymentMethod = {
  metodo_pago_id: string;
  metodo_pago: string;
  descripcion: string;
  esta_activo: boolean;
};
