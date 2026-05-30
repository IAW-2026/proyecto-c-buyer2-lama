import { generateObject } from "ai";
import { geminiModel, isAIConfigured } from "@/lib/ai/config";
import { createAICacheKey, getAICache, setAICache } from "@/lib/ai/cache";
import { searchIntentSchema, type SearchIntent } from "@/lib/ai/schemas";
import type { Category } from "@/lib/types";

/**
 * Analiza una query de búsqueda con IA para extraer filtros estructurados.
 * Si la IA falla o no está configurada, devuelve null (fallback a búsqueda normal).
 */
export async function parseSearchIntent(
  query: string,
  categories: Category[]
): Promise<SearchIntent | null> {
  if (!isAIConfigured() || !query.trim()) {
    return null;
  }

  // Solo usar IA si parece lenguaje natural (más de 2 palabras o sin match directo)
  const words = query.trim().split(/\s+/);
  if (words.length <= 1) {
    return null;
  }

  try {
    const cacheKey = createAICacheKey("search-intent", {
      query: query.trim().toLowerCase(),
      categories: categories.map((category) => category.categoria_producto_id)
    });
    const cachedIntent = getAICache<SearchIntent | null>(cacheKey);

    if (cachedIntent) {
      return cachedIntent;
    }

    const categoryNames = categories.map((c) => `${c.nombre} (ID: ${c.categoria_producto_id})`).join(", ");

    const { object } = await generateObject({
      model: geminiModel,
      schema: searchIntentSchema,
      prompt: `Analizá esta búsqueda de un usuario en un marketplace de ropa de segunda mano y extraé filtros estructurados.

Categorías disponibles: ${categoryNames || "No disponibles"}
Talles disponibles: XS, S, M, L, XL, 36, 37, 38, 39

Búsqueda del usuario: "${query}"

Reglas:
- "search" debe contener las palabras clave relevantes para buscar productos (título, marca, tipo de prenda)
- "categoria" debe ser el ID exacto de la categoría si se puede inferir, o null
- "talle" debe ser uno de los talles disponibles si se menciona, o null
- "genero" debe ser "Hombre", "Mujer" o "Unisex" si se menciona, o null
- "intent_description" es una breve descripción de lo que busca el usuario (para debug)
- Si el usuario solo busca algo genérico como "campera", poné la palabra clave en "search" y dejá los filtros en null`
    });

    const intent = searchIntentSchema.parse(object);
    setAICache(cacheKey, intent, 10 * 60 * 1000);
    return intent;
  } catch {
    return null;
  }
}

/**
 * Determina si una query parece lenguaje natural (vs. keywords simples).
 * Esto permite mostrar un indicador de "búsqueda inteligente" en la UI.
 */
export function looksLikeNaturalLanguage(query: string): boolean {
  if (!query.trim()) {
    return false;
  }

  const words = query.trim().split(/\s+/);
  if (words.length <= 1) {
    return false;
  }

  // Si contiene preposiciones, artículos o verbos comunes es lenguaje natural
  const nlIndicators = [
    "para", "de", "con", "que", "algo", "busco", "quiero",
    "necesito", "tengo", "como", "parecido", "similar",
    "elegante", "casual", "formal", "abrigado", "liviano",
    "fiesta", "oficina", "salir", "verano", "invierno"
  ];

  const lowerQuery = query.toLowerCase();
  return nlIndicators.some((indicator) => lowerQuery.includes(indicator));
}
