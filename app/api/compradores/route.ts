import { NextResponse } from "next/server";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { listBuyers, upsertBuyer } from "@/lib/buyer-store";
import { buyerSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const result = await listBuyers({
    search: searchParams.get("search") ?? "",
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 8)
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = buyerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de comprador invalidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const buyer = await upsertBuyer(parsed.data);
  return NextResponse.json(buyer, { status: 201 });
}

