import { AppError } from "./http/errors";
import { getRequestIP } from "./http/handler";
import { backend } from "./cache";

const RATE_LIMIT_PREFIX = "rate";

class MemoryRateLimiter {
  private requests = new Map<string, number[]>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter((time) => time > windowStart);

    if (recentRequests.length >= this.maxRequests) {
      return true;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    if (Math.random() < 0.05) {
      this.cleanup();
    }

    return false;
  }

  private cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, times] of this.requests.entries()) {
      const filtered = times.filter((time) => time > windowStart);
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
  }
}

class DistributedRateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private memoryFallback: MemoryRateLimiter;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.memoryFallback = new MemoryRateLimiter(windowMs, maxRequests);
  }

  async isRateLimited(key: string): Promise<boolean> {
    const window = Math.floor(Date.now() / this.windowMs);
    const windowKey = `${RATE_LIMIT_PREFIX}:${key}:${window}`;

    try {
      const count = await backend.incr(windowKey);
      if (count === 1) {
        await backend.expire(windowKey, Math.ceil(this.windowMs / 1000));
      }
      return count > this.maxRequests;
    } catch {
      return this.memoryFallback.isRateLimited(key);
    }
  }
}

export { DistributedRateLimiter };

export async function enforceRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number,
  message = "Too many requests."
): Promise<void> {
  const limiter = new DistributedRateLimiter(windowMs, maxRequests);
  const limited = await limiter.isRateLimited(key);
  if (limited) {
    throw AppError.tooManyRequests(message);
  }
}

export async function enforceRequestRateLimit(
  request: Request,
  scope: string,
  windowMs: number,
  maxRequests: number,
  message = "Too many requests."
): Promise<void> {
  const key = `${scope}:${getRequestIP(request)}`;
  await enforceRateLimit(key, windowMs, maxRequests, message);
}
