import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { EmptyState, PageShell } from "@/components/ui";
import { getCatalogProducts } from "@/lib/mock-external";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const catalog = getCatalogProducts({
    search: params.search,
    categoria: params.categoria,
    talle: params.talle,
    page: Number(params.page ?? 1),
    pageSize: 6
  });

  return (
    <PageShell title="Comprar ropa usada y vintage" eyebrow="Marketplace lama">
      <div className="mb-6">
        <SearchBar search={params.search} categoria={params.categoria} talle={params.talle} />
      </div>

      {catalog.items.length ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.items.map((product) => (
              <ProductCard key={product.producto_id} product={product} />
            ))}
          </div>
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
          text="Probá ajustar la búsqueda, la categoría o el talle para ver más publicaciones activas."
        />
      )}
    </PageShell>
  );
}
