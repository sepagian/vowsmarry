# Visual Design Tokens

This document describes the visual styling tokens available in the VowsMarry design system, including border radius, shadows, opacity, blur, and animation tokens.

## Border Radius Tokens

Consistent rounded corners across the application:

```typescript
borderRadius: {
  none: '0px',        // No rounding
  sm: '0.125rem',     // 2px - Subtle rounding
  base: '0.25rem',    // 4px - Default rounding
  md: '0.375rem',     // 6px - Medium rounding
  lg: '0.5rem',       // 8px - Large rounding
  xl: '0.75rem',      // 12px - Extra large rounding
  '2xl': '1rem',      // 16px - 2x large rounding
  '3xl': '1.5rem',    // 24px - 3x large rounding
  full: '9999px'      // Fully rounded (pills, circles)
}
```

### Usage Examples

```html
<!-- Card with medium rounding -->
<div class="rounded-md bg-white shadow-card">...</div>

<!-- Button with default rounding -->
<button class="rounded-base bg-primary text-primary-content">...</button>

<!-- Avatar with full rounding -->
<img class="rounded-full w-12 h-12" src="..." alt="Avatar" />

<!-- Using shortcuts -->
<div class="rounded-card">...</div>        <!-- rounded-lg -->
<button class="rounded-button">...</button> <!-- rounded-md -->
<input class="rounded-input" />             <!-- rounded-base -->
```

## Border Width and Style Tokens

Consistent border thickness and styles:

```typescript
borderWidth: {
  0: '0px',    // No border
  1: '1px',    // Default thin border
  2: '2px',    // Medium border
  4: '4px',    // Thick border
  8: '8px'     // Extra thick border
}

borderStyle: {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  none: 'none'
}
```

### Usage Examples

```html
<!-- Default border -->
<div class="border-default">...</div>

<!-- Input with focus border -->
<input class="border-input" />

<!-- Card border -->
<div class="border-card rounded-card">...</div>

<!-- Divider -->
<hr class="border-divider" />
```

## Shadow Tokens

Depth and elevation system for layering:

```typescript
boxShadow: {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',                                    // Subtle shadow
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Default shadow
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Medium shadow
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Large shadow
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // Extra large shadow
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',                           // 2x large shadow
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'                          // Inner shadow
}
```

### Shadow Hierarchy

- `shadow-sm`: Subtle elements (form inputs, small cards)
- `shadow-base`: Default elements (buttons, small modals)
- `shadow-md`: Cards, panels, dropdowns
- `shadow-lg`: Large modals, popovers, tooltips
- `shadow-xl`: Major modals, overlays
- `shadow-2xl`: Hero sections, major components

### Usage Examples

```html
<!-- Card with medium shadow -->
<div class="shadow-card rounded-card">...</div>

<!-- Button with interactive shadow -->
<button class="shadow-button">...</button>

<!-- Modal with large shadow -->
<div class="shadow-modal rounded-modal">...</div>

<!-- Dropdown with large shadow -->
<div class="shadow-dropdown rounded-lg">...</div>
```

## Opacity Tokens

Transparency levels for overlays and states:

```typescript
opacity: {
  0: '0',      // Fully transparent
  5: '0.05',   // Nearly transparent
  10: '0.1',   // Very light
  20: '0.2',   // Light
  50: '0.5',   // Half transparent
  75: '0.75',  // Mostly opaque
  100: '1'     // Fully opaque
}
```

### Usage Examples

```html
<!-- Overlay -->
<div class="bg-black opacity-50">...</div>

<!-- Disabled state -->
<button class="opacity-50 cursor-not-allowed">...</button>

<!-- Hover state -->
<div class="hover:opacity-80">...</div>
```

## Blur Tokens

Backdrop and filter blur effects:

```typescript
blur: {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px'
}

backdropBlur: {
  none: 'none',
  sm: 'blur(4px)',
  base: 'blur(8px)',
  md: 'blur(12px)',
  lg: 'blur(16px)',
  xl: 'blur(24px)',
  '2xl': 'blur(40px)',
  '3xl': 'blur(64px)'
}
```

### Usage Examples

```html
<!-- Glass morphism effect -->
<div class="glass">...</div>

<!-- Overlay with backdrop blur -->
<div class="overlay">...</div>

<!-- Custom backdrop blur -->
<div class="backdrop-blur-md bg-white bg-opacity-20">...</div>
```

## Animation and Transition Tokens

Smooth interactions and micro-animations:

```typescript
animationDuration: {
  75: '75ms',        // Ultra fast
  100: '100ms',      // Very fast
  150: '150ms',      // Fast
  200: '200ms',      // Default fast
  300: '300ms',      // Default
  500: '500ms',      // Slow
  700: '700ms',      // Slower
  1000: '1000ms'     // Very slow
}

animationTimingFunction: {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}
```

### Pre-built Animations

```typescript
animations: {
  'fade-in': 'fadeIn 300ms cubic-bezier(0, 0, 0.2, 1)',
  'fade-out': 'fadeOut 300ms cubic-bezier(0.4, 0, 1, 1)',
  'scale-in': 'scaleIn 200ms cubic-bezier(0, 0, 0.2, 1)',
  'slide-up': 'slideUp 300ms cubic-bezier(0, 0, 0.2, 1)',
  'bounce-in': 'bounceIn 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}
```

### Usage Examples

```html
<!-- Smooth transitions -->
<button class="transition-smooth hover:scale-105">...</button>

<!-- Fast transitions -->
<div class="transition-fast hover:opacity-80">...</div>

<!-- Interactive elements -->
<div class="interactive">...</div>        <!-- hover:scale-105 active:scale-95 -->
<div class="interactive-subtle">...</div> <!-- hover:opacity-80 active:opacity-60 -->
<div class="interactive-lift">...</div>   <!-- hover:shadow-lg hover:-translate-y-1 -->

<!-- Entrance animations -->
<div class="animate-fade-in">...</div>
<div class="animate-slide-up">...</div>
<div class="animate-scale-in">...</div>
<div class="animate-bounce-in">...</div>
```

## Utility Shortcuts

Pre-built combinations for common patterns:

### Interactive States
- `interactive`: Scale on hover/active with smooth transition
- `interactive-subtle`: Opacity change on hover/active
- `interactive-lift`: Lift effect with shadow on hover

### Overlays
- `overlay`: Dark overlay with backdrop blur
- `overlay-light`: Light overlay with backdrop blur
- `overlay-dark`: Dark overlay with stronger blur

### Glass Morphism
- `glass`: Light glass effect with backdrop blur
- `glass-dark`: Dark glass effect with backdrop blur

### Component-Specific
- `rounded-card`: Standard card border radius
- `rounded-button`: Standard button border radius
- `rounded-input`: Standard input border radius
- `shadow-card`: Standard card shadow
- `shadow-button`: Interactive button shadow
- `border-default`: Standard border styling

## Best Practices

### Animation Guidelines
1. Use fast durations (150-200ms) for micro-interactions
2. Use medium durations (300ms) for page transitions
3. Use slow durations (500ms+) for complex animations
4. Prefer `ease-out` for entrance animations
5. Prefer `ease-in` for exit animations
6. Use `ease-smooth` for general interactions

### Shadow Guidelines
1. Use consistent shadow hierarchy
2. Avoid mixing different shadow sizes on the same level
3. Use inner shadows sparingly for input states
4. Consider dark mode shadow adjustments

### Border Radius Guidelines
1. Use consistent rounding within component families
2. Larger components can use larger border radius
3. Use `full` rounding for avatars and pills
4. Match border radius to component size

### Performance Considerations
1. Prefer CSS transitions over JavaScript animations
2. Use `transform` and `opacity` for smooth animations
3. Avoid animating layout properties (width, height, margin)
4. Use `will-change` sparingly and remove after animation