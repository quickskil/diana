
import type { Config } from 'tailwindcss'
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { base: '#fff7fb', card: '#ffffff', brand: { DEFAULT: '#f472b6', 500: '#f472b6', 600: '#ec4899' } },
      boxShadow: { glow: '0 0 40px rgba(244,114,182,.25), 0 0 60px rgba(252,231,243,.45)' },
      backgroundImage: { mesh: 'radial-gradient(1200px 600px at 0% 0%, rgba(244,114,182,.18), transparent 60%), radial-gradient(800px 400px at 100% 0%, rgba(190,227,248,.25), transparent 60%), radial-gradient(600px 300px at 0% 100%, rgba(252,231,243,.3), transparent 60%)' }
    }
  },
  plugins: []
} satisfies Config
