import { NextResponse } from "next/server";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { createPayment } from "@/lib/payment-service";
import { createSalesOrder } from "@/lib/order-service";
import { getProductsByIds } from "@/lib/seller-service";
import { paymentSchema } from "@/lib/validation";

function createOrderId() {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  const authContext = await getAuthContext();
  if (!authContext.userId) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para pagar." }, { status: 401 });
  }

  if (!canAccessBuyerApp(authContext)) {
    return NextResponse.json({ error: "Necesitas rol comprador para pagar." }, { status: 403 });
  }

  const currentBuyer = await getBuyer(authContext.userId);
  if (currentBuyer && !currentBuyer.esta_activo) {
    return NextResponse.json({ error: "La cuenta esta desactivada." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = paymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de pago invalidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (authContext.userId !== data.comprador.clerk_user_id_comprador) {
    return NextResponse.json({ error: "El comprador no coincide con la sesion." }, { status: 403 });
  }

  const productIds = data.producto_ids;
  const products = await getProductsByIds(productIds).catch(() => null);

  if (!products) {
    return NextResponse.json({ error: "No se pudieron validar los productos." }, { status: 502 });
  }

  const foundProductIds = new Set(products.map((product) => product.producto_id));

  if (
    products.length !== new Set(productIds).size ||
    productIds.some((productId) => !foundProductIds.has(productId)) ||
    products.some((product) => product.estado_publicacion !== "activa")
  ) {
    return NextResponse.json({ error: "Producto no disponible." }, { status: 422 });
  }

  const sellerId = products[0]?.clerk_user_id_vendedor;
  const allProductsBelongToSameSeller = products.every(
    (product) => product.clerk_user_id_vendedor === sellerId
  );

  if (!sellerId || !allProductsBelongToSameSeller) {
    return NextResponse.json({ error: "Los productos del carrito deben pertenecer al mismo vendedor." }, { status: 422 });
  }

  const productsTotal = products.reduce((sum, product) => sum + product.precio, 0);

  if (data.monto_producto !== productsTotal || data.monto_total !== productsTotal + data.monto_envio) {
    return NextResponse.json({ error: "Los montos de la compra no coinciden con el producto." }, { status: 422 });
  }

  try {
    const order = await createSalesOrder({
      ordenId: createOrderId(),
      clerkUserId: data.comprador.clerk_user_id_comprador,
      items: products.map((product) => ({
        producto_id: product.producto_id,
        precio_unitario: product.precio
      })),
      precioTotal: data.monto_producto,
      direccionEnvio: data.comprador.direccion_envio
    });

    await createPayment({
      ordenId: order.orden_id,
      comprador: {
        clerk_user_id_comprador: data.comprador.clerk_user_id_comprador,
        nombre: data.comprador.nombre,
        email: data.comprador.email
      },
      vendedorId: sellerId,
      montoProducto: data.monto_producto,
      montoEnvio: data.monto_envio,
      montoTotal: data.monto_total
    });

    const now = new Date().toISOString();

    return NextResponse.json(
      {
        orden_id: order.orden_id,
        producto_ids: productIds,
        monto_total: data.monto_total,
        estado_general: order.estado_general ?? "pendiente de pago",
        estado_pago: order.estado_pago ?? "pendiente",
        estado_envio: order.estado_envio ?? "pendiente",
        fecha_creacion: order.fecha_creacion ?? now,
        fecha_actualizacion: order.fecha_actualizacion ?? order.fecha_creacion ?? now
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "No se pudo crear la orden o procesar el pago." }, { status: 502 });
  }
}
