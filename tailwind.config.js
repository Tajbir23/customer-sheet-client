/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          deepest: "var(--bg-deepest)",
          deep: "var(--bg-deep)",
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
          hover: "var(--bg-hover)",
        },
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
          glow: "var(--border-glow)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
        },
        accent: {
          purple: {
            DEFAULT: "var(--accent-purple)",
            light: "var(--accent-purple-light)",
            dark: "var(--accent-purple-dark)",
          },
          blue: {
            DEFAULT: "var(--accent-blue)",
            light: "var(--accent-blue-light)",
          },
          cyan: {
            DEFAULT: "var(--accent-cyan)",
            light: "var(--accent-cyan-light)",
          },
        },
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)",
          bg: "var(--success-bg)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          light: "var(--warning-light)",
          bg: "var(--warning-bg)",
        },
        error: {
          DEFAULT: "var(--error)",
          light: "var(--error-light)",
          bg: "var(--error-bg)",
        },
        info: {
          DEFAULT: "var(--info)",
          bg: "var(--info-bg)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
