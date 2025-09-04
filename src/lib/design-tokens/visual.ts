/**
 * Visual Design Tokens
 * Defines border radius, shadows, opacity, blur, and animation tokens
 * for consistent visual styling across the application
 */

export const visualTokens = {
  // Border radius scale - consistent rounded corners
  borderRadius: {
    none: '0px',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px - default
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px'     // Fully rounded (pills, circles)
  },

  // Border width tokens - consistent border thickness
  borderWidth: {
    0: '0px',
    1: '1px',          // Default thin border
    2: '2px',          // Medium border
    4: '4px',          // Thick border
    8: '8px'           // Extra thick border
  },

  // Border style tokens - consistent border styles
  borderStyle: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    none: 'none'
  },

  // Shadow tokens - depth and elevation system
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',                                    // Subtle shadow
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Default shadow
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Medium shadow
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Large shadow
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // Extra large shadow
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',                           // 2x large shadow
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'                          // Inner shadow
  },

  // Drop shadow tokens - for filter effects
  dropShadow: {
    none: 'none',
    sm: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
    base: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
    md: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    lg: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    xl: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
    '2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
  },

  // Opacity tokens - transparency levels
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    15: '0.15',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1'
  },

  // Blur tokens - backdrop and filter blur effects
  blur: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px'
  },

  // Backdrop blur tokens - for overlay effects
  backdropBlur: {
    none: 'none',
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
    '2xl': 'blur(40px)',
    '3xl': 'blur(64px)'
  },

  // Animation duration tokens - consistent timing
  animationDuration: {
    75: '75ms',        // Ultra fast
    100: '100ms',      // Very fast
    150: '150ms',      // Fast
    200: '200ms',      // Default fast
    300: '300ms',      // Default
    500: '500ms',      // Slow
    700: '700ms',      // Slower
    1000: '1000ms'     // Very slow
  },

  // Animation timing functions - easing curves
  animationTimingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom easing curves for smooth interactions
    'ease-in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'ease-in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    // Smooth curves for UI interactions
    'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Transition duration tokens - for CSS transitions
  transitionDuration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },

  // Transition timing functions - for CSS transitions
  transitionTimingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  // Common animation presets - ready-to-use animations
  animations: {
    // Fade animations
    'fade-in': 'fadeIn 300ms cubic-bezier(0, 0, 0.2, 1)',
    'fade-out': 'fadeOut 300ms cubic-bezier(0.4, 0, 1, 1)',
    'fade-in-up': 'fadeInUp 300ms cubic-bezier(0, 0, 0.2, 1)',
    'fade-in-down': 'fadeInDown 300ms cubic-bezier(0, 0, 0.2, 1)',
    
    // Scale animations
    'scale-in': 'scaleIn 200ms cubic-bezier(0, 0, 0.2, 1)',
    'scale-out': 'scaleOut 200ms cubic-bezier(0.4, 0, 1, 1)',
    
    // Slide animations
    'slide-in-left': 'slideInLeft 300ms cubic-bezier(0, 0, 0.2, 1)',
    'slide-in-right': 'slideInRight 300ms cubic-bezier(0, 0, 0.2, 1)',
    'slide-up': 'slideUp 300ms cubic-bezier(0, 0, 0.2, 1)',
    'slide-down': 'slideDown 300ms cubic-bezier(0, 0, 0.2, 1)',
    
    // Bounce animations
    'bounce-in': 'bounceIn 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Spin animation
    'spin': 'spin 1s linear infinite',
    
    // Pulse animation
    'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    
    // Ping animation
    'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
  },

  // Keyframes for animations
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' }
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' }
    },
    fadeInUp: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' }
    },
    fadeInDown: {
      '0%': { opacity: '0', transform: 'translateY(-10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' }
    },
    scaleIn: {
      '0%': { opacity: '0', transform: 'scale(0.95)' },
      '100%': { opacity: '1', transform: 'scale(1)' }
    },
    scaleOut: {
      '0%': { opacity: '1', transform: 'scale(1)' },
      '100%': { opacity: '0', transform: 'scale(0.95)' }
    },
    slideInLeft: {
      '0%': { opacity: '0', transform: 'translateX(-10px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' }
    },
    slideInRight: {
      '0%': { opacity: '0', transform: 'translateX(10px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' }
    },
    slideUp: {
      '0%': { transform: 'translateY(100%)' },
      '100%': { transform: 'translateY(0)' }
    },
    slideDown: {
      '0%': { transform: 'translateY(-100%)' },
      '100%': { transform: 'translateY(0)' }
    },
    bounceIn: {
      '0%': { opacity: '0', transform: 'scale(0.3)' },
      '50%': { opacity: '1', transform: 'scale(1.05)' },
      '70%': { transform: 'scale(0.9)' },
      '100%': { opacity: '1', transform: 'scale(1)' }
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' }
    },
    ping: {
      '75%, 100%': { transform: 'scale(2)', opacity: '0' }
    }
  }
} as const;

// Type definitions for better TypeScript support
export type BorderRadius = keyof typeof visualTokens.borderRadius;
export type BorderWidth = keyof typeof visualTokens.borderWidth;
export type BorderStyle = keyof typeof visualTokens.borderStyle;
export type BoxShadow = keyof typeof visualTokens.boxShadow;
export type DropShadow = keyof typeof visualTokens.dropShadow;
export type Opacity = keyof typeof visualTokens.opacity;
export type Blur = keyof typeof visualTokens.blur;
export type BackdropBlur = keyof typeof visualTokens.backdropBlur;
export type AnimationDuration = keyof typeof visualTokens.animationDuration;
export type AnimationTimingFunction = keyof typeof visualTokens.animationTimingFunction;
export type TransitionDuration = keyof typeof visualTokens.transitionDuration;
export type TransitionTimingFunction = keyof typeof visualTokens.transitionTimingFunction;
export type Animation = keyof typeof visualTokens.animations;
export type Keyframe = keyof typeof visualTokens.keyframes;