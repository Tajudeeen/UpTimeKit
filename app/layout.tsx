import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
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
  other: {
    'base:app_id': '69f214dd60934e840dedaad8',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>\n      <body className="min-h-screen bg-[#F8FAFF] antialiased">\n        {children}\n        <Toaster\n          position="top-right"\n          toastOptions={{\n            duration: 4000,\n            style: {\n              background: '#fff',\n              color: '#0f172a',\n              border: '1px solid rgba(0,82,255,0.15)',\n              borderRadius: '12px',\n              boxShadow: '0 4px 24px -4px rgba(0,82,255,0.15)',\n              fontFamily: 'var(--font-inter)',\n              fontSize: '14px',\n            },\n          }}\n        />\n      </body>\n    </html>\n  );\n}