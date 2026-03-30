import { NextResponse } from 'next/server';
import { baseClient } from '@/lib/viem-client';
import { checkRateLimit } from '@/lib/helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`blocks:${ip}`, 20)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const latestBlock = await baseClient.getBlockNumber();

    // Fetch last 8 blocks
    const blockNums = Array.from({ length: 8 }, (_, i) => latestBlock - BigInt(i));
    const blocks = await Promise.all(
      blockNums.map((n) =>
        baseClient.getBlock({ blockNumber: n, includeTransactions: false }).catch(() => null)
      )
    );

    const validBlocks = blocks
      .filter(Boolean)
      .map((b) => {
        const block = b!;
        const gasUtilPct = block.gasLimit > 0n
          ? Number((block.gasUsed * 100n) / block.gasLimit)
          : 0;
        return {
          number: block.number?.toString() ?? '0',
          hash: block.hash ?? '',
          timestamp: block.timestamp.toString(),
          txCount: block.transactions.length,
          gasUsed: block.gasUsed.toString(),
          gasLimit: block.gasLimit.toString(),
          gasUtilPct,
          miner: block.miner,
          size: block.size?.toString() ?? '0',
        };
      });

    return NextResponse.json({ blocks: validBlocks }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[blocks] RPC error:', err);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 502 });
  }
}