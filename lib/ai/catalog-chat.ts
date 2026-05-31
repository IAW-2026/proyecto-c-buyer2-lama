import { getCatalogProducts, getCategories } from "@/lib/seller-service";
import type { Category, Product } from "@/lib/types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const pluralToSingular: Record<string, string> = {
  abrigos: "abrigo",
  buzos: "buzo",
  camisas: "camisa",
  camperas: "campera",
  carteras: "cartera",
  chalecos: "chaleco",
  faldas: "falda",
  jeans: "jean",
  pantalones: "pantalon",
  polleras: "pollera",
  remeras: "remera",
  sacos: "saco",
  shorts: "short",
  sweaters: "sweater",
  tops: "top",
  vestidos: "vestido",
  zapatillas: "zapatilla",
  zapatos: "zapato"
};

const productTerms = new Set([
  "abrigo",
  "buzo",
  "camisa",
  "campera",
  "cartera",
  "chaleco",
  "falda",
  "jean",
  "pantalon",
  "pollera",
  "remera",
  "saco",
  "short",
  "sweater",
  "top",
  "vestido",
  "zapatilla",
  "zapato",
  ...Object.keys(pluralToSingular)
]);

const searchTriggers = new Set([
  "alguna",
  "alguno",
  "busco",
  "comprar",
  "encontrar",
  "hay",
  "mostrame",
  "mostras",
  "mostrar",
  "necesito",
  "opciones",
  "quiero",
  "recomendame",
  "recomendas",
  "tenes",
  "ver"
]);

const stopWords = new Set([
  "algo",
  "algun",
  "alguna",
  "alguno",
  "algunas",
  "algunos",
  "buscar",
  "busco",
  "comprar",
  "con",
  "de",
  "del",
  "en",
  "encontrar",
  "hay",
  "la",
  "las",
  "lo",
  "los",
  "me",
  "mi",
  "mira",
  "mirar",
  "mostrame",
  "mostras",
  "mostrar",
  "necesito",
  "opciones",
  "para",
  "podes",
  "podrias",
  "por",
  "quiero",
  "recomendame",
  "recomendas",
  "si",
  "tenes",
  "un",
  "una",
  "unas",
  "unos",
  "ver"
]);

const styleOnlyTerms = ["combinar", "combino", "como uso", "outfit", "queda bien"];

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeToken(token: string) {
  return pluralToSingular[token] ?? token;
}

function tokenize(text: string) {
  return normalizeText(text)
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function isSizeToken(token: string) {
  return /^(xs|s|m|l|xl|36|37|38|39)$/.test(token);
}

function getSearchTokens(text: string) {
  const tokens = tokenize(text);

  return tokens
    .filter((token, index) => {
      if (stopWords.has(token)) {
        return false;
      }

      if (token === "talle" || isSizeToken(token) || tokens[index - 1] === "talle") {
        return false;
      }

      if (["hombre", "masculino", "mujer", "femenino", "unisex"].includes(token)) {
        return false;
      }

      return true;
    })
    .map(normalizeToken);
}

function extractSize(text: string) {
  return normalizeText(text).match(/\btalle\s*(xs|s|m|l|xl|36|37|38|39)\b/)?.[1]?.toUpperCase();
}

function extractGender(text: string) {
  const normalized = normalizeText(text);

  if (/\b(hombre|masculino)\b/.test(normalized)) {
    return "Hombre";
  }

  if (/\b(mujer|femenino)\b/.test(normalized)) {
    return "Mujer";
  }

  if (/\bunisex\b/.test(normalized)) {
    return "Unisex";
  }

  return undefined;
}

function getCategoryTokens(category: Category) {
  return tokenize(category.nombre)
    .map(normalizeToken)
    .filter((token) => !stopWords.has(token) && token.length > 1);
}

function findMatchingCategory(text: string, categories: Category[]) {
  const queryTokens = getSearchTokens(text);
  const firstProductToken = queryTokens.find((token) => productTerms.has(token));

  return categories
    .map((category) => {
      const categoryTokens = getCategoryTokens(category);
      const matchingTokens = categoryTokens.filter((token) => queryTokens.includes(token));
      const hasFullCategoryMatch =
        categoryTokens.length > 0 && categoryTokens.every((token) => queryTokens.includes(token));
      const firstProductTokenMatches = Boolean(firstProductToken && categoryTokens.includes(firstProductToken));

      return {
        category,
        categoryTokens,
        score:
          (hasFullCategoryMatch ? 100 : 0) +
          (firstProductTokenMatches ? 50 : 0) +
          matchingTokens.length
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)[0];
}

function cleanSearchQuery(text: string, categoryTokens: string[] = []) {
  const categoryTokenSet = new Set(categoryTokens);
  const queryTokens = getSearchTokens(text).filter((token) => !categoryTokenSet.has(token));

  return [...new Set(queryTokens)].join(" ");
}

export function isCatalogSearchRequest(text: string) {
  const tokens = tokenize(text);
  const normalizedText = normalizeText(text);
  const normalizedTokens = tokens.map(normalizeToken);
  const hasProductTerm = normalizedTokens.some((token) => productTerms.has(token));
  const hasSearchTrigger = tokens.some((token) => searchTriggers.has(token));
  const isStyleOnly = styleOnlyTerms.some((term) => normalizedText.includes(term));
  const isShortKeywordSearch = tokens.length <= 5;

  return hasProductTerm && (hasSearchTrigger || (isShortKeywordSearch && !isStyleOnly));
}

function formatProduct(product: Product, index: number) {
  return `${index + 1}. ${product.titulo} - ${currency.format(product.precio)}. Talle ${product.talle}, estado ${product.estado_prenda}. Ver: /productos/${product.producto_id}`;
}

function buildCatalogResponse(products: Product[], label: string) {
  if (!products.length) {
    return `No encontre productos activos para "${label}". Proba con otra palabra clave o revisa el catalogo completo.`;
  }

  return [
    "Encontre estas opciones reales en LAMA:",
    "",
    ...products.map(formatProduct),
    "",
    "Si queres, puedo ayudarte a afinar la busqueda por talle, genero o estilo."
  ].join("\n");
}

export async function createCatalogSearchAnswer(text: string) {
  const categories = await getCategories().catch(() => []);
  const categoryMatch = findMatchingCategory(text, categories);
  const query = cleanSearchQuery(text, categoryMatch?.categoryTokens) || "";
  const label = [categoryMatch?.category.nombre, query].filter(Boolean).join(" - ") || text.trim();
  const catalog = await getCatalogProducts({
    search: query,
    categoria: categoryMatch?.category.categoria_producto_id,
    talle: extractSize(text),
    genero: extractGender(text),
    pageSize: 4,
    includeOptions: false,
    semanticSearch: !categoryMatch
  }).catch(() => null);

  if (!catalog) {
    return "No pude consultar el catalogo ahora. Proba de nuevo en un momento o revisa la seccion Productos.";
  }

  return buildCatalogResponse(catalog.items, label);
}
