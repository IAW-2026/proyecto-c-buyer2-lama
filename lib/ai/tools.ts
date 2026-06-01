import { tool } from "ai";
import { z } from "zod";
import { getCatalogProducts } from "@/lib/seller-service";
import { sanitizeProducts } from "@/lib/ai/sanitize";

const searchProductsInputSchema = z.object({
  search: z
    .string()
    .max(120)
    .optional()
    .describe("Texto libre de busqueda, por ejemplo 'campera de cuero' o 'vestido elegante'."),
  talle: z.string().max(10).optional().describe("Talle de la prenda, por ejemplo S, M, L, XL o 38."),
  genero: z.string().max(20).optional().describe("Genero de la prenda: hombre, mujer, niños o unisex."),
  pageSize: z.number().int().min(1).max(8).optional().describe("Cantidad de resultados a devolver.")
});

export const chatTools = {
  searchProducts: tool({
    description:
      "Busca productos disponibles en el catalogo de LAMA. Usala solo para encontrar prendas o productos.",
    inputSchema: searchProductsInputSchema,
    execute: async ({ search, talle, genero, pageSize }) => {
      try {
        const catalog = await getCatalogProducts({
          search: search ?? "",
          talle,
          genero,
          pageSize: pageSize ?? 4,
          includeOptions: false,
          semanticSearch: true
        });

        if (catalog.items.length === 0) {
          return {
            found: false,
            message: "No se encontraron productos con esos filtros.",
            products: []
          };
        }

        return {
          found: true,
          total: catalog.total,
          products: sanitizeProducts(catalog.items)
        };
      } catch {
        return {
          found: false,
          message: "Error al buscar productos. Intenta de nuevo.",
          products: []
        };
      }
    }
  })
};
