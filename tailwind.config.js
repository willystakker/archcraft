/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#06060b',
        base: '#0a0a12',
        surface: '#111120',
        card: '#181828',
        border: '#252538',
        muted: '#2a2a42',
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
          to: { boxShadow: '0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.2)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
