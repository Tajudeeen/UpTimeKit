'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | null;
  unit?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  subtext?: string;
  mono?: boolean;
  accentColor?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  isLoading,
  isError,
  subtext,
  mono = true,
  accentColor = 'text-[#0052FF]',
}: MetricCardProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef<string | null>(null);

  useEffect(() => {
    if (value && value !== prevValue.current && valueRef.current) {
      valueRef.current.classList.remove('flash-update');
      // Force reflow
      void valueRef.current.offsetWidth;
      valueRef.current.classList.add('flash-update');
      prevValue.current = value;
    }
  }, [value]);

  return (
    <div className="card p-5 flex flex-col gap-3 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <span className={clsx('opacity-70', accentColor)}>{icon}</span>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        {isLoading ? (
          <div className="skeleton h-8 w-32 rounded-lg" />
        ) : isError ? (
          <span className="text-2xl font-mono font-bold text-red-400">—</span>
        ) : (
          <>
            <span
              ref={valueRef}
              className={clsx(
                'stat-value leading-none',
                mono ? 'font-mono' : 'font-sans'
              )}
            >
              {value ?? '—'}
            </span>
            {unit && (
              <span className="text-sm font-medium text-slate-400 mb-0.5">{unit}</span>
            )}
          </>
        )}
      </div>

      {/* Subtext */}
      {subtext && !isLoading && (
        <p className="text-xs text-slate-400 leading-snug">{subtext}</p>
      )}
      {isLoading && <div className="skeleton h-3 w-24 rounded" />}
    </div>
  );
}