<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import { PanelRight } from 'lucide-svelte';
	const sidebar = Sidebar.useSidebar();
</script>

<header class="bg-background sticky top-0 z-50 flex w-full items-center border-b">
	<div class="h-12 flex w-full items-center gap-2 px-4">
		<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
			<PanelRight />
		</Button>
		<Separator orientation="vertical" class="mr-2 h-4" />
		<Breadcrumb.Root class="hidden sm:block">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>
