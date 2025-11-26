/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1',   // indigo-500
        danger: '#ef4444',
        success: '#10b981',
      },
      animation: {
        'eliminate': 'eliminate 1s ease-in-out forwards',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        eliminate: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}