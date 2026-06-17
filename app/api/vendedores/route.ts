import { NextResponse } from "next/server";
import { getSellersList } from "@/lib/seller-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? searchParams.get("page_size") ?? 20), 1), 50);

  try {
    const sellers = await getSellersList({ search, page, pageSize });
    return NextResponse.json(sellers);
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los vendedores." }, { status: 502 });
  }
}
