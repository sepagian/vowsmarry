<script lang="ts">
	import { Container, Grid, GridItem, Stack, Flex } from './index.js';
</script>

<!-- Test layout components with design tokens -->
<Container size="6xl" padding="md">
	<Stack direction="vertical" spacing={8}>
		<h1>Design Token System Test</h1>
		
		<!-- Test responsive grid -->
		<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={{ default: 4, md: 6, lg: 8 }}>
			<GridItem>
				<div class="component-responsive bg-base-200 rounded-lg">
					<h3>Grid Item 1</h3>
					<p>This is a test of the responsive grid system.</p>
				</div>
			</GridItem>
			<GridItem>
				<div class="component-responsive bg-base-200 rounded-lg">
					<h3>Grid Item 2</h3>
					<p>Using design tokens for consistent spacing.</p>
				</div>
			</GridItem>
			<GridItem>
				<div class="component-responsive bg-base-200 rounded-lg">
					<h3>Grid Item 3</h3>
					<p>Mobile-first responsive design approach.</p>
				</div>
			</GridItem>
		</Grid>
		
		<!-- Test flex layout -->
		<Flex justify="between" align="center" gap={4} class="section-responsive bg-base-100 rounded-lg">
			<div>
				<h3>Flex Layout Test</h3>
				<p>Using Flex component with design tokens</p>
			</div>
			<button class="px-4 py-2 bg-primary text-primary-content rounded">Action</button>
		</Flex>
		
		<!-- Test responsive utilities -->
		<div class="grid-responsive-cards">
			<div class="p-component bg-accent rounded-lg">
				<h4>Responsive Card 1</h4>
				<p>Using responsive utility classes</p>
			</div>
			<div class="p-component bg-accent rounded-lg">
				<h4>Responsive Card 2</h4>
				<p>1 column mobile, 2 tablet, 3 desktop</p>
			</div>
			<div class="p-component bg-accent rounded-lg">
				<h4>Responsive Card 3</h4>
				<p>Consistent spacing with design tokens</p>
			</div>
		</div>
		
		<!-- Test spacing tokens -->
		<Stack direction="horizontal" spacing={6} justify="center" wrap={true}>
			<div class="px-4 py-2 bg-secondary text-secondary-content rounded">Spacing: 4px base</div>
			<div class="px-6 py-3 bg-secondary text-secondary-content rounded">Spacing: 6px (1.5rem)</div>
			<div class="px-8 py-4 bg-secondary text-secondary-content rounded">Spacing: 8px (2rem)</div>
		</Stack>
	</Stack>
</Container>