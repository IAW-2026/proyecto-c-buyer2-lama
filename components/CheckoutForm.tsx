"use client";

import { useState, useTransition } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import type { PaymentMethod, Product } from "@/lib/types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function CheckoutForm({
  product,
  buyer,
  methods
}: {
  product: Product;
  buyer: { clerk_user_id_comprador: string; nombre: string; email: string; direccion_envio: string };
  methods: PaymentMethod[];
}) {
  const [methodId, setMethodId] = useState(methods[0]?.metodo_pago_id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const shippingAmount = 4500;
  const total = product.precio + shippingAmount;

  function submitPayment() {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          producto_id: product.producto_id,
          comprador: buyer,
          monto_producto: product.precio,
          monto_envio: shippingAmount,
          monto_total: total,
          metodo_pago_id: methodId
        })
      });

      const data = await response.json();
      setMessage(
        response.ok
          ? `Pago ${data.estado_pago}. Orden ${data.nro_orden}. Comprobante ${data.pago_id}.`
          : data.error ?? "No se pudo procesar el pago."
      );
    });
  }

  return (
    <div className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
      <h2 className="text-xl font-bold">Checkout</h2>
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

      <label className="mt-5 block text-sm font-bold" htmlFor="metodo_pago">
        Metodo de pago
      </label>
      <select
        id="metodo_pago"
        value={methodId}
        onChange={(event) => setMethodId(event.target.value)}
        className="mt-2 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
      >
        {methods.map((method) => (
          <option key={method.metodo_pago_id} value={method.metodo_pago_id}>
            {method.metodo_pago}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={submitPayment}
        disabled={isPending || !methodId}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-3 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CreditCard className="h-4 w-4" aria-hidden="true" />
        )}
        Pagar compra
      </button>

      {message ? (
        <p className="mt-4 rounded-md bg-lama-cream px-3 py-2 text-sm font-semibold" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
