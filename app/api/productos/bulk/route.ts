import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/seller-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json({ items: [] });
  }

  try {
    const products = await getProductsByIds(ids);
    return NextResponse.json({ items: products });
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los productos." }, { status: 502 });
  }
}
