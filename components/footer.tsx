export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#0052FF] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-700">UptimeKit</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">Base Mainnet Monitor</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Chain ID 8453</span>
          <span className="text-slate-200">|</span>
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0052FF] transition-colors"
          >
            base.org
          </a>
          <span className="text-slate-200">|</span>
          <a
            href="https://docs.base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0052FF] transition-colors"
          >
            Docs
          </a>
        </div>
        <div>
            <span className="text-xs text-slate-300">Built by </span>
            <a
              href="https://x.com/Deeen_Code"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0052FF] transition-colors"
            >
              Deeen_Code
            </a>
                <span className="text-xs text-slate-300"> · </span>
        </div>
      </div>
    </footer>
  );
}