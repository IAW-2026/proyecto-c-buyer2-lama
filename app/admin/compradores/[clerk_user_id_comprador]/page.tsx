import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Ban, Mail, MapPin, Pencil, Phone, RotateCcw, UserRound } from "lucide-react";
import { toggleBuyerStatus } from "@/app/admin/actions";
import { AdminPreferencesForm } from "@/components/AdminPreferencesForm";
import { ProductMini } from "@/components/ProductCard";
import { ButtonLink, Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { getSalesOrdersForBuyer } from "@/lib/order-service";
import { getCategories, getProductsByIds, getSellers } from "@/lib/seller-service";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(date));
}

export default async function AdminBuyerDetailPage({
  params
}: {
  params: Promise<{ clerk_user_id_comprador: string }>;
}) {
  const authContext = await getAuthContext();
  const { clerk_user_id_comprador } = await params;

  if (!canAccessAdmin(authContext)) {
    return (
      <PageShell title="Comprador" eyebrow="Acceso">
        <Card>
          <p className="font-bold">Necesitas rol super_admin para administrar la Buyer App.</p>
        </Card>
      </PageShell>
    );
  }

  const buyer = await getBuyer(clerk_user_id_comprador);

  if (!buyer) {
    notFound();
  }

  const [ordersFromSeller, categories, sellers] = await Promise.all([
    getSalesOrdersForBuyer(buyer.clerk_user_id_comprador),
    getCategories().catch(() => []),
    getSellers().catch(() => [])
  ]);
  const products = await getProductsByIds(ordersFromSeller.flatMap((order) => order.producto_ids)).catch(() => []);
  const productsById = new Map(products.map((product) => [product.producto_id, product]));
  const orders = ordersFromSeller.map((order) => ({
    ...order,
    products: order.producto_ids.map((productId) => productsById.get(productId)).filter(Boolean)
  }));

  return (
    <PageShell
      title={buyer.nombre_comprador}
      eyebrow="Detalle de comprador"
      titleClassName="font-display"
      actions={
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin" className="bg-lama-card text-lama-ink hover:bg-lama-cream">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </ButtonLink>
          <Link
            href={`/admin?edit=${buyer.clerk_user_id_comprador}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar
          </Link>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-lama-cream text-lama-detail">
                <UserRound className="h-6 w-6" aria-hidden="true" />
              </div>
              <StatusBadge
                className={
                  buyer.esta_activo
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
              >
                {buyer.esta_activo ? "Activa" : "Inactiva"}
              </StatusBadge>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-lama-detail" aria-hidden="true" />
                <div>
                  <dt className="font-bold">Email</dt>
                  <dd className="break-all text-lama-ink/70">{buyer.email}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-lama-detail" aria-hidden="true" />
                <div>
                  <dt className="font-bold">Telefono</dt>
                  <dd className="text-lama-ink/70">{buyer.telefono ?? "-"}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-lama-detail" aria-hidden="true" />
                <div>
                  <dt className="font-bold">Direccion</dt>
                  <dd className="text-lama-ink/70">{buyer.direccion_envio ?? "-"}</dd>
                </div>
              </div>
              <div>
                <dt className="font-bold">DNI</dt>
                <dd className="text-lama-ink/70">{buyer.DNI ?? "-"}</dd>
              </div>
              <div>
                <dt className="font-bold">Fecha creacion</dt>
                <dd className="text-lama-ink/70">{formatDate(buyer.fecha_creacion)}</dd>
              </div>
              {!buyer.esta_activo && buyer.fecha_desactivacion ? (
                <div>
                  <dt className="font-bold">Fecha desactivacion</dt>
                  <dd className="text-lama-ink/70">{formatDate(buyer.fecha_desactivacion)}</dd>
                </div>
              ) : null}
            </dl>

            <form action={toggleBuyerStatus} className="mt-6">
              <input type="hidden" name="clerk_user_id_comprador" value={buyer.clerk_user_id_comprador} />
              <input type="hidden" name="intent" value={buyer.esta_activo ? "deactivate" : "activate"} />
              <button
                className={
                  buyer.esta_activo
                    ? "inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                    : "inline-flex w-full items-center justify-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                }
              >
                {buyer.esta_activo ? (
                  <Ban className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                )}
                {buyer.esta_activo ? "Desactivar cuenta" : "Activar cuenta"}
              </button>
            </form>
          </Card>
        </aside>

        <div className="space-y-5">
          <AdminPreferencesForm
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

          <Card>
            <h2 className="text-xl font-bold">Compras</h2>
            {orders.length ? (
              <div className="mt-5 grid gap-4">
                {orders.map((order) => (
                  <article key={order.orden_id} className="rounded-lg border border-lama-line bg-lama-cream p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">Orden: {order.orden_id}</h3>
                        <p className="mt-1 text-sm text-lama-ink/65">{formatDate(order.fecha_creacion)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge>{order.estado_general}</StatusBadge>
                        <StatusBadge>{order.estado_envio}</StatusBadge>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {order.products.length ? (
                        order.products.map((product) => (
                          <ProductMini key={product!.producto_id} product={product!} />
                        ))
                      ) : (
                        <p className="text-sm font-semibold text-lama-ink/65">Productos no disponibles.</p>
                      )}
                    </div>

                    <dl className="mt-4 grid gap-3 border-t border-lama-line pt-4 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-bold">Total</dt>
                        <dd>{currency.format(order.total)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold">Pago</dt>
                        <dd>{order.estado_pago}</dd>
                      </div>
                      <div>
                        <dt className="font-bold">Direccion</dt>
                        <dd>{order.direccion_envio}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold text-lama-ink/65">Todavia no hay compras registradas.</p>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
