/**
 * Combined Design Tokens
 * Provides a single object with all design tokens for easy access
 */

import { layoutTokens } from './layout.js';
import { spacingTokens } from './spacing.js';
import { typographyTokens } from './typography.js';
import { colorTokens } from './colors.js';
import { responsiveUtilities } from './responsive.js';

// Combined tokens for easy access
export const designTokens = {
  layout: layoutTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  colors: colorTokens,
  responsive: responsiveUtilities
} as const;

export type DesignTokens = typeof designTokens;