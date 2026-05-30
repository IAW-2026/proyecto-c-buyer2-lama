import type { Product, BuyerPreferences } from "@/lib/types";
import type { ChatMessage } from "@/lib/ai/schemas";

/**
 * Datos seguros de un producto para enviar a la IA.
 * Se excluyen URLs internas o datos que no aportan al análisis.
 */
export type SafeProduct = {
  producto_id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  estado_prenda: string;
  talle: string;
  marca: string;
  genero: string;
  categoria_id: string;
};

/**
 * Extrae solo los campos seguros de un producto.
 * No envía: imagenes, vendedor_id, clerk_user_id_vendedor, estado_publicacion, fecha_creacion.
 */
export function sanitizeProduct(product: Product): SafeProduct {
  return {
    producto_id: product.producto_id,
    titulo: product.titulo,
    descripcion: product.descripcion,
    precio: product.precio,
    estado_prenda: product.estado_prenda,
    talle: product.talle,
    marca: product.marca,
    genero: product.genero,
    categoria_id: product.categoria_id
  };
}

export function sanitizeProducts(products: Product[]): SafeProduct[] {
  return products.map(sanitizeProduct);
}

/**
 * Datos seguros de preferencias del comprador.
 * No envía: clerk_user_id_comprador, preferencia_id.
 */
export type SafePreferences = {
  talles_preferidos: string[];
  categorias_preferidas: string[];
  vendedores_preferidos: string[];
};

export function sanitizePreferences(preferences: BuyerPreferences): SafePreferences {
  return {
    talles_preferidos: preferences.talles_preferidos,
    categorias_preferidas: preferences.categorias_preferidas,
    vendedores_preferidos: preferences.vendedores_preferidos
  };
}

export function sanitizeChatContent(content: string) {
  return content
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email oculto]")
    .replace(/\b(?:DNI|Documento|CUIL|CUIT)\s*:?\s*\d{7,11}\b/gi, "[documento oculto]")
    .replace(/\b(?:\+?54\s?)?(?:9\s?)?(?:11|[2368]\d{2,3})[-\s]?\d{3,4}[-\s]?\d{4}\b/g, "[telefono oculto]")
    .replace(/\b(direcci[oó]n|domicilio)\s*:?\s*[^.\n]{4,120}/gi, "$1 [oculta]");
}

export function sanitizeChatMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: sanitizeChatContent(message.content)
  }));
}
