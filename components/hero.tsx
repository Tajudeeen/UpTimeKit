'use client';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16">
      {/* Background gradient + grid */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Chain badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-base-100 rounded-full px-3.5 py-1.5 shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse-slow" />
          <span className="text-xs font-semibold text-[#0052FF] tracking-wide uppercase">
            Chain ID 8453
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          Base Network{' '}
          <span className="text-[#0052FF]">Health</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          Real-time on-chain metrics, RPC latency, and block activity for the Base blockchain — refreshed every 8 seconds.
        </p>
      </div>
    </section>
  );
}