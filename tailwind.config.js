/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta monocromática — negro profundo + grises
        'base':      '#0a0a0a',   // fondo global
        'surface':   '#141414',   // cards / paneles
        'elevated':  '#1c1c1c',   // inputs / elementos elevados
        'border':    'rgba(255,255,255,0.07)',
        'border-md': 'rgba(255,255,255,0.12)',
        'border-lg': 'rgba(255,255,255,0.20)',
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'lato':   ['Lato', 'sans-serif'],
        'marker': ['Permanent Marker', 'cursive'],
      },
      borderRadius: {
        'card': '20px',
        'btn':  '100px',
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
        'form':   '0 2px 4px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.5)',
        'btn':    '0 1px 2px rgba(0,0,0,0.4)',
        'inset':  'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        'xs': '4px',
      },
    },
  },
  plugins: [],
};
