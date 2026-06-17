import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { setBuyerActive } from "@/lib/buyer-store";
import { requireServiceApiKey } from "@/lib/service-api-key";
import { buyerStatusUpdateSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const unauthorizedResponse = requireServiceApiKey(request, "control-plane");
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { clerk_user_id_comprador } = await context.params;
  if (!clerk_user_id_comprador || clerk_user_id_comprador.length < 3) {
    return NextResponse.json({ error: "Comprador invalido." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = buyerStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Estado de comprador invalido.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const buyer = await setBuyerActive(clerk_user_id_comprador, parsed.data.esta_activo);
    revalidatePath("/admin");
    revalidatePath(`/admin/compradores/${clerk_user_id_comprador}`);

    return NextResponse.json(buyer);
  } catch (error) {
    if (error instanceof Error && error.message === "Comprador no encontrado.") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "No se pudo actualizar el estado del comprador." }, { status: 500 });
  }
}
