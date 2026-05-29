import { ProductCard } from "@/components/ProductCard";
import { DashboardPreview } from "@/components/DashboardPreview";
import Link from "next/link";
import { canAccessBuyerApp } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { listFavoriteProductIds } from "@/lib/favorites-store";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
import {
  getCatalogProducts,
  getPersonalizedCatalogProducts,
  hasBuyerPreferences
} from "@/lib/mock-external";
import type { Product } from "@/lib/types";
import {
  ChevronDown,
  Recycle,
  ShoppingBag,
  Sparkles,
  Users
} from "lucide-react";

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

export default async function Home() {
  const authContext = await getBuyerRouteAuthContext();
  const hasBuyerRole = canAccessBuyerApp(authContext);
  const buyer = authContext.userId && hasBuyerRole ? await getBuyer(authContext.userId) : null;
  const favoriteProductIds =
    authContext.userId && hasBuyerRole
      ? new Set(await listFavoriteProductIds(authContext.userId))
      : new Set<string>();
  const preferences = buyer?.preferencias;
  const catalog = getCatalogProducts({ pageSize: 8 });
  const personalizedCatalog = hasBuyerPreferences(preferences)
    ? getPersonalizedCatalogProducts({
        preferences,
        pageSize: 6
      })
    : null;
  const categoryTiles = catalog.categorias.map((category) => {
    const categoryProduct = getCatalogProducts({
      categoria: category.categoria_producto_id,
      pageSize: 1
    }).items[0];

    return {
      ...category,
      image: categoryProduct?.imagenes[0] ?? "/products/inicio.png"
    };
  });

  return (
    <div>
      <section className="relative -mt-[112px] flex min-h-[calc(85vh+112px)] items-end overflow-hidden sm:min-h-[calc(90vh+112px)] lg:-mt-[65px] lg:min-h-[calc(90vh+65px)]">
        <img
          src="/products/inicio.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24 lg:px-8">
          <div className="max-w-2xl">
            <p
              className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 sm:text-xs"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              Marketplace de moda circular
            </p>
            <h1
              className="font-display text-5xl font-bold leading-[1.05] text-white drop-shadow-lg sm:text-7xl lg:text-8xl"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              Compra moda
              <br />
              <span className="italic">con historia</span>
            </h1>
            <p
              className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:mt-6 sm:text-lg"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              Descubri prendas unicas de segunda mano, seleccionadas por la comunidad.
              Moda circular, sustentable y con personalidad.
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              {!authContext.userId ? (
                <Link
                  href="/sign-in"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-lama-ink transition-all duration-300 hover:bg-lama-cream hover:shadow-lg hover:shadow-white/10 sm:px-8 sm:py-4 sm:text-base"
                >
                  Comenzar ahora
                  <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                </Link>
              ) : null}
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
              >
                Ver Productos
              </Link>
            </div>

            <div
              className="mt-10 flex flex-wrap gap-6 sm:mt-14 sm:gap-8"
              style={{ animationDelay: "0.7s", animationFillMode: "both" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-white/80" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white sm:text-xl">+10k</p>
                  <p className="text-[11px] font-medium text-white/50">productos</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                  <Users className="h-4 w-4 text-white/80" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white sm:text-xl">+2k</p>
                  <p className="text-[11px] font-medium text-white/50">compradores</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                  <Recycle className="h-4 w-4 text-white/80" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white sm:text-xl">100%</p>
                  <p className="text-[11px] font-medium text-white/50">circular</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce-down">
          <ChevronDown className="h-6 w-6 text-white/40" aria-hidden="true" />
        </div>
      </section>

      <section
        id="categorias"
        className="mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-6"
        aria-labelledby="home-categories"
      >
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-lama-detail">
              Categorias
            </p>
            <h2
              id="home-categories"
              className="font-display text-3xl font-bold text-lama-ink sm:text-4xl"
            >
              Elegi por tipo de prenda
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden text-sm font-bold text-lama-detail underline underline-offset-4 transition-colors hover:text-lama-ink sm:inline"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTiles.map((category) => (
            <Link
              key={category.categoria_producto_id}
              href={`/productos?categoria=${category.categoria_producto_id}`}
              className="group relative block min-h-60 overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 sm:min-h-64"
            >
              <img
                src={category.image}
                alt={category.nombre}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition duration-300 group-hover:from-black/50"
                aria-hidden="true"
              />
              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition group-hover:bg-white/20">
                  {category.nombre}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {personalizedCatalog?.personalizedItems.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6" aria-labelledby="personalized-products">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-lama-detail">
              Para vos
            </p>
            <h2
              id="personalized-products"
              className="font-display text-3xl font-bold text-lama-ink sm:text-4xl"
            >
              Basado en tus preferencias
            </h2>
          </div>
          <ProductGrid
            products={personalizedCatalog.personalizedItems}
            favoriteProductIds={favoriteProductIds}
            canFavorite={Boolean(authContext.userId && hasBuyerRole)}
          />
        </section>
      ) : null}

      <div className="border-t border-lama-line/50">
        <DashboardPreview />
      </div>
    </div>
  );
}
