/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F4EE',
        surface: '#FFFFFF',
        sidebar: '#EBE6DA',
        sidebarHover: '#E2DDCF',
        borderCream: '#E8E2D5',
        forest: {
          DEFAULT: '#1E3A2B',
          hover: '#284E3A',
          dark: '#14271D',
          light: '#EAF4EE',
          text: '#1E3A2B',
        },
        charcoal: {
          DEFAULT: '#1E2621',
          muted: '#6E7570',
          light: '#8E9690',
        },
        pastel: {
          mint: '#EAF4EE',
          mintText: '#236B43',
          peach: '#FDF0ED',
          peachText: '#C34E32',
          yellow: '#FEF7E6',
          yellowText: '#A1741F',
          purple: '#F0EFFE',
          purpleText: '#5344B5',
          blue: '#EBF5FA',
          blueText: '#256E93',
          grey: '#F3F4F6',
          greyText: '#4B5563',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(30, 58, 43, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(30, 58, 43, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 20px 40px -10px rgba(30, 58, 43, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
