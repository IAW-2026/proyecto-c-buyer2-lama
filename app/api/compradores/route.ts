import { NextResponse } from "next/server";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { listBuyers } from "@/lib/buyer-store";

export async function GET(request: Request) {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const result = await listBuyers({
    search: searchParams.get("search") ?? "",
    estado: searchParams.get("estado") ?? "todos",
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 8)
  });

  return NextResponse.json(result);
}

export async function POST(_request: Request) {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  return NextResponse.json(
    { error: "Los compradores se crean desde Clerk/onboarding, no desde el admin." },
    { status: 405 }
  );
}
