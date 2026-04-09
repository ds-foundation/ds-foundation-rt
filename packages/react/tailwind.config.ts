// packages/react/tailwind.config.ts
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        sidebar: 'var(--sidebar-bg)',
        header: {
          DEFAULT: 'var(--header-bg)',
          foreground: 'var(--header-fg)',
        },
        tableheader: {
          DEFAULT: 'var(--table-header-bg)',
          foreground: 'var(--table-header-fg)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        gray: {
          '25': 'var(--gray-25)',
          '50': 'var(--gray-50)',
          '100': 'var(--gray-100)',
          '200': 'var(--gray-200)',
          '300': 'var(--gray-300)',
          '400': 'var(--gray-400)',
          '500': 'var(--gray-500)',
          '600': 'var(--gray-600)',
          '700': 'var(--gray-700)',
          '800': 'var(--gray-800)',
          '900': 'var(--gray-900)',
        },
        blue: {
          '100': 'var(--blue-100)',
          '200': 'var(--blue-200)',
          '300': 'var(--blue-300)',
          '400': 'var(--blue-400)',
          '500': 'var(--blue-500)',
          '600': 'var(--blue-600)',
          '700': 'var(--blue-700)',
          '800': 'var(--blue-800)',
          '900': 'var(--blue-900)',
        },
        green: {
          '100': 'var(--green-100)',
          '200': 'var(--green-200)',
          '300': 'var(--green-300)',
          '400': 'var(--green-400)',
          '500': 'var(--green-500)',
        },
        purple: {
          '100': 'var(--purple-100)',
          '200': 'var(--purple-200)',
          '300': 'var(--purple-300)',
          '400': 'var(--purple-400)',
          '500': 'var(--purple-500)',
        },
        pink: {
          '100': 'var(--pink-100)',
          '200': 'var(--pink-200)',
          '300': 'var(--pink-300)',
          '400': 'var(--pink-400)',
          '500': 'var(--pink-500)',
        },
        orange: {
          '100': 'var(--orange-100)',
          '200': 'var(--orange-200)',
          '300': 'var(--orange-300)',
          '400': 'var(--orange-400)',
          '500': 'var(--orange-500)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
