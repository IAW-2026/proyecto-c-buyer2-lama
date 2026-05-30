import { NextResponse } from "next/server";
import { getCatalogProducts, normalizeProductSort } from "@/lib/seller-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? searchParams.get("page_size") ?? 6), 1), 20);
  const categoria = searchParams.get("categoria") ?? searchParams.get("categoria_id");
  const vendedor = searchParams.get("vendedor_id") ?? searchParams.get("clerk_user_id_vendedor");
  const talle = searchParams.get("talle");
  const genero = searchParams.get("genero");
  const sort = normalizeProductSort(searchParams.get("sort"));

  try {
    const catalog = await getCatalogProducts({
      search,
      categoria,
      vendedor,
      talle,
      genero,
      sort,
      page,
      pageSize,
      semanticSearch: true
    });
    return NextResponse.json(catalog);
  } catch {
    return NextResponse.json({ error: "No se pudo obtener el catalogo." }, { status: 502 });
  }
}
