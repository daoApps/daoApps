import type { Config } from 'tailwindcss'
import { colors, spacing, borderRadius, shadows, breakpoints } from './src/styles/tokens'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      boxShadow: shadows,
      screens: breakpoints,
    },
  },
  plugins: [],
} satisfies Config
