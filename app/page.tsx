'use client';

import { useMetrics } from '@/hooks/useMetric';
import MetricsGrid from '@/components/metricGrid';
import NetworkHealthBanner from '@/components/ntwHealthBanner';
import { useRpcStatus } from '@/hooks/useRpcstatus';
import { useBlocks } from '@/hooks/useBlock';
import Navbar from '@/components/navbar';
import AlertManager from '@/components/AlertManager';
import Hero from '@/components/hero';
import RpcStatusPanel from '@/components/RpcStatusPanel';
import ActivityFeed from '@/components/ActivityFeed';
import Footer from '@/components/footer';

export default function HomePage() {
  const metrics = useMetrics(8_000);
  const rpcStatus = useRpcStatus(10_000);
  const blocks = useBlocks(8_000);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar lastUpdated={metrics.lastUpdated} />
      <AlertManager endpoints={rpcStatus.endpoints} metrics={metrics.data} />

      <main className="flex-1">
        {/* Hero */}
        <Hero />

        {/* Network health banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <NetworkHealthBanner
            endpoints={rpcStatus.endpoints}
            isLoading={rpcStatus.isLoading}
          />
        </div>

        {/* Metrics grid */}
        <section id="metrics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Live Metrics
          </h2>
          <MetricsGrid data={metrics.data} isLoading={metrics.isLoading} isError={metrics.isError} />
        </section>

        {/* RPC Status + Activity Feed */}
        <section id="rpc" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                RPC Endpoints
              </h2>
              <RpcStatusPanel
                endpoints={rpcStatus.endpoints}
                latencyHistory={rpcStatus.latencyHistory}
                isLoading={rpcStatus.isLoading}
                lastChecked={rpcStatus.lastChecked}
              />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Block Activity
              </h2>
              <ActivityFeed
                blocks={blocks.blocks}
                isLoading={blocks.isLoading}
                isError={blocks.isError}
              />
            </div>
          </div>
        </section>

        <div className="h-16" />
      </main>

      <Footer />
    </div>
  );
}