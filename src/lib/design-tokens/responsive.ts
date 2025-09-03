/**
 * Responsive Design Utilities
 * Mobile-first responsive design helpers and utilities
 */

import { layoutTokens } from './layout.js';
import { spacingTokens } from './spacing.js';

export const responsiveUtilities = {
  // Mobile-first breakpoint utilities
  breakpoints: {
    // Mobile (default - no prefix needed)
    mobile: {
      container: spacingTokens.responsive.mobile.container,
      section: spacingTokens.responsive.mobile.section,
      component: spacingTokens.responsive.mobile.component
    },
    
    // Tablet (md: prefix)
    tablet: {
      container: spacingTokens.responsive.tablet.container,
      section: spacingTokens.responsive.tablet.section,
      component: spacingTokens.responsive.tablet.component
    },
    
    // Desktop (lg: prefix)
    desktop: {
      container: spacingTokens.responsive.desktop.container,
      section: spacingTokens.responsive.desktop.section,
      component: spacingTokens.responsive.desktop.component
    }
  },

  // Responsive container classes
  containers: {
    // Responsive container with padding
    'container-responsive': {
      width: '100%',
      paddingLeft: spacingTokens.responsive.mobile.container,
      paddingRight: spacingTokens.responsive.mobile.container,
      marginLeft: 'auto',
      marginRight: 'auto',
      '@media (min-width: 768px)': {
        paddingLeft: spacingTokens.responsive.tablet.container,
        paddingRight: spacingTokens.responsive.tablet.container
      },
      '@media (min-width: 1024px)': {
        paddingLeft: spacingTokens.responsive.desktop.container,
        paddingRight: spacingTokens.responsive.desktop.container
      }
    },

    // Responsive section spacing
    'section-responsive': {
      paddingTop: spacingTokens.responsive.mobile.section,
      paddingBottom: spacingTokens.responsive.mobile.section,
      '@media (min-width: 768px)': {
        paddingTop: spacingTokens.responsive.tablet.section,
        paddingBottom: spacingTokens.responsive.tablet.section
      },
      '@media (min-width: 1024px)': {
        paddingTop: spacingTokens.responsive.desktop.section,
        paddingBottom: spacingTokens.responsive.desktop.section
      }
    },

    // Responsive component spacing
    'component-responsive': {
      padding: spacingTokens.responsive.mobile.component,
      '@media (min-width: 768px)': {
        padding: spacingTokens.responsive.tablet.component
      },
      '@media (min-width: 1024px)': {
        padding: spacingTokens.responsive.desktop.component
      }
    }
  },

  // Common responsive patterns
  patterns: {
    // Responsive grid - 1 col mobile, 2 col tablet, 3+ col desktop
    'grid-responsive-cards': {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      gap: spacingTokens.spacing[4],
      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: spacingTokens.spacing[6]
      },
      '@media (min-width: 1024px)': {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: spacingTokens.spacing[8]
      }
    },

    // Responsive flex - column on mobile, row on desktop
    'flex-responsive': {
      display: 'flex',
      flexDirection: 'column',
      gap: spacingTokens.spacing[4],
      '@media (min-width: 768px)': {
        flexDirection: 'row',
        gap: spacingTokens.spacing[6]
      }
    },

    // Responsive text alignment
    'text-responsive': {
      textAlign: 'center',
      '@media (min-width: 768px)': {
        textAlign: 'left'
      }
    }
  }
} as const;

// Helper function to generate responsive classes
export function generateResponsiveClass(
  property: string,
  values: Record<string, string>,
  prefix: string = ''
): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'mobile' || breakpoint === 'default') {
      // Mobile-first: no prefix for base styles
      result[`${prefix}${property}`] = value;
    } else {
      // Add breakpoint prefix for larger screens
      const bp = breakpoint === 'tablet' ? 'md' : 'lg';
      result[`${bp}:${prefix}${property}`] = value;
    }
  });
  
  return result;
}

// Responsive spacing utilities
export const responsiveSpacing = {
  // Container padding utilities
  'px-container': generateResponsiveClass('px', {
    mobile: spacingTokens.responsive.mobile.container,
    tablet: spacingTokens.responsive.tablet.container,
    desktop: spacingTokens.responsive.desktop.container
  }),
  
  // Section spacing utilities
  'py-section': generateResponsiveClass('py', {
    mobile: spacingTokens.responsive.mobile.section,
    tablet: spacingTokens.responsive.tablet.section,
    desktop: spacingTokens.responsive.desktop.section
  }),
  
  // Component spacing utilities
  'p-component': generateResponsiveClass('p', {
    mobile: spacingTokens.responsive.mobile.component,
    tablet: spacingTokens.responsive.tablet.component,
    desktop: spacingTokens.responsive.desktop.component
  })
} as const;