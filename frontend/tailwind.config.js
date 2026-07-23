/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pepper: '#0F180A',        // near-black green, use sparingly for high-contrast text
        darkestForest: '#1F2D13', // deep background / dark sections
        nettle: '#384929',        // primary dark green — headers, nav bar
        hinterlands: '#37460F',   // accent dark olive-green
        deathworldForest: '#5A6A31', // mid-tone green — secondary buttons, tags
        specialOps: '#838E57',    // muted sage — borders, secondary text, icons
        rejuvenate: '#C6C7A6',    // light sage/beige — cards, section backgrounds
        cream: '#F5F1E6',         // primary light background
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Nunito Sans', 'system-ui', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
        typewriter: ['"Special Elite"', 'Courier New', 'monospace'],
      },
      boxShadow: {
        cozy: '0 4px 20px -2px rgba(31, 45, 19, 0.08), 0 2px 8px -1px rgba(31, 45, 19, 0.04)',
        cozyActive: '0 10px 25px -3px rgba(31, 45, 19, 0.12), 0 4px 12px -2px rgba(31, 45, 19, 0.06)',
      }
    },
  },
  plugins: [],
}
