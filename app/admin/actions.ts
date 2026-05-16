"use server";

import { revalidatePath } from "next/cache";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { upsertBuyer, upsertPreferences } from "@/lib/buyer-store";
import { buyerSchema, preferencesSchema, splitFormList } from "@/lib/validation";

export type AdminFormState = {
  ok: boolean;
  message: string;
};

export async function saveAdminBuyer(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    return { ok: false, message: "No autorizado." };
  }

  const buyer = buyerSchema.safeParse({
    clerk_user_id_comprador: String(formData.get("clerk_user_id_comprador") ?? ""),
    email: String(formData.get("email") ?? ""),
    nombre_comprador: String(formData.get("nombre_comprador") ?? ""),
    DNI: String(formData.get("DNI") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    direccion_envio: String(formData.get("direccion_envio") ?? "")
  });

  if (!buyer.success) {
    return { ok: false, message: buyer.error.issues[0]?.message ?? "Datos invalidos." };
  }

  const preferences = preferencesSchema.safeParse({
    clerk_user_id_comprador: buyer.data.clerk_user_id_comprador,
    talles_preferidos: splitFormList(formData.get("talles_preferidos")),
    categorias_preferidas: splitFormList(formData.get("categorias_preferidas")),
    vendedores_preferidos: splitFormList(formData.get("vendedores_preferidos"))
  });

  if (!preferences.success) {
    return { ok: false, message: preferences.error.issues[0]?.message ?? "Preferencias invalidas." };
  }

  await upsertBuyer(buyer.data);
  await upsertPreferences(preferences.data);
  revalidatePath("/admin");
  return { ok: true, message: "Comprador guardado en Buyer App." };
}

