import { NextResponse } from "next/server";
import { getBuyer } from "@/lib/buyer-store";
import { CHECKOUT_SHIPPING_AMOUNT, getSalesOrderSellerId } from "@/lib/checkout";
import { ExternalApiError } from "@/lib/external-app-client";
import { enrichSalesOrderItems, getSalesOrderById } from "@/lib/order-service";
import { requireAnyServiceApiKey } from "@/lib/service-api-key";
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
  request: Request,
  context: { params: Promise<{ orden_id: string }> }
) {
  const unauthorizedResponse = requireAnyServiceApiKey(request, ["payments", "control-plane"]);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

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

    const orderWithItems = await enrichSalesOrderItems(order);
    const sellerId = getSalesOrderSellerId(orderWithItems);

    if (!sellerId) {
      return NextResponse.json(
        {
          error: "La orden no informa vendedor_id. Seller debe devolverlo en GET /api/ordenes-ventas/{orden_id}."
        },
        { status: 502 }
      );
    }

    const itemsTotal = orderWithItems.items.reduce((sum, item) => sum + item.precio_unitario, 0);
    const productsTotal = orderWithItems.total || itemsTotal;
    const response = checkoutOrderResponseSchema.parse({
      orden_id: orderWithItems.orden_id,
      comprador: {
        comprador_id: buyerId,
        nombre: buyer.nombre_comprador,
        email: buyer.email
      },
      vendedor_id: sellerId,
      items: orderWithItems.items.map((item) => ({
        producto_id: item.producto_id,
        precio_unitario: item.precio_unitario,
        titulo: item.titulo ?? "",
        imagenes: item.imagenes ?? []
      })),
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
