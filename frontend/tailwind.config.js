// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      animation: {
        borderGlow: 'borderGlow 6s linear infinite',
      },
      keyframes: {
        borderGlow: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
      backgroundSize: {
        'gradient-to-r': '200% 200%',
      }
    }
  },
  plugins: []
};
