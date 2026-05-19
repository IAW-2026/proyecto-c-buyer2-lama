import type { Product } from "@/lib/types";

export const PURCHASES_STORAGE_KEY = "lama-purchases";

export type StoredPurchase = {
  orden_id: string;
  nro_orden: string;
  clerk_user_id_comprador: string;
  producto_ids: string[];
  total: number;
  direccion_envio: string;
  estado_general: "pagada";
  estado_pago: "aprobado";
  estado_envio: "pendiente";
  fecha_creacion: string;
  fecha_actualizacion: string;
  products: Product[];
};

export function readPurchases() {
  try {
    const storedPurchases = window.localStorage.getItem(PURCHASES_STORAGE_KEY);
    return storedPurchases ? (JSON.parse(storedPurchases) as StoredPurchase[]) : [];
  } catch {
    return [];
  }
}

export function savePurchase(purchase: StoredPurchase) {
  const purchases = readPurchases();
  const withoutDuplicate = purchases.filter((item) => item.orden_id !== purchase.orden_id);
  window.localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify([purchase, ...withoutDuplicate]));
  window.dispatchEvent(new Event("lama-purchases-updated"));
}
