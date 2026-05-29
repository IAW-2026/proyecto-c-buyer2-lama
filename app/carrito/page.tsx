import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CartClient } from "@/components/CartClient";
import { ButtonLink, Card, PageShell } from "@/components/ui";
import { canAccessBuyerApp } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { fetchInternalApi } from "@/lib/external-client";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
import type { PaymentMethod } from "@/lib/types";

export default async function CartPage() {
  const authContext = await getBuyerRouteAuthContext();
  const hasBuyerRole = canAccessBuyerApp(authContext);

  if (authContext.userId && authContext.roles.length === 0) {
    redirect("/onboarding/buyer");
  }

  const methods = authContext.userId && hasBuyerRole ? await fetchInternalApi<PaymentMethod[]>("/api/metodos-pago") : [];
  const buyerProfile = authContext.userId && hasBuyerRole ? await getBuyer(authContext.userId) : null;

  return (
    <PageShell
      title="Mi carrito"
      eyebrow="Productos guardados"
      titleClassName="font-display"
      actions={
        <ButtonLink href="/productos" className="bg-lama-card text-lama-ink hover:bg-lama-cream">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </ButtonLink>
      }
    >
      {authContext.userId && authContext.email && hasBuyerRole ? (
        <CartClient
          methods={methods}
          buyer={{
            clerk_user_id_comprador: authContext.userId,
            nombre: buyerProfile?.nombre_comprador ?? authContext.name ?? "",
            email: authContext.email,
            DNI: buyerProfile?.DNI ?? "",
            direccion_envio: buyerProfile?.direccion_envio ?? ""
          }}
        />
      ) : authContext.userId ? (
        <Card>
          <p className="font-bold">Este usuario ya tiene otro rol asignado y no puede acceder al carrito de comprador.</p>
        </Card>
      ) : (
        <Card>
          <p className="font-bold">Necesitas iniciar sesion para ver tu carrito.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/sign-in">Iniciar sesion</ButtonLink>
            <ButtonLink href="/sign-up" className="bg-lama-cream text-lama-ink hover:bg-lama-card">
              Registrarme
            </ButtonLink>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
