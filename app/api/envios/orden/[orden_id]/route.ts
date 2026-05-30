import { NextResponse } from "next/server";
import { getSalesOrderShipping } from "@/lib/order-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orden_id: string }> }
) {
  const { orden_id } = await context.params;

  try {
    const shipping = await getSalesOrderShipping(orden_id);

    if (!shipping) {
      return NextResponse.json({ error: "Envio no encontrado." }, { status: 404 });
    }

    return NextResponse.json(shipping);
  } catch {
    return NextResponse.json({ error: "No se pudo obtener el envio." }, { status: 502 });
  }
}
