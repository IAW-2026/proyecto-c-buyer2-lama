import { NextResponse } from "next/server";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer, upsertBuyer } from "@/lib/buyer-store";
import { buyerSchema } from "@/lib/validation";

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
  const parsed = buyerSchema.safeParse({ ...body, clerk_user_id_comprador });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de comprador invalidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const buyer = await upsertBuyer(parsed.data);
  return NextResponse.json(buyer);
}
