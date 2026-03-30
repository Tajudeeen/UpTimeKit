import { createPublicClient, http, PublicClient } from 'viem';
import { base } from 'viem/chains';

const RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

// Singleton public client for Base mainnet
export const baseClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL, {
    timeout: 8_000,
    retryCount: 2,
    retryDelay: 500,
  }),
});

// List of RPC endpoints to monitor
export const RPC_ENDPOINTS = [
  {
    name: 'Base Official',
    url: 'https://mainnet.base.org',
    isPrimary: true,
  },
  {
    name: 'PublicNode',
    url: 'https://base.publicnode.com',
    isPrimary: false,
  },
  {
    name: 'BlastAPI',
    url: 'https://base-mainnet.public.blastapi.io',
    isPrimary: false,
  },
];

// Create a one-off client for a specific RPC URL (used for latency pings)
export function createClientForRpc(rpcUrl: string): PublicClient {
  return createPublicClient({
    chain: base,
    transport: http(rpcUrl, {
      timeout: 6_000,
      retryCount: 1,
    }),
  });
}