import { ExternalApiError, fetchExternalJson } from "@/lib/external-app-client";
import type { ShippingInfo } from "@/lib/types";

export async function getShippingForOrder(orderId: string) {
  try {
    return await fetchExternalJson<ShippingInfo>(
      "shipping",
      `/api/envios/orden/${encodeURIComponent(orderId)}`
    );
  } catch (error) {
    if (error instanceof ExternalApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
