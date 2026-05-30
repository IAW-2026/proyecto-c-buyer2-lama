type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForAIRateLimit = globalThis as unknown as {
  aiRateLimits?: Map<string, RateLimitEntry>;
};

const aiRateLimits = globalForAIRateLimit.aiRateLimits ?? new Map<string, RateLimitEntry>();
globalForAIRateLimit.aiRateLimits = aiRateLimits;

export function checkAIRateLimit({
  key,
  limit,
  windowMs
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const current = aiRateLimits.get(key);

  if (!current || current.resetAt <= now) {
    aiRateLimits.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000)
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function getAIRateLimitKey(request: Request, scope: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${scope}:${forwardedFor || realIp || "anonymous"}`;
}
