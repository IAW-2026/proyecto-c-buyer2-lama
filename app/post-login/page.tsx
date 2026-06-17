import { redirect } from "next/navigation";
import { canAccessAdmin, canAccessBuyerApp, getAuthContext } from "@/lib/auth";

function safeRedirectPath(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export default async function PostLoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;
  const redirectPath = safeRedirectPath(params.redirect_url);

  if (!authContext.userId) {
    redirect(redirectPath ? `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}` : "/sign-in");
  }

  if (canAccessAdmin(authContext)) {
    redirect("/admin");
  }

  if (canAccessBuyerApp(authContext)) {
    redirect(redirectPath ?? "/");
  }

  redirect("/onboarding/buyer");
}
