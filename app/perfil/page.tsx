import { redirect } from "next/navigation";
import { ProfileForms } from "@/components/ProfileForms";
import { Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { ensureBuyerRegistration, getBuyer } from "@/lib/buyer-store";
import type { BuyerWithPreferences } from "@/lib/types";

function emptyBuyer(userId: string, email: string | null, name: string | null): BuyerWithPreferences {
  return {
    clerk_user_id_comprador: userId,
    email: email ?? "",
    nombre_comprador: name ?? "",
    DNI: "",
    telefono: "",
    direccion_envio: "",
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    preferencias: null
  };
}

export default async function ProfilePage() {
  const authContext = await getAuthContext();

  if (authContext.userId && !canAccessBuyerApp(authContext)) {
    redirect("/onboarding/buyer");
  }

  if (!authContext.userId) {
    return (
      <PageShell title="Mi Perfil" eyebrow="Acceso">
        <Card>
          <p className="font-bold">Necesitas iniciar sesion con rol buyer o super_admin.</p>
        </Card>
      </PageShell>
    );
  }

  const buyer =
    (await getBuyer(authContext.userId)) ??
    (authContext.email
      ? await ensureBuyerRegistration({
          clerkUserId: authContext.userId,
          email: authContext.email,
          name: authContext.name
        })
      : emptyBuyer(authContext.userId, authContext.email, authContext.name));

  return (
    <PageShell title="Mi Perfil" eyebrow="Información personal y preferencias">
      <ProfileForms buyer={buyer} />
    </PageShell>
  );
}
