import { z } from 'zod';

export const compradorSchema = z.object({
  nombreComprador: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  dni: z.string().optional(),
  telefono: z.string().optional(),
  direccionEnvio: z.string().min(5, 'Dirección muy corta'),
});

export const preferenciaSchema = z.object({
  tallesPreferidos: z.array(z.string()).optional(),
  categoriasPreferidas: z.array(z.string()).optional(),
  vendedoresPreferidos: z.array(z.string()).optional(),
});

export const itemCarritoSchema = z.object({
  productoId: z.string(),
  cantidad: z.number().min(1, 'Cantidad mínima es 1').max(100),
});

export const actualizarItemCarritoSchema = z.object({
  cantidad: z.number().min(1, 'Cantidad mínima es 1').max(100),
});

export const crearPedidoSchema = z.object({
  direccionEnvio: z.string().min(5, 'Dirección muy corta'),
  metodoPago: z.string(),
});

export type CompradorInput = z.infer<typeof compradorSchema>;
export type PreferenciaInput = z.infer<typeof preferenciaSchema>;
export type ItemCarritoInput = z.infer<typeof itemCarritoSchema>;
export type ActualizarItemCarritoInput = z.infer<typeof actualizarItemCarritoSchema>;
export type CrearPedidoInput = z.infer<typeof crearPedidoSchema>;

export const productoSchema = z.object({
  titulo: z.string().min(3, 'Título muy corto'),
  descripcion: z.string().optional(),
  precio: z.coerce.number().positive('Precio debe ser positivo'),
  imagenUrl: z.string().url('URL de imagen inválida').optional(),
  categoria: z.string().min(1, 'Categoría requerida'),
  talle: z.string().min(1, 'Talle requerido'),
  marca: z.string().min(1, 'Marca requerida'),
  estado: z.enum(['excelente', 'buen estado', 'regular']).optional(),
  stock: z.coerce.number().int().nonnegative('Stock no puede ser negativo').optional(),
  vendedorId: z.string().optional(),
});

export const actualizarPedidoSchema = z.object({
  estado: z.enum(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']),
});

export type ProductoInput = z.infer<typeof productoSchema>;
export type ActualizarPedidoInput = z.infer<typeof actualizarPedidoSchema>;

