import { NextResponse } from "next/server";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getProductById } from "@/lib/mock-external";
import { getSalesOrdersForBuyer } from "@/lib/order-service";

export async function GET() {
  const authContext = await getAuthContext();

  if (!authContext.userId) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para ver tus compras." }, { status: 401 });
  }

  if (!canAccessBuyerApp(authContext)) {
    return NextResponse.json({ error: "Necesitas rol comprador para ver tus compras." }, { status: 403 });
  }

  const orders = await getSalesOrdersForBuyer(authContext.userId);

  return NextResponse.json(
    orders.map((order) => ({
      ...order,
      products: order.producto_ids
        .map((productId) => getProductById(productId))
        .filter((product) => product !== undefined)
    }))
  );
}
