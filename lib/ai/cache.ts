type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const globalForAICache = globalThis as unknown as {
  aiMemoryCache?: Map<string, CacheEntry<unknown>>;
};

const aiMemoryCache = globalForAICache.aiMemoryCache ?? new Map<string, CacheEntry<unknown>>();
globalForAICache.aiMemoryCache = aiMemoryCache;

export function getAICache<T>(key: string): T | null {
  const entry = aiMemoryCache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    aiMemoryCache.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setAICache<T>(key: string, value: T, ttlMs: number) {
  aiMemoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

export function createAICacheKey(prefix: string, payload: unknown) {
  return `${prefix}:${JSON.stringify(payload)}`;
}
