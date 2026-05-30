import { generateObject } from "ai";
import { geminiModel, isAIConfigured } from "@/lib/ai/config";
import { createAICacheKey, getAICache, setAICache } from "@/lib/ai/cache";
import { aiRecommendationsResponseSchema, type AIRecommendation } from "@/lib/ai/schemas";
import { sanitizeProducts, sanitizePreferences } from "@/lib/ai/sanitize";
import type { Product, BuyerPreferences } from "@/lib/types";

/**
 * Genera recomendaciones de productos usando IA.
 * Recibe productos candidatos, preferencias y favoritos del usuario.
 * Devuelve una lista rankeada de IDs con razón.
 *
 * Si la IA falla o no está configurada, devuelve un array vacío (fallback al sistema actual).
 */
export async function getAIRecommendations({
  candidateProducts,
  preferences,
  favoriteProductIds,
  limit = 6
}: {
  candidateProducts: Product[];
  preferences: BuyerPreferences | null;
  favoriteProductIds: string[];
  limit?: number;
}): Promise<AIRecommendation[]> {
  if (!isAIConfigured() || candidateProducts.length === 0) {
    return [];
  }

  try {
    const safeProducts = sanitizeProducts(candidateProducts);
    const safePreferences = preferences ? sanitizePreferences(preferences) : null;
    const cacheKey = createAICacheKey("recommendations", {
      products: safeProducts.map((product) => product.producto_id),
      preferences: safePreferences,
      favorites: [...favoriteProductIds].sort(),
      limit
    });
    const cachedRecommendations = getAICache<AIRecommendation[]>(cacheKey);

    if (cachedRecommendations) {
      return cachedRecommendations;
    }

    const prompt = `Sos un recomendador de moda para un marketplace de ropa de segunda mano (LAMA).
Seleccioná y rankeá los ${limit} productos más relevantes para este comprador.

${safePreferences ? `Preferencias del comprador:
- Talles preferidos: ${safePreferences.talles_preferidos.join(", ") || "Sin definir"}
- Categorías preferidas: ${safePreferences.categorias_preferidas.join(", ") || "Sin definir"}` : "El comprador no tiene preferencias definidas."}

${favoriteProductIds.length > 0 ? `Productos en favoritos del comprador (IDs): ${favoriteProductIds.slice(0, 10).join(", ")}` : "No tiene favoritos."}

Productos disponibles:
${JSON.stringify(safeProducts.slice(0, 30), null, 0)}

Criterios de ranking:
1. Coincidencia con talles preferidos (prioridad alta)
2. Coincidencia con categorías preferidas
3. Variedad: no recomiendes muchos productos iguales
4. Si tiene favoritos, buscá productos similares en estilo o categoría
5. Priorizá prendas en buen estado

Devolvé exactamente ${limit} recomendaciones con el producto_id y una razón breve en español.`;

    const { object } = await generateObject({
      model: geminiModel,
      schema: aiRecommendationsResponseSchema,
      prompt
    });

    const validated = aiRecommendationsResponseSchema.parse(object);

    // Filtrar solo IDs que realmente existen en los candidatos
    const validIds = new Set(candidateProducts.map((p) => p.producto_id));
    const recommendations = validated.recommendations
      .filter((rec) => validIds.has(rec.producto_id))
      .slice(0, limit);

    setAICache(cacheKey, recommendations, 5 * 60 * 1000);
    return recommendations;
  } catch {
    return [];
  }
}
