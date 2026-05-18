import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { upsertBuyer } from "@/lib/buyer-store";
import { buyerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authContext = await getAuthContext();

  if (!authContext.userId || !authContext.email) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para guardar tus datos." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = buyerSchema.safeParse({
    ...body,
    clerk_user_id_comprador: authContext.userId,
    email: authContext.email
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de facturacion invalidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const buyer = await upsertBuyer(parsed.data);
  return NextResponse.json(buyer, { status: 200 });
}
