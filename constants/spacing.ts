export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Layout = {
  padding: 20,
  maxWidth: 480,
  bottomNavHeight: 72,
} as const;

export type SpacingType = typeof Spacing;
export type RadiusType = typeof Radius;