import { z } from "zod";

export const buyerSchema = z.object({
  clerk_user_id_comprador: z.string().min(3, "El ID de Clerk es obligatorio."),
  email: z.string().email("El email no tiene un formato valido."),
  nombre_comprador: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  DNI: z.string().min(7, "El DNI debe tener al menos 7 caracteres.").max(12),
  telefono: z.string().optional(),
  direccion_envio: z.string().min(6, "La direccion de envio es obligatoria.")
});

export const preferencesSchema = z.object({
  clerk_user_id_comprador: z.string().min(3),
  talles_preferidos: z.array(z.string().min(1)).default([]),
  categorias_preferidas: z.array(z.string().min(1)).default([]),
  vendedores_preferidos: z.array(z.string().min(1)).default([])
});

export const paymentSchema = z.object({
  producto_id: z.string().min(3),
  comprador: z.object({
    clerk_user_id_comprador: z.string().min(3),
    nombre: z.string().min(3),
    email: z.string().email(),
    direccion_envio: z.string().min(3)
  }),
  monto_producto: z.number().positive(),
  monto_envio: z.number().min(0),
  monto_total: z.number().positive(),
  metodo_pago_id: z.string().min(3)
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
