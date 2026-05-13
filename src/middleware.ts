import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { createClient as createSupabaseClient } from './utils/supabase/middleware';

const isProtectedRoute = createRouteMatcher([
  '/productos(.*)',
  '/carrito(.*)',
  '/checkout(.*)',
  '/pedidos(.*)',
  '/perfil(.*)',
  '/admin(.*)',
  '/api/carrito(.*)',
  '/api/pedidos(.*)',
  '/api/compradores(.*)',
  '/api/preferencias(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Refresh Supabase session
  const supabaseResponse = createSupabaseClient(req);

  if (isProtectedRoute(req)) auth().protect();

  return supabaseResponse;
});

export const config = {
  matcher: [
    '/((?!_next|static|.*\\..*|favicon.ico).*)',
    '/api/(.*)',
  ],
};
