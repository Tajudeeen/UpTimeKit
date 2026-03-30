'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { RpcStatus } from '@/lib/helpers';

export interface RpcEndpointStatus {
  name: string;
  url: string;
  isPrimary: boolean;
  latencyMs: number | null;
  status: RpcStatus;
  checkedAt: number;
}

export interface LatencyPoint {
  time: string;
  latency: number | null;
}

interface UseRpcStatusResult {
  endpoints: RpcEndpointStatus[];
  latencyHistory: Record<string, LatencyPoint[]>; // keyed by endpoint name
  isLoading: boolean;
  isError: boolean;
  lastChecked: Date | null;
}

const MAX_HISTORY = 20;

export function useRpcStatus(pollInterval = 10_000): UseRpcStatusResult {
  const [endpoints, setEndpoints] = useState<RpcEndpointStatus[]>([]);
  const [latencyHistory, setLatencyHistory] = useState<Record<string, LatencyPoint[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/rpc-status', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { endpoints: RpcEndpointStatus[] } = await res.json();

      setEndpoints(json.endpoints);
      setIsError(false);
      setLastChecked(new Date());

      // Append to latency history
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLatencyHistory((prev) => {
        const updated = { ...prev };
        for (const ep of json.endpoints) {
          const existing = updated[ep.name] ?? [];
          const next = [
            ...existing,
            { time: now, latency: ep.latencyMs },
          ].slice(-MAX_HISTORY);
          updated[ep.name] = next;
        }
        return updated;
      });
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    timerRef.current = setInterval(fetchStatus, pollInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStatus, pollInterval]);

  return { endpoints, latencyHistory, isLoading, isError, lastChecked };
}