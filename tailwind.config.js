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
          DEFAULT: '#0F766E',
          hover: '#0D5C56',
          light: '#0D9488',
        },
        secondary: {
          DEFAULT: '#0D9488',
          hover: '#0F766E',
          light: '#14B8A6',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#0D9488',
        surface: '#F8FAFC',
        'text-body': '#1F2937',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
