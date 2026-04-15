/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F97316',
          amber:  '#FBBF24',
          dark:   '#1C1410',
          cream:  '#FFF8F0',
          muted:  '#92400E',
        }
      },
      animation: {
        'rise': 'rise 4s linear infinite',
        'pulse-amber': 'pulseAmber 1.5s infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        rise: {
          '0%': { transform: 'translateY(0)', opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) scale(1.5)', opacity: '0' },
        },
        pulseAmber: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(251, 191, 36, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(251, 191, 36, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
