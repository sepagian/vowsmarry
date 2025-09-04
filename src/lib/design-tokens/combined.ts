/**
 * Combined Design Tokens
 * Provides a single object with all design tokens for easy access
 */

import { layoutTokens } from './layout';
import { spacingTokens } from './spacing';
import { typographyTokens } from './typography';
import { colorTokens } from './colors';
import { visualTokens } from './visual';
import { responsiveUtilities } from './responsive';

// Combined tokens for easy access
export const designTokens = {
  layout: layoutTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  colors: colorTokens,
  visual: visualTokens,
  responsive: responsiveUtilities
} as const;

export type DesignTokens = typeof designTokens;