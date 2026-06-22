/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50:  '#FFFCF9',   // near-white cream
          100: '#FFF8F0',   // main background
          200: '#EDE6D8',   // light warm gray — cards, borders
          300: '#D4CAAE',   // muted elements
          400: '#B0A882',   // secondary text / icons
          500: '#978F66',   // primary accent — olive gold
          600: '#7D7655',   // darker olive
          700: '#625C41',   // dark olive
          800: '#3A3828',   // near-black
          900: '#1F1E14',   // darkest
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)',    'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia',   'serif'],
      },
      keyframes: {
        drift: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.55' },
        },
      },
      animation: {
        'drift':      'drift 22s linear infinite',
        'fade-up':    'fadeUp 0.35s ease-out forwards',
        'pulse-soft': 'pulse_soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
