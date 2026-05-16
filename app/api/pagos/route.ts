import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { createOrder, getProductById, paymentMethods } from "@/lib/mock-external";
import { paymentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authContext = await getAuthContext();
  if (!authContext.userId) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para pagar." }, { status: 401 });
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

  const method = paymentMethods.find(
    (item) => item.metodo_pago_id === data.metodo_pago_id && item.esta_activo
  );

  if (!method) {
    return NextResponse.json({ error: "Metodo de pago no disponible." }, { status: 422 });
  }

  const product = getProductById(data.producto_id);
  if (!product || product.estado_publicacion !== "activa") {
    return NextResponse.json({ error: "Producto no disponible." }, { status: 422 });
  }

  if (data.monto_producto !== product.precio || data.monto_total !== product.precio + data.monto_envio) {
    return NextResponse.json({ error: "Los montos de la compra no coinciden con el producto." }, { status: 422 });
  }

  const order = createOrder({
    clerkUserId: data.comprador.clerk_user_id_comprador,
    productoId: product.producto_id,
    total: data.monto_total,
    direccionEnvio: data.comprador.direccion_envio
  });

  return NextResponse.json(
    {
      pago_id: `pago_${Date.now()}`,
      orden_id: order.orden_id,
      nro_orden: order.nro_orden,
      monto_total: data.monto_total,
      metodo_pago_id: data.metodo_pago_id,
      estado_pago: "aprobado",
      fecha_creacion: new Date().toISOString()
    },
    { status: 201 }
  );
}
