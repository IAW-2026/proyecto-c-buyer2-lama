import { generateObject } from "ai";
import { geminiModel, isAIConfigured } from "@/lib/ai/config";
import { createAICacheKey, getAICache, setAICache } from "@/lib/ai/cache";
import { aiStyleTipsSchema, type AIStyleTips } from "@/lib/ai/schemas";
import { sanitizeProduct } from "@/lib/ai/sanitize";
import type { Product } from "@/lib/types";

/**
 * Genera tips de estilo y sugerencias de outfit para un producto usando IA.
 * Si falla o no está configurada la IA, devuelve null.
 */
export async function getProductStyleTips(
  product: Product,
  categoryName?: string
): Promise<AIStyleTips | null> {
  if (!isAIConfigured()) {
    return null;
  }

  try {
    const safeProduct = sanitizeProduct(product);
    const cacheKey = createAICacheKey("product-style-tips", {
      productId: safeProduct.producto_id,
      title: safeProduct.titulo,
      updatedAt: product.fecha_creacion
    });
    const cachedTips = getAICache<AIStyleTips>(cacheKey);

    if (cachedTips) {
      return cachedTips;
    }

    const { object } = await generateObject({
      model: geminiModel,
      schema: aiStyleTipsSchema,
      prompt: `Generá tips de estilo para esta prenda de un marketplace de ropa de segunda mano.

Producto:
- Título: ${safeProduct.titulo}
- Descripción: ${safeProduct.descripcion}
- Marca: ${safeProduct.marca}
- Talle: ${safeProduct.talle}
- Estado: ${safeProduct.estado_prenda}
- Género: ${safeProduct.genero}
${categoryName ? `- Categoría: ${categoryName}` : ""}
- Precio: $${safeProduct.precio} ARS

Generá en español argentino:
1. "style_tip": un tip de estilo breve y útil (cómo usar la prenda, con qué combina)
2. "occasion": para qué ocasión es ideal (ej: "Casual de día", "Salida nocturna", "Oficina")
3. "combination_ideas": 2-3 ideas de combinación concretas (ej: "Con jeans rectos y botas texanas")

Sé conciso, entusiasta y enfocate en moda circular/sustentable.`
    });

    const tips = aiStyleTipsSchema.parse(object);
    setAICache(cacheKey, tips, 24 * 60 * 60 * 1000);
    return tips;
  } catch {
    return null;
  }
}
