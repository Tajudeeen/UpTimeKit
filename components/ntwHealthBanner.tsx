'use client';

import { RpcEndpointStatus } from '@/hooks/useRpcstatus';
import clsx from 'clsx';

interface NetworkHealthBannerProps {
  endpoints: RpcEndpointStatus[];
  isLoading: boolean;
}

function deriveOverallHealth(endpoints: RpcEndpointStatus[]) {
  if (endpoints.length === 0) return 'unknown';
  const down = endpoints.filter((e) => e.status === 'down').length;
  const slow = endpoints.filter((e) => e.status === 'slow').length;
  if (down === endpoints.length) return 'down';
  if (down > 0 || slow > 0) return 'degraded';
  return 'healthy';
}

export default function NetworkHealthBanner({
  endpoints,
  isLoading,
}: NetworkHealthBannerProps) {
  if (isLoading) {
    return <div className="skeleton h-12 w-full rounded-2xl" />;
  }

  const health = deriveOverallHealth(endpoints);

  const config = {
    healthy: {
      bg: 'bg-emerald-50 border-emerald-200',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
      label: 'All Systems Operational',
      sub: 'All RPC endpoints are online and responding normally.',
    },
    degraded: {
      bg: 'bg-amber-50 border-amber-200',
      dot: 'bg-amber-400',
      text: 'text-amber-700',
      label: 'Partial Degradation',
      sub: 'Some RPC endpoints are experiencing elevated latency or downtime.',
    },
    down: {
      bg: 'bg-red-50 border-red-200',
      dot: 'bg-red-500',
      text: 'text-red-700',
      label: 'Network Unavailable',
      sub: 'All monitored RPC endpoints appear to be down.',
    },
    unknown: {
      bg: 'bg-slate-50 border-slate-200',
      dot: 'bg-slate-400',
      text: 'text-slate-600',
      label: 'Checking Status…',
      sub: 'Fetching network status for the first time.',
    },
  }[health];

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-2xl border animate-in',
        config.bg
      )}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <span
          className={clsx(
            'absolute w-4 h-4 rounded-full opacity-30 status-ping',
            config.dot
          )}
        />
        <span className={clsx('w-2.5 h-2.5 rounded-full', config.dot)} />
      </div>
      <div className="min-w-0">
        <span className={clsx('text-sm font-semibold', config.text)}>
          {config.label}
        </span>
        <span className="hidden sm:inline text-xs text-slate-400 ml-2">
          {config.sub}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        {endpoints.map((ep) => (
          <span
            key={ep.name}
            title={`${ep.name}: ${ep.status}`}
            className={clsx('w-2 h-2 rounded-full', {
              'bg-emerald-500': ep.status === 'online',
              'bg-amber-400': ep.status === 'slow',
              'bg-red-500': ep.status === 'down',
            })}
          />
        ))}
      </div>
    </div>
  );
}