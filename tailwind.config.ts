
import type { Config } from 'tailwindcss'
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { base: '#05060f', card: '#0b0f22', brand: { DEFAULT: '#7c3aed', 500: '#7c3aed', 600: '#6d28d9' } },
      boxShadow: { glow: '0 0 40px rgba(124,58,237,.35), 0 0 60px rgba(96,165,250,.25)' },
      backgroundImage: { mesh: 'radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.22), transparent 60%), radial-gradient(800px 400px at 100% 0%, rgba(96,165,250,.22), transparent 60%), radial-gradient(600px 300px at 0% 100%, rgba(52,211,153,.18), transparent 60%)' }
    }
  },
  plugins: []
} satisfies Config
