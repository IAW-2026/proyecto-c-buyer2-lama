import { NextResponse } from "next/server";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getSalesOrdersForBuyerList } from "@/lib/order-service";
import { getProductsByIds } from "@/lib/seller-service";

export async function GET(request: Request) {
  const authContext = await getAuthContext();

  if (!authContext.userId) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para ver tus compras." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedBuyerId =
    searchParams.get("comprador_id") ?? searchParams.get("clerk_user_id_comprador") ?? authContext.userId;
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? searchParams.get("page_size") ?? 20), 1), 50);
  const isOwnBuyerRequest = requestedBuyerId === authContext.userId;
  const isAdminRequest = canAccessAdmin(authContext);

  if (!isAdminRequest && (!isOwnBuyerRequest || !canAccessBuyerApp(authContext))) {
    return NextResponse.json({ error: "Necesitas rol comprador para ver tus compras." }, { status: 403 });
  }

  try {
    const orders = await getSalesOrdersForBuyerList(requestedBuyerId, { page, pageSize });
    const products = await getProductsByIds(orders.items.flatMap((order) => order.producto_ids));
    const productsById = new Map(products.map((product) => [product.producto_id, product]));

    return NextResponse.json({
      ...orders,
      items: orders.items.map((order) => ({
        ...order,
        products: order.producto_ids
          .map((productId) => productsById.get(productId))
          .filter((product) => product !== undefined)
      }))
    });
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener las compras." }, { status: 502 });
  }
}
