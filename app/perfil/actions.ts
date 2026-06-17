"use server";

import { revalidatePath } from "next/cache";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer, upsertBuyer, upsertPreferences } from "@/lib/buyer-store";
import { buyerSchema, preferencesSchema } from "@/lib/validation";

export type FormState = {
  ok: boolean;
  message: string;
};

function formList(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

export async function saveProfile(_state: FormState, formData: FormData): Promise<FormState> {
  const authContext = await getAuthContext();
  const clerkUserId = String(formData.get("clerk_user_id_comprador") ?? authContext.userId ?? "");

  if (!authContext.userId || !canAccessBuyerApp(authContext)) {
    return { ok: false, message: "Necesitas iniciar sesion para guardar el perfil." };
  }

  if (!canAccessAdmin(authContext) && clerkUserId !== authContext.userId) {
    return { ok: false, message: "No tenes permisos para editar este perfil." };
  }

  const currentBuyer = await getBuyer(clerkUserId);
  if (currentBuyer && !currentBuyer.esta_activo) {
    return { ok: false, message: "La cuenta esta desactivada." };
  }

  const parsed = buyerSchema.safeParse({
    clerk_user_id_comprador: clerkUserId,
    email: authContext.email ?? String(formData.get("email") ?? ""),
    nombre_comprador: String(formData.get("nombre_comprador") ?? ""),
    DNI: String(formData.get("DNI") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    direccion_envio: String(formData.get("direccion_envio") ?? "")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }

  await upsertBuyer(parsed.data);
  revalidatePath("/perfil");
  revalidatePath("/admin");
  return { ok: true, message: "Perfil guardado correctamente." };
}

export async function savePreferences(_state: FormState, formData: FormData): Promise<FormState> {
  const authContext = await getAuthContext();
  const clerkUserId = String(formData.get("clerk_user_id_comprador") ?? authContext.userId ?? "");
  const shouldClearPreferences = formData.get("intent") === "clear";

  if (!authContext.userId || !canAccessBuyerApp(authContext)) {
    return { ok: false, message: "Necesitas iniciar sesion para guardar preferencias." };
  }

  if (!canAccessAdmin(authContext) && clerkUserId !== authContext.userId) {
    return { ok: false, message: "No tenes permisos para editar estas preferencias." };
  }

  const currentBuyer = await getBuyer(clerkUserId);
  if (currentBuyer && !currentBuyer.esta_activo) {
    return { ok: false, message: "La cuenta esta desactivada." };
  }

  const parsed = preferencesSchema.safeParse({
    clerk_user_id_comprador: clerkUserId,
    talles_preferidos: shouldClearPreferences ? [] : formList(formData, "talles_preferidos"),
    categorias_preferidas: shouldClearPreferences ? [] : formList(formData, "categorias_preferidas"),
    vendedores_preferidos: shouldClearPreferences ? [] : formList(formData, "vendedores_preferidos")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Preferencias invalidas." };
  }

  await upsertPreferences(parsed.data);
  revalidatePath("/perfil");
  revalidatePath("/admin");
  return {
    ok: true,
    message: shouldClearPreferences ? "Preferencias limpiadas correctamente." : "Preferencias guardadas correctamente."
  };
}
