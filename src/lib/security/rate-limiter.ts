interface RateRecord {
  count: number;
  resetAt: number;
}

const cache = new Map<string, RateRecord>();

export function checkRateLimit(ip: string, limit = 15, windowSeconds = 60): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = cache.get(ip);

  if (!record || now > record.resetAt) {
    cache.set(ip, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}
