import { z } from "zod";

export const buyerSchema = z.object({
  clerk_user_id_comprador: z.string().min(3, "El ID de Clerk es obligatorio."),
  email: z.string().email("El email no tiene un formato valido."),
  nombre_comprador: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  DNI: z.string().min(7, "El DNI debe tener al menos 7 caracteres.").max(12),
  telefono: z.string().optional(),
  direccion_envio: z.string().min(6, "La direccion de envio es obligatoria.")
});

function nullableText(schema: z.ZodString) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }, schema.nullable());
}

export const adminBuyerUpdateSchema = z.object({
  clerk_user_id_comprador: z.string().min(3, "El ID de Clerk es obligatorio."),
  nombre_comprador: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres."),
  DNI: nullableText(z.string().min(7, "El DNI debe tener al menos 7 caracteres.").max(12)),
  telefono: nullableText(z.string().max(30, "El telefono es demasiado largo.")),
  direccion_envio: nullableText(z.string().min(6, "La direccion debe tener al menos 6 caracteres."))
});

export const preferencesSchema = z.object({
  clerk_user_id_comprador: z.string().min(3),
  talles_preferidos: z.array(z.string().min(1)).default([]),
  categorias_preferidas: z.array(z.string().min(1)).default([]),
  vendedores_preferidos: z.array(z.string().min(1)).default([])
});

export const paymentSchema = z.object({
  producto_ids: z.array(z.string().min(3)).min(1),
  comprador: z.object({
    clerk_user_id_comprador: z.string().min(3),
    nombre: z.string().min(3),
    email: z.string().email(),
    direccion_envio: z.string().min(3)
  }),
  monto_producto: z.number().positive(),
  monto_envio: z.number().min(0),
  monto_total: z.number().positive()
}).refine((data) => data.monto_total === data.monto_producto + data.monto_envio, {
  message: "El monto total no coincide con producto mas envio.",
  path: ["monto_total"]
});

export const checkoutOrderParamsSchema = z.object({
  orden_id: z.string().min(3)
});

const checkoutOrderItemResponseSchema = z.object({
  producto_id: z.string().min(3),
  precio_unitario: z.number().min(0),
  titulo: z.string(),
  imagenes: z.array(z.string())
});

export const checkoutOrderResponseSchema = z.object({
  orden_id: z.string().min(3),
  comprador: z.object({
    comprador_id: z.string().min(3),
    nombre: z.string().min(1),
    email: z.string().email()
  }),
  vendedor_id: z.string().min(3),
  items: z.array(checkoutOrderItemResponseSchema).min(1),
  monto_producto: z.number().min(0),
  monto_envio: z.number().min(0),
  monto_total: z.number().min(0)
}).refine((data) => data.monto_total === data.monto_producto + data.monto_envio, {
  message: "El monto total no coincide con producto mas envio.",
  path: ["monto_total"]
});

export function splitFormList(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
