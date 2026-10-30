import type { Config } from 'tailwindcss';

const config: Config = {
  // Aktifkan dark mode via class (untuk future support)
  darkMode: ['class'],

  // Path file yang menggunakan class Tailwind
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // ============================================================
      // FONT: Plus Jakarta Sans
      // ============================================================
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },

      // ============================================================
      // WARNA CUSTOM TataDana
      // ============================================================
      colors: {
        // Primary: Orange TataDana
        primary: {
          DEFAULT: '#F97316',
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },

        // Background
        background: '#FFFFFF',
        surface: '#F9FAFB',

        // Border
        border: '#E5E7EB',

        // Text
        'text-primary':   '#111827',
        'text-secondary': '#6B7280',
        'text-muted':     '#9CA3AF',

        // Status warna
        success: {
          DEFAULT: '#10B981',
          light:   '#D1FAE5',
          dark:    '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light:   '#FEF3C7',
          dark:    '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light:   '#FEE2E2',
          dark:    '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light:   '#DBEAFE',
          dark:    '#2563EB',
        },

        // shadcn/ui compatible colors
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
      },

      // ============================================================
      // BORDER RADIUS
      // ============================================================
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ============================================================
      // ANIMASI CUSTOM
      // ============================================================
      keyframes: {
        // Animasi masuk dari bawah
        'slide-up': {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        // Animasi masuk dari kanan
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        // Animasi fade in
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Animasi bounce ringan untuk tombol
        'bounce-light': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        // Animasi shimmer untuk skeleton loading
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Animasi accordion
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        // Animasi pulse untuk notifikasi
        'pulse-orange': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(249, 115, 22, 0)' },
        },
      },
      animation: {
        'slide-up':       'slide-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in':        'fade-in 0.2s ease-out',
        'bounce-light':   'bounce-light 0.6s ease-in-out',
        shimmer:          'shimmer 1.5s infinite linear',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'pulse-orange':   'pulse-orange 2s infinite',
      },

      // ============================================================
      // BOX SHADOW CUSTOM
      // ============================================================
      boxShadow: {
        'card':         '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover':   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'primary':      '0 4px 14px 0 rgba(249, 115, 22, 0.4)',
        'primary-sm':   '0 2px 8px 0 rgba(249, 115, 22, 0.3)',
        'inner-orange': 'inset 0 2px 4px 0 rgba(249, 115, 22, 0.1)',
      },

      // ============================================================
      // BACKGROUND GRADIENTS
      // ============================================================
      backgroundImage: {
        'gradient-orange':         'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-orange-light':   'linear-gradient(135deg, #FED7AA 0%, #FEF3C7 100%)',
        'gradient-hero':           'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #FFF7ED 100%)',
        'shimmer':                 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
    },
  },

  plugins: [
    // Plugin untuk animasi (opsional, bisa tambahkan require('tailwindcss-animate'))
  ],
};

export default config;
