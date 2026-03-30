'use client';

import { Metrics } from '@/hooks/useMetric';
import { RpcEndpointStatus } from '@/hooks/useRpcstatus';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface AlertManagerProps {
  endpoints: RpcEndpointStatus[];
  metrics: Metrics | null;
}

export default function AlertManager({ endpoints, metrics }: AlertManagerProps) {
  const prevStatuses = useRef<Record<string, string>>({});
  const prevBlockNumber = useRef<string | null>(null);

  // Alert on RPC status changes
  useEffect(() => {
    if (!endpoints.length) return;

    for (const ep of endpoints) {
      const prev = prevStatuses.current[ep.name];
      if (!prev) {
        prevStatuses.current[ep.name] = ep.status;
        continue;
      }
      if (prev !== ep.status) {
        if (ep.status === 'down') {
          toast.error(`${ep.name} is down`, { id: ep.name });
        } else if (ep.status === 'slow') {
          toast(`${ep.name} is responding slowly`, {
            id: ep.name,
            icon: '⚠️',
          });
        } else if (ep.status === 'online' && prev !== 'online') {
          toast.success(`${ep.name} is back online`, { id: ep.name });
        }
        prevStatuses.current[ep.name] = ep.status;
      }
    }
  }, [endpoints]);

  // Alert if block height stalls (same block for >30s — detect by counting same value)
  const stalledCount = useRef(0);
  useEffect(() => {
    if (!metrics?.blockNumber) return;
    if (metrics.blockNumber === prevBlockNumber.current) {
      stalledCount.current += 1;
      if (stalledCount.current === 4) {
        // ~32 seconds (4 × 8s polls)
        toast.error('Block production may have stalled', { id: 'block-stall' });
      }
    } else {
      stalledCount.current = 0;
      prevBlockNumber.current = metrics.blockNumber;
    }
  }, [metrics?.blockNumber]);

  return null;
}