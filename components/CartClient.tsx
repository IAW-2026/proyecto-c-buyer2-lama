"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { CreditCard, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui";
import type { PaymentMethod, Product } from "@/lib/types";

const CART_STORAGE_KEY = "lama-cart";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

function readCart(): Product[] {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? (JSON.parse(storedCart) as Product[]) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: Product[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("lama-cart-updated"));
}

export function CartClient({
  buyer,
  methods
}: {
  buyer: { clerk_user_id_comprador: string; nombre: string; email: string; direccion_envio: string };
  methods: PaymentMethod[];
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [methodId, setMethodId] = useState(methods[0]?.metodo_pago_id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCart(readCart());
    setIsLoaded(true);
  }, []);

  const productsTotal = useMemo(() => cart.reduce((sum, product) => sum + product.precio, 0), [cart]);
  const shippingAmount = cart.length ? 4500 : 0;
  const total = productsTotal + shippingAmount;

  function removeProduct(productId: string) {
    const nextCart = cart.filter((product) => product.producto_id !== productId);
    setCart(nextCart);
    saveCart(nextCart);
  }

  function clearCart() {
    setCart([]);
    saveCart([]);
    setMessage(null);
  }

  function submitPayment() {
    setMessage(null);
    startTransition(async () => {
      const results = [];

      for (const [index, product] of cart.entries()) {
        const itemShippingAmount = index === 0 ? shippingAmount : 0;
        const response = await fetch("/api/pagos", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            producto_id: product.producto_id,
            comprador: buyer,
            monto_producto: product.precio,
            monto_envio: itemShippingAmount,
            monto_total: product.precio + itemShippingAmount,
            metodo_pago_id: methodId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.error ?? "No se pudo procesar el pago del carrito.");
          return;
        }

        results.push(data.nro_orden);
      }

      setCart([]);
      saveCart([]);
      setMessage(`Pago aprobado. Ordenes ${results.join(", ")}.`);
    });
  }

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-lama-line bg-lama-card p-8 text-center shadow-soft">
        <p className="font-bold">Cargando carrito...</p>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <EmptyState
        title="Tu carrito esta vacio"
        text="Cuando agregues una prenda desde el detalle del producto, va a aparecer aca."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4">
        {cart.map((product) => (
          <article
            key={product.producto_id}
            className="grid gap-4 rounded-lg border border-lama-line bg-lama-card p-4 shadow-soft sm:grid-cols-[120px_1fr_auto]"
          >
            <Link
              href={`/productos/${product.producto_id}`}
              className="relative aspect-square overflow-hidden rounded-md bg-lama-cream"
              aria-label={`Ver ${product.titulo}`}
            >
              <img src={product.imagenes[0]} alt={product.titulo} className="h-full w-full object-cover" />
            </Link>

            <div className="min-w-0">
              <Link href={`/productos/${product.producto_id}`} className="text-lg font-bold hover:text-lama-detail">
                {product.titulo}
              </Link>
              <p className="mt-1 text-sm text-lama-ink/70">
                {product.marca} - Talle {product.talle}
              </p>
              <p className="mt-3 line-clamp-2 text-sm text-lama-ink/80">{product.descripcion}</p>
              <p className="mt-3 text-xl font-bold">{currency.format(product.precio)}</p>
            </div>

            <button
              type="button"
              onClick={() => removeProduct(product.producto_id)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-lama-line text-lama-ink hover:bg-lama-cream focus:outline-none focus:ring-2 focus:ring-lama-detail"
              aria-label={`Quitar ${product.titulo} del carrito`}
              title="Quitar del carrito"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-lama-detail" aria-hidden="true" />
          <h2 className="text-xl font-bold">Resumen</h2>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt>Productos</dt>
            <dd className="font-bold">{cart.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-bold">{currency.format(productsTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Envio</dt>
            <dd className="font-bold">{currency.format(shippingAmount)}</dd>
          </div>
          <div className="flex justify-between border-t border-lama-line pt-3 text-base">
            <dt>Total</dt>
            <dd className="font-bold">{currency.format(total)}</dd>
          </div>
        </dl>

        <label className="mt-5 block text-sm font-bold" htmlFor="metodo_pago_carrito">
          Metodo de pago
        </label>
        <select
          id="metodo_pago_carrito"
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
          Pagar carrito
        </button>

        <button
          type="button"
          onClick={clearCart}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-cream px-4 py-3 text-sm font-bold text-lama-ink hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
        >
          Vaciar carrito
        </button>

        {message ? (
          <p className="mt-4 rounded-md bg-lama-cream px-3 py-2 text-sm font-semibold" role="status">
            {message}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
