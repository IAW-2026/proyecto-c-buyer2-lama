import { NextResponse } from "next/server";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import {
  enrichSalesOrderItems,
  getSalesOrderById,
  getSalesOrdersForBuyerList
} from "@/lib/order-service";
import type { SalesOrder } from "@/lib/types";

function hasDetailedItems(order: SalesOrder) {
  return order.items.length > 0 && order.items.every((item) => item.titulo && item.imagenes);
}

async function getOrderWithDetailedItems(order: SalesOrder) {
  const detailedOrder = hasDetailedItems(order)
    ? order
    : await getSalesOrderById(order.orden_id).catch(() => null);

  return enrichSalesOrderItems(detailedOrder ?? order);
}

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
    const items = await Promise.all(orders.items.map(getOrderWithDetailedItems));

    return NextResponse.json({
      ...orders,
      items
    });
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener las compras." }, { status: 502 });
  }
}
