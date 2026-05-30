import { NextResponse } from "next/server";
import { getCategories } from "@/lib/seller-service";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ items: categories });
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener las categorias." }, { status: 502 });
  }
}
