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
      /**
       * CV type scale. px here renders at px * 0.75 pt in the PDF (96dpi to 72pt),
       * so these land at roughly 10.1, 10.5 and 11.25pt.
       *
       * They used to be 10.5/11.5/12.5px, which measured 7.9/8.6/9.4pt in the
       * generated file. That passed every parser and was painful for a person to
       * read: MIT puts the floor at 10pt. One page has to come from cutting
       * content, not from shrinking the type below what a recruiter will read.
       */
      fontSize: {
        'cv-xs': ['11.9px', '1.62'],
        'cv-sm': ['12.4px', '1.72'],
        'cv-base': ['13.6px', '1.3'],
        'cv-lg': ['16px', '1.35'],
        'cv-xl': ['18px', '1.3'],
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
