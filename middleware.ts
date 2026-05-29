import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks/clerk"
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/compras(.*)",
  "/favoritos(.*)",
  "/onboarding/buyer(.*)",
  "/perfil(.*)",
  "/api/pagos"
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/post-login", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ico|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)"
  ]
};
