import { prisma } from "@/lib/prisma";
import { getProductById, products } from "@/lib/mock-external";
import type { Product } from "@/lib/types";

export type FavoriteProduct = Product & {
  fecha_agregado: string;
};

type FavoriteRecord = {
  favorito_id: string;
  producto_id: string;
  clerk_user_id_comprador: string;
  fecha_agregado: Date;
};

type FavoriteSort = "recent";

const globalForFavoritesStore = globalThis as unknown as {
  fallbackFavorites?: FavoriteRecord[];
};

const fallbackFavorites = globalForFavoritesStore.fallbackFavorites ?? [];
globalForFavoritesStore.fallbackFavorites = fallbackFavorites;

function shouldUseDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function productIsAvailable(product: Product) {
  return product.estado_publicacion === "activa";
}

function normalizeFavoriteSort(sort?: string | null): FavoriteSort {
  return sort === "recent" ? sort : "recent";
}

function favoriteProductFromRecord(record: FavoriteRecord): FavoriteProduct | null {
  const product = getProductById(record.producto_id);

  if (!product) {
    return null;
  }

  return {
    ...product,
    fecha_agregado: record.fecha_agregado.toISOString()
  };
}

async function getFavoriteRecords(clerkUserId: string): Promise<FavoriteRecord[]> {
  if (shouldUseDatabase()) {
    try {
      return await prisma.favorito_producto.findMany({
        where: { clerk_user_id_comprador: clerkUserId },
        orderBy: { fecha_agregado: "desc" }
      });
    } catch {
      return fallbackFavorites.filter((favorite) => favorite.clerk_user_id_comprador === clerkUserId);
    }
  }

  return fallbackFavorites.filter((favorite) => favorite.clerk_user_id_comprador === clerkUserId);
}

export async function listFavoriteProductIds(clerkUserId: string) {
  const records = await getFavoriteRecords(clerkUserId);
  return records.map((favorite) => favorite.producto_id);
}

export async function isFavoriteProduct(clerkUserId: string, productId: string) {
  const records = await getFavoriteRecords(clerkUserId);
  return records.some((favorite) => favorite.producto_id === productId);
}

export async function addFavoriteProduct(clerkUserId: string, productId: string) {
  const product = getProductById(productId);

  if (!product || !productIsAvailable(product)) {
    throw new Error("Producto no disponible para guardar en favoritos.");
  }

  if (shouldUseDatabase()) {
    try {
      return await prisma.favorito_producto.upsert({
        where: {
          producto_id_clerk_user_id_comprador: {
            producto_id: productId,
            clerk_user_id_comprador: clerkUserId
          }
        },
        update: {},
        create: {
          producto_id: productId,
          clerk_user_id_comprador: clerkUserId
        }
      });
    } catch {
      return addFallbackFavorite(clerkUserId, productId);
    }
  }

  return addFallbackFavorite(clerkUserId, productId);
}

function addFallbackFavorite(clerkUserId: string, productId: string) {
  const existing = fallbackFavorites.find(
    (favorite) =>
      favorite.clerk_user_id_comprador === clerkUserId && favorite.producto_id === productId
  );

  if (existing) {
    return existing;
  }

  const favorite: FavoriteRecord = {
    favorito_id: `fav_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    producto_id: productId,
    clerk_user_id_comprador: clerkUserId,
    fecha_agregado: new Date()
  };

  fallbackFavorites.unshift(favorite);
  return favorite;
}

export async function removeFavoriteProduct(clerkUserId: string, productId: string) {
  if (shouldUseDatabase()) {
    try {
      await prisma.favorito_producto.deleteMany({
        where: {
          producto_id: productId,
          clerk_user_id_comprador: clerkUserId
        }
      });
      return;
    } catch {
      removeFallbackFavorite(clerkUserId, productId);
      return;
    }
  }

  removeFallbackFavorite(clerkUserId, productId);
}

function removeFallbackFavorite(clerkUserId: string, productId: string) {
  const index = fallbackFavorites.findIndex(
    (favorite) =>
      favorite.clerk_user_id_comprador === clerkUserId && favorite.producto_id === productId
  );

  if (index >= 0) {
    fallbackFavorites.splice(index, 1);
  }
}

export async function listFavoriteProducts({
  clerkUserId,
  search = "",
  categoria,
  talle,
  sort = "recent",
  page = 1,
  pageSize = 8
}: {
  clerkUserId: string;
  search?: string;
  categoria?: string | null;
  talle?: string | null;
  sort?: FavoriteSort | string | null;
  page?: number;
  pageSize?: number;
}) {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedPage = Math.max(page, 1);
  const normalizedPageSize = Math.min(Math.max(pageSize, 1), 20);
  const normalizedSort = normalizeFavoriteSort(sort);
  const favoriteProducts = (await getFavoriteRecords(clerkUserId))
    .map(favoriteProductFromRecord)
    .filter((product): product is FavoriteProduct => Boolean(product));
  const filtered = favoriteProducts.filter((product) => {
    const matchesSearch = normalizedSearch
      ? [product.titulo, product.descripcion, product.marca]
          .some((value) => value.toLowerCase().includes(normalizedSearch))
      : true;
    const matchesCategory = categoria ? product.categoria_id === categoria : true;
    const matchesSize = talle ? product.talle === talle : true;

    return matchesSearch && matchesCategory && matchesSize;
  });
  const sorted =
    normalizedSort === "recent"
      ? [...filtered].sort(
          (a, b) => new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime()
        )
      : filtered;

  return {
    items: sorted.slice((normalizedPage - 1) * normalizedPageSize, normalizedPage * normalizedPageSize),
    total: sorted.length,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    categorias: [...new Set(products.map((product) => product.categoria_id))]
  };
}
