/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        'ink-faint': 'var(--ink-faint)',
        forest: {
          DEFAULT: 'var(--forest)',
          deep: 'var(--forest-deep)',
          tint: 'var(--forest-tint)',
        },
        navy: {
          DEFAULT: 'var(--navy)',
          tint: 'var(--navy-tint)',
        },
        amber: {
          DEFAULT: 'var(--amber)',
          deep: 'var(--amber-deep)',
          tint: 'var(--amber-tint)',
          ink: 'var(--amber-ink)',
        },
        success: {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-tint)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          tint: 'var(--danger-tint)',
        },
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
      },
      fontFamily: {
        display: [
          'Fraunces',
          'Iowan Old Style',
          'Palatino Linotype',
          'Palatino',
          'Georgia',
          'serif',
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 36, 29, 0.04), 0 20px 40px -28px rgba(22, 36, 29, 0.45)',
      },
    },
  },
  plugins: [],
};
