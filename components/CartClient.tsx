"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { CreditCard, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { BillingDetailsModal, type BillingDetails } from "@/components/BillingDetailsModal";
import { EmptyState, LoadingState } from "@/components/ui";
import { CHECKOUT_SHIPPING_AMOUNT } from "@/lib/checkout";
import { isProductAvailable } from "@/lib/product-availability";
import type { Product } from "@/lib/types";

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

function unavailableProductsMessage(count: number) {
  return count === 1
    ? "Quitamos del carrito un producto que ya no esta disponible."
    : `Quitamos del carrito ${count} productos que ya no estan disponibles.`;
}

export function CartClient({
  buyer
}: {
  buyer: CartBuyer;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    async function refreshCart() {
      const storedCart = readCart();
      const productIds = storedCart.map((product) => product.producto_id).filter(Boolean);

      if (!productIds.length) {
        setCart([]);
        setIsLoaded(true);
        return;
      }

      try {
        const params = new URLSearchParams({ ids: productIds.join(",") });
        const response = await fetch(`/api/productos/bulk?${params.toString()}`, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("No se pudo validar el carrito.");
        }

        const data = (await response.json()) as { items?: Product[] };
        const availableProductsById = new Map(
          (data.items ?? [])
            .filter(isProductAvailable)
            .map((product) => [product.producto_id, product])
        );
        const nextCart = productIds
          .map((productId) => availableProductsById.get(productId))
          .filter((product): product is Product => Boolean(product));

        if (!isMounted) {
          return;
        }

        setCart(nextCart);
        saveCart(nextCart);

        const removedProductsCount = storedCart.length - nextCart.length;

        if (removedProductsCount > 0) {
          setMessage(unavailableProductsMessage(removedProductsCount));
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setCart(storedCart);
        setMessage("No pudimos validar si el carrito esta actualizado. Intentalo de nuevo antes de pagar.");
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    refreshCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const productsTotal = useMemo(() => cart.reduce((sum, product) => sum + product.precio, 0), [cart]);
  const shippingAmount = cart.length ? CHECKOUT_SHIPPING_AMOUNT : 0;
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

      const response = await fetch("/api/ordenes/checkout", {
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
          monto_total: total
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo procesar el pago del carrito.");
        return;
      }

      if (typeof data.payment_url !== "string" || !data.payment_url) {
        setMessage("La orden se creo, pero no se recibio la URL de pago.");
        return;
      }

      setCart([]);
      saveCart([]);
      setIsBillingOpen(false);
      setMessage("Orden creada. Te estamos llevando a Payments para completar el pago.");
      window.location.assign(data.payment_url);
    });
  }

  if (!isLoaded) {
    return <LoadingState text="Cargando carrito..." />;
  }

  if (!cart.length) {
    return (
      <EmptyState
        title="Tu carrito esta vacio"
        text={message ?? "Cuando agregues una prenda desde el detalle del producto, va a aparecer aca."}
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
              <img
                src={product.imagenes?.[0] ?? "/products/inicio.png"}
                alt={product.titulo}
                className="h-full w-full object-cover"
              />
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
