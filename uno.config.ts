import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetWebFonts,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
	transformerCompileClass
} from 'unocss';
import { presetAnimations } from 'unocss-preset-animations';
import { builtinColors, presetShadcn } from 'unocss-preset-shadcn';
// Import design tokens directly to avoid circular dependency issues
import { layoutTokens } from './src/lib/design-tokens/layout.js';
import { spacingTokens } from './src/lib/design-tokens/spacing.js';
import { typographyTokens } from './src/lib/design-tokens/typography.js';
import { colorTokens } from './src/lib/design-tokens/colors.js';

export default defineConfig({
	preflights: [
		{
			getCSS: () =>
				`
:root {
  /* Primary color scale */
  --primary-50: ${colorTokens.primary[50]};
  --primary-100: ${colorTokens.primary[100]};
  --primary-200: ${colorTokens.primary[200]};
  --primary-300: ${colorTokens.primary[300]};
  --primary-400: ${colorTokens.primary[400]};
  --primary-500: ${colorTokens.primary[500]};
  --primary-600: ${colorTokens.primary[600]};
  --primary-700: ${colorTokens.primary[700]};
  --primary-800: ${colorTokens.primary[800]};
  --primary-900: ${colorTokens.primary[900]};
  --primary-950: ${colorTokens.primary[950]};
  --primary: ${colorTokens.primary.DEFAULT};
  --primary-content: ${colorTokens.primary.content};

  /* Secondary color scale */
  --secondary-50: ${colorTokens.secondary[50]};
  --secondary-100: ${colorTokens.secondary[100]};
  --secondary-200: ${colorTokens.secondary[200]};
  --secondary-300: ${colorTokens.secondary[300]};
  --secondary-400: ${colorTokens.secondary[400]};
  --secondary-500: ${colorTokens.secondary[500]};
  --secondary-600: ${colorTokens.secondary[600]};
  --secondary-700: ${colorTokens.secondary[700]};
  --secondary-800: ${colorTokens.secondary[800]};
  --secondary-900: ${colorTokens.secondary[900]};
  --secondary-950: ${colorTokens.secondary[950]};
  --secondary: ${colorTokens.secondary.DEFAULT};
  --secondary-content: ${colorTokens.secondary.content};

  /* Accent color scale */
  --accent-50: ${colorTokens.accent[50]};
  --accent-100: ${colorTokens.accent[100]};
  --accent-200: ${colorTokens.accent[200]};
  --accent-300: ${colorTokens.accent[300]};
  --accent-400: ${colorTokens.accent[400]};
  --accent-500: ${colorTokens.accent[500]};
  --accent-600: ${colorTokens.accent[600]};
  --accent-700: ${colorTokens.accent[700]};
  --accent-800: ${colorTokens.accent[800]};
  --accent-900: ${colorTokens.accent[900]};
  --accent-950: ${colorTokens.accent[950]};
  --accent: ${colorTokens.accent.DEFAULT};
  --accent-content: ${colorTokens.accent.content};

  /* Neutral color scale */
  --neutral-50: ${colorTokens.neutral[50]};
  --neutral-100: ${colorTokens.neutral[100]};
  --neutral-200: ${colorTokens.neutral[200]};
  --neutral-300: ${colorTokens.neutral[300]};
  --neutral-400: ${colorTokens.neutral[400]};
  --neutral-500: ${colorTokens.neutral[500]};
  --neutral-600: ${colorTokens.neutral[600]};
  --neutral-700: ${colorTokens.neutral[700]};
  --neutral-800: ${colorTokens.neutral[800]};
  --neutral-900: ${colorTokens.neutral[900]};
  --neutral-950: ${colorTokens.neutral[950]};
  --neutral: ${colorTokens.neutral.DEFAULT};
  --neutral-content: ${colorTokens.neutral.content};

  /* Base color scale */
  --base-50: ${colorTokens.base[50]};
  --base-100: ${colorTokens.base[100]};
  --base-200: ${colorTokens.base[200]};
  --base-300: ${colorTokens.base[300]};
  --base-400: ${colorTokens.base[400]};
  --base-500: ${colorTokens.base[500]};
  --base-600: ${colorTokens.base[600]};
  --base-700: ${colorTokens.base[700]};
  --base-800: ${colorTokens.base[800]};
  --base-900: ${colorTokens.base[900]};
  --base-950: ${colorTokens.base[950]};
  --base: ${colorTokens.base.DEFAULT};
  --base-content: ${colorTokens.base.content};

  /* Semantic colors */
  --success-50: ${colorTokens.success[50]};
  --success-100: ${colorTokens.success[100]};
  --success-200: ${colorTokens.success[200]};
  --success-300: ${colorTokens.success[300]};
  --success-400: ${colorTokens.success[400]};
  --success-500: ${colorTokens.success[500]};
  --success-600: ${colorTokens.success[600]};
  --success-700: ${colorTokens.success[700]};
  --success-800: ${colorTokens.success[800]};
  --success-900: ${colorTokens.success[900]};
  --success-950: ${colorTokens.success[950]};
  --success: ${colorTokens.success.DEFAULT};
  --success-content: ${colorTokens.success.content};

  --warning-50: ${colorTokens.warning[50]};
  --warning-100: ${colorTokens.warning[100]};
  --warning-200: ${colorTokens.warning[200]};
  --warning-300: ${colorTokens.warning[300]};
  --warning-400: ${colorTokens.warning[400]};
  --warning-500: ${colorTokens.warning[500]};
  --warning-600: ${colorTokens.warning[600]};
  --warning-700: ${colorTokens.warning[700]};
  --warning-800: ${colorTokens.warning[800]};
  --warning-900: ${colorTokens.warning[900]};
  --warning-950: ${colorTokens.warning[950]};
  --warning: ${colorTokens.warning.DEFAULT};
  --warning-content: ${colorTokens.warning.content};

  --error-50: ${colorTokens.error[50]};
  --error-100: ${colorTokens.error[100]};
  --error-200: ${colorTokens.error[200]};
  --error-300: ${colorTokens.error[300]};
  --error-400: ${colorTokens.error[400]};
  --error-500: ${colorTokens.error[500]};
  --error-600: ${colorTokens.error[600]};
  --error-700: ${colorTokens.error[700]};
  --error-800: ${colorTokens.error[800]};
  --error-900: ${colorTokens.error[900]};
  --error-950: ${colorTokens.error[950]};
  --error: ${colorTokens.error.DEFAULT};
  --error-content: ${colorTokens.error.content};

  --info-50: ${colorTokens.info[50]};
  --info-100: ${colorTokens.info[100]};
  --info-200: ${colorTokens.info[200]};
  --info-300: ${colorTokens.info[300]};
  --info-400: ${colorTokens.info[400]};
  --info-500: ${colorTokens.info[500]};
  --info-600: ${colorTokens.info[600]};
  --info-700: ${colorTokens.info[700]};
  --info-800: ${colorTokens.info[800]};
  --info-900: ${colorTokens.info[900]};
  --info-950: ${colorTokens.info[950]};
  --info: ${colorTokens.info.DEFAULT};
  --info-content: ${colorTokens.info.content};

  /* State variants */
  --primary-hover: ${colorTokens.states.hover.primary};
  --secondary-hover: ${colorTokens.states.hover.secondary};
  --accent-hover: ${colorTokens.states.hover.accent};
  --neutral-hover: ${colorTokens.states.hover.neutral};
  --success-hover: ${colorTokens.states.hover.success};
  --warning-hover: ${colorTokens.states.hover.warning};
  --error-hover: ${colorTokens.states.hover.error};
  --info-hover: ${colorTokens.states.hover.info};

  --primary-active: ${colorTokens.states.active.primary};
  --secondary-active: ${colorTokens.states.active.secondary};
  --accent-active: ${colorTokens.states.active.accent};
  --neutral-active: ${colorTokens.states.active.neutral};
  --success-active: ${colorTokens.states.active.success};
  --warning-active: ${colorTokens.states.active.warning};
  --error-active: ${colorTokens.states.active.error};
  --info-active: ${colorTokens.states.active.info};

  --primary-focus: ${colorTokens.states.focus.primary};
  --secondary-focus: ${colorTokens.states.focus.secondary};
  --accent-focus: ${colorTokens.states.focus.accent};
  --neutral-focus: ${colorTokens.states.focus.neutral};
  --success-focus: ${colorTokens.states.focus.success};
  --warning-focus: ${colorTokens.states.focus.warning};
  --error-focus: ${colorTokens.states.focus.error};
  --info-focus: ${colorTokens.states.focus.info};

  --primary-disabled: ${colorTokens.states.disabled.primary};
  --secondary-disabled: ${colorTokens.states.disabled.secondary};
  --accent-disabled: ${colorTokens.states.disabled.accent};
  --neutral-disabled: ${colorTokens.states.disabled.neutral};
  --success-disabled: ${colorTokens.states.disabled.success};
  --warning-disabled: ${colorTokens.states.disabled.warning};
  --error-disabled: ${colorTokens.states.disabled.error};
  --info-disabled: ${colorTokens.states.disabled.info};
  --disabled-content: ${colorTokens.states.disabled.content};

  /* Typography tokens */
  /* Typography tokens */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}

.dark {
  /* Primary color scale - dark mode */
  --primary-50: ${colorTokens.dark.primary[50]};
  --primary-100: ${colorTokens.dark.primary[100]};
  --primary-200: ${colorTokens.dark.primary[200]};
  --primary-300: ${colorTokens.dark.primary[300]};
  --primary-400: ${colorTokens.dark.primary[400]};
  --primary-500: ${colorTokens.dark.primary[500]};
  --primary-600: ${colorTokens.dark.primary[600]};
  --primary-700: ${colorTokens.dark.primary[700]};
  --primary-800: ${colorTokens.dark.primary[800]};
  --primary-900: ${colorTokens.dark.primary[900]};
  --primary-950: ${colorTokens.dark.primary[950]};
  --primary: ${colorTokens.dark.primary.DEFAULT};
  --primary-content: ${colorTokens.dark.primary.content};

  /* Secondary color scale - dark mode */
  --secondary-50: ${colorTokens.dark.secondary[50]};
  --secondary-100: ${colorTokens.dark.secondary[100]};
  --secondary-200: ${colorTokens.dark.secondary[200]};
  --secondary-300: ${colorTokens.dark.secondary[300]};
  --secondary-400: ${colorTokens.dark.secondary[400]};
  --secondary-500: ${colorTokens.dark.secondary[500]};
  --secondary-600: ${colorTokens.dark.secondary[600]};
  --secondary-700: ${colorTokens.dark.secondary[700]};
  --secondary-800: ${colorTokens.dark.secondary[800]};
  --secondary-900: ${colorTokens.dark.secondary[900]};
  --secondary-950: ${colorTokens.dark.secondary[950]};
  --secondary: ${colorTokens.dark.secondary.DEFAULT};
  --secondary-content: ${colorTokens.dark.secondary.content};

  /* Accent color scale - dark mode */
  --accent-50: ${colorTokens.dark.accent[50]};
  --accent-100: ${colorTokens.dark.accent[100]};
  --accent-200: ${colorTokens.dark.accent[200]};
  --accent-300: ${colorTokens.dark.accent[300]};
  --accent-400: ${colorTokens.dark.accent[400]};
  --accent-500: ${colorTokens.dark.accent[500]};
  --accent-600: ${colorTokens.dark.accent[600]};
  --accent-700: ${colorTokens.dark.accent[700]};
  --accent-800: ${colorTokens.dark.accent[800]};
  --accent-900: ${colorTokens.dark.accent[900]};
  --accent-950: ${colorTokens.dark.accent[950]};
  --accent: ${colorTokens.dark.accent.DEFAULT};
  --accent-content: ${colorTokens.dark.accent.content};

  /* Base color scale - dark mode */
  --base-50: ${colorTokens.dark.base[50]};
  --base-100: ${colorTokens.dark.base[100]};
  --base-200: ${colorTokens.dark.base[200]};
  --base-300: ${colorTokens.dark.base[300]};
  --base-400: ${colorTokens.dark.base[400]};
  --base-500: ${colorTokens.dark.base[500]};
  --base-600: ${colorTokens.dark.base[600]};
  --base-700: ${colorTokens.dark.base[700]};
  --base-800: ${colorTokens.dark.base[800]};
  --base-900: ${colorTokens.dark.base[900]};
  --base-950: ${colorTokens.dark.base[950]};
  --base: ${colorTokens.dark.base.DEFAULT};
  --base-content: ${colorTokens.dark.base.content};

  /* Neutral color scale - dark mode */
  --neutral-50: ${colorTokens.dark.neutral[50]};
  --neutral-100: ${colorTokens.dark.neutral[100]};
  --neutral-200: ${colorTokens.dark.neutral[200]};
  --neutral-300: ${colorTokens.dark.neutral[300]};
  --neutral-400: ${colorTokens.dark.neutral[400]};
  --neutral-500: ${colorTokens.dark.neutral[500]};
  --neutral-600: ${colorTokens.dark.neutral[600]};
  --neutral-700: ${colorTokens.dark.neutral[700]};
  --neutral-800: ${colorTokens.dark.neutral[800]};
  --neutral-900: ${colorTokens.dark.neutral[900]};
  --neutral-950: ${colorTokens.dark.neutral[950]};
  --neutral: ${colorTokens.dark.neutral.DEFAULT};
  --neutral-content: ${colorTokens.dark.neutral.content};

  /* Semantic colors remain the same in dark mode for consistency */
  --success: ${colorTokens.success.DEFAULT};
  --success-content: ${colorTokens.success.content};
  --warning: ${colorTokens.warning.DEFAULT};
  --warning-content: ${colorTokens.warning.content};
  --error: ${colorTokens.error.DEFAULT};
  --error-content: ${colorTokens.error.content};
  --info: ${colorTokens.info.DEFAULT};
  --info-content: ${colorTokens.info.content};
}

/* Font loading optimization */
@font-face {
  font-family: 'Rethink Sans';
  font-display: swap;
}

@font-face {
  font-family: 'Instrument Serif';
  font-display: swap;
}

@font-face {
  font-family: 'Open Sans';
  font-display: swap;
}

/* Base typography styles */
html {
  font-size: 16px;
  line-height: 1.5;
}

body {
  font-family: var(--font-family-body, 'Open Sans', ui-sans-serif, system-ui, sans-serif);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-normal);
}

/* Heading defaults */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-sans, 'Rethink Sans', ui-sans-serif, system-ui, sans-serif);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin: 0;
}

/* Paragraph defaults */
p {
  margin: 0;
  line-height: var(--line-height-normal);
}

/* Code defaults */
code, pre {
  font-family: var(--font-family-mono, ui-monospace, 'SF Mono', Consolas, monospace);
}
      `.trim()
		}
	],
	theme: {
		// Layout and spacing tokens
		spacing: spacingTokens.spacing,
		maxWidth: layoutTokens.layout.maxWidth,
		minWidth: layoutTokens.layout.minWidth,
		height: layoutTokens.layout.height,

		// Breakpoints for responsive design
		breakpoints: layoutTokens.breakpoints,

		// Grid system
		gridTemplateColumns: layoutTokens.grid.cols,
		gridTemplateRows: layoutTokens.grid.rows,
		gridColumn: layoutTokens.grid.colSpan,
		gridRow: layoutTokens.grid.rowSpan,

		// Container sizes
		container: layoutTokens.container,

		// Typography tokens
		fontSize: typographyTokens.fontSize,
		fontWeight: typographyTokens.fontWeight,
		lineHeight: typographyTokens.lineHeight,
		letterSpacing: typographyTokens.letterSpacing,
		fontFamily: typographyTokens.fontFamily,

		// Comprehensive color system with full scales and state variants
		colors: {
			// Primary color scale
			primary: {
				50: 'var(--primary-50)',
				100: 'var(--primary-100)',
				200: 'var(--primary-200)',
				300: 'var(--primary-300)',
				400: 'var(--primary-400)',
				500: 'var(--primary-500)',
				600: 'var(--primary-600)',
				700: 'var(--primary-700)',
				800: 'var(--primary-800)',
				900: 'var(--primary-900)',
				950: 'var(--primary-950)',
				DEFAULT: 'var(--primary)',
				content: 'var(--primary-content)',
				hover: 'var(--primary-hover)',
				active: 'var(--primary-active)',
				focus: 'var(--primary-focus)',
				disabled: 'var(--primary-disabled)'
			},
			// Secondary color scale
			secondary: {
				50: 'var(--secondary-50)',
				100: 'var(--secondary-100)',
				200: 'var(--secondary-200)',
				300: 'var(--secondary-300)',
				400: 'var(--secondary-400)',
				500: 'var(--secondary-500)',
				600: 'var(--secondary-600)',
				700: 'var(--secondary-700)',
				800: 'var(--secondary-800)',
				900: 'var(--secondary-900)',
				950: 'var(--secondary-950)',
				DEFAULT: 'var(--secondary)',
				content: 'var(--secondary-content)',
				hover: 'var(--secondary-hover)',
				active: 'var(--secondary-active)',
				focus: 'var(--secondary-focus)',
				disabled: 'var(--secondary-disabled)'
			},
			// Accent color scale
			accent: {
				50: 'var(--accent-50)',
				100: 'var(--accent-100)',
				200: 'var(--accent-200)',
				300: 'var(--accent-300)',
				400: 'var(--accent-400)',
				500: 'var(--accent-500)',
				600: 'var(--accent-600)',
				700: 'var(--accent-700)',
				800: 'var(--accent-800)',
				900: 'var(--accent-900)',
				950: 'var(--accent-950)',
				DEFAULT: 'var(--accent)',
				content: 'var(--accent-content)',
				hover: 'var(--accent-hover)',
				active: 'var(--accent-active)',
				focus: 'var(--accent-focus)',
				disabled: 'var(--accent-disabled)'
			},
			// Neutral color scale (gray scale)
			neutral: {
				50: 'var(--neutral-50)',
				100: 'var(--neutral-100)',
				200: 'var(--neutral-200)',
				300: 'var(--neutral-300)',
				400: 'var(--neutral-400)',
				500: 'var(--neutral-500)',
				600: 'var(--neutral-600)',
				700: 'var(--neutral-700)',
				800: 'var(--neutral-800)',
				900: 'var(--neutral-900)',
				950: 'var(--neutral-950)',
				DEFAULT: 'var(--neutral)',
				content: 'var(--neutral-content)',
				hover: 'var(--neutral-hover)',
				active: 'var(--neutral-active)',
				focus: 'var(--neutral-focus)',
				disabled: 'var(--neutral-disabled)'
			},
			// Base color scale (backgrounds)
			base: {
				50: 'var(--base-50)',
				100: 'var(--base-100)',
				200: 'var(--base-200)',
				300: 'var(--base-300)',
				400: 'var(--base-400)',
				500: 'var(--base-500)',
				600: 'var(--base-600)',
				700: 'var(--base-700)',
				800: 'var(--base-800)',
				900: 'var(--base-900)',
				950: 'var(--base-950)',
				DEFAULT: 'var(--base)',
				content: 'var(--base-content)'
			},
			// Semantic colors
			success: {
				50: 'var(--success-50)',
				100: 'var(--success-100)',
				200: 'var(--success-200)',
				300: 'var(--success-300)',
				400: 'var(--success-400)',
				500: 'var(--success-500)',
				600: 'var(--success-600)',
				700: 'var(--success-700)',
				800: 'var(--success-800)',
				900: 'var(--success-900)',
				950: 'var(--success-950)',
				DEFAULT: 'var(--success)',
				content: 'var(--success-content)',
				hover: 'var(--success-hover)',
				active: 'var(--success-active)',
				focus: 'var(--success-focus)',
				disabled: 'var(--success-disabled)'
			},
			warning: {
				50: 'var(--warning-50)',
				100: 'var(--warning-100)',
				200: 'var(--warning-200)',
				300: 'var(--warning-300)',
				400: 'var(--warning-400)',
				500: 'var(--warning-500)',
				600: 'var(--warning-600)',
				700: 'var(--warning-700)',
				800: 'var(--warning-800)',
				900: 'var(--warning-900)',
				950: 'var(--warning-950)',
				DEFAULT: 'var(--warning)',
				content: 'var(--warning-content)',
				hover: 'var(--warning-hover)',
				active: 'var(--warning-active)',
				focus: 'var(--warning-focus)',
				disabled: 'var(--warning-disabled)'
			},
			error: {
				50: 'var(--error-50)',
				100: 'var(--error-100)',
				200: 'var(--error-200)',
				300: 'var(--error-300)',
				400: 'var(--error-400)',
				500: 'var(--error-500)',
				600: 'var(--error-600)',
				700: 'var(--error-700)',
				800: 'var(--error-800)',
				900: 'var(--error-900)',
				950: 'var(--error-950)',
				DEFAULT: 'var(--error)',
				content: 'var(--error-content)',
				hover: 'var(--error-hover)',
				active: 'var(--error-active)',
				focus: 'var(--error-focus)',
				disabled: 'var(--error-disabled)'
			},
			info: {
				50: 'var(--info-50)',
				100: 'var(--info-100)',
				200: 'var(--info-200)',
				300: 'var(--info-300)',
				400: 'var(--info-400)',
				500: 'var(--info-500)',
				600: 'var(--info-600)',
				700: 'var(--info-700)',
				800: 'var(--info-800)',
				900: 'var(--info-900)',
				950: 'var(--info-950)',
				DEFAULT: 'var(--info)',
				content: 'var(--info-content)',
				hover: 'var(--info-hover)',
				active: 'var(--info-active)',
				focus: 'var(--info-focus)',
				disabled: 'var(--info-disabled)'
			},
			// Additional utility colors
			disabled: {
				content: 'var(--disabled-content)'
			}
		}
	},
	variants: [
		(matcher) => {
			if (!matcher.startsWith('dark:')) return;
			return {
				matcher: matcher.slice(5),
				selector: (s) => `.dark ${s}`
			};
		}
	],
	presets: [
		presetWind4(),
		presetAttributify(),
		presetIcons({
			scale: 1.2,
			warn: true
		}),
		presetTypography(),
		presetWebFonts({
			provider: 'google', // default provider
			fonts: {
				sans: 'Rethink Sans',
				serif: 'Instrument Serif',
				body: 'Open Sans'
			}
		}),
		presetAnimations(),
		presetShadcn(builtinColors.map((c) => ({ color: c })))
	],
	transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
	shortcuts: {
		// Responsive container utilities
		'container-responsive': 'w-full px-4 sm:px-6 lg:px-8 mx-auto',
		'section-responsive': 'py-6 sm:py-8 lg:py-12',
		'component-responsive': 'p-3 sm:p-4 lg:p-5',

		// Responsive pattern utilities
		'grid-responsive-cards': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8',
		'flex-responsive': 'flex flex-col md:flex-row gap-4 md:gap-6',
		'text-responsive': 'text-center md:text-left',

		// Responsive spacing utilities
		'px-container': 'px-4 sm:px-6 lg:px-8',
		'py-section': 'py-6 sm:py-8 lg:py-12',
		'p-component': 'p-3 sm:p-4 lg:p-5',

		// Typography utilities - semantic heading styles
		'text-h1': 'text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
		'text-h2': 'text-xl md:text-2xl lg:text-4xl font-semibold leading-tight tracking-tight',
		'text-h3': 'text-lg md:text-xl lg:text-3xl font-semibold leading-snug',
		'text-h4': 'text-base md:text-lg lg:text-2xl font-semibold leading-snug',
		'text-h5': 'text-base md:text-lg lg:text-xl font-medium leading-normal',
		'text-h6': 'text-sm md:text-base lg:text-lg font-medium leading-normal',

		// Typography utilities - body text styles
		'text-body-large': 'text-lg font-normal leading-relaxed',
		'text-body': 'text-base font-normal leading-normal',
		'text-body-small': 'text-sm font-normal leading-normal tracking-wide',

		// Typography utilities - UI element styles
		'text-button': 'text-sm font-medium leading-tight tracking-wide',
		'text-label': 'text-sm font-medium leading-snug',
		'text-caption': 'text-xs font-normal leading-snug tracking-wider',
		'text-code': 'text-sm font-normal leading-normal font-mono',

		// Responsive typography utilities
		'text-responsive-h1': 'text-2xl md:text-3xl lg:text-5xl font-bold leading-tight tracking-tight',
		'text-responsive-h2': 'text-xl md:text-2xl lg:text-4xl font-semibold leading-tight tracking-tight',
		'text-responsive-h3': 'text-lg md:text-xl lg:text-3xl font-semibold leading-snug',
		'text-responsive-body': 'text-base leading-normal font-normal',

		// Color utility shortcuts - semantic button styles
		'btn-primary': 'bg-primary text-primary-content hover:bg-primary-hover active:bg-primary-active focus:bg-primary-focus disabled:bg-primary-disabled disabled:text-disabled-content',
		'btn-secondary': 'bg-secondary text-secondary-content hover:bg-secondary-hover active:bg-secondary-active focus:bg-secondary-focus disabled:bg-secondary-disabled disabled:text-disabled-content',
		'btn-accent': 'bg-accent text-accent-content hover:bg-accent-hover active:bg-accent-active focus:bg-accent-focus disabled:bg-accent-disabled disabled:text-disabled-content',
		'btn-success': 'bg-success text-success-content hover:bg-success-hover active:bg-success-active focus:bg-success-focus disabled:bg-success-disabled disabled:text-disabled-content',
		'btn-warning': 'bg-warning text-warning-content hover:bg-warning-hover active:bg-warning-active focus:bg-warning-focus disabled:bg-warning-disabled disabled:text-disabled-content',
		'btn-error': 'bg-error text-error-content hover:bg-error-hover active:bg-error-active focus:bg-error-focus disabled:bg-error-disabled disabled:text-disabled-content',
		'btn-info': 'bg-info text-info-content hover:bg-info-hover active:bg-info-active focus:bg-info-focus disabled:bg-info-disabled disabled:text-disabled-content',

		// Color utility shortcuts - outline button styles
		'btn-outline-primary': 'border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-content active:bg-primary-active focus:bg-primary-focus disabled:border-primary-disabled disabled:text-primary-disabled',
		'btn-outline-secondary': 'border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-content active:bg-secondary-active focus:bg-secondary-focus disabled:border-secondary-disabled disabled:text-secondary-disabled',
		'btn-outline-accent': 'border border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-content active:bg-accent-active focus:bg-accent-focus disabled:border-accent-disabled disabled:text-accent-disabled',

		// Color utility shortcuts - ghost button styles
		'btn-ghost-primary': 'text-primary bg-transparent hover:bg-primary-100 active:bg-primary-200 focus:bg-primary-100 disabled:text-primary-disabled',
		'btn-ghost-secondary': 'text-secondary bg-transparent hover:bg-secondary-100 active:bg-secondary-200 focus:bg-secondary-100 disabled:text-secondary-disabled',
		'btn-ghost-accent': 'text-accent bg-transparent hover:bg-accent-100 active:bg-accent-200 focus:bg-accent-100 disabled:text-accent-disabled',

		// Color utility shortcuts - surface styles
		'surface-primary': 'bg-primary-50 text-primary-900 border border-primary-200',
		'surface-secondary': 'bg-secondary-50 text-secondary-900 border border-secondary-200',
		'surface-accent': 'bg-accent-50 text-accent-900 border border-accent-200',
		'surface-success': 'bg-success-50 text-success-900 border border-success-200',
		'surface-warning': 'bg-warning-50 text-warning-900 border border-warning-200',
		'surface-error': 'bg-error-50 text-error-900 border border-error-200',
		'surface-info': 'bg-info-50 text-info-900 border border-info-200',

		// Color utility shortcuts - text styles
		'text-muted': 'text-neutral-600 dark:text-neutral-400',
		'text-subtle': 'text-neutral-500 dark:text-neutral-500',
		'text-placeholder': 'text-neutral-400 dark:text-neutral-600'
	},
	safelist: [
		// Layout and spacing classes that should always be included
		'container-responsive',
		'section-responsive',
		'component-responsive',
		'grid-responsive-cards',
		'flex-responsive',
		'text-responsive',
		'px-container',
		'py-section',
		'p-component',

		// Typography classes that should always be included
		'text-h1',
		'text-h2',
		'text-h3',
		'text-h4',
		'text-h5',
		'text-h6',
		'text-body-large',
		'text-body',
		'text-body-small',
		'text-button',
		'text-label',
		'text-caption',
		'text-code',
		'text-responsive-h1',
		'text-responsive-h2',
		'text-responsive-h3',
		'text-responsive-body',

		// Color utility classes that should always be included
		'btn-primary',
		'btn-secondary',
		'btn-accent',
		'btn-success',
		'btn-warning',
		'btn-error',
		'btn-info',
		'btn-outline-primary',
		'btn-outline-secondary',
		'btn-outline-accent',
		'btn-ghost-primary',
		'btn-ghost-secondary',
		'btn-ghost-accent',
		'surface-primary',
		'surface-secondary',
		'surface-accent',
		'surface-success',
		'surface-warning',
		'surface-error',
		'surface-info',
		'text-muted',
		'text-subtle',
		'text-placeholder'
	]
});
