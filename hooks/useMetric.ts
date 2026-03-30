'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface Metrics {
  blockNumber: string;
  gasPrice: string;
  avgBlockTime: string;
  tps: string;
  baseFee: string | null;
  latestBlock: {
    hash: string;
    txCount: number;
    timestamp: string;
    gasUsed: string;
    gasLimit: string;
  } | null;
  fetchedAt: number;
}

interface UseMetricsResult {
  data: Metrics | null;
  isLoading: boolean;
  isError: boolean;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useMetrics(pollInterval = 8_000): UseMetricsResult {
  const [data, setData] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: Metrics = await res.json();
      setData(json);
      setIsError(false);
      setLastUpdated(new Date());
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    timerRef.current = setInterval(fetchMetrics, pollInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchMetrics, pollInterval]);

  return { data, isLoading, isError, lastUpdated, refresh: fetchMetrics };
}