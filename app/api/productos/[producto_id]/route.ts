import { NextResponse } from "next/server";
import { getProductById } from "@/lib/mock-external";

export async function GET(
  _request: Request,
  context: { params: Promise<{ producto_id: string }> }
) {
  const { producto_id } = await context.params;
  const product = getProductById(producto_id);

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  return NextResponse.json(product);
}

