import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/ui";
import { canAccessBuyerApp } from "@/lib/auth";
import { listFavoriteProductIds } from "@/lib/favorites-store";
import {
  getCatalogProducts,
  normalizeProductSort
} from "@/lib/mock-external";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
import type { Product } from "@/lib/types";

function ProductGrid({
  products,
  favoriteProductIds,
  canFavorite
}: {
  products: Product[];
  favoriteProductIds: Set<string>;
  canFavorite: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.producto_id}
          product={product}
          isFavorite={favoriteProductIds.has(product.producto_id)}
          canFavorite={canFavorite}
        />
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const authContext = await getBuyerRouteAuthContext();
  const hasBuyerRole = canAccessBuyerApp(authContext);
  const params = await searchParams;
  const requestedPage = Number(params.page ?? 1);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;
  const sort = normalizeProductSort(params.sort);
  const favoriteProductIds =
    authContext.userId && hasBuyerRole
      ? new Set(await listFavoriteProductIds(authContext.userId))
      : new Set<string>();
  const catalog = getCatalogProducts({
    search: params.search,
    categoria: params.categoria,
    talle: params.talle,
    sort,
    page,
    pageSize: 8
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:px-6">
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display text-4xl font-bold text-lama-ink sm:text-5xl">
          Productos
        </h1>
      </div>

      <div className="mb-8">
        <SearchBar
          search={params.search}
          categoria={params.categoria}
          talle={params.talle}
          sort={sort}
          basePath="/productos"
          categoryOptions={catalog.categorias.map((category) => ({
            id: category.categoria_producto_id,
            label: category.nombre
          }))}
        />
      </div>

      {catalog.items.length ? (
        <>
          <ProductGrid
            products={catalog.items}
            favoriteProductIds={favoriteProductIds}
            canFavorite={Boolean(authContext.userId && hasBuyerRole)}
          />
          <Pagination
            page={catalog.page}
            pageSize={catalog.pageSize}
            total={catalog.total}
            searchParams={params}
          />
        </>
      ) : (
        <EmptyState
          title="No se encontraron prendas"
          text="Proba ajustar la busqueda, la categoria o el talle para ver mas publicaciones activas."
        />
      )}
    </main>
  );
}
