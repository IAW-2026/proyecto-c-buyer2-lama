import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/mock-external";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? 6), 1), 20);
  const categoria = searchParams.get("categoria");
  const talle = searchParams.get("talle");

  return NextResponse.json(getCatalogProducts({ search, categoria, talle, page, pageSize }));
}
