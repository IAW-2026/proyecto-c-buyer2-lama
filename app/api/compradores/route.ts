import { NextResponse } from "next/server";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { listBuyers } from "@/lib/buyer-store";

export async function GET(request: Request) {
  const authContext = await getAuthContext();
  if (!canAccessAdmin(authContext)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? searchParams.get("page_size") ?? 20), 1), 25);

  try {
    const result = await listBuyers({
      search: searchParams.get("search") ?? "",
      estado: searchParams.get("estado") ?? "todos",
      page,
      pageSize
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los compradores." }, { status: 502 });
  }
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
