# Typography Design System

This document describes the typography design tokens and utilities available in the VowsMarry wedding planner dashboard.

## Overview

The typography system provides a consistent, accessible, and responsive approach to text styling across the application. It includes:

- **Font Size Scale**: From `xs` (12px) to `5xl` (48px)
- **Font Weights**: Light, normal, medium, semibold, and bold
- **Line Heights**: Optimized for readability across different text sizes
- **Letter Spacing**: Subtle adjustments for improved readability
- **Semantic Styles**: Pre-configured styles for headings, body text, and UI elements
- **Responsive Typography**: Adaptive sizing for different screen sizes

## Font Size Scale

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `xs` | 0.75rem | 12px | Small text, captions |
| `sm` | 0.875rem | 14px | Small body text |
| `base` | 1rem | 16px | Base body text (browser default) |
| `lg` | 1.125rem | 18px | Large body text |
| `xl` | 1.25rem | 20px | Small headings |
| `2xl` | 1.5rem | 24px | Medium headings |
| `3xl` | 1.875rem | 30px | Large headings |
| `4xl` | 2.25rem | 36px | Extra large headings |
| `5xl` | 3rem | 48px | Display headings |

## Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `light` | 300 | Light weight for large text |
| `normal` | 400 | Normal/regular weight (default) |
| `medium` | 500 | Medium weight for emphasis |
| `semibold` | 600 | Semi-bold for headings |
| `bold` | 700 | Bold for strong emphasis |

## Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 1 | Tight line height for headings |
| `tight` | 1.25 | Tight for large text |
| `snug` | 1.375 | Snug for headings |
| `normal` | 1.5 | Normal for body text (optimal readability) |
| `relaxed` | 1.625 | Relaxed for long-form content |
| `loose` | 2 | Loose for special cases |

## Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tighter` | -0.05em | Tighter for large headings |
| `tight` | -0.025em | Tight for headings |
| `normal` | 0em | Normal spacing (default) |
| `wide` | 0.025em | Wide for small text |
| `wider` | 0.05em | Wider for emphasis |
| `widest` | 0.1em | Widest for special cases |

## Font Families

| Token | Fonts | Usage |
|-------|-------|-------|
| `sans` | Rethink Sans + system fallbacks | Primary sans-serif font |
| `serif` | Instrument Serif + system fallbacks | Serif font for emphasis |
| `body` | Open Sans + system fallbacks | Body text font |
| `mono` | System monospace fonts | Code and monospace text |

## Semantic Typography Styles

### Headings

Pre-configured heading styles with optimal font size, weight, line height, and letter spacing:

- `h1`: 48px, bold, tight line height, tight letter spacing
- `h2`: 36px, semibold, tight line height, tight letter spacing
- `h3`: 30px, semibold, snug line height, normal letter spacing
- `h4`: 24px, semibold, snug line height, normal letter spacing
- `h5`: 20px, medium, normal line height, normal letter spacing
- `h6`: 18px, medium, normal line height, normal letter spacing

### Body Text

- `large`: 18px, normal weight, relaxed line height
- `base`: 16px, normal weight, normal line height
- `small`: 14px, normal weight, normal line height, wide letter spacing

### UI Elements

- `button`: 14px, medium weight, tight line height, wide letter spacing
- `label`: 14px, medium weight, snug line height
- `caption`: 12px, normal weight, snug line height, wider letter spacing
- `code`: 14px, normal weight, normal line height, monospace font

## Usage Examples

### Using Typography Components

```svelte
<script>
  import { Typography, Heading, Text } from '$lib/components/ui';
</script>

<!-- Semantic heading -->
<Heading level={1} responsive>Welcome to VowsMarry</Heading>

<!-- Body text with size variant -->
<Text size="large">Plan your perfect wedding with our comprehensive tools.</Text>

<!-- Typography component with custom variant -->
<Typography variant="caption" as="span">Last updated: 2 hours ago</Typography>
```

### Using CSS Classes

```svelte
<!-- Responsive heading -->
<h1 class="text-responsive-h1">Wedding Dashboard</h1>

<!-- Body text -->
<p class="text-body">Manage all aspects of your wedding planning.</p>

<!-- UI text -->
<button class="text-button">Get Started</button>
```

### Using Utility Functions

```svelte
<script>
  import { getFontSize, getHeadingStyles } from '$lib/utils/typography';
  
  const titleSize = getFontSize('2xl');
  const h2Styles = getHeadingStyles('h2');
</script>

<h2 style="font-size: {titleSize}">Section Title</h2>
```

## Responsive Typography

The system includes responsive typography that adapts to different screen sizes:

### Mobile (default)
- H1: 36px
- H2: 30px
- H3: 24px
- Body: 16px

### Tablet
- H1: 40px
- H2: 32px
- H3: 26px
- Body: 16px

### Desktop
- H1: 48px
- H2: 36px
- H3: 30px
- Body: 16px

### Using Responsive Typography

```svelte
<!-- Automatically responsive -->
<Heading level={1} responsive>Responsive Heading</Heading>

<!-- CSS class -->
<h1 class="text-responsive-h1">Responsive Heading</h1>
```

## Accessibility Considerations

The typography system follows accessibility best practices:

- **Minimum font size**: 14px for small text, 16px for body text
- **Optimal line height**: 1.5 for body text, 1.25-1.375 for headings
- **Sufficient contrast**: Works with the color system for proper contrast ratios
- **Scalable units**: Uses rem units for better scaling with user preferences
- **Font loading**: Optimized with `font-display: swap` for better performance

## Performance Optimization

- **Font loading**: Uses `font-display: swap` for better perceived performance
- **System font fallbacks**: Comprehensive fallback stacks for each font family
- **CSS custom properties**: Efficient CSS variable usage for dynamic theming
- **Minimal font loading**: Only loads necessary font weights and styles

## Customization

The typography system can be customized by modifying the tokens in `src/lib/design-tokens/typography.ts`:

```typescript
export const typographyTokens = {
  fontSize: {
    // Add or modify font sizes
    xs: '0.75rem',
    // ...
  },
  // ...
};
```

## Integration with UnoCSS

The typography tokens are automatically integrated with UnoCSS, providing:

- Utility classes for all typography tokens
- Responsive variants
- CSS custom properties
- Semantic shortcuts

## Best Practices

1. **Use semantic components**: Prefer `<Heading>` and `<Text>` components over raw HTML
2. **Responsive by default**: Use responsive typography for headings
3. **Consistent spacing**: Use the provided line heights and letter spacing
4. **Accessible contrast**: Ensure sufficient contrast with background colors
5. **Performance**: Use system fonts when possible for better loading performance