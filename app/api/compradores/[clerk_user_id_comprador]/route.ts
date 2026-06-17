import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer, updateBuyerProfile } from "@/lib/buyer-store";
import { requireServiceApiKey } from "@/lib/service-api-key";
import { adminBuyerUpdateSchema } from "@/lib/validation";

function hasServiceAuthHeaders(request: Request) {
  return Boolean(request.headers.get("x-api-key") || request.headers.get("x-service-name"));
}

function readBuyerField(body: Record<string, unknown> | null, fields: string[]) {
  if (!body) {
    return undefined;
  }

  for (const field of fields) {
    if (field in body) {
      return body[field];
    }
  }

  return undefined;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const authContext = await getAuthContext();
  const { clerk_user_id_comprador } = await context.params;

  if (
    !canAccessAdmin(authContext) &&
    (!canAccessBuyerApp(authContext) || authContext.userId !== clerk_user_id_comprador)
  ) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const buyer = await getBuyer(clerk_user_id_comprador);
  if (!buyer) {
    return NextResponse.json({ error: "Comprador no encontrado." }, { status: 404 });
  }

  return NextResponse.json(buyer);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ clerk_user_id_comprador: string }> }
) {
  const { clerk_user_id_comprador } = await context.params;
  const controlPlaneAuthResponse = requireServiceApiKey(request, "control-plane");
  const isControlPlaneRequest = controlPlaneAuthResponse === null;

  if (!isControlPlaneRequest) {
    if (hasServiceAuthHeaders(request)) {
      return controlPlaneAuthResponse;
    }

    const authContext = await getAuthContext();
    if (
      !canAccessAdmin(authContext) &&
      (!canAccessBuyerApp(authContext) || authContext.userId !== clerk_user_id_comprador)
    ) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const existingBuyer = await getBuyer(clerk_user_id_comprador);

  if (!existingBuyer) {
    return NextResponse.json({ error: "Comprador no encontrado." }, { status: 404 });
  }

  if (!isControlPlaneRequest) {
    const authContext = await getAuthContext();
    if (!canAccessAdmin(authContext) && !existingBuyer.esta_activo) {
      return NextResponse.json({ error: "La cuenta esta desactivada." }, { status: 403 });
    }
  }

  const parsed = adminBuyerUpdateSchema.safeParse({
    clerk_user_id_comprador,
    nombre_comprador:
      readBuyerField(body, ["nombre_comprador", "nombre"]) ?? existingBuyer.nombre_comprador,
    DNI: readBuyerField(body, ["DNI", "dni"]) ?? existingBuyer.DNI,
    telefono: readBuyerField(body, ["telefono"]) ?? existingBuyer.telefono,
    direccion_envio:
      readBuyerField(body, ["direccion_envio", "direccionEnvio", "direccion"]) ??
      existingBuyer.direccion_envio
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de comprador invalidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const buyer = await updateBuyerProfile(parsed.data);
    revalidatePath("/admin");
    revalidatePath(`/admin/compradores/${clerk_user_id_comprador}`);

    return NextResponse.json(buyer);
  } catch (error) {
    if (error instanceof Error && error.message === "Comprador no encontrado.") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "No se pudo actualizar el comprador." }, { status: 500 });
  }
}
