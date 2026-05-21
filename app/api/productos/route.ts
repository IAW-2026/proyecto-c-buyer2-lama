import { NextResponse } from "next/server";
import { getCatalogProducts, normalizeProductSort } from "@/lib/mock-external";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? 6), 1), 20);
  const categoria = searchParams.get("categoria");
  const talle = searchParams.get("talle");
  const sort = normalizeProductSort(searchParams.get("sort"));

  return NextResponse.json(getCatalogProducts({ search, categoria, talle, sort, page, pageSize }));
}
