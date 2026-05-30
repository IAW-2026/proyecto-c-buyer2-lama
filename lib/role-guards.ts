import { redirect } from "next/navigation";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";

export async function getBuyerRouteAuthContext() {
  const authContext = await getAuthContext();

  if (canAccessAdmin(authContext)) {
    redirect("/admin");
  }

  return authContext;
}
