/**
 * Spacing Design Tokens
 * Defines spacing scale for margins, padding, and gaps
 * Following 4px base unit system for consistent spacing
 */

export const spacingTokens = {
  // Base spacing scale - 4px base unit
  spacing: {
    0: '0px',
    px: '1px',
    '0.5': '0.125rem',  // 2px
    1: '0.25rem',       // 4px - base unit
    '1.5': '0.375rem',  // 6px
    2: '0.5rem',        // 8px
    '2.5': '0.625rem',  // 10px
    3: '0.75rem',       // 12px
    '3.5': '0.875rem',  // 14px
    4: '1rem',          // 16px
    5: '1.25rem',       // 20px
    6: '1.5rem',        // 24px
    7: '1.75rem',       // 28px
    8: '2rem',          // 32px
    9: '2.25rem',       // 36px
    10: '2.5rem',       // 40px
    11: '2.75rem',      // 44px
    12: '3rem',         // 48px
    14: '3.5rem',       // 56px
    16: '4rem',         // 64px
    18: '4.5rem',       // 72px
    20: '5rem',         // 80px
    24: '6rem',         // 96px
    28: '7rem',         // 112px
    32: '8rem',         // 128px
    36: '9rem',         // 144px
    40: '10rem',        // 160px
    44: '11rem',        // 176px
    48: '12rem',        // 192px
    52: '13rem',        // 208px
    56: '14rem',        // 224px
    60: '15rem',        // 240px
    64: '16rem',        // 256px
    72: '18rem',        // 288px
    80: '20rem',        // 320px
    96: '24rem',        // 384px
    auto: 'auto'
  },

  // Semantic spacing - contextual spacing values
  semantic: {
    // Component spacing
    component: {
      xs: '0.25rem',    // 4px - tight spacing
      sm: '0.5rem',     // 8px - small spacing
      md: '1rem',       // 16px - medium spacing
      lg: '1.5rem',     // 24px - large spacing
      xl: '2rem',       // 32px - extra large spacing
      '2xl': '3rem',    // 48px - 2x large spacing
      '3xl': '4rem'     // 64px - 3x large spacing
    },

    // Layout spacing
    layout: {
      xs: '0.5rem',     // 8px - minimal layout spacing
      sm: '1rem',       // 16px - small layout spacing
      md: '1.5rem',     // 24px - medium layout spacing
      lg: '2rem',       // 32px - large layout spacing
      xl: '3rem',       // 48px - extra large layout spacing
      '2xl': '4rem',    // 64px - 2x large layout spacing
      '3xl': '6rem',    // 96px - 3x large layout spacing
      '4xl': '8rem'     // 128px - 4x large layout spacing
    },

    // Section spacing
    section: {
      xs: '1rem',       // 16px - minimal section spacing
      sm: '1.5rem',     // 24px - small section spacing
      md: '2rem',       // 32px - medium section spacing
      lg: '3rem',       // 48px - large section spacing
      xl: '4rem',       // 64px - extra large section spacing
      '2xl': '6rem',    // 96px - 2x large section spacing
      '3xl': '8rem'     // 128px - 3x large section spacing
    },

    // Page spacing
    page: {
      xs: '1.5rem',     // 24px - minimal page spacing
      sm: '2rem',       // 32px - small page spacing
      md: '3rem',       // 48px - medium page spacing
      lg: '4rem',       // 64px - large page spacing
      xl: '6rem',       // 96px - extra large page spacing
      '2xl': '8rem'     // 128px - 2x large page spacing
    }
  },

  // Responsive spacing - different spacing for different screen sizes
  responsive: {
    // Mobile spacing (default)
    mobile: {
      container: '1rem',    // 16px - mobile container padding
      section: '1.5rem',    // 24px - mobile section spacing
      component: '0.75rem'  // 12px - mobile component spacing
    },

    // Tablet spacing
    tablet: {
      container: '1.5rem',  // 24px - tablet container padding
      section: '2rem',      // 32px - tablet section spacing
      component: '1rem'     // 16px - tablet component spacing
    },

    // Desktop spacing
    desktop: {
      container: '2rem',    // 32px - desktop container padding
      section: '3rem',      // 48px - desktop section spacing
      component: '1.25rem'  // 20px - desktop component spacing
    }
  },

  // Negative spacing - for negative margins
  negative: {
    px: '-1px',
    '0.5': '-0.125rem',
    1: '-0.25rem',
    '1.5': '-0.375rem',
    2: '-0.5rem',
    '2.5': '-0.625rem',
    3: '-0.75rem',
    '3.5': '-0.875rem',
    4: '-1rem',
    5: '-1.25rem',
    6: '-1.5rem',
    7: '-1.75rem',
    8: '-2rem',
    9: '-2.25rem',
    10: '-2.5rem',
    11: '-2.75rem',
    12: '-3rem',
    14: '-3.5rem',
    16: '-4rem',
    18: '-4.5rem',
    20: '-5rem',
    24: '-6rem',
    28: '-7rem',
    32: '-8rem',
    36: '-9rem',
    40: '-10rem',
    44: '-11rem',
    48: '-12rem',
    52: '-13rem',
    56: '-14rem',
    60: '-15rem',
    64: '-16rem',
    72: '-18rem',
    80: '-20rem',
    96: '-24rem'
  }
} as const;

// Type definitions for better TypeScript support
export type SpacingValue = keyof typeof spacingTokens.spacing;
export type SemanticSpacing = keyof typeof spacingTokens.semantic.component;
export type LayoutSpacing = keyof typeof spacingTokens.semantic.layout;
export type SectionSpacing = keyof typeof spacingTokens.semantic.section;
export type PageSpacing = keyof typeof spacingTokens.semantic.page;