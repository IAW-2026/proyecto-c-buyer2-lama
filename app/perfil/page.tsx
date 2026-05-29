import { redirect } from "next/navigation";
import { ProfileForms } from "@/components/ProfileForms";
import { Card, PageShell } from "@/components/ui";
import { canAccessBuyerApp } from "@/lib/auth";
import { ensureBuyerRegistration, getBuyer } from "@/lib/buyer-store";
import { categories, sellers } from "@/lib/mock-external";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
import type { BuyerWithPreferences } from "@/lib/types";

function emptyBuyer(userId: string, email: string | null, name: string | null): BuyerWithPreferences {
  return {
    clerk_user_id_comprador: userId,
    email: email ?? "",
    nombre_comprador: name ?? "",
    DNI: "",
    telefono: "",
    direccion_envio: "",
    esta_activo: true,
    fecha_desactivacion: null,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    preferencias: null
  };
}

export default async function ProfilePage() {
  const authContext = await getBuyerRouteAuthContext();

  if (authContext.userId && authContext.roles.length === 0) {
    redirect("/onboarding/buyer");
  }

  if (!authContext.userId) {
    return (
      <PageShell title="Mi Perfil" eyebrow="Acceso">
        <Card>
          <p className="font-bold">Necesitas iniciar sesion con rol comprador.</p>
        </Card>
      </PageShell>
    );
  }

  if (!canAccessBuyerApp(authContext)) {
    return (
      <PageShell title="Mi Perfil" eyebrow="Acceso">
        <Card>
          <p className="font-bold">Este usuario ya tiene otro rol asignado y no puede acceder como comprador.</p>
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

  if (!buyer.esta_activo) {
    return (
      <PageShell title="Mi Perfil" eyebrow="Informacion personal y preferencias">
        <Card>
          <p className="font-bold">Tu cuenta esta desactivada.</p>
          <p className="mt-2 text-sm text-lama-ink/70">
            No podes editar el perfil, guardar favoritos ni realizar compras hasta que un administrador la active.
          </p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell title="Mi Perfil" eyebrow="Informacion personal y preferencias">
      <ProfileForms
        buyer={buyer}
        categoryOptions={categories.map((category) => ({
          id: category.categoria_producto_id,
          label: category.nombre
        }))}
        sellerOptions={sellers.map((seller) => ({
          id: seller.clerk_user_id_vendedor,
          label: seller.nombre_vendedor
        }))}
      />
    </PageShell>
  );
}
