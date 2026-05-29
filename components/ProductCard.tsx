import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { FavoriteButton } from "@/components/FavoriteButton";
import { StatusBadge } from "@/components/ui";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function ProductCard({
  product,
  isFavorite = false,
  canFavorite = false,
  isAccountActive = true
}: {
  product: Product;
  isFavorite?: boolean;
  canFavorite?: boolean;
  isAccountActive?: boolean;
}) {
  const isAvailable = product.estado_publicacion === "activa";

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-lama-line bg-lama-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-lama-detail/40 hover:shadow-lg">
      <Link
        href={`/productos/${product.producto_id}`}
        className="block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
        aria-label={`Ver detalle de ${product.titulo}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-lama-cream">
          <img
            src={product.imagenes[0]}
            alt={product.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-lama-ink opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Ver detalle
            </span>
          </div>
        </div>

        <div className="space-y-2 p-3 sm:p-4">
          <div className="flex flex-wrap gap-1.5">
            {!isAvailable ? (
              <StatusBadge className="px-2 py-0.5 text-[10px] leading-4 sm:text-xs">
                No disponible
              </StatusBadge>
            ) : null}
            <StatusBadge className="px-2 py-0.5 text-[10px] leading-4 sm:text-xs">
              {product.estado_prenda}
            </StatusBadge>
            <StatusBadge className="px-2 py-0.5 text-[10px] leading-4 sm:text-xs">
              Talle {product.talle}
            </StatusBadge>
          </div>
          <p className="text-lg font-bold text-lama-detail sm:text-xl">
            {currency.format(product.precio)}
          </p>
          <div>
            <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-lama-ink sm:text-base">
              {product.titulo}
            </h2>
            <p className="mt-1 text-xs text-lama-ink/55 sm:text-sm">{product.marca}</p>
          </div>
        </div>
      </Link>

      <FavoriteButton
        productId={product.producto_id}
        productTitle={product.titulo}
        initialFavorite={isFavorite}
        isAuthenticated={canFavorite}
        isAccountActive={isAccountActive}
        isAvailable={isAvailable}
        redirectTo={`/productos/${product.producto_id}`}
        className="absolute right-3 top-3 z-10"
      />
    </article>
  );
}

export function ProductMini({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-lama-cream">
        <img src={product.imagenes[0]} alt="" className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="font-bold">{product.titulo}</p>
        <p className="text-sm text-lama-ink/70">
          {product.marca} · Talle {product.talle}
        </p>
      </div>
    </div>
  );
}
