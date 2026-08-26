export const Typography = {
  display: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1,
  },
  h1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    lineHeight: 30,
  },
  h3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
} as const;

export type TypographyType = typeof Typography;