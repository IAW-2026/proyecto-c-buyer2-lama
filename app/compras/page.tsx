import { PurchasesClient } from "@/components/PurchasesClient";
import { ButtonLink, Card, PageShell } from "@/components/ui";
import { getAuthContext } from "@/lib/auth";

export default async function PurchasesPage() {
  const authContext = await getAuthContext();

  return (
    <PageShell title="Mis compras" eyebrow="Seguimiento">
      {authContext.userId ? (
        <PurchasesClient buyerId={authContext.userId} />
      ) : (
        <Card>
          <p className="font-bold">Necesitas iniciar sesion para ver tus compras.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/sign-in">Iniciar sesion</ButtonLink>
            <ButtonLink href="/sign-up" className="bg-lama-cream text-lama-ink hover:bg-white">
              Registrarme
            </ButtonLink>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
