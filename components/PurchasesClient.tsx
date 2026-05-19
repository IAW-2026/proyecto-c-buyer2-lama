"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageCheck, Truck } from "lucide-react";
import { ProductMini } from "@/components/ProductCard";
import { Card, EmptyState, StatusBadge } from "@/components/ui";
import { readPurchases, type StoredPurchase } from "@/lib/purchases-storage";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function PurchasesClient({ buyerId }: { buyerId: string }) {
  const [purchases, setPurchases] = useState<StoredPurchase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function mergePurchases(items: StoredPurchase[]) {
      return [...new Map(items.map((purchase) => [purchase.orden_id, purchase])).values()];
    }

    async function refreshPurchases() {
      const localPurchases = readPurchases();
      let apiPurchases: StoredPurchase[] = [];

      try {
        const response = await fetch("/api/ordenes-ventas", { cache: "no-store" });
        if (response.ok) {
          apiPurchases = await response.json();
        }
      } catch {
        apiPurchases = [];
      }

      setPurchases(mergePurchases([...localPurchases, ...apiPurchases]));
      setIsLoaded(true);
    }

    refreshPurchases();
    window.addEventListener("storage", refreshPurchases);
    window.addEventListener("lama-purchases-updated", refreshPurchases);

    return () => {
      window.removeEventListener("storage", refreshPurchases);
      window.removeEventListener("lama-purchases-updated", refreshPurchases);
    };
  }, []);

  const buyerPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.clerk_user_id_comprador === buyerId),
    [buyerId, purchases]
  );

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-lama-line bg-lama-card p-8 text-center shadow-soft">
        <p className="font-bold">Cargando compras...</p>
      </div>
    );
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
                <h2 className="text-xl font-bold">Nro. Orden: {purchase.nro_orden}</h2>
                <StatusBadge>{purchase.estado_general}</StatusBadge>
                <StatusBadge>Pago {purchase.estado_pago}</StatusBadge>
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
              <p className="mt-2 text-sm font-bold">Empresa a cargo del envio: lama Logistica</p>
              <p className="text-sm font-semibold">Codigo de Seguimiento: LMA-{purchase.orden_id.toUpperCase()}</p>
              <ol className="mt-4 space-y-3">
                <li className="text-sm">
                  <div className="flex items-center gap-2 font-bold">
                    <PackageCheck className="h-4 w-4 text-lama-detail" aria-hidden="true" />
                    {purchase.estado_envio}
                  </div>
                  <p className="ml-6 text-lama-ink/75">Envio generado al confirmar la compra.</p>
                </li>
              </ol>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
