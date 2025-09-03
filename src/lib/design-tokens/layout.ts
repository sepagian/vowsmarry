/**
 * Layout Design Tokens
 * Defines container widths, breakpoints, and grid systems
 * Following mobile-first responsive design approach
 */

export const layoutTokens = {
  // Container widths - responsive container sizes
  container: {
    xs: '20rem',      // 320px - mobile small
    sm: '24rem',      // 384px - mobile
    md: '28rem',      // 448px - mobile large
    lg: '32rem',      // 512px - tablet small
    xl: '36rem',      // 576px - tablet
    '2xl': '42rem',   // 672px - tablet large
    '3xl': '48rem',   // 768px - desktop small
    '4xl': '56rem',   // 896px - desktop
    '5xl': '64rem',   // 1024px - desktop large
    '6xl': '72rem',   // 1152px - desktop xl
    '7xl': '80rem',   // 1280px - desktop 2xl
    full: '100%',     // Full width
    screen: '100vw'   // Full viewport width
  },

  // Breakpoints - mobile-first responsive breakpoints
  breakpoints: {
    xs: '20rem',      // 320px
    sm: '24rem',      // 384px
    md: '48rem',      // 768px
    lg: '64rem',      // 1024px
    xl: '80rem',      // 1280px
    '2xl': '96rem'    // 1536px
  },

  // Grid system - flexible grid configurations
  grid: {
    // Grid template columns
    cols: {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
      8: 'repeat(8, minmax(0, 1fr))',
      9: 'repeat(9, minmax(0, 1fr))',
      10: 'repeat(10, minmax(0, 1fr))',
      11: 'repeat(11, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
      none: 'none',
      subgrid: 'subgrid'
    },

    // Grid template rows
    rows: {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      none: 'none',
      subgrid: 'subgrid'
    },

    // Grid column spans
    colSpan: {
      1: 'span 1 / span 1',
      2: 'span 2 / span 2',
      3: 'span 3 / span 3',
      4: 'span 4 / span 4',
      5: 'span 5 / span 5',
      6: 'span 6 / span 6',
      7: 'span 7 / span 7',
      8: 'span 8 / span 8',
      9: 'span 9 / span 9',
      10: 'span 10 / span 10',
      11: 'span 11 / span 11',
      12: 'span 12 / span 12',
      auto: 'auto',
      full: '1 / -1'
    },

    // Grid row spans
    rowSpan: {
      1: 'span 1 / span 1',
      2: 'span 2 / span 2',
      3: 'span 3 / span 3',
      4: 'span 4 / span 4',
      5: 'span 5 / span 5',
      6: 'span 6 / span 6',
      auto: 'auto',
      full: '1 / -1'
    }
  },

  // Layout utilities
  layout: {
    // Max widths for content containers
    maxWidth: {
      xs: '20rem',      // 320px
      sm: '24rem',      // 384px
      md: '28rem',      // 448px
      lg: '32rem',      // 512px
      xl: '36rem',      // 576px
      '2xl': '42rem',   // 672px
      '3xl': '48rem',   // 768px
      '4xl': '56rem',   // 896px
      '5xl': '64rem',   // 1024px
      '6xl': '72rem',   // 1152px
      '7xl': '80rem',   // 1280px
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      prose: '65ch',    // Optimal reading width
      screen: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    },

    // Min widths
    minWidth: {
      0: '0px',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content'
    },

    // Heights
    height: {
      auto: 'auto',
      full: '100%',
      screen: '100vh',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content'
    }
  }
} as const;

// Type definitions for better TypeScript support
export type ContainerSize = keyof typeof layoutTokens.container;
export type Breakpoint = keyof typeof layoutTokens.breakpoints;
export type GridCols = keyof typeof layoutTokens.grid.cols;
export type GridRows = keyof typeof layoutTokens.grid.rows;
export type GridColSpan = keyof typeof layoutTokens.grid.colSpan;
export type GridRowSpan = keyof typeof layoutTokens.grid.rowSpan;