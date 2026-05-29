import { NextResponse } from "next/server";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer, updateBuyerProfile } from "@/lib/buyer-store";
import { adminBuyerUpdateSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const authContext = await getAuthContext();
  const { clerk_user_id_comprador } = await context.params;

  if (
    !canAccessAdmin(authContext) &&
    (!canAccessBuyerApp(authContext) || authContext.userId !== clerk_user_id_comprador)
  ) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const buyer = await getBuyer(clerk_user_id_comprador);
  if (!buyer) {
    return NextResponse.json({ error: "Comprador no encontrado." }, { status: 404 });
  }

  return NextResponse.json(buyer);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const authContext = await getAuthContext();
  const { clerk_user_id_comprador } = await context.params;

  if (
    !canAccessAdmin(authContext) &&
    (!canAccessBuyerApp(authContext) || authContext.userId !== clerk_user_id_comprador)
  ) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const existingBuyer = await getBuyer(clerk_user_id_comprador);

  if (!existingBuyer) {
    return NextResponse.json({ error: "Comprador no encontrado." }, { status: 404 });
  }

  if (!canAccessAdmin(authContext) && !existingBuyer.esta_activo) {
    return NextResponse.json({ error: "La cuenta esta desactivada." }, { status: 403 });
  }

  const parsed = adminBuyerUpdateSchema.safeParse({
    clerk_user_id_comprador,
    nombre_comprador: String(body?.nombre_comprador ?? ""),
    DNI: String(body?.DNI ?? ""),
    telefono: String(body?.telefono ?? ""),
    direccion_envio: String(body?.direccion_envio ?? "")
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de comprador invalidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const buyer = await updateBuyerProfile(parsed.data);
  return NextResponse.json(buyer);
}
