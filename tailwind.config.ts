import defaultTheme from 'tailwindcss/defaultTheme'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class', // 👈 این خط مهمه
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'system-ui',
        'Ubuntu',
        'Cantarell',
        'Noto Sans',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      mono: [
        'Cascadia Code',
        'Consolas',
        'Menlo',
        'Ubuntu Mono',
        'DejaVu Sans Mono',
        'Courier New',
        'monospace',
      ],
      serif: [...defaultTheme.fontFamily.serif],
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['mdi']),
    }),
  ],
} satisfies Config
