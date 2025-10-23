/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#102A43',
          600: '#0f172a',
          700: '#0f172a',
          800: '#0f172a',
          900: '#0f172a',
        },
        client: {
          background: '#FFFFFF',
          text: '#102A43',
          'text-light': '#334E68',
          'text-muted': '#627D98',
        },
      },
    },
  },
  plugins: [],
}


