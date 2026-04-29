/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/tracking/**/*.{js,jsx}',
    './src/hooks/useDeviceStatus.js',
  ],
  // Prefix to avoid Bootstrap conflicts
  prefix: '',
  // Do not inject Tailwind base reset — Bootstrap already handles resets
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border, 214.3 31.8% 91.4%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 222.2 84% 4.9%))',
        muted: {
          DEFAULT: 'hsl(var(--muted, 210 40% 96.1%))',
          foreground: 'hsl(var(--muted-foreground, 215.4 16.3% 46.9%))',
        },
      },
    },
  },
  plugins: [],
};
