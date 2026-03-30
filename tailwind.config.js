/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          50:  '#e6eeff',
          100: '#c0d4ff',
          200: '#94b3ff',
          300: '#608aff',
          400: '#2d65ff',
          500: '#0052FF',
          600: '#0045d9',
          700: '#0036b3',
          800: '#00278d',
          900: '#001866',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'count-up': 'countUp 0.6s ease-out',
        'ping-once': 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.04), 0 4px 16px -4px rgba(0,82,255,0.08)',
        'card-hover': '0 4px 24px -4px rgba(0,82,255,0.18), 0 1px 3px 0 rgba(0,0,0,0.06)',
        'glow': '0 0 24px rgba(0,82,255,0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,82,255,0.12) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,82,255,0.03) 0%, rgba(0,82,255,0.0) 100%)',
      },
    },
  },
  plugins: [],
};