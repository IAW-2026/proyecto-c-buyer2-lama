import { ExternalApiError, fetchExternalJson } from "@/lib/external-app-client";
import { getAIRecommendations } from "@/lib/ai/recommendations";
import { parseSearchIntent, looksLikeNaturalLanguage } from "@/lib/ai/search-intent";
import type {
  BuyerPreferences,
  CatalogResponse,
  Category,
  OrderStatus,
  Product,
  ProductSort,
  SalesOrder,
  Seller
} from "@/lib/types";

type CatalogQuery = {
  search?: string;
  categoria?: string | null;
  vendedor?: string | null;
  talle?: string | null;
  genero?: string | null;
  sort?: ProductSort | string | null;
  page?: number;
  pageSize?: number;
  includeOptions?: boolean;
  semanticSearch?: boolean;
};

type SellerCatalogResponse = {
  items: SellerProductResponse[];
  total: number;
  page: number;
  page_size?: number;
  pageSize?: number;
};

type SellerListResponse<T> =
  | T[]
  | {
      items: T[];
      total?: number;
      page?: number;
      page_size?: number;
      pageSize?: number;
    };

type SellerListResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

type SellerResponse = Omit<Seller, "vendedor_id" | "clerk_user_id_vendedor"> & {
  vendedor_id?: string;
  clerk_user_id_vendedor?: string;
};

type SellerProductResponse = Omit<Product, "vendedor_id" | "clerk_user_id_vendedor"> & {
  vendedor_id?: string;
  clerk_user_id_vendedor?: string;
};

type SellerOrderItem = {
  producto_id: string;
  precio_unitario: number;
};

type SellerOrderResponse = {
  orden_id: string;
  comprador_id?: string;
  clerk_user_id_comprador?: string;
  items?: SellerOrderItem[];
  producto_ids?: string[];
  precio_total?: number;
  total?: number;
  direccion_envio?: string;
  estado_general?: SalesOrder["estado_general"];
  estado_pago?: SalesOrder["estado_pago"];
  estado_envio?: SalesOrder["estado_envio"];
  fecha_creacion?: string;
  fecha_actualizacion?: string;
};

export type CreateSalesOrderInput = {
  ordenId: string;
  clerkUserId: string;
  items: SellerOrderItem[];
  precioTotal: number;
  direccionEnvio: string;
};

export function normalizeProductSort(sort?: string | null): ProductSort {
  if (sort === "price_asc" || sort === "price_desc" || sort === "recent") {
    return sort;
  }

  return "recent";
}

const allowedSizes = new Set(["XS", "S", "M", "L", "XL", "36", "37", "38", "39"]);

function normalizeSizeFilter(value?: string | null) {
  const normalized = value?.trim().toUpperCase();
  return normalized && allowedSizes.has(normalized) ? normalized : null;
}

function normalizeGenderFilter(value?: string | null) {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "hombre") {
    return "Hombre";
  }

  if (normalized === "mujer") {
    return "Mujer";
  }

  if (normalized === "unisex") {
    return "Unisex";
  }

  return null;
}

function normalizePage(value?: number) {
  return Math.max(Number.isFinite(value) ? Number(value) : 1, 1);
}

function normalizePageSize(value?: number) {
  return Math.min(Math.max(Number.isFinite(value) ? Number(value) : 8, 1), 50);
}

function normalizeSeller(seller: SellerResponse): Seller {
  const sellerId = seller.clerk_user_id_vendedor ?? seller.vendedor_id ?? "";

  return {
    ...seller,
    vendedor_id: seller.vendedor_id ?? sellerId,
    clerk_user_id_vendedor: sellerId
  };
}

function normalizeProduct(product: SellerProductResponse): Product {
  const sellerId = product.clerk_user_id_vendedor ?? product.vendedor_id ?? "";

  return {
    ...product,
    vendedor_id: product.vendedor_id ?? sellerId,
    clerk_user_id_vendedor: sellerId,
    genero: product.genero ?? ""
  };
}

function normalizeListResponse<T>(
  response: SellerListResponse<T>,
  fallback: { page?: number; pageSize?: number } = {}
): SellerListResult<T> {
  const items = Array.isArray(response) ? response : response.items;

  return {
    items,
    total: Array.isArray(response) ? items.length : response.total ?? items.length,
    page: Array.isArray(response) ? fallback.page ?? 1 : response.page ?? fallback.page ?? 1,
    pageSize: Array.isArray(response)
      ? fallback.pageSize ?? items.length
      : response.pageSize ?? response.page_size ?? fallback.pageSize ?? items.length
  };
}

function buildProductQuery({
  search = "",
  categoria,
  vendedor,
  talle,
  genero,
  sort,
  page = 1,
  pageSize = 8
}: CatalogQuery) {
  const params = new URLSearchParams();
  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    params.set("search", normalizedSearch);
  }

  if (categoria) {
    params.set("categoria_id", categoria);
  }

  if (vendedor) {
    params.set("vendedor_id", vendedor);
  }

  if (talle) {
    params.set("talle", talle);
  }

  if (genero) {
    params.set("genero", genero);
  }

  params.set("sort", normalizeProductSort(sort));
  params.set("page", String(normalizePage(page)));
  params.set("pageSize", String(normalizePageSize(pageSize)));

  return params.toString();
}

export async function getCategories() {
  const response = await fetchExternalJson<SellerListResponse<Category>>(
    "seller",
    "/api/categorias-productos"
  );
  return normalizeListResponse(response).items;
}

export async function getSellersList({
  search = "",
  page = 1,
  pageSize = 100
}: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  params.set("page", String(normalizePage(page)));
  params.set("pageSize", String(normalizePageSize(pageSize)));

  const response = await fetchExternalJson<SellerListResponse<SellerResponse>>(
    "seller",
    `/api/vendedores?${params.toString()}`
  );
  const result = normalizeListResponse(response, {
    page: normalizePage(page),
    pageSize: normalizePageSize(pageSize)
  });

  return {
    ...result,
    items: result.items.map(normalizeSeller)
  };
}

export async function getSellers(options: Parameters<typeof getSellersList>[0] = {}) {
  return (await getSellersList(options)).items;
}

async function resolveSemanticCatalogQuery(query: CatalogQuery): Promise<{
  query: CatalogQuery;
  categoriesForOptions?: Category[];
  aiSearch?: CatalogResponse["aiSearch"];
}> {
  const originalSearch = query.search?.trim() ?? "";

  if (
    !query.semanticSearch ||
    !looksLikeNaturalLanguage(originalSearch) ||
    query.categoria ||
    query.talle ||
    query.genero
  ) {
    return { query };
  }

  const categories = await getCategories().catch(() => []);
  const intent = await parseSearchIntent(originalSearch, categories);

  if (!intent) {
    return { query, categoriesForOptions: categories };
  }

  const categoryIds = new Set(categories.map((category) => category.categoria_producto_id));
  const inferredCategory =
    intent.categoria && categoryIds.has(intent.categoria) ? intent.categoria : query.categoria;
  const inferredSize = normalizeSizeFilter(intent.talle) ?? query.talle;
  const inferredGender = normalizeGenderFilter(intent.genero) ?? query.genero;
  const interpretedSearch = intent.search.trim() || originalSearch;

  return {
    query: {
      ...query,
      search: interpretedSearch,
      categoria: inferredCategory,
      talle: inferredSize,
      genero: inferredGender
    },
    categoriesForOptions: categories,
    aiSearch: {
      used: true,
      originalSearch,
      interpretedSearch,
      intentDescription: intent.intent_description || undefined
    }
  };
}

export function hasBuyerPreferences(preferences?: BuyerPreferences | null): preferences is BuyerPreferences {
  return Boolean(
    preferences &&
      [
        preferences.talles_preferidos,
        preferences.categorias_preferidas,
        preferences.vendedores_preferidos
      ].some((values) => values.length > 0)
  );
}

function preferenceScore(product: Product, preferences: BuyerPreferences) {
  let score = 0;

  if (preferences.talles_preferidos.includes(product.talle)) {
    score += 1;
  }

  if (preferences.categorias_preferidas.includes(product.categoria_id)) {
    score += 1;
  }

  if (preferences.vendedores_preferidos.includes(product.clerk_user_id_vendedor)) {
    score += 1;
  }

  return score;
}

export function matchesAnyPreference(product: Product, preferences?: BuyerPreferences | null) {
  return preferences ? preferenceScore(product, preferences) > 0 : false;
}

function sortByPreferenceRelevance(items: Product[], preferences: BuyerPreferences) {
  return [...items].sort((a, b) => {
    const scoreDifference = preferenceScore(b, preferences) - preferenceScore(a, preferences);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
  });
}

export async function getCatalogProducts(query: CatalogQuery = {}): Promise<CatalogResponse> {
  const semanticQuery = await resolveSemanticCatalogQuery(query);
  const effectiveQuery = semanticQuery.query;
  const normalizedPage = normalizePage(effectiveQuery.page);
  const normalizedPageSize = normalizePageSize(effectiveQuery.pageSize);
  const catalog = await fetchExternalJson<SellerCatalogResponse>(
    "seller",
    `/api/productos?${buildProductQuery(effectiveQuery)}`
  );
  const [categorias, vendedores]: [Category[], Seller[]] =
    effectiveQuery.includeOptions === false
      ? [[], []]
      : await Promise.all([
          semanticQuery.categoriesForOptions ? Promise.resolve(semanticQuery.categoriesForOptions) : getCategories(),
          getSellers()
        ]);

  return {
    items: catalog.items.map(normalizeProduct),
    total: catalog.total,
    page: catalog.page ?? normalizedPage,
    pageSize: catalog.pageSize ?? catalog.page_size ?? normalizedPageSize,
    categorias,
    vendedores,
    aiSearch: semanticQuery.aiSearch
  };
}

export async function getPersonalizedCatalogProducts({
  preferences,
  favoriteProductIds = [],
  search = "",
  categoria,
  talle,
  page = 1,
  pageSize = 6,
  recommendedLimit = 6
}: {
  preferences: BuyerPreferences;
  favoriteProductIds?: string[];
  search?: string;
  categoria?: string | null;
  talle?: string | null;
  page?: number;
  pageSize?: number;
  recommendedLimit?: number;
}) {
  const normalizedPage = normalizePage(page);
  const normalizedPageSize = normalizePageSize(pageSize);
  const catalog = await getCatalogProducts({
    search,
    categoria,
    talle,
    page: 1,
    pageSize: Math.max(recommendedLimit + normalizedPage * normalizedPageSize, 20)
  });
  const personalizedItems = sortByPreferenceRelevance(
    catalog.items.filter((product) => matchesAnyPreference(product, preferences)),
    preferences
  ).slice(0, Math.max(recommendedLimit, 0));
  const recommendationReasons: Record<string, string> = {};
  const aiRecommendations = await getAIRecommendations({
    candidateProducts: catalog.items,
    preferences,
    favoriteProductIds,
    limit: Math.max(recommendedLimit, 0)
  });
  const productsById = new Map(catalog.items.map((product) => [product.producto_id, product]));
  const aiPersonalizedItems = aiRecommendations
    .map((recommendation) => {
      const product = productsById.get(recommendation.producto_id);

      if (product && recommendation.reason) {
        recommendationReasons[recommendation.producto_id] = recommendation.reason;
      }

      return product;
    })
    .filter((product): product is Product => Boolean(product));
  const mergedPersonalizedItems = [
    ...aiPersonalizedItems,
    ...personalizedItems.filter(
      (product) => !aiPersonalizedItems.some((aiProduct) => aiProduct.producto_id === product.producto_id)
    )
  ].slice(0, Math.max(recommendedLimit, 0));
  const finalPersonalizedItems = mergedPersonalizedItems.length ? mergedPersonalizedItems : personalizedItems;
  const personalizedIds = new Set(finalPersonalizedItems.map((product) => product.producto_id));
  const remainingItems = catalog.items.filter((product) => !personalizedIds.has(product.producto_id));

  return {
    personalizedItems: finalPersonalizedItems,
    recommendationReasons,
    items: remainingItems.slice(
      (normalizedPage - 1) * normalizedPageSize,
      normalizedPage * normalizedPageSize
    ),
    total: remainingItems.length,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    categorias: catalog.categorias,
    vendedores: catalog.vendedores
  };
}

export async function getProductById(productId: string) {
  try {
    const product = await fetchExternalJson<SellerProductResponse>(
      "seller",
      `/api/productos/${encodeURIComponent(productId)}`
    );
    return normalizeProduct(product);
  } catch (error) {
    if (error instanceof ExternalApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getProductsByIds(productIds: string[]) {
  const uniqueProductIds = [...new Set(productIds)].filter(Boolean);

  if (!uniqueProductIds.length) {
    return [];
  }

  const params = new URLSearchParams({ ids: uniqueProductIds.join(",") });
  const response = await fetchExternalJson<SellerListResponse<SellerProductResponse>>(
    "seller",
    `/api/productos/bulk?${params.toString()}`
  );
  const products = normalizeListResponse(response).items;
  const productsById = new Map(products.map((product) => [product.producto_id, normalizeProduct(product)]));

  return uniqueProductIds
    .map((productId) => productsById.get(productId))
    .filter((product): product is Product => Boolean(product));
}

function normalizeOrder(
  order: SellerOrderResponse,
  fallback?: {
    clerkUserId?: string;
    productIds?: string[];
    total?: number;
    direccionEnvio?: string;
  }
): SalesOrder {
  const createdAt = order.fecha_creacion ?? new Date().toISOString();
  const productIds =
    order.producto_ids ??
    order.items?.map((item) => item.producto_id) ??
    fallback?.productIds ??
    [];
  const items =
    order.items ??
    productIds.map((productId) => ({
      producto_id: productId,
      precio_unitario: 0
    }));
  const buyerId = order.clerk_user_id_comprador ?? order.comprador_id ?? fallback?.clerkUserId ?? "";

  return {
    orden_id: order.orden_id,
    comprador_id: order.comprador_id ?? buyerId,
    clerk_user_id_comprador: buyerId,
    items,
    producto_ids: productIds,
    total: order.total ?? order.precio_total ?? fallback?.total ?? 0,
    direccion_envio: order.direccion_envio ?? fallback?.direccionEnvio ?? "",
    estado_general: order.estado_general ?? "pendiente de pago",
    estado_pago: order.estado_pago ?? "pendiente",
    estado_envio: order.estado_envio ?? "pendiente",
    fecha_creacion: createdAt,
    fecha_actualizacion: order.fecha_actualizacion ?? createdAt
  };
}

export async function createSalesOrder(input: CreateSalesOrderInput) {
  const response = await fetchExternalJson<SellerOrderResponse | null>("seller", "/api/ordenes-ventas", {
    method: "POST",
    body: JSON.stringify({
      orden_id: input.ordenId,
      comprador_id: input.clerkUserId,
      items: input.items,
      precio_total: input.precioTotal,
      direccion_envio: input.direccionEnvio
    })
  });

  return normalizeOrder(response ?? { orden_id: input.ordenId }, {
    clerkUserId: input.clerkUserId,
    productIds: input.items.map((item) => item.producto_id),
    total: input.precioTotal,
    direccionEnvio: input.direccionEnvio
  });
}

export async function getSalesOrderStatus(orderId: string) {
  try {
    return await fetchExternalJson<OrderStatus>(
      "seller",
      `/api/ordenes-ventas/${encodeURIComponent(orderId)}/estado`
    );
  } catch (error) {
    if (error instanceof ExternalApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getSalesOrderById(orderId: string) {
  try {
    const order = await fetchExternalJson<SellerOrderResponse>(
      "seller",
      `/api/ordenes-ventas/${encodeURIComponent(orderId)}`
    );
    return normalizeOrder(order);
  } catch (error) {
    if (error instanceof ExternalApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getSalesOrdersForBuyerList(
  buyerId: string,
  {
    page = 1,
    pageSize = 20
  }: {
    page?: number;
    pageSize?: number;
  } = {}
) {
  const normalizedPage = normalizePage(page);
  const normalizedPageSize = normalizePageSize(pageSize);
  const params = new URLSearchParams({
    comprador_id: buyerId,
    page: String(normalizedPage),
    pageSize: String(normalizedPageSize)
  });
  const response = await fetchExternalJson<SellerListResponse<SellerOrderResponse>>(
    "seller",
    `/api/ordenes-ventas?${params.toString()}`
  );
  const result = normalizeListResponse(response, {
    page: normalizedPage,
    pageSize: normalizedPageSize
  });

  return {
    ...result,
    items: result.items.map((order) => normalizeOrder(order, { clerkUserId: buyerId }))
  };
}

export async function getSalesOrdersForBuyer(
  buyerId: string,
  options?: Parameters<typeof getSalesOrdersForBuyerList>[1]
) {
  return (await getSalesOrdersForBuyerList(buyerId, options)).items;
}
