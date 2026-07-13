/**
 * Minimal Upstash Redis REST helpers for lead intelligence.
 * Falls back to in-memory Map when env is missing (dev / no Redis).
 */

type ZMember = { score: number; member: string };

const memory = new Map<string, { value: string; expiresAt?: number }>();
const memoryZSets = new Map<string, ZMember[]>();

function upstashConfigured(): { base: string; token: string } | null {
  const base = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!base || !token) return null;
  return { base, token };
}

export async function redisCommand(args: Array<string | number>): Promise<unknown> {
  const cfg = upstashConfigured();
  if (!cfg) {
    const op = String(args[0]).toUpperCase();
    if (op === "GET") {
      const entry = memory.get(String(args[1]));
      if (!entry) return null;
      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        memory.delete(String(args[1]));
        return null;
      }
      return entry.value;
    }
    if (op === "SET") {
      const key = String(args[1]);
      const value = String(args[2]);
      let expiresAt: number | undefined;
      const exIdx = args.findIndex((a) => String(a).toUpperCase() === "EX");
      if (exIdx >= 0) {
        expiresAt = Date.now() + Number(args[exIdx + 1]) * 1000;
      }
      memory.set(key, { value, expiresAt });
      return "OK";
    }
    if (op === "ZADD") {
      const key = String(args[1]);
      const score = Number(args[2]);
      const member = String(args[3]);
      const list = memoryZSets.get(key) || [];
      const filtered = list.filter((m) => m.member !== member);
      filtered.push({ score, member });
      memoryZSets.set(key, filtered);
      return 1;
    }
    if (op === "ZREVRANGE") {
      const key = String(args[1]);
      const start = Number(args[2]);
      const stop = Number(args[3]);
      const list = [...(memoryZSets.get(key) || [])].sort((a, b) => b.score - a.score);
      const end = stop < 0 ? list.length : stop + 1;
      return list.slice(start, end).map((m) => m.member);
    }
    if (op === "DEL") {
      memory.delete(String(args[1]));
      memoryZSets.delete(String(args[1]));
      return 1;
    }
    return null;
  }

  const res = await fetch(`${cfg.base}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`upstash ${res.status}`);
  }
  const data = (await res.json()) as { result?: unknown };
  return data.result ?? null;
}

export async function redisGet(key: string): Promise<string | null> {
  const result = await redisCommand(["GET", key]);
  return typeof result === "string" ? result : null;
}

export async function redisSet(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> {
  if (ttlSeconds && ttlSeconds > 0) {
    await redisCommand(["SET", key, value, "EX", ttlSeconds]);
  } else {
    await redisCommand(["SET", key, value]);
  }
}

export async function redisDel(key: string): Promise<void> {
  await redisCommand(["DEL", key]);
}
