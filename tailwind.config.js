/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'bg-primary': '#0A0E14',
        'bg-secondary': '#151B24',
        'bg-tertiary': '#1E2936',
        'border-color': '#2C3847',

        'text-primary': '#E8EDF2',
        'text-secondary': '#A0AEC0',
        'text-tertiary': '#64748B',

        'accent-primary': '#3B82F6',
        'accent-secondary': '#8B5CF6',
        'accent-success': '#10B981',
        'accent-warning': '#F59E0B',
        'accent-danger': '#EF4444',

        // Node category colors
        'node-person': '#3B82F6',
        'node-organization': '#8B5CF6',
        'node-event': '#F59E0B',
        'node-location': '#10B981',
        'node-document': '#6366F1',
      },
    },
  },
  plugins: [],
}
