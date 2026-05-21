import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { EmptyState, PageShell } from "@/components/ui";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import {
  getCatalogProducts,
  getPersonalizedCatalogProducts,
  hasBuyerPreferences,
  normalizeProductSort
} from "@/lib/mock-external";
import type { Product } from "@/lib/types";

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.producto_id} product={product} />
      ))}
    </div>
  );
}

export default async function Home({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? 1);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;
  const authContext = await getAuthContext();
  const buyer =
    authContext.userId && canAccessBuyerApp(authContext) ? await getBuyer(authContext.userId) : null;
  const preferences = buyer?.preferencias;
  const sort = normalizeProductSort(params.sort);
  const hasActiveCatalogFilters = Boolean(
    params.search?.trim() || params.categoria || params.talle || sort !== "recent"
  );
  const shouldPersonalize = !hasActiveCatalogFilters && hasBuyerPreferences(preferences);
  const catalog = getCatalogProducts({
    search: params.search,
    categoria: params.categoria,
    talle: params.talle,
    sort,
    page,
    pageSize: 8
  });
  const personalizedCatalog = shouldPersonalize
    ? getPersonalizedCatalogProducts({
        preferences,
        page,
        pageSize: 6
      })
    : null;
  const visibleCatalog = personalizedCatalog ?? catalog;

  return (
    <PageShell title="Comprar ropa usada y vintage">
      <div className="mb-6">
        <SearchBar search={params.search} categoria={params.categoria} talle={params.talle} sort={sort} />
      </div>

      {personalizedCatalog?.personalizedItems.length ? (
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-lama-ink">Basado en tus preferencias</h2>
          </div>
          <ProductGrid products={personalizedCatalog.personalizedItems} />
        </section>
      ) : null}

      {visibleCatalog.items.length ? (
        <section>
          {personalizedCatalog ? (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-lama-ink">Más productos</h2>
            </div>
          ) : null}
          <ProductGrid products={visibleCatalog.items} />
          <Pagination
            page={visibleCatalog.page}
            pageSize={visibleCatalog.pageSize}
            total={visibleCatalog.total}
            searchParams={params}
          />
        </section>
      ) : (
        !personalizedCatalog?.personalizedItems.length && (
          <EmptyState
            title="No se encontraron prendas"
            text="Probá ajustar la búsqueda, la categoría o el talle para ver más publicaciones activas."
          />
        )
      )}
    </PageShell>
  );
}
