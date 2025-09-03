/**
 * Design Tokens Index
 * Central export for all design tokens
 */

// Re-export individual tokens
export { layoutTokens } from './layout.js';
export { spacingTokens } from './spacing.js';
export { typographyTokens } from './typography.js';
export { colorTokens } from './colors.js';
export { responsiveUtilities, responsiveSpacing } from './responsive.js';

// Re-export types
export type {
  ContainerSize,
  Breakpoint,
  GridCols,
  GridRows,
  GridColSpan,
  GridRowSpan
} from './layout.js';

export type {
  SpacingValue,
  SemanticSpacing,
  LayoutSpacing,
  SectionSpacing,
  PageSpacing
} from './spacing.js';

export type {
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  FontFamily,
  HeadingLevel,
  BodyTextSize,
  UITextType
} from './typography.js';

export type {
  PrimaryColor,
  SecondaryColor,
  AccentColor,
  NeutralColor,
  BaseColor,
  SemanticColor,
  StateVariant,
  ColorScale
} from './colors.js';

// Re-export combined tokens
export { designTokens } from './combined.js';
export type { DesignTokens } from './combined.js';