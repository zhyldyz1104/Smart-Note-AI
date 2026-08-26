export const Colors = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  pink: {
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
  },
  background: '#0f0a1f',
  surface: '#1a0b2e',
  surfaceLight: '#241640',
  text: '#f8fafc',
  textMuted: '#a78bca',
  border: '#2d1b4e',
  white: '#ffffff',
  black: '#000000',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
} as const;

export const Gradients = {
  primary: ['#a855f7', '#ec4899'],
  hero: ['#6b21a8', '#9333ea', '#ec4899'],
  card: ['#241640', '#1a0b2e'],
  button: ['#a855f7', '#ec4899'],
  accent: ['#9333ea', '#a855f7'],
} as const;

export type ColorType = typeof Colors;
export type GradientType = typeof Gradients;