import { logger } from "../logger/logger";

export type CacheBackend = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
};

type RedisResponse<T = unknown> = {
  result?: T;
  error?: string;
};

class MemoryCacheBackend implements CacheBackend {
  private values = new Map<string, { value: string; expiresAt?: number }>();
  private readonly maxEntries = 500;

  private cleanupExpiredKeys(): void {
    const now = Date.now();
    for (const [key, entry] of this.values.entries()) {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.values.delete(key);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    const entry = this.values.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.values.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.values.size >= this.maxEntries) {
      this.cleanupExpiredKeys();
      if (this.values.size >= this.maxEntries) {
        const firstKey = this.values.keys().next().value;
        if (firstKey) this.values.delete(firstKey);
      }
    }

    this.values.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.values.delete(key);
  }

  async incr(key: string): Promise<number> {
    const entry = this.values.get(key);
    const existing =
      entry && (!entry.expiresAt || entry.expiresAt > Date.now()) ? parseInt(entry.value, 10) : 0;
    const next = existing + 1;
    this.values.set(key, { value: String(next), expiresAt: entry?.expiresAt });
    return next;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const entry = this.values.get(key);
    if (!entry) return;
    entry.expiresAt = Date.now() + ttlSeconds * 1000;
  }
}

class UpstashRedisBackend implements CacheBackend {
  constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  private async command<T = unknown>(parts: Array<string | number>): Promise<T | null> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parts),
    });

    const payload = (await response.json()) as RedisResponse<T>;

    if (!response.ok || payload.error) {
      throw new Error(payload.error || `Redis request failed (${response.status})`);
    }

    return (payload.result ?? null) as T | null;
  }

  async get(key: string): Promise<string | null> {
    return this.command<string>(["GET", key]);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const parts: Array<string | number> = ["SET", key, value];
    if (ttlSeconds) {
      parts.push("EX", ttlSeconds);
    }
    await this.command(parts);
  }

  async delete(key: string): Promise<void> {
    await this.command(["DEL", key]);
  }

  async incr(key: string): Promise<number> {
    return (await this.command<number>(["INCR", key])) ?? 0;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.command(["EXPIRE", key, ttlSeconds]);
  }
}

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN;
export const backend: CacheBackend =
  REDIS_URL && REDIS_TOKEN
    ? new UpstashRedisBackend(REDIS_URL, REDIS_TOKEN)
    : new MemoryCacheBackend();

const PUBLIC_CACHE_PREFIX = "cache:public";
const VERSION_PREFIX = "cache:version";

function getRequestSignature(requestUrl: string) {
  const url = new URL(requestUrl);
  return `${url.pathname}${url.search}`;
}

async function getVersion(namespace: string): Promise<string> {
  return (await backend.get(`${VERSION_PREFIX}:${namespace}`)) || "0";
}

export async function bumpPublicCacheVersion(namespace: string): Promise<void> {
  const versionKey = `${VERSION_PREFIX}:${namespace}`;
  await backend.set(versionKey, String(Date.now()));
}

export async function readPublicCache<T>(namespace: string, requestUrl: string): Promise<T | null> {
  const version = await getVersion(namespace);
  const cacheKey = `${PUBLIC_CACHE_PREFIX}:${namespace}:v${version}:${getRequestSignature(requestUrl)}`;
  const cached = await backend.get(cacheKey);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch (error) {
    logger.warn("Failed to parse cached payload", {
      namespace,
      cacheKey,
      error,
    });
    return null;
  }
}

export async function writePublicCache<T>(
  namespace: string,
  requestUrl: string,
  value: T,
  ttlSeconds = 300
): Promise<void> {
  const version = await getVersion(namespace);
  const cacheKey = `${PUBLIC_CACHE_PREFIX}:${namespace}:v${version}:${getRequestSignature(requestUrl)}`;
  await backend.set(cacheKey, JSON.stringify(value), ttlSeconds);
}
