import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { removeFavoriteProduct } from "@/lib/favorites-store";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ producto_id: string }> }
) {
  const authContext = await getAuthContext();
  const { producto_id } = await context.params;

  if (!authContext.userId) {
    return NextResponse.json({ error: "Necesitas iniciar sesion para quitar favoritos." }, { status: 401 });
  }

  if (!canAccessBuyerApp(authContext)) {
    return NextResponse.json({ error: "Necesitas rol comprador para quitar favoritos." }, { status: 403 });
  }

  await removeFavoriteProduct(authContext.userId, producto_id);
  revalidatePath("/");
  revalidatePath("/favoritos");
  revalidatePath(`/productos/${producto_id}`);

  return NextResponse.json({ ok: true }, { status: 200 });
}
