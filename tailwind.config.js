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
          primary: "var(--neon-primary)", // #C3F400 Lima Vectorial Oficial
          hover: "var(--neon-hover)",
          subtle: "var(--neon-glow)",
          glow: "var(--neon-glow)",
          cognitive: "var(--azul-cognitivo)", // #80B8FF Azul Cognitivo
          purple: "var(--purple)", // #AA8BFB Morado Asistencia
          blue: "var(--blue)", // #80B8FF Azul Datos
        },
        cognitive: {
          DEFAULT: "var(--azul-cognitivo)",
          glow: "var(--azul-cognitivo-glow)",
          border: "rgba(128, 184, 255, 0.3)",
        },
        neon: {
          DEFAULT: "var(--neon-primary)",
          hover: "var(--neon-hover)",
          glow: "var(--neon-glow)",
          text: "var(--neon-text)",
        },
        lime: {
          action: "var(--neon-primary)",
          text: "var(--neon-text)",
        },
        purple: {
          DEFAULT: "var(--purple)",
          glow: "var(--purple-glow)",
        },
        blue: {
          DEFAULT: "var(--blue)",
        },
        status: {
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          info: "var(--blue)",
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
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['var(--font-heading)', 'Montserrat', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-up': 'scaleUp 0.2s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      }
    },
  },
  plugins: [],
};
