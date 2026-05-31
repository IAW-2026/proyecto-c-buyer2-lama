"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageCheck, Truck } from "lucide-react";
import { ProductMini } from "@/components/ProductCard";
import { Card, EmptyState, LoadingState, StatusBadge } from "@/components/ui";
import type { OrderStatus, Product, ShippingInfo } from "@/lib/types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

type PurchasesResponse =
  | Purchase[]
  | {
      items?: Purchase[];
    };

type Purchase = {
  orden_id: string;
  comprador_id?: string;
  clerk_user_id_comprador: string;
  total: number;
  direccion_envio: string;
  estado_general: OrderStatus["estado_general"];
  estado_pago: OrderStatus["estado_pago"];
  estado_envio: OrderStatus["estado_envio"];
  fecha_actualizacion: string;
  products: Product[];
  shipping?: ShippingInfo | null;
};

function normalizePurchasesResponse(response: PurchasesResponse) {
  return Array.isArray(response) ? response : response.items ?? [];
}

export function PurchasesClient({ buyerId }: { buyerId: string }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function enrichPurchase(purchase: Purchase): Promise<Purchase> {
      const [status, shipping] = await Promise.all([
        fetch(`/api/ordenes-ventas/${purchase.orden_id}/estado`, { cache: "no-store" })
          .then(async (response) => (response.ok ? ((await response.json()) as OrderStatus) : null))
          .catch(() => null),
        fetch(`/api/envios/orden/${purchase.orden_id}`, { cache: "no-store" })
          .then(async (response) => (response.ok ? ((await response.json()) as ShippingInfo) : null))
          .catch(() => null)
      ]);

      return {
        ...purchase,
        ...(status
          ? {
              estado_general: status.estado_general,
              estado_pago: status.estado_pago,
              estado_envio: status.estado_envio,
              fecha_actualizacion: status.fecha_actualizacion ?? purchase.fecha_actualizacion
            }
          : {}),
        shipping
      };
    }

    async function refreshPurchases() {
      let apiPurchases: Purchase[] = [];

      try {
        const response = await fetch("/api/ordenes-ventas", { cache: "no-store" });
        if (response.ok) {
          apiPurchases = normalizePurchasesResponse(await response.json());
        }
      } catch {
        apiPurchases = [];
      }

      setPurchases(await Promise.all(apiPurchases.map(enrichPurchase)));
      setIsLoaded(true);
    }

    refreshPurchases();
  }, [buyerId]);

  const buyerPurchases = useMemo(
    () =>
      purchases.filter(
        (purchase) => (purchase.comprador_id ?? purchase.clerk_user_id_comprador) === buyerId
      ),
    [buyerId, purchases]
  );

  if (!isLoaded) {
    return <LoadingState text="Cargando compras..." />;
  }

  if (!buyerPurchases.length) {
    return (
      <EmptyState title="Todavia no hay compras" text="Cuando compres una prenda, la orden y el envio apareceran aca." />
    );
  }

  return (
    <div className="grid gap-5">
      {buyerPurchases.map((purchase) => (
        <Card key={purchase.orden_id}>
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold">Orden: {purchase.orden_id}</h2>
                <StatusBadge>{purchase.estado_general}</StatusBadge>
              </div>
              <div className="space-y-3">
                {purchase.products.map((product) => (
                  <ProductMini key={product.producto_id} product={product} />
                ))}
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-bold">Total</dt>
                  <dd>{currency.format(purchase.total)}</dd>
                </div>
                <div>
                  <dt className="font-bold">Direccion</dt>
                  <dd>{purchase.direccion_envio}</dd>
                </div>
                <div>
                  <dt className="font-bold">Actualizado</dt>
                  <dd>{new Date(purchase.fecha_actualizacion).toLocaleString("es-AR")}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-lama-line bg-lama-cream p-4">
              <div className="flex items-center gap-2 font-bold">
                <Truck className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                Envio
              </div>
              <p className="mt-2 text-sm font-bold">
                Empresa a cargo del envio: {purchase.shipping?.empresa_logistica ?? "Pendiente"}
              </p>
              {purchase.shipping?.codigo_seguimiento ? (
                <p className="text-sm font-semibold">
                  Codigo de Seguimiento: {purchase.shipping.codigo_seguimiento}
                </p>
              ) : null}
              <ol className="mt-4 space-y-3">
                {(purchase.shipping?.historial_estados?.length
                  ? purchase.shipping.historial_estados
                  : [{ estado: purchase.estado_envio, descripcion: "Envio pendiente de preparacion." }]
                ).map((item, index) => (
                  <li key={`${item.estado}-${index}`} className="text-sm">
                    <div className="flex items-center gap-2 font-bold">
                      <PackageCheck className="h-4 w-4 text-lama-detail" aria-hidden="true" />
                      {item.estado}
                    </div>
                    <p className="ml-6 text-lama-ink/75">{item.descripcion}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
