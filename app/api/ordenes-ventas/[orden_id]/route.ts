import { NextResponse } from "next/server";
import { resolveSalesOrderSellerId } from "@/lib/checkout";
import { getSalesOrderById } from "@/lib/order-service";
import { checkoutOrderParamsSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orden_id: string }> }
) {
  const params = checkoutOrderParamsSchema.safeParse(await context.params);

  if (!params.success) {
    return NextResponse.json(
      { error: "Orden invalida.", issues: params.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { orden_id } = params.data;

  try {
    const order = await getSalesOrderById(orden_id);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 });
    }

    const sellerId = resolveSalesOrderSellerId(order);

    return NextResponse.json({
      ...order,
      ...(sellerId
        ? {
            vendedor_id: order.vendedor_id ?? sellerId,
            clerk_user_id_vendedor: order.clerk_user_id_vendedor ?? sellerId
          }
        : {})
    });
  } catch {
    return NextResponse.json({ error: "No se pudo obtener la orden." }, { status: 502 });
  }
}
