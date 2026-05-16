import { Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { ButtonLink, StatusBadge } from "@/components/ui";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-lama-line bg-lama-card shadow-soft">
      <div className="relative aspect-[4/3] bg-lama-cream">
        <img
          src={product.imagenes[0]}
          alt={product.titulo}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge>{product.estado_prenda}</StatusBadge>
          <StatusBadge>Talle {product.talle}</StatusBadge>
        </div>
        <div>
          <h2 className="text-xl font-bold">{product.titulo}</h2>
          <p className="mt-1 text-sm text-lama-ink/70">{product.marca}</p>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-lama-ink/80">{product.descripcion}</p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-bold">{currency.format(product.precio)}</p>
          <ButtonLink href={`/productos/${product.producto_id}`}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            Ver
          </ButtonLink>
        </div>
      </div>
    </article>
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
