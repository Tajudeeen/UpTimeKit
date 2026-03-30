'use client';

import { BlockInfo } from '@/hooks/useBlock';
import clsx from 'clsx';

interface ActivityFeedProps {
  blocks: BlockInfo[];
  isLoading: boolean;
  isError: boolean;
}

function GasBar({ pct }: { pct: number }) {
  const color =
    pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={clsx('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

function timeAgo(ts: string): string {
  const diff = Math.floor(Date.now() / 1000) - parseInt(ts);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function ActivityFeed({ blocks, isLoading, isError }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="card p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-1 w-full rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card p-4 flex items-center justify-center h-48 text-sm text-slate-400">
        Failed to load blocks
      </div>
    );
  }

  return (
    <div className="card p-4 space-y-1 divide-y divide-slate-50">
      {blocks.map((block) => (
        <div key={block.number} className="py-2.5 first:pt-0 last:pb-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold text-slate-700">
                #{Number(block.number).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{block.hash}</span>
            </div>
            <span className="text-[10px] text-slate-300">{timeAgo(block.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <GasBar pct={block.gasUtilPct} />
            <span className="text-[10px] text-slate-400 font-mono w-10 text-right shrink-0">
              {block.gasUtilPct}%
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>{block.txCount} txs</span>
            <span>{block.size ? (parseInt(block.size) / 1024).toFixed(1) + ' KB' : '—'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}