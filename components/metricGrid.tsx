'use client';

import { Metrics } from "@/hooks/useMetric";
import MetricCard from "./metricCard";


interface MetricsGridProps {
  data: Metrics | null;
  isLoading: boolean;
  isError: boolean;
}

const BlockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 3H8L2 7h20l-6-4z" />
  </svg>
);

const GasIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22V8l9-6 9 6v14" />
    <path d="M9 22V12h6v10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TpsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const FeeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const TxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export default function MetricsGrid({ data, isLoading, isError }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard
        label="Block Height"
        value={data?.blockNumber ?? null}
        icon={<BlockIcon />}
        isLoading={isLoading}
        isError={isError}
        subtext="Latest confirmed"
      />
      <MetricCard
        label="Gas Price"
        value={data?.gasPrice ?? null}
        unit="Gwei"
        icon={<GasIcon />}
        isLoading={isLoading}
        isError={isError}
      />
      <MetricCard
        label="Block Time"
        value={data?.avgBlockTime ?? null}
        unit="s"
        icon={<ClockIcon />}
        isLoading={isLoading}
        isError={isError}
        subtext="6-block average"
        accentColor="text-emerald-500"
      />
      <MetricCard
        label="TPS"
        value={data?.tps ?? null}
        icon={<TpsIcon />}
        isLoading={isLoading}
        isError={isError}
        subtext="Transactions/sec"
        accentColor="text-violet-500"
      />
      <MetricCard
        label="Base Fee"
        value={data?.baseFee ?? null}
        unit="Gwei"
        icon={<FeeIcon />}
        isLoading={isLoading}
        isError={isError}
        accentColor="text-amber-500"
      />
      <MetricCard
        label="Tx Count"
        value={data?.latestBlock?.txCount?.toString() ?? null}
        icon={<TxIcon />}
        isLoading={isLoading}
        isError={isError}
        subtext="Latest block"
        accentColor="text-rose-500"
      />
    </div>
  );
}