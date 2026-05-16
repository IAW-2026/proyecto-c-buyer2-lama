import { NextResponse } from "next/server";
import { getShippingForOrder } from "@/lib/mock-external";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orden_id: string }> }
) {
  const { orden_id } = await context.params;
  const shipping = getShippingForOrder(orden_id);

  if (!shipping) {
    return NextResponse.json({ error: "Envio no encontrado." }, { status: 404 });
  }

  return NextResponse.json(shipping);
}
