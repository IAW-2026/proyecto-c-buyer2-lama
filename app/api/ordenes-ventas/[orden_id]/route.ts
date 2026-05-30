import { NextResponse } from "next/server";
import { getSalesOrderById } from "@/lib/order-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orden_id: string }> }
) {
  const { orden_id } = await context.params;

  try {
    const order = await getSalesOrderById(orden_id);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "No se pudo obtener la orden." }, { status: 502 });
  }
}
