import { redirect } from "next/navigation";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";

export default async function PostLoginPage() {
  const authContext = await getAuthContext();

  if (!authContext.userId) {
    redirect("/sign-in");
  }

  if (canAccessAdmin(authContext)) {
    redirect("/admin");
  }

  if (canAccessBuyerApp(authContext)) {
    redirect("/");
  }

  redirect("/onboarding/buyer");
}
