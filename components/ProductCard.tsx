import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { StatusBadge } from "@/components/ui";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.producto_id}`}
      className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
      aria-label={`Ver detalle de ${product.titulo}`}
    >
      <article className="h-full overflow-hidden rounded-lg border border-lama-line bg-lama-card shadow-soft transition group-hover:-translate-y-0.5 group-hover:border-lama-detail/60">
        <div className="relative aspect-square bg-lama-cream">
          <img
            src={product.imagenes[0]}
            alt={product.titulo}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-2 p-3 sm:p-4">
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge className="px-2 py-0.5 text-[10px] leading-4 sm:text-xs">{product.estado_prenda}</StatusBadge>
            <StatusBadge className="px-2 py-0.5 text-[10px] leading-4 sm:text-xs">Talle {product.talle}</StatusBadge>
          </div>
          <p className="text-base font-bold sm:text-lg">{currency.format(product.precio)}</p>
          <div>
            <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 sm:text-base">
              {product.titulo}
            </h2>
            <p className="mt-1 text-xs text-lama-ink/70 sm:text-sm">{product.marca}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ProductMini({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-lama-cream">
        <img src={product.imagenes[0]} alt="" className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="font-bold">{product.titulo}</p>
        <p className="text-sm text-lama-ink/70">
          {product.marca} · Talle {product.talle}
        </p>
      </div>
      <ShoppingBag className="ml-auto h-5 w-5 text-lama-detail" aria-hidden="true" />
    </div>
  );
}
