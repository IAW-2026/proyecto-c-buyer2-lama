import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/ui";
import {
  getCatalogProducts,
  normalizeProductSort
} from "@/lib/mock-external";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
import type { Product } from "@/lib/types";

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.producto_id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await getBuyerRouteAuthContext();
  const params = await searchParams;
  const requestedPage = Number(params.page ?? 1);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;
  const sort = normalizeProductSort(params.sort);
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
          categoryOptions={catalog.categorias.map((category) => ({
            id: category.categoria_producto_id,
            label: category.nombre
          }))}
        />
      </div>

      {catalog.items.length ? (
        <>
          <ProductGrid products={catalog.items} />
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
