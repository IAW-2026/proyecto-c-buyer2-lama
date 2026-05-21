import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/ui";
import Link from "next/link";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import {
  getCatalogProducts,
  getPersonalizedCatalogProducts,
  hasBuyerPreferences,
  normalizeProductSort,
  products
} from "@/lib/mock-external";
import type { Product } from "@/lib/types";

const homeHeroBackground = {
  backgroundImage:
    "linear-gradient(90deg, rgba(0,0,0,0.54), rgba(0,0,0,0.14), rgba(0,0,0,0.45)), url('/products/campera_denim.webp')"
};

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
  const categoryTiles = catalog.categorias.map((category) => {
    const categoryProduct = products.find(
      (product) =>
        product.categoria_id === category.categoria_producto_id &&
        product.estado_publicacion === "activa"
    );

    return {
      ...category,
      image: categoryProduct?.imagenes[0] ?? "/products/campera_denim.webp"
    };
  });

  return (
    <div>
      <section className="min-h-[470px] bg-cover bg-center text-white sm:min-h-[560px]" style={homeHeroBackground}>
        <div className="mx-auto flex min-h-[470px] max-w-7xl items-end px-4 pb-12 pt-16 sm:min-h-[560px] sm:pb-16">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-white/85">
              Compra circular
            </p>
            <h1 className="text-5xl font-semibold leading-none text-white drop-shadow sm:text-7xl">
              Prendas con historia
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16" aria-labelledby="home-categories">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lama-detail">
              Categorias
            </p>
            <h2 id="home-categories" className="mt-2 text-3xl font-bold text-lama-ink">
              Elegi por tipo de prenda
            </h2>
          </div>
          <Link href="/" className="hidden text-sm font-bold underline underline-offset-4 sm:inline">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTiles.map((category) => (
            <Link
              key={category.categoria_producto_id}
              href={`/?categoria=${category.categoria_producto_id}`}
              className="group relative block min-h-56 overflow-hidden bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail"
            >
              <img
                src={category.image}
                alt={category.nombre}
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/35 transition group-hover:bg-black/25" aria-hidden="true" />
              <span className="absolute inset-x-6 bottom-6 text-3xl font-bold uppercase text-white underline decoration-white underline-offset-4 drop-shadow">
                {category.nombre}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12" aria-labelledby="catalog-products">
        <div className="mb-6">
          <h2 id="catalog-products" className="text-3xl font-bold text-lama-ink">
            Ultimas prendas
          </h2>
        </div>

        <div className="mb-6">
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

        {visibleCatalog.items.length ? (
          <>
            <ProductGrid products={visibleCatalog.items} />
            <Pagination
              page={visibleCatalog.page}
              pageSize={visibleCatalog.pageSize}
              total={visibleCatalog.total}
              searchParams={params}
            />
          </>
        ) : (
          <EmptyState
            title="No se encontraron prendas"
            text="Proba ajustar la busqueda, la categoria o el talle para ver mas publicaciones activas."
          />
        )}
      </section>

      {personalizedCatalog?.personalizedItems.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16" aria-labelledby="personalized-products">
          <div className="mb-6">
            <h2 id="personalized-products" className="text-3xl font-bold text-lama-ink">
              Basado en tus preferencias
            </h2>
          </div>
          <ProductGrid products={personalizedCatalog.personalizedItems} />
        </section>
      ) : null}
    </div>
  );
}
