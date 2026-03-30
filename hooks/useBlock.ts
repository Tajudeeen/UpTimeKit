'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface BlockInfo {
  number: string;
  hash: string;
  timestamp: string;
  txCount: number;
  gasUsed: string;
  gasLimit: string;
  gasUtilPct: number;
  miner: string;
  size: string;
}

interface UseBlocksResult {
  blocks: BlockInfo[];
  isLoading: boolean;
  isError: boolean;
}

export function useBlocks(pollInterval = 8_000): UseBlocksResult {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch('/api/blocks', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { blocks: BlockInfo[] } = await res.json();
      setBlocks(json.blocks);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
    timerRef.current = setInterval(fetchBlocks, pollInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchBlocks, pollInterval]);

  return { blocks, isLoading, isError };
}