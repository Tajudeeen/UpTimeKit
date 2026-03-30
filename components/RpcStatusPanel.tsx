'use client';

import clsx from 'clsx';
import { getStatusColor, formatLatency } from '@/lib/helpers';
import { LatencyPoint, RpcEndpointStatus } from '@/hooks/useRpcstatus';
import LatencyChart from './latencyChart';

interface RpcStatusPanelProps {
  endpoints: RpcEndpointStatus[];
  latencyHistory: Record<string, LatencyPoint[]>;
  isLoading: boolean;
  lastChecked: Date | null;
}

const CHART_COLORS: Record<string, string> = {
  'Base Official': '#0052FF',
  'PublicNode': '#10b981',
  'BlastAPI': '#f59e0b',
};

export default function RpcStatusPanel({
  endpoints,
  latencyHistory,
  isLoading,
  lastChecked,
}: RpcStatusPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-6 w-16 rounded" />
            <div className="skeleton h-20 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {endpoints.map((ep) => {
          const colors = getStatusColor(ep.status);
          const chartColor = CHART_COLORS[ep.name] ?? '#0052FF';
          const history = latencyHistory[ep.name] ?? [];

          return (
            <div key={ep.name} className="card p-5 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <span
                      className={clsx(
                        'absolute w-3 h-3 rounded-full opacity-40 status-ping',
                        colors.dot
                      )}
                    />
                    <span className={clsx('w-2 h-2 rounded-full', colors.dot)} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{ep.name}</span>
                  {ep.isPrimary && (
                    <span className="text-[10px] font-medium text-[#0052FF] border border-base-200 rounded-full px-1.5 py-0.5 bg-base-50">
                      Primary
                    </span>
                  )}
                </div>
                <span className={clsx('text-xs font-semibold capitalize', colors.text)}>
                  {ep.status}
                </span>
              </div>

              {/* Latency */}
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {ep.latencyMs !== null ? formatLatency(ep.latencyMs) : '—'}
                </span>
                <span className="text-xs text-slate-400">avg</span>
              </div>

              {/* Chart */}
              <LatencyChart data={history} color={chartColor} name={ep.name} />

              {/* URL */}
              <p className="text-[10px] text-slate-300 font-mono truncate">{ep.url}</p>
            </div>
          );
        })}
      </div>

      {lastChecked && (
        <p className="text-xs text-slate-300 text-right">
          Checked at{' '}
          {lastChecked.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}