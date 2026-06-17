import { fetchExternalNoContent } from "@/lib/external-app-client";

export type BuyerStatusSyncPayload = {
  esta_activo: boolean;
};

export function buildBuyerStatusSyncPayload(isActive: boolean): BuyerStatusSyncPayload {
  return {
    esta_activo: isActive
  };
}

export function isControlPlaneSyncConfigured() {
  return Boolean(process.env.CONTROL_PLANE_BASE_URL?.trim());
}

export async function syncBuyerStatusWithControlPlane(clerkUserId: string, isActive: boolean) {
  if (!isControlPlaneSyncConfigured()) {
    return;
  }

  await fetchExternalNoContent(
    "control-plane",
    `/api/compradores/${encodeURIComponent(clerkUserId)}/estado`,
    {
      method: "PATCH",
      body: JSON.stringify(buildBuyerStatusSyncPayload(isActive))
    }
  );
}
