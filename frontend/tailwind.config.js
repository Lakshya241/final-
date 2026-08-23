/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FFFDF9",
          100: "#FDF8F0",
          200: "#F5EFE3",
          300: "#EAE0D0",
          400: "#DDD0BA",
          500: "#C9B99A",
        },
        gold: {
          100: "#FDF4D8",
          200: "#F5E199",
          300: "#ECD46A",
          400: "#E8C96A",
          500: "#C9A84C",
          600: "#B08A30",
          700: "#9A7730",
          800: "#7A5D22",
          900: "#5C4518",
        },
        charcoal: {
          50:  "#F5F5F5",
          100: "#E8E8E8",
          200: "#D0D0D0",
          300: "#ABABAB",
          400: "#858585",
          500: "#5E5E5E",
          600: "#404040",
          700: "#2E2E30",
          800: "#242428",
          900: "#1C1C1E",
          950: "#111113",
        },
        rose: {
          gold: "#B76E79",
          light: "#D4909A",
          pale:  "#F0D5D9",
        },
        warm: {
          white: "#FEFCF8",
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif:   ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans:    ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        widest: '0.25em',
        'ultra-wide': '0.35em',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
      },
      boxShadow: {
        'gold':       '0 8px 32px rgba(201, 168, 76, 0.25)',
        'gold-lg':    '0 16px 48px rgba(201, 168, 76, 0.35)',
        'card':       '0 4px 24px rgba(0, 0, 0, 0.07)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'dark':       '0 24px 64px rgba(0, 0, 0, 0.35)',
        'inner-gold': 'inset 0 1px 0 rgba(201, 168, 76, 0.3)',
      },
      backgroundImage: {
        'gold-gradient':       'linear-gradient(135deg, #E8C96A 0%, #C9A84C 50%, #9A7730 100%)',
        'gold-gradient-soft':  'linear-gradient(135deg, #F5E199 0%, #C9A84C 100%)',
        'dark-gradient':       'linear-gradient(135deg, #1C1C1E 0%, #2A2A2E 100%)',
        'cream-gradient':      'linear-gradient(135deg, #FDF8F0 0%, #F5EFE3 50%, #EAE0D0 100%)',
        'hero-pattern':        "radial-gradient(circle at 20% 80%, rgba(201, 168, 76, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(183, 110, 121, 0.08) 0%, transparent 50%)",
        'rose-gradient':       'linear-gradient(135deg, #D4909A 0%, #B76E79 100%)',
      },
      animation: {
        'float-slow':   'float-slow 5s ease-in-out infinite',
        'float-medium': 'float-medium 4s ease-in-out infinite',
        'spin-slow':    'spin-slow 12s linear infinite',
        'pulse-gold':   'pulse-gold 2.5s ease-in-out infinite',
        'fade-in-up':   'fadeInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'scale-in':     'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-left':   'slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'marquee':      'marquee 28s linear infinite',
        'shimmer':      'shimmer 1.5s infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':      { transform: 'translateY(-8px) rotate(3deg)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(201, 168, 76, 0)' },
        },
        'fadeInUp': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scaleIn': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slideInLeft': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
