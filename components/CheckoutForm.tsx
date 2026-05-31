"use client";

import { useState, useTransition } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { BillingDetailsModal, type BillingDetails } from "@/components/BillingDetailsModal";
import { CHECKOUT_SHIPPING_AMOUNT } from "@/lib/checkout";
import type { Product } from "@/lib/types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

type CheckoutBuyer = BillingDetails & {
  clerk_user_id_comprador: string;
};

export function CheckoutForm({
  product,
  buyer
}: {
  product: Product;
  buyer: CheckoutBuyer;
}) {
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const shippingAmount = CHECKOUT_SHIPPING_AMOUNT;
  const total = product.precio + shippingAmount;

  function openBillingDetails() {
    setMessage(null);
    setIsBillingOpen(true);
  }

  function submitPayment(details: BillingDetails) {
    const nombre_comprador = `${details.nombre}`.trim();

    startTransition(async () => {
      const profileResponse = await fetch("/api/perfil", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre_comprador,
          email: details.email,
          DNI: details.DNI,
          direccion_envio: details.direccion_envio
        })
      });

      if (!profileResponse.ok) {
        const profileData = await profileResponse.json();
        setMessage(profileData.error ?? "No se pudieron guardar los datos de facturacion.");
        return;
      }

      const response = await fetch("/api/ordenes/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          producto_ids: [product.producto_id],
          comprador: {
            ...buyer,
            email: details.email,
            nombre: nombre_comprador,
            direccion_envio: details.direccion_envio
          },
          monto_producto: product.precio,
          monto_envio: shippingAmount,
          monto_total: total
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo procesar el pago.");
        return;
      }

      if (typeof data.payment_url !== "string" || !data.payment_url) {
        setMessage("La orden se creo, pero no se recibio la URL de pago.");
        return;
      }

      setIsBillingOpen(false);
      setMessage("Orden creada. Te estamos llevando a Payments para completar el pago.");
      window.location.assign(data.payment_url);
    });
  }

  return (
    <div className="w-full max-w-xl rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
      <h2 className="text-xl font-bold">Realizar Compra</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Producto</dt>
          <dd className="font-bold">{currency.format(product.precio)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envio</dt>
          <dd className="font-bold">{currency.format(shippingAmount)}</dd>
        </div>
        <div className="flex justify-between border-t border-lama-line pt-2 text-base">
          <dt>Total</dt>
          <dd className="font-bold">{currency.format(total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={openBillingDetails}
        disabled={isPending}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-3 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CreditCard className="h-4 w-4" aria-hidden="true" />
        )}
        Pagar compra
      </button>

      {isBillingOpen ? (
        <BillingDetailsModal
          initialDetails={buyer}
          isPending={isPending}
          onClose={() => setIsBillingOpen(false)}
          onConfirm={submitPayment}
        />
      ) : null}

      {message ? (
        <p className="mt-4 rounded-md bg-lama-cream px-3 py-2 text-sm font-semibold" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
