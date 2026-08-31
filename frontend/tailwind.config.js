/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            light: '#e0f2fe',
            DEFAULT: '#0284c7',
            dark: '#0369a1',
          },
          green: {
            light: '#dcfce7',
            DEFAULT: '#22c55e',
            dark: '#15803d',
          },
          yellow: {
            light: '#fef9c3',
            DEFAULT: '#eab308',
            dark: '#a16207',
          },
          orange: {
            light: '#ffedd5',
            DEFAULT: '#f97316',
            dark: '#c2410c',
          },
          coral: {
            light: '#ffe4e6',
            DEFAULT: '#f43f5e',
            dark: '#be123c',
          },
          purple: {
            light: '#f3e8ff',
            DEFAULT: '#a855f7',
            dark: '#7e22ce',
          }
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'playful': '0 8px 30px rgb(0,0,0,0.06)',
        'playful-hover': '0 20px 40px rgb(0,0,0,0.12)',
        'neon-blue': '0 0 15px rgba(2, 132, 199, 0.4)',
        'neon-green': '0 0 15px rgba(34, 197, 94, 0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
