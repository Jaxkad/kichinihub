/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'heritage-burgundy': '#800020',
        'organic-cream': '#FDFBF7',
        'warm-charcoal': '#2D2D2D',
        'golden-honey': '#D4AF37',
        'menu-red': '#C4302B',
        'price-yellow': '#F7DA47',
        'accent-green': '#8DC63F',
        'hot-orange': '#FF4500',
        'sage-green': '#8A9A5B',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
