import { NextResponse } from 'next/server';
import { baseClient } from '@/lib/viem-client';
import { checkRateLimit, calcAvgBlockTime, calcTps, formatGasPrice } from '@/lib/helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function fetchMetricsSafely() {
  // Fetch in parallel for speed
  const [blockNumber, gasPrice, feeHistory] = await Promise.all([
    baseClient.getBlockNumber(),
    baseClient.getGasPrice(),
    baseClient.getFeeHistory({
      blockCount: 10,
      rewardPercentiles: [50],
    }).catch(() => null),
  ]);

  // Fetch last 5 blocks for block time + TPS calculation
  const blockNums = Array.from({ length: 5 }, (_, i) => blockNumber - BigInt(i));
  const blocks = await Promise.all(
    blockNums.map((n) =>
      baseClient.getBlock({ blockNumber: n, includeTransactions: false }).catch(() => null)
    )
  );

  const validBlocks = blocks.filter(Boolean) as Awaited<ReturnType<typeof baseClient.getBlock>>[];

  const avgBlockTime = calcAvgBlockTime(
    validBlocks.map((b) => ({ timestamp: b.timestamp }))
  );

  const txCounts = validBlocks.map((b) => b.transactions.length);
  const blockTimes = validBlocks
    .slice(0, -1)
    .map((b, i) => Number(validBlocks[i].timestamp) - Number(validBlocks[i + 1].timestamp));

  const tps = calcTps(txCounts, blockTimes);

  return {
    blockNumber: blockNumber.toString(),
    gasPrice: formatGasPrice(gasPrice),
    avgBlockTime: avgBlockTime.toFixed(2),
    tps: tps.toFixed(2),
    baseFee: feeHistory?.baseFeePerGas?.at(-1)
      ? formatGasPrice(feeHistory.baseFeePerGas.at(-1) as bigint)
      : null,
    latestBlock: validBlocks[0]
      ? {
          hash: validBlocks[0].hash,
          txCount: validBlocks[0].transactions.length,
          timestamp: validBlocks[0].timestamp.toString(),
          gasUsed: validBlocks[0].gasUsed.toString(),
          gasLimit: validBlocks[0].gasLimit.toString(),
        }
      : null,
    fetchedAt: Date.now(),
  };
}

export async function GET(request: Request) {
  // Rate limiting: 30 req/min per IP
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`metrics:${ip}`, 30)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const data = await fetchMetricsSafely();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[metrics] RPC error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch metrics', detail: String(err) },
      { status: 502 }
    );
  }
}