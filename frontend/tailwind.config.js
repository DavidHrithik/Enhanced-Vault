/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'bg-start': 'rgb(var(--bg-start) / <alpha-value>)',
        'bg-mid': 'rgb(var(--bg-mid) / <alpha-value>)',
        'bg-end': 'rgb(var(--bg-end) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
