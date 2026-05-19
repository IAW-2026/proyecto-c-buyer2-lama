import { NextResponse } from "next/server";
import { getSalesOrderStatus } from "@/lib/order-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orden_id: string }> }
) {
  const { orden_id } = await context.params;
  const order = await getSalesOrderStatus(orden_id);

  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 });
  }

  return NextResponse.json({
    orden_id: order.orden_id,
    estado_general: order.estado_general,
    estado_pago: order.estado_pago,
    estado_envio: order.estado_envio,
    fecha_actualizacion: order.fecha_actualizacion
  });
}
