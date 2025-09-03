/**
 * Color Design Tokens
 * Defines comprehensive color system with semantic naming
 * Includes primary, secondary, accent colors, neutral scale, semantic colors,
 * state variants, and dark mode support
 */

export const colorTokens = {
  // Primary color palette - main brand colors
  primary: {
    50: 'oklch(97% 0.013 19.571)',   // Very light primary
    100: 'oklch(94% 0.026 19.571)',  // Light primary
    200: 'oklch(89% 0.052 19.571)',  // Lighter primary
    300: 'oklch(83% 0.078 19.571)',  // Light primary
    400: 'oklch(77% 0.104 19.571)',  // Medium light primary
    500: 'oklch(70% 0.130 19.571)',  // Base primary
    600: 'oklch(63% 0.156 19.571)',  // Medium dark primary
    700: 'oklch(56% 0.182 19.571)',  // Dark primary
    800: 'oklch(49% 0.208 19.571)',  // Darker primary
    900: 'oklch(42% 0.234 19.571)',  // Very dark primary
    950: 'oklch(35% 0.260 19.571)',  // Darkest primary
    DEFAULT: 'oklch(70% 0.130 19.571)', // Default primary (500)
    content: 'oklch(25% 0.092 26.042)'  // Text on primary
  },

  // Secondary color palette - complementary brand colors
  secondary: {
    50: 'oklch(96% 0.020 321.434)',   // Very light secondary
    100: 'oklch(92% 0.040 321.434)',  // Light secondary
    200: 'oklch(87% 0.060 321.434)',  // Lighter secondary
    300: 'oklch(82% 0.080 321.434)',  // Light secondary
    400: 'oklch(77% 0.100 321.434)',  // Medium light secondary
    500: 'oklch(72% 0.120 321.434)',  // Base secondary
    600: 'oklch(67% 0.140 321.434)',  // Medium dark secondary
    700: 'oklch(62% 0.160 321.434)',  // Dark secondary
    800: 'oklch(57% 0.180 321.434)',  // Darker secondary
    900: 'oklch(52% 0.200 321.434)',  // Very dark secondary
    950: 'oklch(47% 0.220 321.434)',  // Darkest secondary
    DEFAULT: 'oklch(72% 0.120 321.434)', // Default secondary (500)
    content: 'oklch(29% 0.136 325.661)'  // Text on secondary
  },

  // Accent color palette - highlight and emphasis colors
  accent: {
    50: 'oklch(99% 0.010 103.193)',   // Very light accent
    100: 'oklch(98% 0.020 103.193)',  // Light accent
    200: 'oklch(96% 0.030 103.193)',  // Lighter accent
    300: 'oklch(94% 0.040 103.193)',  // Light accent
    400: 'oklch(92% 0.050 103.193)',  // Medium light accent
    500: 'oklch(90% 0.060 103.193)',  // Base accent
    600: 'oklch(88% 0.070 103.193)',  // Medium dark accent
    700: 'oklch(86% 0.080 103.193)',  // Dark accent
    800: 'oklch(84% 0.090 103.193)',  // Darker accent
    900: 'oklch(82% 0.100 103.193)',  // Very dark accent
    950: 'oklch(80% 0.110 103.193)',  // Darkest accent
    DEFAULT: 'oklch(90% 0.060 103.193)', // Default accent (500)
    content: 'oklch(28% 0.066 53.813)'   // Text on accent
  },

  // Neutral color scale - grays for backgrounds and text
  neutral: {
    50: 'oklch(98% 0.001 286.375)',   // Very light gray
    100: 'oklch(96% 0.002 286.375)',  // Light gray
    200: 'oklch(92% 0.004 286.320)',  // Lighter gray
    300: 'oklch(87% 0.006 286.265)',  // Light gray
    400: 'oklch(75% 0.008 286.210)',  // Medium light gray
    500: 'oklch(63% 0.010 286.155)',  // Base gray
    600: 'oklch(51% 0.012 286.100)',  // Medium dark gray
    700: 'oklch(39% 0.014 286.045)',  // Dark gray
    800: 'oklch(27% 0.016 285.990)',  // Darker gray
    900: 'oklch(21% 0.018 285.935)',  // Very dark gray
    950: 'oklch(14% 0.020 285.880)',  // Darkest gray
    DEFAULT: 'oklch(63% 0.010 286.155)', // Default neutral (500)
    content: 'oklch(96% 0.003 264.542)'  // Text on neutral
  },

  // Base colors - fundamental background and content colors
  base: {
    50: 'oklch(99% 0 0)',             // Pure white
    100: 'oklch(98% 0 0)',            // Off white
    200: 'oklch(96% 0.001 286.375)', // Very light background
    300: 'oklch(92% 0.004 286.320)', // Light background
    400: 'oklch(87% 0.006 286.265)', // Medium light background
    500: 'oklch(75% 0.008 286.210)', // Medium background
    600: 'oklch(63% 0.010 286.155)', // Medium dark background
    700: 'oklch(51% 0.012 286.100)', // Dark background
    800: 'oklch(39% 0.014 286.045)', // Darker background
    900: 'oklch(27% 0.016 285.990)', // Very dark background
    950: 'oklch(14% 0.005 285.823)', // Darkest background
    DEFAULT: 'oklch(98% 0 0)',        // Default base (100)
    content: 'oklch(14% 0.005 285.823)' // Text on base
  },

  // Semantic colors - status and feedback colors
  success: {
    50: 'oklch(95% 0.040 130.85)',    // Very light success
    100: 'oklch(90% 0.080 130.85)',   // Light success
    200: 'oklch(85% 0.120 130.85)',   // Lighter success
    300: 'oklch(80% 0.160 130.85)',   // Light success
    400: 'oklch(75% 0.200 130.85)',   // Medium light success
    500: 'oklch(70% 0.240 130.85)',   // Base success
    600: 'oklch(65% 0.280 130.85)',   // Medium dark success
    700: 'oklch(60% 0.320 130.85)',   // Dark success
    800: 'oklch(55% 0.360 130.85)',   // Darker success
    900: 'oklch(50% 0.400 130.85)',   // Very dark success
    950: 'oklch(45% 0.440 130.85)',   // Darkest success
    DEFAULT: 'oklch(70% 0.240 130.85)', // Default success (500)
    content: 'oklch(27% 0.072 132.109)' // Text on success
  },

  warning: {
    50: 'oklch(95% 0.040 47.604)',    // Very light warning
    100: 'oklch(90% 0.080 47.604)',   // Light warning
    200: 'oklch(85% 0.120 47.604)',   // Lighter warning
    300: 'oklch(80% 0.160 47.604)',   // Light warning
    400: 'oklch(75% 0.200 47.604)',   // Medium light warning
    500: 'oklch(70% 0.240 47.604)',   // Base warning
    600: 'oklch(65% 0.280 47.604)',   // Medium dark warning
    700: 'oklch(60% 0.320 47.604)',   // Dark warning
    800: 'oklch(55% 0.360 47.604)',   // Darker warning
    900: 'oklch(50% 0.400 47.604)',   // Very dark warning
    950: 'oklch(45% 0.440 47.604)',   // Darkest warning
    DEFAULT: 'oklch(70% 0.240 47.604)', // Default warning (500)
    content: 'oklch(26% 0.079 36.259)'  // Text on warning
  },

  error: {
    50: 'oklch(95% 0.040 16.439)',    // Very light error
    100: 'oklch(90% 0.080 16.439)',   // Light error
    200: 'oklch(85% 0.120 16.439)',   // Lighter error
    300: 'oklch(80% 0.160 16.439)',   // Light error
    400: 'oklch(75% 0.200 16.439)',   // Medium light error
    500: 'oklch(70% 0.240 16.439)',   // Base error
    600: 'oklch(65% 0.280 16.439)',   // Medium dark error
    700: 'oklch(60% 0.320 16.439)',   // Dark error
    800: 'oklch(55% 0.360 16.439)',   // Darker error
    900: 'oklch(50% 0.400 16.439)',   // Very dark error
    950: 'oklch(45% 0.440 16.439)',   // Darkest error
    DEFAULT: 'oklch(70% 0.240 16.439)', // Default error (500)
    content: 'oklch(27% 0.105 12.094)'  // Text on error
  },

  info: {
    50: 'oklch(95% 0.025 215.221)',   // Very light info
    100: 'oklch(90% 0.050 215.221)',  // Light info
    200: 'oklch(85% 0.075 215.221)',  // Lighter info
    300: 'oklch(80% 0.100 215.221)',  // Light info
    400: 'oklch(75% 0.125 215.221)',  // Medium light info
    500: 'oklch(70% 0.150 215.221)',  // Base info
    600: 'oklch(65% 0.175 215.221)',  // Medium dark info
    700: 'oklch(60% 0.200 215.221)',  // Dark info
    800: 'oklch(55% 0.225 215.221)',  // Darker info
    900: 'oklch(50% 0.250 215.221)',  // Very dark info
    950: 'oklch(45% 0.275 215.221)',  // Darkest info
    DEFAULT: 'oklch(70% 0.150 215.221)', // Default info (500)
    content: 'oklch(30% 0.056 229.695)'  // Text on info
  },

  // State variants - interactive states
  states: {
    hover: {
      primary: 'oklch(75% 0.140 19.571)',     // Primary hover
      secondary: 'oklch(77% 0.130 321.434)',  // Secondary hover
      accent: 'oklch(92% 0.070 103.193)',     // Accent hover
      neutral: 'oklch(68% 0.012 286.155)',    // Neutral hover
      success: 'oklch(75% 0.250 130.85)',     // Success hover
      warning: 'oklch(75% 0.250 47.604)',     // Warning hover
      error: 'oklch(75% 0.250 16.439)',       // Error hover
      info: 'oklch(75% 0.160 215.221)'        // Info hover
    },
    active: {
      primary: 'oklch(65% 0.150 19.571)',     // Primary active
      secondary: 'oklch(67% 0.150 321.434)',  // Secondary active
      accent: 'oklch(88% 0.080 103.193)',     // Accent active
      neutral: 'oklch(58% 0.014 286.155)',    // Neutral active
      success: 'oklch(65% 0.270 130.85)',     // Success active
      warning: 'oklch(65% 0.270 47.604)',     // Warning active
      error: 'oklch(65% 0.270 16.439)',       // Error active
      info: 'oklch(65% 0.170 215.221)'        // Info active
    },
    focus: {
      primary: 'oklch(70% 0.130 19.571)',     // Primary focus (same as default)
      secondary: 'oklch(72% 0.120 321.434)',  // Secondary focus
      accent: 'oklch(90% 0.060 103.193)',     // Accent focus
      neutral: 'oklch(63% 0.010 286.155)',    // Neutral focus
      success: 'oklch(70% 0.240 130.85)',     // Success focus
      warning: 'oklch(70% 0.240 47.604)',     // Warning focus
      error: 'oklch(70% 0.240 16.439)',       // Error focus
      info: 'oklch(70% 0.150 215.221)'        // Info focus
    },
    disabled: {
      primary: 'oklch(85% 0.020 19.571)',     // Primary disabled
      secondary: 'oklch(85% 0.025 321.434)',  // Secondary disabled
      accent: 'oklch(95% 0.015 103.193)',     // Accent disabled
      neutral: 'oklch(80% 0.004 286.155)',    // Neutral disabled
      success: 'oklch(85% 0.050 130.85)',     // Success disabled
      warning: 'oklch(85% 0.050 47.604)',     // Warning disabled
      error: 'oklch(85% 0.050 16.439)',       // Error disabled
      info: 'oklch(85% 0.030 215.221)',       // Info disabled
      content: 'oklch(60% 0.008 286.155)'     // Disabled text
    }
  },

  // Dark mode color variants
  dark: {
    // Primary colors in dark mode
    primary: {
      50: 'oklch(35% 0.260 19.571)',   // Very dark primary (inverted)
      100: 'oklch(42% 0.234 19.571)',  // Dark primary
      200: 'oklch(49% 0.208 19.571)',  // Darker primary
      300: 'oklch(56% 0.182 19.571)',  // Dark primary
      400: 'oklch(63% 0.156 19.571)',  // Medium dark primary
      500: 'oklch(70% 0.130 19.571)',  // Base primary (same)
      600: 'oklch(77% 0.104 19.571)',  // Medium light primary
      700: 'oklch(83% 0.078 19.571)',  // Light primary
      800: 'oklch(89% 0.052 19.571)',  // Lighter primary
      900: 'oklch(94% 0.026 19.571)',  // Very light primary
      950: 'oklch(97% 0.013 19.571)',  // Lightest primary (inverted)
      DEFAULT: 'oklch(80% 0.114 19.571)', // Brighter in dark mode
      content: 'oklch(25% 0.092 26.042)'  // Text on primary
    },

    // Secondary colors in dark mode
    secondary: {
      50: 'oklch(47% 0.220 321.434)',   // Very dark secondary (inverted)
      100: 'oklch(52% 0.200 321.434)',  // Dark secondary
      200: 'oklch(57% 0.180 321.434)',  // Darker secondary
      300: 'oklch(62% 0.160 321.434)',  // Dark secondary
      400: 'oklch(67% 0.140 321.434)',  // Medium dark secondary
      500: 'oklch(72% 0.120 321.434)',  // Base secondary (same)
      600: 'oklch(77% 0.100 321.434)',  // Medium light secondary
      700: 'oklch(82% 0.080 321.434)',  // Light secondary
      800: 'oklch(87% 0.060 321.434)',  // Lighter secondary
      900: 'oklch(92% 0.040 321.434)',  // Very light secondary
      950: 'oklch(96% 0.020 321.434)',  // Lightest secondary (inverted)
      DEFAULT: 'oklch(83% 0.145 321.434)', // Brighter in dark mode
      content: 'oklch(29% 0.136 325.661)'  // Text on secondary
    },

    // Accent colors in dark mode
    accent: {
      50: 'oklch(80% 0.110 103.193)',   // Very dark accent (inverted)
      100: 'oklch(82% 0.100 103.193)',  // Dark accent
      200: 'oklch(84% 0.090 103.193)',  // Darker accent
      300: 'oklch(86% 0.080 103.193)',  // Dark accent
      400: 'oklch(88% 0.070 103.193)',  // Medium dark accent
      500: 'oklch(90% 0.060 103.193)',  // Base accent (same)
      600: 'oklch(92% 0.050 103.193)',  // Medium light accent
      700: 'oklch(94% 0.040 103.193)',  // Light accent
      800: 'oklch(96% 0.030 103.193)',  // Lighter accent
      900: 'oklch(98% 0.020 103.193)',  // Very light accent
      950: 'oklch(99% 0.010 103.193)',  // Lightest accent (inverted)
      DEFAULT: 'oklch(97% 0.071 103.193)', // Brighter in dark mode
      content: 'oklch(28% 0.066 53.813)'   // Text on accent
    },

    // Base colors in dark mode
    base: {
      50: 'oklch(14% 0.005 285.823)',   // Very dark background (inverted)
      100: 'oklch(21% 0.006 285.885)',  // Dark background
      200: 'oklch(27% 0.006 286.033)',  // Darker background
      300: 'oklch(33% 0.007 286.100)',  // Dark background
      400: 'oklch(39% 0.008 286.155)',  // Medium dark background
      500: 'oklch(45% 0.009 286.210)',  // Medium background
      600: 'oklch(51% 0.010 286.265)',  // Medium light background
      700: 'oklch(63% 0.012 286.320)',  // Light background
      800: 'oklch(75% 0.014 286.375)',  // Lighter background
      900: 'oklch(87% 0.016 286.430)',  // Very light background
      950: 'oklch(98% 0 0)',             // Lightest background (inverted)
      DEFAULT: 'oklch(14% 0.005 285.823)', // Dark base
      content: 'oklch(98% 0 0)'            // Light text on dark base
    },

    // Neutral colors in dark mode
    neutral: {
      50: 'oklch(14% 0.020 285.880)',   // Very dark neutral (inverted)
      100: 'oklch(21% 0.018 285.935)',  // Dark neutral
      200: 'oklch(27% 0.016 285.990)',  // Darker neutral
      300: 'oklch(39% 0.014 286.045)',  // Dark neutral
      400: 'oklch(51% 0.012 286.100)',  // Medium dark neutral
      500: 'oklch(63% 0.010 286.155)',  // Base neutral (same)
      600: 'oklch(75% 0.008 286.210)',  // Medium light neutral
      700: 'oklch(87% 0.006 286.265)',  // Light neutral
      800: 'oklch(92% 0.004 286.320)',  // Lighter neutral
      900: 'oklch(96% 0.002 286.375)',  // Very light neutral
      950: 'oklch(98% 0.001 286.375)',  // Lightest neutral (inverted)
      DEFAULT: 'oklch(21% 0.034 264.665)', // Dark neutral
      content: 'oklch(96% 0.003 264.542)'  // Light text on dark neutral
    }
  }
} as const;

// Type definitions for better TypeScript support
export type PrimaryColor = keyof typeof colorTokens.primary;
export type SecondaryColor = keyof typeof colorTokens.secondary;
export type AccentColor = keyof typeof colorTokens.accent;
export type NeutralColor = keyof typeof colorTokens.neutral;
export type BaseColor = keyof typeof colorTokens.base;
export type SemanticColor = keyof typeof colorTokens.success;
export type StateVariant = keyof typeof colorTokens.states.hover;
export type ColorScale = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';