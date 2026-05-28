import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export const COMPRADOR_ROLE = "comprador";
export const SUPER_ADMIN_ROLE = "super_admin";

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

function validEmail(email: string | null | undefined) {
  const normalizedEmail = normalizeEmail(email);
  return normalizedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ? normalizedEmail : null;
}

function metadataObject(metadata: unknown) {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? (metadata as Record<string, unknown>)
    : {};
}

export function normalizeRoles(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((role): role is string => typeof role === "string" && role.trim().length > 0))];
}

export function getRolesFromMetadata(metadata: unknown) {
  return normalizeRoles(metadataObject(metadata).roles);
}

export function hasBuyerAccess(roles: string[]) {
  return roles.includes(COMPRADOR_ROLE) && !roles.includes(SUPER_ADMIN_ROLE);
}

export async function ensureCompradorRole(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const publicMetadata = metadataObject(user.publicMetadata);
  const currentRoles = getRolesFromMetadata(publicMetadata);

  if (currentRoles.includes(SUPER_ADMIN_ROLE) || currentRoles.includes(COMPRADOR_ROLE)) {
    return currentRoles;
  }

  const roles = [...currentRoles, COMPRADOR_ROLE];

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...publicMetadata,
      roles
    }
  });

  return roles;
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
      validEmail(claims?.email as string | undefined) ??
      validEmail(user?.primaryEmailAddress?.emailAddress) ??
      validEmail(user?.emailAddresses[0]?.emailAddress);
    const name = user?.fullName ?? user?.username ?? null;
    const sessionRoles = normalizeRoles(claims?.roles);
    const metadataRoles = getRolesFromMetadata(user?.publicMetadata);
    const roles = normalizeRoles([...sessionRoles, ...metadataRoles]);

    return {
      userId: session.userId,
      email,
      name,
      roles
    };
  } catch {
    return { userId: null, email: null, name: null, roles: [] };
  }
}

export function canAccessBuyerApp(authContext: AuthContext) {
  return hasBuyerAccess(authContext.roles);
}

export function canAccessAdmin(authContext: AuthContext) {
  return authContext.roles.includes(SUPER_ADMIN_ROLE);
}
