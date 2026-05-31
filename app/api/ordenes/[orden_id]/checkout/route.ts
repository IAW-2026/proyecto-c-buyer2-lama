import { NextResponse } from "next/server";
import { getBuyer } from "@/lib/buyer-store";
import { CHECKOUT_SHIPPING_AMOUNT } from "@/lib/checkout";
import { ExternalApiError } from "@/lib/external-app-client";
import { getSalesOrderById } from "@/lib/order-service";
import { getProductsByIds } from "@/lib/seller-service";
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

    const productIds = order.producto_ids.length
      ? order.producto_ids
      : order.items.map((item) => item.producto_id);
    const products = await getProductsByIds(productIds);
    const foundProductIds = new Set(products.map((product) => product.producto_id));

    if (
      products.length !== new Set(productIds).size ||
      productIds.some((productId) => !foundProductIds.has(productId))
    ) {
      return NextResponse.json({ error: "No se pudieron validar los productos de la orden." }, { status: 502 });
    }

    const sellerId = products[0]?.clerk_user_id_vendedor;
    const allProductsBelongToSameSeller = products.every(
      (product) => product.clerk_user_id_vendedor === sellerId
    );

    if (!sellerId || !allProductsBelongToSameSeller) {
      return NextResponse.json({ error: "La orden contiene productos de distintos vendedores." }, { status: 422 });
    }

    const productsTotal = order.total || products.reduce((sum, product) => sum + product.precio, 0);
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
