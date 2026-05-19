import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getProductById } from "@/lib/mock-external";
import { getSalesOrdersForBuyer } from "@/lib/order-service";

export async function GET() {
  const authContext = await getAuthContext();

  if (!authContext.userId) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para ver tus compras." }, { status: 401 });
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
