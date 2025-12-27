import {
	defineConfig,
	presetWind4,
	presetIcons,
	presetAttributify,
	presetTypography,
	presetWebFonts,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
import { presetShadcn } from 'unocss-preset-shadcn';
import { presetAnimations } from 'unocss-preset-animations';
import { presetScrollbar } from 'unocss-preset-scrollbar';
import { safelistClasses } from './src/lib/styles/safelist';

export default defineConfig({
	safelist: safelistClasses,
	theme: {
		colors: {
			'background-light': '#FDFCFB',
			'background-dark': '#1A1A1A',
			'surface-light': '#FFFFFF',
			'surface-dark': '#2C2C2C',
			'muted-light': '#A0AEC0',
			'muted-dark': '#718096',
			'text-light': '#2D3748',
			'text-dark': '#E2E8F0',
			'border-light': '#E2E8F0',
			'border-dark': '#4A5568',
		},
	},
	presets: [
		presetWind4(),
		presetIcons({
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle',
			},
			collections: {
				lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default),
				tabler: () => import('@iconify-json/tabler/icons.json').then((i) => i.default),
			},
		}),
		presetAttributify(),
		presetTypography(),
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'Geist',
			},
		}),
		presetAnimations(),
		presetShadcn(),
		presetScrollbar(),
	],
	transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
});
