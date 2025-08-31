import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), UnoCSS()],
	optimizeDeps: {
		include: ['lucide-svelte', 'drizzle-orm', '@supabase/supabase-js', 'zod']
	},
	ssr: {
		noExternal: ['lucide-svelte', 'drizzle-orm', '@supabase/supabase-js']
	}
});
