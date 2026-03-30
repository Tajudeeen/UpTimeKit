'use client';

import { useEffect, useState } from 'react';

interface NavbarProps {
  lastUpdated: Date | null;
}

export default function Navbar({ lastUpdated }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!lastUpdated) return;
    const fmt = () =>
      setTimeStr(
        lastUpdated.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    fmt();
  }, [lastUpdated]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0052FF] flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 tracking-tight text-[15px]">
            UptimeKit
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium border border-slate-200 rounded-full px-2 py-0.5">
            Base Mainnet
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {timeStr && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Updated {timeStr}
            </div>
          )}
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#0052FF] hover:text-blue-700 transition-colors"
          >
            Base →
          </a>
        </div>
      </div>
    </header>
  );
}