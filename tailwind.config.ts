import type { Config } from 'tailwindcss';

const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: withVar('--bg'),
        surface: withVar('--surface'),
        'surface-2': withVar('--surface-2'),
        fg: withVar('--fg'),
        muted: withVar('--muted'),
        subtle: withVar('--subtle'),
        line: withVar('--line'),
        accent: withVar('--accent'),
        'accent-fg': withVar('--accent-fg'),
        'accent-soft': withVar('--accent-soft'),
        key: withVar('--key'),
        rel: withVar('--rel'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      maxWidth: { content: '70rem' },
      fontSize: {
        'cv-xs': ['10.5px', '1.45'],
        'cv-sm': ['11.5px', '1.45'],
        'cv-base': ['12.5px', '1.5'],
        'cv-lg': ['13.5px', '1.4'],
        'cv-xl': ['15px', '1.3'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both' },
    },
  },
  plugins: [],
} satisfies Config;
