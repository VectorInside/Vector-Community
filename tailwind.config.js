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
          base: "#0D0F12",
          surface: "#12151A",
          elevated: "#1A1E26",
          card: "#15181E",
          border: "#1F242D",
          hover: "#252B36",
        },
        brand: {
          primary: "#D4FF00",
          hover: "#BCDF00",
          subtle: "#D4FF001A",
          glow: "rgba(212, 255, 0, 0.4)",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        },
      },
      boxShadow: {
        'neon': '0 0 20px -3px rgba(212, 255, 0, 0.35)',
        'neon-lg': '0 0 35px -5px rgba(212, 255, 0, 0.5)',
        'neon-sm': '0 0 10px rgba(212, 255, 0, 0.25)',
        'surface': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 255, 0, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 255, 0, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};
