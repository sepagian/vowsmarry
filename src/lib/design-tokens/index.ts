/**
 * Design Tokens Index
 * Central export for all design tokens
 */

// Re-export individual tokens
export { layoutTokens } from './layout';
export { spacingTokens } from './spacing';
export { typographyTokens } from './typography';
export { colorTokens } from './colors.js';
export { visualTokens } from './visual';
export { responsiveUtilities, responsiveSpacing } from './responsive';

// Re-export types
export type {
  ContainerSize,
  Breakpoint,
  GridCols,
  GridRows,
  GridColSpan,
  GridRowSpan
} from './layout';

export type {
  SpacingValue,
  SemanticSpacing,
  LayoutSpacing,
  SectionSpacing,
  PageSpacing
} from './spacing';

export type {
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  FontFamily,
  HeadingLevel,
  BodyTextSize,
  UITextType
} from './typography';

export type {
  PrimaryColor,
  SecondaryColor,
  AccentColor,
  NeutralColor,
  BaseColor,
  SemanticColor,
  StateVariant,
  ColorScale
} from './colors';

export type {
  BorderRadius,
  BorderWidth,
  BorderStyle,
  BoxShadow,
  DropShadow,
  Opacity,
  Blur,
  BackdropBlur,
  AnimationDuration,
  AnimationTimingFunction,
  TransitionDuration,
  TransitionTimingFunction,
  Animation,
  Keyframe
} from './visual';

// Re-export combined tokens
export { designTokens } from './combined';
export type { DesignTokens } from './combined';