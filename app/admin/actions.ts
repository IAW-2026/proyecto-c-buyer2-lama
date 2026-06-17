"use server";

import { revalidatePath } from "next/cache";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { setBuyerActive, updateBuyerProfile, upsertPreferences } from "@/lib/buyer-store";
import { syncBuyerStatusWithControlPlane } from "@/lib/control-plane-service";
import { adminBuyerUpdateSchema, preferencesSchema } from "@/lib/validation";

export type AdminFormState = {
  ok: boolean;
  message: string;
};

async function ensureAdmin() {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    throw new Error("No autorizado.");
  }
}

function formList(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function parseBuyerStatusIntent(intent: FormDataEntryValue | null) {
  if (intent === "activate") {
    return true;
  }

  if (intent === "deactivate") {
    return false;
  }

  throw new Error("Intent de estado invalido.");
}

export async function updateAdminBuyer(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, message: "No autorizado." };
  }

  const parsed = adminBuyerUpdateSchema.safeParse({
    clerk_user_id_comprador: String(formData.get("clerk_user_id_comprador") ?? ""),
    nombre_comprador: String(formData.get("nombre_comprador") ?? ""),
    DNI: String(formData.get("DNI") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    direccion_envio: String(formData.get("direccion_envio") ?? "")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }

  try {
    await updateBuyerProfile(parsed.data);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "No pudimos actualizar el comprador."
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/compradores/${parsed.data.clerk_user_id_comprador}`);
  return { ok: true, message: "Comprador actualizado." };
}

export async function toggleBuyerStatus(formData: FormData) {
  await ensureAdmin();

  const clerkUserId = String(formData.get("clerk_user_id_comprador") ?? "");
  const isActive = parseBuyerStatusIntent(formData.get("intent"));

  await setBuyerActive(clerkUserId, isActive);
  try {
    await syncBuyerStatusWithControlPlane(clerkUserId, isActive);
  } catch (error) {
    console.error("[control-plane] No se pudo sincronizar el estado del comprador.", error);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/compradores/${clerkUserId}`);
}

export async function saveAdminPreferences(
  _state: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, message: "No autorizado." };
  }

  const clerkUserId = String(formData.get("clerk_user_id_comprador") ?? "");
  const shouldClearPreferences = formData.get("intent") === "clear";
  const preferences = preferencesSchema.safeParse({
    clerk_user_id_comprador: clerkUserId,
    talles_preferidos: shouldClearPreferences ? [] : formList(formData, "talles_preferidos"),
    categorias_preferidas: shouldClearPreferences ? [] : formList(formData, "categorias_preferidas"),
    vendedores_preferidos: shouldClearPreferences ? [] : formList(formData, "vendedores_preferidos")
  });

  if (!preferences.success) {
    return { ok: false, message: preferences.error.issues[0]?.message ?? "Preferencias invalidas." };
  }

  await upsertPreferences(preferences.data);
  revalidatePath("/admin");
  revalidatePath(`/admin/compradores/${clerkUserId}`);
  return { ok: true, message: "Preferencias actualizadas." };
}
