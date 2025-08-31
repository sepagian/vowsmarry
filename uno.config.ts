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

export default defineConfig({
	preflights: [
		{
			getCSS: () =>
				`
:root {
  /* light */
  --base-100: oklch(98% 0 0);
  --base-200: oklch(96% 0.001 286.375);
  --base-300: oklch(92% 0.004 286.32);
  --base-content: oklch(14% 0.005 285.823);

  --primary: oklch(80% 0.114 19.571);
  --primary-content: oklch(25% 0.092 26.042);

  --secondary: oklch(83% 0.145 321.434);
  --secondary-content: oklch(29% 0.136 325.661);

  --accent: oklch(97% 0.071 103.193);
  --accent-content: oklch(28% 0.066 53.813);

  --neutral: oklch(21% 0.034 264.665);
  --neutral-content: oklch(96% 0.003 264.542);

  --info: oklch(71% 0.143 215.221);
  --info-content: oklch(30% 0.056 229.695);

  --success: oklch(76% 0.233 130.85);
  --success-content: oklch(27% 0.072 132.109);

  --warning: oklch(70% 0.213 47.604);
  --warning-content: oklch(26% 0.079 36.259);

  --error: oklch(64% 0.246 16.439);
  --error-content: oklch(27% 0.105 12.094);
}

.dark {
  /* dark */
  --base-100: oklch(14% 0.005 285.823);
  --base-200: oklch(21% 0.006 285.885);
  --base-300: oklch(27% 0.006 286.033);
  --base-content: oklch(98% 0 0);

  --primary: oklch(80% 0.114 19.571);
  --primary-content: oklch(25% 0.092 26.042);

  --secondary: oklch(83% 0.145 321.434);
  --secondary-content: oklch(29% 0.136 325.661);

  --accent: oklch(97% 0.071 103.193);
  --accent-content: oklch(28% 0.066 53.813);

  --neutral: oklch(21% 0.034 264.665);
  --neutral-content: oklch(96% 0.003 264.542);

  --info: oklch(71% 0.143 215.221);
  --info-content: oklch(30% 0.056 229.695);

  --success: oklch(76% 0.233 130.85);
  --success-content: oklch(27% 0.072 132.109);

  --warning: oklch(70% 0.213 47.604);
  --warning-content: oklch(26% 0.079 36.259);

  --error: oklch(64% 0.246 16.439);
  --error-content: oklch(27% 0.105 12.094);
}
      `.trim()
		}
	],
	theme: {
		colors: {
			base: {
				100: 'var(--base-100)',
				200: 'var(--base-200)',
				300: 'var(--base-300)',
				content: 'var(--base-content)'
			},
			primary: {
				DEFAULT: 'var(--primary)',
				content: 'var(--primary-content)'
			},
			secondary: {
				DEFAULT: 'var(--secondary)',
				content: 'var(--secondary-content)'
			},
			accent: {
				DEFAULT: 'var(--accent)',
				content: 'var(--accent-content)'
			},
			neutral: {
				DEFAULT: 'var(--neutral)',
				content: 'var(--neutral-content)'
			},
			info: {
				DEFAULT: 'var(--info)',
				content: 'var(--info-content)'
			},
			success: {
				DEFAULT: 'var(--success)',
				content: 'var(--success-content)'
			},
			warning: {
				DEFAULT: 'var(--warning)',
				content: 'var(--warning-content)'
			},
			error: {
				DEFAULT: 'var(--error)',
				content: 'var(--error-content)'
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
	safelist: [
		// Add any classes that should always be included in the output here
	]
});
