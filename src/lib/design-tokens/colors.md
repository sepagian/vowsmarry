# Color System Design Tokens

This document describes the comprehensive color system implemented for the VowsMarry Wedding Planner Dashboard. The color system provides semantic naming, full color scales, state variants, and dark mode support.

## Color Palette Overview

### Primary Colors
The primary color palette uses warm coral/salmon tones that evoke romance and celebration:
- **Base**: `oklch(70% 0.130 19.571)` - Warm coral
- **Usage**: Main brand elements, primary buttons, key actions
- **Scale**: 50-950 with full range of lightness values

### Secondary Colors
The secondary color palette uses complementary purple/magenta tones:
- **Base**: `oklch(72% 0.120 321.434)` - Elegant purple
- **Usage**: Secondary actions, accent elements, complementary highlights
- **Scale**: 50-950 with full range of lightness values

### Accent Colors
The accent color palette uses soft yellow/green tones for highlights:
- **Base**: `oklch(90% 0.060 103.193)` - Soft yellow-green
- **Usage**: Highlights, call-to-action elements, special emphasis
- **Scale**: 50-950 with full range of lightness values

### Neutral Colors (Gray Scale)
The neutral palette provides a comprehensive gray scale for backgrounds and text:
- **Base**: `oklch(63% 0.010 286.155)` - Balanced gray
- **Usage**: Text, borders, backgrounds, subtle elements
- **Scale**: 50-950 from very light to very dark

### Base Colors
The base color palette provides fundamental background and content colors:
- **Light**: `oklch(98% 0 0)` - Pure white
- **Dark**: `oklch(14% 0.005 285.823)` - Deep dark
- **Usage**: Page backgrounds, card backgrounds, content areas

## Semantic Colors

### Success
- **Color**: `oklch(70% 0.240 130.85)` - Fresh green
- **Usage**: Success messages, completed states, positive feedback

### Warning
- **Color**: `oklch(70% 0.240 47.604)` - Warm orange
- **Usage**: Warning messages, caution states, attention needed

### Error
- **Color**: `oklch(70% 0.240 16.439)` - Clear red
- **Usage**: Error messages, destructive actions, validation errors

### Info
- **Color**: `oklch(70% 0.150 215.221)` - Calm blue
- **Usage**: Information messages, neutral notifications, help text

## State Variants

Each color includes interactive state variants:

### Hover States
Slightly lighter/brighter versions for hover interactions:
- `primary-hover`, `secondary-hover`, `accent-hover`, etc.

### Active States
Darker versions for active/pressed states:
- `primary-active`, `secondary-active`, `accent-active`, etc.

### Focus States
Same as default for consistent focus indication:
- `primary-focus`, `secondary-focus`, `accent-focus`, etc.

### Disabled States
Muted versions for disabled elements:
- `primary-disabled`, `secondary-disabled`, `accent-disabled`, etc.

## Dark Mode Support

The color system includes comprehensive dark mode variants:

### Automatic Theme Switching
- Colors automatically adapt based on the `.dark` class on the root element
- System preference detection and manual theme switching supported
- Smooth transitions between light and dark modes

### Dark Mode Color Adjustments
- Primary, secondary, and accent colors remain consistent for brand recognition
- Base and neutral colors invert appropriately for dark backgrounds
- Semantic colors maintain their meaning while adjusting for dark mode readability

## Usage Examples

### CSS Custom Properties
```css
/* Use color scale values */
background-color: var(--primary-500);
color: var(--primary-content);

/* Use semantic colors */
background-color: var(--success);
color: var(--success-content);

/* Use state variants */
background-color: var(--primary);
&:hover {
  background-color: var(--primary-hover);
}
&:active {
  background-color: var(--primary-active);
}
&:disabled {
  background-color: var(--primary-disabled);
  color: var(--disabled-content);
}
```

### UnoCSS Classes
```html
<!-- Primary button -->
<button class="bg-primary text-primary-content hover:bg-primary-hover">
  Primary Action
</button>

<!-- Using color scale -->
<div class="bg-neutral-100 text-neutral-900 border border-neutral-200">
  Content with neutral colors
</div>

<!-- Semantic colors -->
<div class="bg-success-50 text-success-900 border border-success-200">
  Success message
</div>

<!-- Utility shortcuts -->
<button class="btn-primary">Primary Button</button>
<button class="btn-outline-secondary">Secondary Outline</button>
<div class="surface-warning">Warning surface</div>
```

### Svelte Components
```svelte
<script>
  import { themeStore } from '$lib/utils/theme.js';
</script>

<!-- Theme toggle button -->
<button on:click={themeStore.toggle} class="btn-ghost-primary">
  Toggle Theme
</button>

<!-- Conditional styling based on theme -->
<div class="bg-base-100 text-base-content">
  Content that adapts to theme
</div>
```

## Utility Shortcuts

The color system includes pre-built utility shortcuts for common patterns:

### Button Styles
- `btn-primary`, `btn-secondary`, `btn-accent` - Solid buttons
- `btn-outline-primary`, `btn-outline-secondary` - Outline buttons  
- `btn-ghost-primary`, `btn-ghost-secondary` - Ghost buttons

### Surface Styles
- `surface-primary`, `surface-secondary` - Colored surfaces
- `surface-success`, `surface-warning`, `surface-error` - Status surfaces

### Text Styles
- `text-muted` - Muted text color
- `text-subtle` - Subtle text color
- `text-placeholder` - Placeholder text color

## Accessibility Considerations

### Contrast Ratios
All color combinations meet WCAG 2.1 AA contrast requirements:
- Text on colored backgrounds maintains 4.5:1 contrast ratio
- Large text maintains 3:1 contrast ratio
- Interactive elements have sufficient contrast in all states

### Color Blindness Support
- Colors are not the only means of conveying information
- Semantic meaning is reinforced through icons and text
- Color combinations are tested for various types of color blindness

### Focus Indicators
- Focus states provide clear visual indication
- Focus rings use high contrast colors
- Keyboard navigation is fully supported

## Implementation Notes

### Performance
- Colors are defined as CSS custom properties for optimal performance
- Dark mode switching uses CSS classes, not JavaScript color manipulation
- Color tokens are tree-shakeable when not used

### Consistency
- All colors follow the same naming convention
- Color scales are mathematically consistent
- State variants follow predictable patterns

### Extensibility
- New colors can be added following the same pattern
- Color scales can be extended with additional stops
- Theme variants can be added for special use cases

## Migration Guide

### From Existing Colors
If migrating from an existing color system:

1. Replace hardcoded color values with CSS custom properties
2. Update class names to use the new color scale system
3. Add dark mode support using the `.dark` class
4. Test all interactive states with the new state variants

### Best Practices
1. Use semantic colors for status and feedback
2. Use the color scale for subtle variations
3. Always pair colors with their content colors
4. Test in both light and dark modes
5. Verify accessibility compliance