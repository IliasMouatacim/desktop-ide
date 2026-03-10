/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ide: {
          bg: '#1e1e2e',
          sidebar: '#181825',
          panel: '#11111b',
          border: '#313244',
          borderLight: '#45475a',
          text: '#cdd6f4',
          textMuted: '#6c7086',
          textSubtle: '#585b70',
          accent: '#89b4fa',
          accentHover: '#74c7ec',
          accentDim: '#89b4fa20',
          success: '#a6e3a1',
          warning: '#f9e2af',
          error: '#f38ba8',
          surface: '#1e1e2e',
          surfaceHover: '#313244',
          overlay: '#181825',
          lavender: '#b4befe',
          mauve: '#cba6f7',
          peach: '#fab387',
          teal: '#94e2d5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 12px rgba(137, 180, 250, 0.15)',
        'glow-lg': '0 0 24px rgba(137, 180, 250, 0.2)',
        'panel': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'float': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #89b4fa, #74c7ec)',
        'gradient-subtle': 'linear-gradient(180deg, #1e1e2e 0%, #181825 100%)',
      }
    },
  },
  plugins: [],
};
