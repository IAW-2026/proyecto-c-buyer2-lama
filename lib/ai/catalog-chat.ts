import { getCatalogProducts } from "@/lib/seller-service";
import type { Product } from "@/lib/types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const productTerms = [
  "abrigo",
  "buzo",
  "camisa",
  "campera",
  "camperas",
  "cartera",
  "chaleco",
  "falda",
  "jean",
  "jeans",
  "pantalon",
  "pantalones",
  "pollera",
  "remera",
  "remeras",
  "saco",
  "short",
  "shorts",
  "sweater",
  "top",
  "vestido",
  "zapatilla",
  "zapatillas",
  "zapato",
  "zapatos"
];

const searchTriggers = [
  "alguna",
  "alguno",
  "busco",
  "comprar",
  "encontrar",
  "hay",
  "mostrame",
  "necesito",
  "opciones",
  "quiero",
  "recomendame",
  "recomendas",
  "tenes",
  "tenés"
];

const styleOnlyTerms = ["combinar", "combino", "como uso", "cómo uso", "outfit", "queda bien"];

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extractSize(text: string) {
  return text.match(/\btalle\s*(xs|s|m|l|xl|36|37|38|39)\b/i)?.[1]?.toUpperCase();
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

function cleanSearchQuery(text: string) {
  return text
    .replace(/[¿?¡!.,:;]/g, " ")
    .replace(/\btalle\s*(xs|s|m|l|xl|36|37|38|39)\b/gi, " ")
    .replace(/\b(para|de)\s+(hombre|mujer|femenino|masculino|unisex)\b/gi, " ")
    .replace(/\b(me|podrias|podrías|podes|podés|por favor|quiero|busco|necesito|tenes|tenés|hay|mostrame|mostrar|ver|opciones|recomendame|recomendas|comprar|encontrar|alguna|alguno|unas|unos|una|un|algo)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isCatalogSearchRequest(text: string) {
  const normalized = normalizeText(text);
  const hasProductTerm = productTerms.some((term) => new RegExp(`\\b${term}\\b`).test(normalized));
  const hasSearchTrigger = searchTriggers.some((term) => new RegExp(`\\b${term}\\b`).test(normalized));
  const isStyleOnly = styleOnlyTerms.some((term) => normalized.includes(term));
  const isShortKeywordSearch = normalized.split(/\s+/).filter(Boolean).length <= 5;

  return hasProductTerm && (hasSearchTrigger || (isShortKeywordSearch && !isStyleOnly));
}

function formatProduct(product: Product, index: number) {
  return `${index + 1}. ${product.titulo} - ${currency.format(product.precio)}. Talle ${product.talle}, estado ${product.estado_prenda}. Ver: /productos/${product.producto_id}`;
}

function buildCatalogResponse(products: Product[], query: string) {
  if (!products.length) {
    return `No encontre productos activos para "${query}". Proba con otra palabra clave, por ejemplo "campera", "denim", "remera" o revisa el catalogo completo.`;
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
  const query = cleanSearchQuery(text) || text.trim();
  const catalog = await getCatalogProducts({
    search: query,
    talle: extractSize(text),
    genero: extractGender(text),
    pageSize: 4,
    includeOptions: false,
    semanticSearch: true
  }).catch(() => null);

  if (!catalog) {
    return "No pude consultar el catalogo ahora. Proba de nuevo en un momento o revisa la seccion Productos.";
  }

  return buildCatalogResponse(catalog.items, query);
}
