/**
 * Typography Utilities
 * Helper functions for working with typography tokens
 */

import { typographyTokens } from '$lib/design-tokens/typography.js';
import type { FontSize, FontWeight, LineHeight, LetterSpacing, HeadingLevel, BodyTextSize, UITextType } from '$lib/design-tokens/typography.js';

/**
 * Get font size value from token
 */
export function getFontSize(size: FontSize): string {
  return typographyTokens.fontSize[size];
}

/**
 * Get font weight value from token
 */
export function getFontWeight(weight: FontWeight): string {
  return typographyTokens.fontWeight[weight];
}

/**
 * Get line height value from token
 */
export function getLineHeight(height: LineHeight): string {
  return typographyTokens.lineHeight[height];
}

/**
 * Get letter spacing value from token
 */
export function getLetterSpacing(spacing: LetterSpacing): string {
  return typographyTokens.letterSpacing[spacing];
}

/**
 * Get semantic heading styles
 */
export function getHeadingStyles(level: HeadingLevel) {
  return typographyTokens.semantic.heading[level];
}

/**
 * Get semantic body text styles
 */
export function getBodyTextStyles(size: BodyTextSize) {
  return typographyTokens.semantic.body[size];
}

/**
 * Get semantic UI element styles
 */
export function getUITextStyles(type: UITextType) {
  return typographyTokens.semantic.ui[type];
}

/**
 * Get responsive font size for different screen sizes
 */
export function getResponsiveFontSize(element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small', screen: 'mobile' | 'tablet' | 'desktop') {
  return typographyTokens.responsive[screen][element];
}

/**
 * Create CSS custom properties object for typography tokens
 */
export function createTypographyCustomProperties() {
  const properties: Record<string, string> = {};
  
  // Font sizes
  Object.entries(typographyTokens.fontSize).forEach(([key, value]) => {
    properties[`--font-size-${key}`] = value;
  });
  
  // Font weights
  Object.entries(typographyTokens.fontWeight).forEach(([key, value]) => {
    properties[`--font-weight-${key}`] = value;
  });
  
  // Line heights
  Object.entries(typographyTokens.lineHeight).forEach(([key, value]) => {
    properties[`--line-height-${key}`] = value;
  });
  
  // Letter spacing
  Object.entries(typographyTokens.letterSpacing).forEach(([key, value]) => {
    properties[`--letter-spacing-${key}`] = value;
  });
  
  return properties;
}

/**
 * Generate CSS class names for typography utilities
 */
export function generateTypographyClasses() {
  const classes: Record<string, string> = {};
  
  // Font size classes
  Object.keys(typographyTokens.fontSize).forEach(size => {
    classes[`text-${size}`] = `font-size: var(--font-size-${size});`;
  });
  
  // Font weight classes
  Object.keys(typographyTokens.fontWeight).forEach(weight => {
    classes[`font-${weight}`] = `font-weight: var(--font-weight-${weight});`;
  });
  
  // Line height classes
  Object.keys(typographyTokens.lineHeight).forEach(height => {
    classes[`leading-${height}`] = `line-height: var(--line-height-${height});`;
  });
  
  // Letter spacing classes
  Object.keys(typographyTokens.letterSpacing).forEach(spacing => {
    classes[`tracking-${spacing}`] = `letter-spacing: var(--letter-spacing-${spacing});`;
  });
  
  return classes;
}

/**
 * Validate typography token values
 */
export function validateTypographyToken(category: 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing', value: string): boolean {
  const tokens = typographyTokens[category];
  return value in tokens;
}

/**
 * Get all available typography tokens for a category
 */
export function getAvailableTokens(category: 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'): string[] {
  return Object.keys(typographyTokens[category]);
}

/**
 * Create inline styles object from typography tokens
 */
export function createTypographyStyles(options: {
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
}): Record<string, string> {
  const styles: Record<string, string> = {};
  
  if (options.fontSize) {
    styles.fontSize = getFontSize(options.fontSize);
  }
  
  if (options.fontWeight) {
    styles.fontWeight = getFontWeight(options.fontWeight);
  }
  
  if (options.lineHeight) {
    styles.lineHeight = getLineHeight(options.lineHeight);
  }
  
  if (options.letterSpacing) {
    styles.letterSpacing = getLetterSpacing(options.letterSpacing);
  }
  
  return styles;
}