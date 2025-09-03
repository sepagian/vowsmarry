/**
 * Typography Design Tokens
 * Defines font size scale, font weights, line heights, and letter spacing
 * Following optimal readability and accessibility guidelines
 */

export const typographyTokens = {
  // Font size scale - responsive and accessible sizing
  fontSize: {
    xs: '0.75rem',      // 12px - small text, captions
    sm: '0.875rem',     // 14px - small body text
    base: '1rem',       // 16px - base body text (browser default)
    lg: '1.125rem',     // 18px - large body text
    xl: '1.25rem',      // 20px - small headings
    '2xl': '1.5rem',    // 24px - medium headings
    '3xl': '1.875rem',  // 30px - large headings
    '4xl': '2.25rem',   // 36px - extra large headings
    '5xl': '3rem'       // 48px - display headings
  },

  // Font weights - semantic weight naming
  fontWeight: {
    light: '300',       // Light weight for large text
    normal: '400',      // Normal/regular weight (default)
    medium: '500',      // Medium weight for emphasis
    semibold: '600',    // Semi-bold for headings
    bold: '700'         // Bold for strong emphasis
  },

  // Line heights - optimized for readability
  lineHeight: {
    none: '1',          // 1 - tight line height for headings
    tight: '1.25',      // 1.25 - tight for large text
    snug: '1.375',      // 1.375 - snug for headings
    normal: '1.5',      // 1.5 - normal for body text (optimal readability)
    relaxed: '1.625',   // 1.625 - relaxed for long-form content
    loose: '2'          // 2 - loose for special cases
  },

  // Letter spacing - subtle adjustments for readability
  letterSpacing: {
    tighter: '-0.05em', // -0.05em - tighter for large headings
    tight: '-0.025em',  // -0.025em - tight for headings
    normal: '0em',      // 0em - normal spacing (default)
    wide: '0.025em',    // 0.025em - wide for small text
    wider: '0.05em',    // 0.05em - wider for emphasis
    widest: '0.1em'     // 0.1em - widest for special cases
  },

  // Font families - system fonts with fallbacks
  fontFamily: {
    sans: [
      'Rethink Sans',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"'
    ],
    serif: [
      'Instrument Serif',
      'ui-serif',
      'Georgia',
      'Cambria',
      '"Times New Roman"',
      'Times',
      'serif'
    ],
    body: [
      'Open Sans',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif'
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"SF Mono"',
      'Consolas',
      '"Liberation Mono"',
      'Menlo',
      'monospace'
    ]
  },

  // Semantic typography - contextual text styles
  semantic: {
    // Heading styles
    heading: {
      h1: {
        fontSize: '3rem',       // 48px
        fontWeight: '700',      // bold
        lineHeight: '1.25',     // tight
        letterSpacing: '-0.025em' // tight
      },
      h2: {
        fontSize: '2.25rem',    // 36px
        fontWeight: '600',      // semibold
        lineHeight: '1.25',     // tight
        letterSpacing: '-0.025em' // tight
      },
      h3: {
        fontSize: '1.875rem',   // 30px
        fontWeight: '600',      // semibold
        lineHeight: '1.375',    // snug
        letterSpacing: 'normal' // normal
      },
      h4: {
        fontSize: '1.5rem',     // 24px
        fontWeight: '600',      // semibold
        lineHeight: '1.375',    // snug
        letterSpacing: 'normal' // normal
      },
      h5: {
        fontSize: '1.25rem',    // 20px
        fontWeight: '500',      // medium
        lineHeight: '1.5',      // normal
        letterSpacing: 'normal' // normal
      },
      h6: {
        fontSize: '1.125rem',   // 18px
        fontWeight: '500',      // medium
        lineHeight: '1.5',      // normal
        letterSpacing: 'normal' // normal
      }
    },

    // Body text styles
    body: {
      large: {
        fontSize: '1.125rem',   // 18px
        fontWeight: '400',      // normal
        lineHeight: '1.625',    // relaxed
        letterSpacing: 'normal' // normal
      },
      base: {
        fontSize: '1rem',       // 16px
        fontWeight: '400',      // normal
        lineHeight: '1.5',      // normal
        letterSpacing: 'normal' // normal
      },
      small: {
        fontSize: '0.875rem',   // 14px
        fontWeight: '400',      // normal
        lineHeight: '1.5',      // normal
        letterSpacing: '0.025em' // wide
      }
    },

    // UI element styles
    ui: {
      button: {
        fontSize: '0.875rem',   // 14px
        fontWeight: '500',      // medium
        lineHeight: '1.25',     // tight
        letterSpacing: '0.025em' // wide
      },
      label: {
        fontSize: '0.875rem',   // 14px
        fontWeight: '500',      // medium
        lineHeight: '1.375',    // snug
        letterSpacing: 'normal' // normal
      },
      caption: {
        fontSize: '0.75rem',    // 12px
        fontWeight: '400',      // normal
        lineHeight: '1.375',    // snug
        letterSpacing: '0.05em' // wider
      },
      code: {
        fontSize: '0.875rem',   // 14px
        fontWeight: '400',      // normal
        lineHeight: '1.5',      // normal
        letterSpacing: 'normal' // normal
      }
    }
  },

  // Responsive typography - different sizes for different screens
  responsive: {
    // Mobile typography (default)
    mobile: {
      h1: '2.25rem',      // 36px
      h2: '1.875rem',     // 30px
      h3: '1.5rem',       // 24px
      h4: '1.25rem',      // 20px
      h5: '1.125rem',     // 18px
      h6: '1rem',         // 16px
      body: '1rem',       // 16px
      small: '0.875rem'   // 14px
    },

    // Tablet typography
    tablet: {
      h1: '2.5rem',       // 40px
      h2: '2rem',         // 32px
      h3: '1.625rem',     // 26px
      h4: '1.375rem',     // 22px
      h5: '1.25rem',      // 20px
      h6: '1.125rem',     // 18px
      body: '1rem',       // 16px
      small: '0.875rem'   // 14px
    },

    // Desktop typography
    desktop: {
      h1: '3rem',         // 48px
      h2: '2.25rem',      // 36px
      h3: '1.875rem',     // 30px
      h4: '1.5rem',       // 24px
      h5: '1.25rem',      // 20px
      h6: '1.125rem',     // 18px
      body: '1rem',       // 16px
      small: '0.875rem'   // 14px
    }
  }
} as const;

// Type definitions for better TypeScript support
export type FontSize = keyof typeof typographyTokens.fontSize;
export type FontWeight = keyof typeof typographyTokens.fontWeight;
export type LineHeight = keyof typeof typographyTokens.lineHeight;
export type LetterSpacing = keyof typeof typographyTokens.letterSpacing;
export type FontFamily = keyof typeof typographyTokens.fontFamily;
export type HeadingLevel = keyof typeof typographyTokens.semantic.heading;
export type BodyTextSize = keyof typeof typographyTokens.semantic.body;
export type UITextType = keyof typeof typographyTokens.semantic.ui;