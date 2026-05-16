import { auth, currentUser } from "@clerk/nextjs/server";

const SUPER_ADMIN_EMAIL = "super_admin@lama.com";

export type AuthContext = {
  userId: string | null;
  email: string | null;
  name: string | null;
  roles: string[];
};

export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? null;
}

export function isSuperAdminEmail(email: string | null | undefined) {
  return normalizeEmail(email) === SUPER_ADMIN_EMAIL;
}

export function getRolesForEmail(email: string | null | undefined) {
  return isSuperAdminEmail(email) ? ["super_admin"] : ["user"];
}

export async function getAuthContext(): Promise<AuthContext> {
  if (!isClerkConfigured()) {
    return { userId: null, email: null, name: null, roles: [] };
  }

  try {
    const session = await auth();
    if (!session.userId) {
      return { userId: null, email: null, name: null, roles: [] };
    }

    const user = await currentUser();
    const claims = session.sessionClaims as Record<string, unknown> | null | undefined;
    const email =
      normalizeEmail((claims?.email as string | undefined) ?? user?.primaryEmailAddress?.emailAddress) ??
      normalizeEmail(user?.emailAddresses[0]?.emailAddress);
    const name = user?.fullName ?? user?.username ?? null;

    return {
      userId: session.userId,
      email,
      name,
      roles: getRolesForEmail(email)
    };
  } catch {
    return { userId: null, email: null, name: null, roles: [] };
  }
}

export function canAccessBuyerApp(authContext: AuthContext) {
  return (
    authContext.roles.includes("user") ||
    authContext.roles.includes("buyer") ||
    authContext.roles.includes("super_admin")
  );
}

export function canAccessAdmin(authContext: AuthContext) {
  return authContext.roles.includes("super_admin");
}
