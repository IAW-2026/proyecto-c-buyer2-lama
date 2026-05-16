import { NextResponse } from "next/server";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { getBuyer, upsertPreferences } from "@/lib/buyer-store";
import { preferencesSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const authContext = await getAuthContext();
  const { clerk_user_id_comprador } = await context.params;

  if (!canAccessAdmin(authContext) && authContext.userId !== clerk_user_id_comprador) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const buyer = await getBuyer(clerk_user_id_comprador);
  if (!buyer) {
    return NextResponse.json({ error: "Comprador no encontrado." }, { status: 404 });
  }

  return NextResponse.json(buyer.preferencias);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const authContext = await getAuthContext();
  const { clerk_user_id_comprador } = await context.params;

  if (!canAccessAdmin(authContext) && authContext.userId !== clerk_user_id_comprador) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = preferencesSchema.safeParse({ ...body, clerk_user_id_comprador });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Preferencias invalidas.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const preferences = await upsertPreferences(parsed.data);
  return NextResponse.json(preferences);
}

