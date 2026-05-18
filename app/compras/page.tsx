import { PackageCheck, Truck } from "lucide-react";
import { ProductMini } from "@/components/ProductCard";
import { Card, EmptyState, PageShell, StatusBadge } from "@/components/ui";
import { getAuthContext } from "@/lib/auth";
import { getOrdersForBuyer, getProductById, getShippingForOrder } from "@/lib/mock-external";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export default async function PurchasesPage() {
  const authContext = await getAuthContext();
  const orders = authContext.userId ? getOrdersForBuyer(authContext.userId) : [];
  const enrichedOrders = orders.map((order) => ({
    order,
    status: order,
    shipping: getShippingForOrder(order.orden_id),
    product: getProductById(order.producto_id)
  }));

  return (
    <PageShell title="Mis compras" eyebrow="Seguimiento">
      {enrichedOrders.length ? (
        <div className="grid gap-5">
          {enrichedOrders.map(({ order, status, shipping, product }) => (
            <Card key={order.orden_id}>
              <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold">Nro. Orden: {order.nro_orden}</h2>
                    <StatusBadge>{status.estado_general}</StatusBadge>
                    <StatusBadge>Pago {status.estado_pago}</StatusBadge>
                  </div>
                  {product ? <ProductMini product={product} /> : null}
                  <dl className="grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="font-bold">Total</dt>
                      <dd>{currency.format(order.total)}</dd>
                    </div>
                    <div>
                      <dt className="font-bold">Dirección</dt>
                      <dd>{order.direccion_envio}</dd>
                    </div>
                    <div>
                      <dt className="font-bold">Actualizado</dt>
                      <dd>{new Date(status.fecha_actualizacion).toLocaleString("es-AR")}</dd>
                    </div>
                  </dl>
                </div>

                {shipping ? (
                  <div className="rounded-lg border border-lama-line bg-lama-cream p-4">
                    <div className="flex items-center gap-2 font-bold">
                      <Truck className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                      Envio
                    </div>
                    <p className="mt-2 text-sm font-bold">Empresa a cargo del envio: {shipping.empresa_logistica}</p>
                    <p className="text-sm font-semibold">Código de Seguimiento: {shipping.codigo_seguimiento}</p>
                    <ol className="mt-4 space-y-3">
                      {shipping.historial_estados.map((event) => (
                        <li key={`${event.estado}-${event.fecha}`} className="text-sm">
                          <div className="flex items-center gap-2 font-bold">
                            <PackageCheck className="h-4 w-4 text-lama-detail" aria-hidden="true" />
                            {event.estado}
                          </div>
                          <p className="ml-6 text-lama-ink/75">{event.descripcion}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Todavía no hay compras" text="Cuando compres una prenda, la orden y el envio apareceran aca." />
      )}
    </PageShell>
  );
}
