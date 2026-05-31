"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { isProductAvailable } from "@/lib/product-availability";
import type { Product } from "@/lib/types";

const CART_STORAGE_KEY = "lama-cart";

function readCart(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

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

export function AddToCartButton({ product }: { product: Product }) {
  const [message, setMessage] = useState<string | null>(null);

  function addToCart() {
    if (!isProductAvailable(product)) {
      setMessage("Este producto ya no se encuentra disponible");
      return;
    }

    const cart = readCart();
    const productAlreadyExists = cart.some((item) => item.producto_id === product.producto_id);
    const cartSellerId = cart[0]?.clerk_user_id_vendedor;

    if (productAlreadyExists) {
      setMessage("El producto ya se encuentra en el carrito");
      return;
    }

    if (cartSellerId && cartSellerId !== product.clerk_user_id_vendedor) {
      setMessage(
        "No es posible agregar el producto al carrito porque los vendedores no coinciden. Pero podes agregarlo a tu lista de favoritos"
      );
      return;
    }

    saveCart([...cart, product]);
    setMessage("Producto agregado al carrito");
  }

  return (
    <div className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
      <h2 className="text-xl font-bold">Carrito</h2>
      <p className="mt-2 text-sm text-lama-ink/75">
        Guardalo en tu carrito para verlo junto con otras prendas.
      </p>
      <button
        type="button"
        onClick={addToCart}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-3 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        Agregar al carrito
      </button>

      {message ? (
        <p className="mt-4 flex items-center gap-2 rounded-md bg-lama-cream px-3 py-2 text-sm font-semibold" role="status">
          <CheckCircle2 className="h-4 w-4 text-lama-detail" aria-hidden="true" />
          {message}
        </p>
      ) : null}
    </div>
  );
}
