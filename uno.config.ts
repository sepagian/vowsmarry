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
import { builtinColors, presetShadcn } from 'unocss-preset-shadcn';
import { presetAnimations } from 'unocss-preset-animations';
import { presetScrollbar } from 'unocss-preset-scrollbar';
import { safelistClasses } from './src/lib/styles/safelist';

export default defineConfig({
	safelist: safelistClasses,
	presets: [
		presetWind4(),
		presetIcons({
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle',
			},
			collections: {
				lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default),
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
