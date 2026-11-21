/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#421E20', // Primary Burgundy
          dark: '#291416',    // Dark Burgundy
          light: '#5B2C2E',
          hover: '#35181A',
          subtle: '#542628',
          border: '#52292B',
        },
        gold: {
          DEFAULT: '#D9A441', // Gold
          light: '#E4BA62',
          dark: '#BD8728',
          hover: '#C79230',
          muted: '#F6ECD7',
          glow: 'rgba(217, 164, 65, 0.18)',
        },
        cream: {
          DEFAULT: '#F8F1E8', // Cream Background
          card: '#FFFDF9',    // Card Background
          hover: '#F2E8DC',
          dark: '#ECE0D0',
          border: '#E8DDD0',
        },
        main: {
          text: '#292323', // Main Text
        },
        secondary: {
          text: '#827875', // Secondary Text
        },
        status: {
          success: '#4F9564',
          danger: '#D95353',
          gold: '#D9A441',
          info: '#4B7BEC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(41, 20, 22, 0.04), 0 2px 8px rgba(41, 20, 22, 0.03)',
        'premium': '0 4px 20px -2px rgba(41, 20, 22, 0.06), 0 2px 6px -1px rgba(41, 20, 22, 0.03)',
        'elevated': '0 12px 32px -4px rgba(41, 20, 22, 0.12), 0 4px 10px -2px rgba(41, 20, 22, 0.05)',
        'gold': '0 4px 14px 0 rgba(217, 164, 65, 0.35)',
      },
      borderRadius: {
        'card': '1rem',
      }
    },
  },
  plugins: [],
}
