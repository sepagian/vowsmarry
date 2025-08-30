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
				mono: 'Fira Code',
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
