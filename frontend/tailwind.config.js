/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Ocean Palette
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Living Coral Palette
        coral: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9e9e',
          400: '#ff7b7b',
          500: '#ff6b6b',
          600: '#ff4757',
          700: '#e63946',
          800: '#c92a2a',
          900: '#8b1515',
          950: '#450a0a',
        },
        // Reef Ecosystem Greens
        reef: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Sandy Beach Neutrals
        sand: {
          50: '#fdfbf7',
          100: '#f7f3e8',
          200: '#efe5d0',
          300: '#e6d5b5',
          400: '#dcc099',
          500: '#d4af37',
        },
        // Seafoam Accents
        seafoam: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        // Deep Sea for contrast
        deep: {
          900: '#0a1628',
          950: '#050d18',
        }
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'serif': ['Lora', 'serif'],
      },
      animation: {
        // Ocean waves
        'wave': 'wave 8s ease-in-out infinite',
        'wave-slow': 'wave 12s ease-in-out infinite',
        'wave-fast': 'wave 4s ease-in-out infinite',
        // Floating elements
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 1s',
        // Glows
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'glow-soft': 'glow-soft 4s ease-in-out infinite',
        // Bubbles
        'bubble-rise': 'bubble-rise 15s linear infinite',
        'bubble-rise-slow': 'bubble-rise 20s linear infinite',
        'bubble-rise-fast': 'bubble-rise 10s linear infinite',
        // Subtle breathing
        'breathe': 'breathe 6s ease-in-out infinite',
        // Shimmer effect
        'shimmer': 'shimmer 2s linear infinite',
        // Fade in up
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        // Health bar pulse
        'health-pulse': 'health-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(1deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.6), 0 0 60px rgba(14, 165, 233, 0.3)' },
        },
        'glow-soft': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)' },
        },
        'bubble-rise': {
          '0%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-100px) scale(1)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'health-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, #0c4a6e 0%, #0369a1 30%, #0ea5e9 70%, #0284c7 100%)',
        'deep-ocean': 'linear-gradient(180deg, #082f49 0%, #0c4a6e 50%, #075985 100%)',
        'coral-gradient': 'linear-gradient(135deg, #ff6b6b 0%, #ff9e9e 50%, #ffc5c5 100%)',
        'reef-gradient': 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
        'sunset-ocean': 'linear-gradient(180deg, #0c4a6e 0%, #0369a1 40%, #ff6b6b 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-ocean': '0 0 40px rgba(14, 165, 233, 0.3)',
        'glow-coral': '0 0 40px rgba(255, 107, 107, 0.3)',
        'glow-reef': '0 0 40px rgba(34, 197, 94, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
