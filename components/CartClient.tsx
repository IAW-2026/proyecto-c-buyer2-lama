"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { BillingDetailsModal, type BillingDetails } from "@/components/BillingDetailsModal";
import { EmptyState, LoadingState } from "@/components/ui";
import { savePurchase } from "@/lib/purchases-storage";
import type { PaymentMethod, Product } from "@/lib/types";

const CART_STORAGE_KEY = "lama-cart";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

type CartBuyer = BillingDetails & {
  clerk_user_id_comprador: string;
};

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
  buyer: CartBuyer;
  methods: PaymentMethod[];
}) {
  const router = useRouter();
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [methodId, setMethodId] = useState(methods[0]?.metodo_pago_id ?? "");
  const [isBillingOpen, setIsBillingOpen] = useState(false);
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

  function openBillingDetails() {
    setMessage(null);
    setIsBillingOpen(true);
  }

  function submitPayment(details: BillingDetails) {

    startTransition(async () => {
      const profileResponse = await fetch("/api/perfil", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre_comprador: details.nombre,
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

      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          producto_ids: cart.map((product) => product.producto_id),
          comprador: {
            ...buyer,
            nombre: details.nombre,
            email: details.email,
            direccion_envio: details.direccion_envio
          },
          monto_producto: productsTotal,
          monto_envio: shippingAmount,
          monto_total: total,
          metodo_pago_id: methodId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo procesar el pago del carrito.");
        return;
      }

      const now = new Date().toISOString();
      savePurchase({
        orden_id: data.orden_id,
        nro_orden: data.nro_orden,
        clerk_user_id_comprador: buyer.clerk_user_id_comprador,
        producto_ids: cart.map((product) => product.producto_id),
        total,
        direccion_envio: details.direccion_envio,
        estado_general: "pagada",
        estado_pago: "aprobado",
        estado_envio: "pendiente",
        fecha_creacion: data.fecha_creacion ?? now,
        fecha_actualizacion: data.fecha_creacion ?? now,
        products: cart
      });

      setCart([]);
      saveCart([]);
      setIsBillingOpen(false);
      setMessage("Compra realizada con exito. Te estamos llevando a Mis compras.");
      window.setTimeout(() => router.push("/compras"), 1200);
    });
  }

  if (!isLoaded) {
    return <LoadingState text="Cargando carrito..." />;
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
          onClick={openBillingDetails}
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

        {isBillingOpen ? (
          <BillingDetailsModal
            initialDetails={buyer}
            isPending={isPending}
            onClose={() => setIsBillingOpen(false)}
            onConfirm={submitPayment}
          />
        ) : null}

        <button
          type="button"
          onClick={clearCart}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-cream px-4 py-3 text-sm font-bold text-lama-ink hover:bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
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
