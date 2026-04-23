/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info:    'hsl(var(--info))',
        brand: {
          primary: '#6C72CC',
          emerald: '#10B981',
          cyan:    '#06B6D4',
          rose:    '#F03758',
          amber:   '#F59E0B',
          violet:  '#8B5CF6',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      fontFamily: {
        sans:    ['Roboto', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
        display: ['Roboto', 'system-ui', 'sans-serif'],
      },

      // Shifted ~2 steps larger than Tailwind default for mobile readability
      fontSize: {
        xs:    ['0.875rem',  { lineHeight: '1.25rem'  }],
        sm:    ['1rem',      { lineHeight: '1.625rem' }],
        base:  ['1.125rem',  { lineHeight: '1.75rem'  }],
        lg:    ['1.25rem',   { lineHeight: '1.875rem' }],
        xl:    ['1.4375rem', { lineHeight: '2rem'     }],
        '2xl': ['1.6875rem', { lineHeight: '2.125rem' }],
        '3xl': ['2.0625rem', { lineHeight: '2.5rem'   }],
        '4xl': ['2.5rem',    { lineHeight: '2.75rem'  }],
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
        },
        shimmer: {
          '100%': { transform: 'translateX(200%)' },
        },
        'logo-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0px hsl(var(--primary) / 0)' },
          '50%':      { boxShadow: '0 0 0 10px hsl(var(--primary) / 0.12)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-up':        'fade-up 0.4s ease-out both',
        'fade-in':        'fade-in 0.3s ease-out both',
        'pulse-soft':     'pulse-soft 2.5s ease-in-out infinite',
        shimmer:          'shimmer 0.7s ease-in-out',
        'logo-pulse':     'logo-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
