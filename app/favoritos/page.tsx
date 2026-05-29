import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { ButtonLink, Card, EmptyState, PageShell } from "@/components/ui";
import { canAccessBuyerApp } from "@/lib/auth";
import { listFavoriteProducts } from "@/lib/favorites-store";
import { categories } from "@/lib/mock-external";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
import type { FavoriteProduct } from "@/lib/favorites-store";

function ProductGrid({ products }: { products: FavoriteProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.producto_id}
          product={product}
          isFavorite
          canFavorite
        />
      ))}
    </div>
  );
}

export default async function FavoritesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const authContext = await getBuyerRouteAuthContext();

  if (!authContext.userId) {
    redirect("/sign-in");
  }

  if (authContext.roles.length === 0) {
    redirect("/onboarding/buyer");
  }

  const hasBuyerRole = canAccessBuyerApp(authContext);
  const params = await searchParams;
  const requestedPage = Number(params.page ?? 1);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;
  const favorites = hasBuyerRole
    ? await listFavoriteProducts({
        clerkUserId: authContext.userId,
        search: params.search,
        categoria: params.categoria,
        talle: params.talle,
        sort: "recent",
        page,
        pageSize: 8
      })
    : null;

  return (
    <PageShell
      title="Mis favoritos"
      eyebrow="Productos guardados"
      titleClassName="font-display"
      actions={
        <ButtonLink href="/productos" className="bg-lama-card text-lama-ink hover:bg-lama-cream">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </ButtonLink>
      }
    >
      {!hasBuyerRole ? (
        <Card>
          <p className="font-bold">Este usuario no puede acceder a favoritos de comprador.</p>
          <div className="mt-4">
            <ButtonLink href="/productos">Ver productos</ButtonLink>
          </div>
        </Card>
      ) : favorites ? (
        <>
          <div className="mb-8">
            <SearchBar
              search={params.search}
              categoria={params.categoria}
              talle={params.talle}
              sort="recent"
              basePath="/favoritos"
              sortOptions={[{ value: "recent", label: "Agregados recientemente" }]}
              categoryOptions={categories.map((category) => ({
                id: category.categoria_producto_id,
                label: category.nombre
              }))}
            />
          </div>

          {favorites.items.length ? (
            <>
              <ProductGrid products={favorites.items} />
              <Pagination
                page={favorites.page}
                pageSize={favorites.pageSize}
                total={favorites.total}
                searchParams={params}
              />
            </>
          ) : (
            <EmptyState
              title="Todavia no hay favoritos"
              text="Guarda productos desde las cards o desde el detalle para encontrarlos aca."
            />
          )}
        </>
      ) : null}
    </PageShell>
  );
}
