import { NextResponse } from "next/server";
import { getBuyer } from "@/lib/buyer-store";
import { CHECKOUT_SHIPPING_AMOUNT, getSalesOrderSellerId } from "@/lib/checkout";
import { ExternalApiError } from "@/lib/external-app-client";
import { getSalesOrderById } from "@/lib/order-service";
import { checkoutOrderParamsSchema, checkoutOrderResponseSchema } from "@/lib/validation";

function logCheckoutLookupError(stage: string, error: unknown) {
  if (error instanceof ExternalApiError) {
    console.error(`[api/ordenes/[orden_id]/checkout] ${stage}`, {
      status: error.status,
      body: error.body
    });
    return;
  }

  console.error(`[api/ordenes/[orden_id]/checkout] ${stage}`, error);
}

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

    const buyerId = order.clerk_user_id_comprador || order.comprador_id;

    if (!buyerId) {
      return NextResponse.json({ error: "La orden no tiene comprador asociado." }, { status: 422 });
    }

    const buyer = await getBuyer(buyerId);

    if (!buyer) {
      return NextResponse.json({ error: "Comprador no encontrado." }, { status: 404 });
    }

    if (!buyer.esta_activo) {
      return NextResponse.json({ error: "La cuenta esta desactivada." }, { status: 403 });
    }

    const sellerId = getSalesOrderSellerId(order);

    if (!sellerId) {
      return NextResponse.json(
        {
          error: "La orden no informa vendedor_id. Seller debe devolverlo en GET /api/ordenes-ventas/{orden_id}."
        },
        { status: 502 }
      );
    }

    const itemsTotal = order.items.reduce((sum, item) => sum + item.precio_unitario, 0);
    const productsTotal = order.total || itemsTotal;
    const response = checkoutOrderResponseSchema.parse({
      orden_id: order.orden_id,
      comprador: {
        comprador_id: buyerId,
        nombre: buyer.nombre_comprador,
        email: buyer.email
      },
      vendedor_id: sellerId,
      monto_producto: productsTotal,
      monto_envio: CHECKOUT_SHIPPING_AMOUNT,
      monto_total: productsTotal + CHECKOUT_SHIPPING_AMOUNT
    });

    return NextResponse.json(response);
  } catch (error) {
    logCheckoutLookupError("No se pudo consultar la orden para checkout.", error);
    return NextResponse.json({ error: "No se pudo consultar la orden para checkout." }, { status: 502 });
  }
}
