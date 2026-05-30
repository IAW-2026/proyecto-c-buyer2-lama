import { NextResponse } from "next/server";
import { getProductById } from "@/lib/seller-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ producto_id: string }> }
) {
  const { producto_id } = await context.params;

  try {
    const product = await getProductById(producto_id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "No se pudo obtener el producto." }, { status: 502 });
  }
}
