import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PurchasesClient } from "@/components/PurchasesClient";
import { ButtonLink, Card, PageShell } from "@/components/ui";
import { canAccessBuyerApp } from "@/lib/auth";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";

export default async function PurchasesPage() {
  const authContext = await getBuyerRouteAuthContext();
  const hasBuyerRole = canAccessBuyerApp(authContext);

  if (authContext.userId && authContext.roles.length === 0) {
    redirect("/onboarding/buyer");
  }

  return (
    <PageShell
      title="Mis compras"
      eyebrow="Seguimiento"
      titleClassName="font-display"
      actions={
        <ButtonLink href="/productos" className="bg-lama-card text-lama-ink hover:bg-lama-cream">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </ButtonLink>
      }
    >
      {authContext.userId && hasBuyerRole ? (
        <PurchasesClient buyerId={authContext.userId} />
      ) : authContext.userId ? (
        <Card>
          <p className="font-bold">Este usuario ya tiene otro rol asignado y no puede acceder a compras de comprador.</p>
        </Card>
      ) : (
        <Card>
          <p className="font-bold">Necesitas iniciar sesión para ver tus compras.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/sign-in">Iniciar sesión</ButtonLink>
            <ButtonLink href="/sign-up" className="bg-lama-cream text-lama-ink hover:bg-lama-card">
              Registrarme
            </ButtonLink>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
