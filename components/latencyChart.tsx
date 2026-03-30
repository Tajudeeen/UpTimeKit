'use client';

import { LatencyPoint } from '@/hooks/useRpcstatus';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface LatencyChartProps {
  data: LatencyPoint[];
  color?: string;
  name: string;
}

export default function LatencyChart({
  data,
  color = '#0052FF',
  name,
}: LatencyChartProps) {
  const filtered = data.filter((d) => d.latency !== null);

  if (filtered.length < 2) {
    return (
      <div className="h-20 flex items-center justify-center text-xs text-slate-300">
        Collecting data…
      </div>
    );
  }

  return (
    <div className="h-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid rgba(0,82,255,0.12)',
              borderRadius: 8,
              fontSize: 11,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            formatter={(v: number) => [`${v}ms`, 'Latency']}
            labelStyle={{ color: '#94a3b8', fontSize: 10 }}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad-${name})`}
            dot={false}
            connectNulls={false}
            activeDot={{ r: 3, stroke: color, strokeWidth: 2, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}