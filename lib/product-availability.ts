import type { Product } from "@/lib/types";

export function isProductAvailable(product: Pick<Product, "estado_publicacion">) {
  return product.estado_publicacion === "activa";
}
