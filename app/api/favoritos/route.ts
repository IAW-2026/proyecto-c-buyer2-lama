import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { ensureBuyerRegistration } from "@/lib/buyer-store";
import { addFavoriteProduct } from "@/lib/favorites-store";

export async function POST(request: Request) {
  const authContext = await getAuthContext();

  if (!authContext.userId || !authContext.email) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para guardar favoritos." }, { status: 401 });
  }

  if (!canAccessBuyerApp(authContext)) {
    return NextResponse.json({ error: "Necesitas rol comprador para guardar favoritos." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const productId = typeof body?.producto_id === "string" ? body.producto_id : "";

  if (!productId) {
    return NextResponse.json({ error: "Producto invalido." }, { status: 400 });
  }

  const buyer = await ensureBuyerRegistration({
    clerkUserId: authContext.userId,
    email: authContext.email,
    name: authContext.name
  });

  if (!buyer.esta_activo) {
    return NextResponse.json({ error: "La cuenta esta desactivada." }, { status: 403 });
  }

  try {
    const favorite = await addFavoriteProduct(authContext.userId, productId);
    revalidatePath("/");
    revalidatePath("/favoritos");
    revalidatePath(`/productos/${productId}`);
    return NextResponse.json(favorite, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos guardar el favorito.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
