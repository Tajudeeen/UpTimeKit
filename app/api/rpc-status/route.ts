import { NextResponse } from 'next/server';
import { checkRateLimit, getRpcStatus } from '@/lib/helpers';
import { createClientForRpc, RPC_ENDPOINTS } from '@/lib/viem-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function pingRpc(url: string): Promise<{ latencyMs: number | null; error?: string }> {
  const start = Date.now();
  try {
    const client = createClientForRpc(url);
    await client.getBlockNumber();
    return { latencyMs: Date.now() - start };
  } catch (err) {
    return { latencyMs: null, error: String(err) };
  }
}

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`rpc-status:${ip}`, 20)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const results = await Promise.all(
    RPC_ENDPOINTS.map(async (endpoint: { url: string; name: any; isPrimary: any; }) => {
      const { latencyMs, error } = await pingRpc(endpoint.url);
      return {
        name: endpoint.name,
        url: endpoint.url,
        isPrimary: endpoint.isPrimary,
        latencyMs,
        status: getRpcStatus(latencyMs),
        error: error ?? null,
        checkedAt: Date.now(),
      };
    })
  );

  return NextResponse.json({ endpoints: results }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}