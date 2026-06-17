import { NextResponse } from "next/server";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { listFavoriteProductIds } from "@/lib/favorites-store";
import { getPersonalizedCatalogProducts, hasBuyerPreferences } from "@/lib/seller-service";
import { recommendationQuerySchema } from "@/lib/ai/schemas";
import { checkAIRateLimit, getAIRateLimitKey } from "@/lib/ai/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authContext = await getAuthContext();

  if (!authContext.userId || !canAccessBuyerApp(authContext)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const rateLimit = checkAIRateLimit({
    key: `${getAIRateLimitKey(request, "recommendations")}:${authContext.userId}`,
    limit: 30,
    windowMs: 5 * 60_000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = recommendationQuerySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parametros invalidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const buyer = await getBuyer(authContext.userId);

  if (!hasBuyerPreferences(buyer?.preferencias)) {
    return NextResponse.json(
      { items: [], recommendationReasons: {}, source: "fallback" },
      { headers: { "Cache-Control": "private, max-age=300" } }
    );
  }

  const favoriteProductIds = await listFavoriteProductIds(authContext.userId);
  const recommendations = await getPersonalizedCatalogProducts({
    preferences: buyer.preferencias,
    favoriteProductIds,
    pageSize: 1,
    recommendedLimit: parsed.data.limit
  });
  const source = Object.keys(recommendations.recommendationReasons).length ? "ai" : "fallback";

  return NextResponse.json(
    {
      items: recommendations.personalizedItems,
      recommendationReasons: recommendations.recommendationReasons,
      source
    },
    { headers: { "Cache-Control": "private, max-age=300" } }
  );
}
