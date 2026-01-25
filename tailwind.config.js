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
      boxShadow: {
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(139, 92, 246, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "fade-in-down": "fadeInDown 0.4s ease-out",
        "slide-left": "slideInLeft 0.4s ease-out",
        "slide-right": "slideInRight 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "50%": {
            boxShadow:
              "0 0 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)",
          },
        },
      },
    },
  },
  plugins: [],
};
