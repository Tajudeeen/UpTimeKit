import { formatGwei } from 'viem';

// ─── Formatting ────────────────────────────────────────────────────────────────

export function formatBlockNumber(n: bigint): string {
  return Number(n).toLocaleString('en-US');
}

export function formatGasPrice(wei: bigint): string {
  const gwei = parseFloat(formatGwei(wei));
  return gwei.toFixed(2);
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatTps(tps: number): string {
  return tps.toFixed(1);
}

export function formatTimestamp(ts: number | bigint): string {
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleTimeString('en-US', { hour12: false });
}

export function shortenHash(hash: string): string {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

// ─── Status Helpers ────────────────────────────────────────────────────────────

export type RpcStatus = 'online' | 'slow' | 'down';

export function getRpcStatus(latencyMs: number | null): RpcStatus {
  if (latencyMs === null) return 'down';
  if (latencyMs > 2000) return 'slow';
  return 'online';
}

export function getStatusColor(status: RpcStatus) {
  switch (status) {
    case 'online': return { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    case 'slow':   return { dot: 'bg-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'   };
    case 'down':   return { dot: 'bg-red-500',      text: 'text-red-600',     bg: 'bg-red-50 border-red-200'       };
  }
}

// ─── Rate Limiting (simple in-memory, per-route) ───────────────────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerMinute = 30): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= maxPerMinute) return false;
  entry.count++;
  return true;
}

// ─── Block time calculation ────────────────────────────────────────────────────

export function calcAvgBlockTime(blocks: Array<{ timestamp: bigint }>): number {
  if (blocks.length < 2) return 2.0; // Base target ~2s
  const times: number[] = [];
  for (let i = 1; i < blocks.length; i++) {
    times.push(Number(blocks[i - 1].timestamp) - Number(blocks[i].timestamp));
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return Math.max(0.5, Math.min(avg, 30)); // clamp sanity
}

// ─── TPS estimation ────────────────────────────────────────────────────────────

export function calcTps(
  txCounts: number[],
  blockTimes: number[],
): number {
  if (txCounts.length === 0 || blockTimes.length === 0) return 0;
  const totalTx = txCounts.reduce((a, b) => a + b, 0);
  const totalTime = blockTimes.reduce((a, b) => a + b, 0);
  if (totalTime === 0) return 0;
  return totalTx / totalTime;
}