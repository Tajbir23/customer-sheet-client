module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#374151',
          light: '#6b7280',
          dark: '#1f2937',
        },
        blue: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        green: '#10b981',
        red: '#ef4444',
        orange: '#f59e0b',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'space-1': '0.25rem',
        'space-2': '0.5rem',
        'space-3': '0.75rem',
        'space-4': '1rem',
        'space-5': '1.25rem',
        'space-6': '1.5rem',
        'space-8': '2rem',
      },
      transitionDuration: {
        'DEFAULT': '200ms',
      }
    },
  },
  plugins: [],
};
