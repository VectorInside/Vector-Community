/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          base: "var(--bg-base)",
          surface: "var(--bg-panel)",
          elevated: "var(--bg-card)",
          card: "var(--bg-card)",
          border: "var(--border-color)",
          hover: "#1A1D24",
        },
        brand: {
          primary: "var(--neon-primary)", // #E7F900 Amarillo Vectorial
          hover: "var(--neon-hover)",
          subtle: "var(--neon-glow)",
          glow: "var(--neon-glow)",
          cognitive: "var(--azul-cognitivo)", // #8A95B6 Azul Cognitivo
        },
        cognitive: {
          DEFAULT: "var(--azul-cognitivo)",
          glow: "var(--azul-cognitivo-glow)",
          border: "rgba(138, 149, 182, 0.3)",
        },
        neon: {
          DEFAULT: "var(--neon-primary)",
          hover: "var(--neon-hover)",
          glow: "var(--neon-glow)",
        },
        status: {
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          info: "#8A95B6",
        },
      },
      boxShadow: {
        'neon': '0 0 20px 0 var(--neon-glow)',
        'neon-lg': '0 0 35px -5px rgba(231, 249, 0, 0.45)',
        'neon-sm': '0 0 10px var(--neon-glow)',
        'cognitive': '0 0 20px 0 var(--azul-cognitivo-glow)',
        'surface': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
