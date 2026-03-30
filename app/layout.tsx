import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UptimeKit — Base Network Monitor',
  description: 'Real-time health and uptime dashboard for the Base blockchain network.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#F8FAFF] antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid rgba(0,82,255,0.15)',
              borderRadius: '12px',
              boxShadow: '0 4px 24px -4px rgba(0,82,255,0.15)',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}