<script lang="ts">
	import { Container, Grid, GridItem, Stack, PageHeader } from '$lib/components/layout';
	import { Typography, Heading, Text } from '$lib/components/ui';
	import { layoutTokens, spacingTokens, typographyTokens, visualTokens } from '$lib/design-tokens';
	import VisualTokensShowcase from '$lib/components/examples/visual-tokens-showcase.svelte';


	// Sample data for demonstrating tokens
	const containerSizes = Object.entries(layoutTokens.container);
	const spacingValues = Object.entries(spacingTokens.spacing).slice(0, 12); // Show first 12 for brevity
	const semanticSpacing = Object.entries(spacingTokens.semantic.component);
	const breakpoints = Object.entries(layoutTokens.breakpoints);
	
	// Typography token samples
	const fontSizes = Object.entries(typographyTokens.fontSize);
	const fontWeights = Object.entries(typographyTokens.fontWeight);
	const lineHeights = Object.entries(typographyTokens.lineHeight);
	const letterSpacings = Object.entries(typographyTokens.letterSpacing);
	const headingStyles = Object.entries(typographyTokens.semantic.heading);
</script>

<svelte:head>
	<title>Design Tokens Documentation</title>
</svelte:head>


<Container size="7xl" padding="lg">
	<Stack direction="vertical" spacing={8}>
		<PageHeader
			title="Design Tokens Documentation"
			description="Comprehensive guide to the design token system including typography, spacing, layout, and colors used throughout the VowsMarry Wedding Planner Dashboard"
			showDivider={true}
		/>

		<!-- Introduction -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Overview</h2>
					<p class="text-base-content/70 leading-relaxed">
						Design tokens are the visual design atoms of the design system — specifically, they are
						named entities that store visual design attributes. Our system follows a 4px base unit
						approach for consistent spacing and uses semantic naming for better maintainability.
					</p>
				</div>

				<div class="p-6 bg-info/10 border border-info/20 rounded-lg">
					<h3 class="text-lg font-semibold text-info-content mb-2">Key Principles</h3>
					<ul class="list-disc list-inside space-y-1 text-info-content/80">
						<li>4px base unit system for all spacing</li>
						<li>Mobile-first responsive design approach</li>
						<li>Semantic naming for better developer experience</li>
						<li>Consistent visual hierarchy across components</li>
						<li>Accessible typography with optimal readability</li>
						<li>Performance-optimized font loading strategies</li>
					</ul>
				</div>
			</Stack>
		</section>

		<!-- Spacing Tokens -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Spacing Tokens</h2>
					<p class="text-base-content/70 mb-6">
						Our spacing system is based on a 4px base unit, providing consistent rhythm and visual
						hierarchy.
					</p>
				</div>

				<!-- Base Spacing Scale -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Base Spacing Scale</h3>
					<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
						{#each spacingValues as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
									<div class="flex items-center justify-between mb-2">
										<code class="text-sm font-mono bg-base-200 px-2 py-1 rounded">{key}</code>
										<span class="text-sm text-base-content/70">{value}</span>
									</div>
									<div class="bg-primary rounded" style="height: 8px; width: {value};"></div>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>

				<!-- Semantic Spacing -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Semantic Component Spacing</h3>
					<p class="text-base-content/70 mb-4">
						Semantic spacing tokens provide contextual meaning and should be preferred over raw
						values.
					</p>
					<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
						{#each semanticSpacing as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
									<div class="flex items-center justify-between mb-2">
										<code class="text-sm font-mono bg-secondary/20 px-2 py-1 rounded">{key}</code>
										<span class="text-sm text-base-content/70">{value}</span>
									</div>
									<div class="bg-secondary rounded" style="height: 8px; width: {value};"></div>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>

				<!-- Usage Examples -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Usage Examples</h3>
					<Grid cols={{ default: 1, lg: 2 }} gap={6}>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3">CSS Classes</h4>
								<div class="space-y-2 text-sm font-mono">
									<div class="p-2 bg-base-200 rounded">p-4 (1rem padding)</div>
									<div class="p-2 bg-base-200 rounded">m-6 (1.5rem margin)</div>
									<div class="p-2 bg-base-200 rounded">gap-8 (2rem gap)</div>
								</div>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3">Component Props</h4>
								<div class="space-y-2 text-sm font-mono">
									<div class="p-2 bg-base-200 rounded">spacing={4}</div>
									<div class="p-2 bg-base-200 rounded">gap={6}</div>
									<div class="p-2 bg-base-200 rounded">padding="lg"</div>
								</div>
							</div>
						</GridItem>
					</Grid>
				</div>
			</Stack>
		</section>

		<!-- Typography Tokens -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<Heading level={2} class="mb-4">Typography Tokens</Heading>
					<Text size="base" class="text-base-content/70 mb-6">
						Our typography system provides consistent, accessible, and responsive text styling with semantic naming and optimal readability.
					</Text>
				</div>

				<!-- Typography Components Demo -->
				<div>
					<Heading level={3} class="mb-4">Typography Components</Heading>
					<div class="p-6 bg-base-100 border border-base-300 rounded-lg">
						<Stack direction="vertical" spacing={4}>
							<Heading level={1} responsive>H1 Responsive Heading</Heading>
							<Heading level={2} responsive>H2 Responsive Heading</Heading>
							<Heading level={3} responsive>H3 Responsive Heading</Heading>
							<Heading level={4}>H4 Standard Heading</Heading>
							<Heading level={5}>H5 Standard Heading</Heading>
							<Heading level={6}>H6 Standard Heading</Heading>
							
							<div class="border-t border-base-300 pt-4">
								<Text size="large">Large body text for introductory content and emphasis.</Text>
								<Text size="base" responsive class="mt-2">Base body text with responsive sizing for optimal readability.</Text>
								<Text size="small" class="mt-2">Small body text for secondary information and captions.</Text>
							</div>
							
							<div class="border-t border-base-300 pt-4">
								<Typography variant="button" as="span" class="inline-block bg-primary text-primary-content px-4 py-2 rounded mr-4">Button Text</Typography>
								<Typography variant="label" as="span" class="inline-block mr-4">Label Text</Typography>
								<Typography variant="caption" as="span" class="text-neutral">Caption Text</Typography>
							</div>
						</Stack>
					</div>
				</div>

				<!-- Font Size Scale -->
				<div>
					<Heading level={3} class="mb-4">Font Size Scale</Heading>
					<Text size="base" class="text-base-content/70 mb-4">
						Responsive and accessible font sizes from 12px to 48px, using rem units for better scaling.
					</Text>
					<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
						{#each fontSizes as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
									<div class="flex items-center justify-between mb-3">
										<code class="text-sm font-mono bg-primary/20 px-2 py-1 rounded">{key}</code>
										<span class="text-sm text-base-content/70">{value}</span>
									</div>
									<div class="text-{key}">Sample Text</div>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>

				<!-- Font Weights -->
				<div>
					<Heading level={3} class="mb-4">Font Weights</Heading>
					<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
						{#each fontWeights as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
									<div class="flex items-center justify-between mb-3">
										<code class="text-sm font-mono bg-secondary/20 px-2 py-1 rounded">{key}</code>
										<span class="text-sm text-base-content/70">{value}</span>
									</div>
									<div class="font-{key} text-lg">Sample Text</div>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>

				<!-- Line Heights -->
				<div>
					<Heading level={3} class="mb-4">Line Heights</Heading>
					<Text size="base" class="text-base-content/70 mb-4">
						Optimized line heights for different text sizes and reading contexts.
					</Text>
					<Grid cols={{ default: 1, md: 2 }} gap={4}>
						{#each lineHeights as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
									<div class="flex items-center justify-between mb-3">
										<code class="text-sm font-mono bg-accent/20 px-2 py-1 rounded">{key}</code>
										<span class="text-sm text-base-content/70">{value}</span>
									</div>
									<div class="leading-{key} text-sm">
										This is sample text to demonstrate the line height. Multiple lines help show how the spacing affects readability and visual rhythm.
									</div>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>

				<!-- Semantic Typography Styles -->
				<div>
					<Heading level={3} class="mb-4">Semantic Heading Styles</Heading>
					<Text size="base" class="text-base-content/70 mb-4">
						Pre-configured heading styles with optimal font size, weight, line height, and letter spacing.
					</Text>
					<div class="space-y-4">
						{#each headingStyles as [level, styles]}
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<div class="flex items-start justify-between mb-3">
									<code class="text-sm font-mono bg-warning/20 px-2 py-1 rounded">{level}</code>
									<div class="text-xs text-base-content/70 text-right">
										<div>Size: {styles.fontSize}</div>
										<div>Weight: {styles.fontWeight}</div>
										<div>Line Height: {styles.lineHeight}</div>
										<div>Letter Spacing: {styles.letterSpacing}</div>
									</div>
								</div>
								<div class="text-{level.replace('h', 'h')}">Sample {level.toUpperCase()} Heading</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- CSS Class Examples -->
				<div>
					<Heading level={3} class="mb-4">CSS Class Usage</Heading>
					<Grid cols={{ default: 1, lg: 2 }} gap={6}>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3">Semantic Classes</h4>
								<div class="space-y-2">
									<div class="text-h1">text-h1</div>
									<div class="text-h2">text-h2</div>
									<div class="text-body">text-body</div>
									<div class="text-body-small">text-body-small</div>
									<div class="text-button">text-button</div>
									<div class="text-caption">text-caption</div>
								</div>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3">Responsive Classes</h4>
								<div class="space-y-2">
									<div class="text-responsive-h1">text-responsive-h1</div>
									<div class="text-responsive-h2">text-responsive-h2</div>
									<div class="text-responsive-h3">text-responsive-h3</div>
									<div class="text-responsive-body">text-responsive-body</div>
								</div>
							</div>
						</GridItem>
					</Grid>
				</div>

				<!-- Typography Usage Examples -->
				<div>
					<Heading level={3} class="mb-4">Usage Examples</Heading>
					<Grid cols={{ default: 1, lg: 2 }} gap={6}>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3">Component Usage</h4>
								<div class="space-y-2 text-sm font-mono bg-base-200 p-3 rounded">
									<div>&lt;Heading level={1} responsive&gt;</div>
									<div>&lt;Text size="large"&gt;</div>
									<div>&lt;Typography variant="button"&gt;</div>
								</div>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3">CSS Classes</h4>
								<div class="space-y-2 text-sm font-mono bg-base-200 p-3 rounded">
									<div>class="text-responsive-h1"</div>
									<div>class="text-body font-medium"</div>
									<div>class="text-caption leading-relaxed"</div>
								</div>
							</div>
						</GridItem>
					</Grid>
				</div>
			</Stack>
		</section>

		<!-- Layout Tokens -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Layout Tokens</h2>
					<p class="text-base-content/70 mb-6">
						Layout tokens define container sizes, breakpoints, and grid configurations for
						responsive design.
					</p>
				</div>

				<!-- Container Sizes -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Container Sizes</h3>
					<Grid cols={{ default: 1, md: 2 }} gap={4}>
						{#each containerSizes as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
									<div class="flex items-center justify-between mb-3">
										<code class="text-sm font-mono bg-accent/20 px-2 py-1 rounded">{key}</code>
										<span class="text-sm text-base-content/70">{value}</span>
									</div>
									<div class="bg-accent/30 rounded-lg p-2 text-center text-xs">
										Container Preview
									</div>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>

				<!-- Breakpoints -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Responsive Breakpoints</h3>
					<p class="text-base-content/70 mb-4">
						Mobile-first breakpoints for responsive design. All components support responsive props
						using these breakpoints.
					</p>
					<Grid cols={{ default: 1, md: 2, lg: 4 }} gap={4}>
						{#each breakpoints as [key, value]}
							<GridItem>
								<div class="p-4 bg-base-100 border border-base-300 rounded-lg text-center">
									<code class="text-sm font-mono bg-warning/20 px-2 py-1 rounded block mb-2"
										>{key}</code
									>
									<span class="text-sm text-base-content/70">{value}</span>
								</div>
							</GridItem>
						{/each}
					</Grid>
				</div>
			</Stack>
		</section>

		<!-- Responsive Examples -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Responsive Design Examples</h2>
					<p class="text-base-content/70 mb-6">
						See how design tokens work together to create responsive layouts.
					</p>
				</div>

				<!-- Responsive Spacing Demo -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Responsive Spacing</h3>
					<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
						<div class="p-4 md:p-6 lg:p-8 bg-primary/10 rounded-lg text-center">
							<p class="text-primary-content">
								This box has responsive padding: <code class="bg-primary/20 px-2 py-1 rounded"
									>p-4 md:p-6 lg:p-8</code
								>
							</p>
						</div>
					</div>
				</div>

				<!-- Responsive Grid Demo -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Responsive Grid</h3>
					<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={{ default: 4, md: 6, lg: 8 }}>
						<GridItem>
							<div class="p-4 bg-secondary/10 border border-secondary/20 rounded-lg text-center">
								<h4 class="font-semibold text-secondary-content">Item 1</h4>
								<p class="text-sm text-secondary-content/70">
									1 col mobile, 2 col tablet, 3 col desktop
								</p>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-secondary/10 border border-secondary/20 rounded-lg text-center">
								<h4 class="font-semibold text-secondary-content">Item 2</h4>
								<p class="text-sm text-secondary-content/70">Responsive gap spacing</p>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-secondary/10 border border-secondary/20 rounded-lg text-center">
								<h4 class="font-semibold text-secondary-content">Item 3</h4>
								<p class="text-sm text-secondary-content/70">Mobile-first approach</p>
							</div>
						</GridItem>
					</Grid>
				</div>
			</Stack>
		</section>

		<!-- Visual Styling Tokens -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Visual Styling Tokens</h2>
					<p class="text-base-content/70 mb-6">
						Border radius, shadows, opacity, blur, and animation tokens for consistent visual styling and smooth interactions.
					</p>
				</div>

				<VisualTokensShowcase />
			</Stack>
		</section>

		<!-- Color System -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Color System</h2>
					<p class="text-base-content/70 mb-6">
						Semantic color tokens that adapt to light and dark themes automatically.
					</p>
				</div>

				<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
					<!-- Base Colors -->
					<GridItem>
						<div class="space-y-3">
							<h4 class="font-semibold">Base Colors</h4>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-base-100 border border-base-300 rounded"></div>
									<code class="text-sm">base-100</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-base-200 rounded"></div>
									<code class="text-sm">base-200</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-base-300 rounded"></div>
									<code class="text-sm">base-300</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-base-content rounded"></div>
									<code class="text-sm">base-content</code>
								</div>
							</div>
						</div>
					</GridItem>

					<!-- Semantic Colors -->
					<GridItem>
						<div class="space-y-3">
							<h4 class="font-semibold">Semantic Colors</h4>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-primary rounded"></div>
									<code class="text-sm">primary</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-secondary rounded"></div>
									<code class="text-sm">secondary</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-accent rounded"></div>
									<code class="text-sm">accent</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-neutral rounded"></div>
									<code class="text-sm">neutral</code>
								</div>
							</div>
						</div>
					</GridItem>

					<!-- Status Colors -->
					<GridItem>
						<div class="space-y-3">
							<h4 class="font-semibold">Status Colors</h4>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-info rounded"></div>
									<code class="text-sm">info</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-success rounded"></div>
									<code class="text-sm">success</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-warning rounded"></div>
									<code class="text-sm">warning</code>
								</div>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-error rounded"></div>
									<code class="text-sm">error</code>
								</div>
							</div>
						</div>
					</GridItem>
				</Grid>
			</Stack>
		</section>

		<!-- Usage Guidelines -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Usage Guidelines</h2>
				</div>

				<Grid cols={{ default: 1, lg: 2 }} gap={6}>
					<GridItem>
						<div class="p-6 bg-success/10 border border-success/20 rounded-lg">
							<h3 class="text-lg font-semibold text-success-content mb-4">✅ Do</h3>
							<ul class="space-y-2 text-success-content/80">
								<li>• Use semantic spacing tokens (component.md, layout.lg)</li>
								<li>• Follow the 4px base unit system</li>
								<li>• Use responsive objects for breakpoint-specific values</li>
								<li>• Prefer design tokens over hardcoded values</li>
								<li>• Use mobile-first responsive design</li>
								<li>• Use semantic typography components (Heading, Text)</li>
								<li>• Use responsive typography for headings</li>
								<li>• Maintain consistent line heights and letter spacing</li>
								<li>• Ensure sufficient color contrast for accessibility</li>
							</ul>
						</div>
					</GridItem>

					<GridItem>
						<div class="p-6 bg-error/10 border border-error/20 rounded-lg">
							<h3 class="text-lg font-semibold text-error-content mb-4">❌ Don't</h3>
							<ul class="space-y-2 text-error-content/80">
								<li>• Use arbitrary spacing values (e.g., 13px, 27px)</li>
								<li>• Mix different spacing systems</li>
								<li>• Hardcode breakpoint values</li>
								<li>• Use desktop-first responsive design</li>
								<li>• Override design tokens without good reason</li>
								<li>• Use font sizes smaller than 14px for body text</li>
								<li>• Mix different typography scales</li>
								<li>• Use too many font weights in one design</li>
								<li>• Ignore line height for readability</li>
							</ul>
						</div>
					</GridItem>
				</Grid>
			</Stack>
		</section>

		<!-- Code Examples -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<h2 class="text-2xl font-bold text-base-content mb-4">Code Examples</h2>
				</div>

				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">TypeScript Usage</h3>
					<div class="p-4 bg-base-200 rounded-lg overflow-x-auto">
						<pre class="text-sm"><code
								>{`import { layoutTokens, spacingTokens, typographyTokens } from '$lib/design-tokens';
import { Typography, Heading, Text } from '$lib/components/ui';

// Access design tokens
const containerSize = layoutTokens.container['5xl']; // '64rem'
const spacing = spacingTokens.spacing[4]; // '1rem'
const fontSize = typographyTokens.fontSize.lg; // '1.125rem'
const headingStyles = typographyTokens.semantic.heading.h2;

// Use in component props
<Container size="5xl" padding="lg">
  <Stack spacing={6}>
    <Heading level={1} responsive>Page Title</Heading>
    <Text size="large">Introduction text</Text>
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
      <!-- Content -->
    </Grid>
  </Stack>
</Container>`}</code
							></pre>
					</div>
				</div>

				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">CSS Classes</h3>
					<div class="p-4 bg-base-200 rounded-lg overflow-x-auto">
						<pre class="text-sm"><code
								>{`<!-- Typography classes -->
<h1 class="text-responsive-h1">Responsive Heading</h1>
<h2 class="text-h2 font-semibold">Standard Heading</h2>
<p class="text-body leading-normal">Body text with optimal readability</p>
<span class="text-caption text-neutral">Caption text</span>

<!-- Responsive spacing -->
<div class="p-4 md:p-6 lg:p-8">
  Responsive padding using design tokens
</div>

<!-- Responsive grid with typography -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <div class="text-body">Grid item with body text</div>
</div>

<!-- Utility classes -->
<div class="container-responsive">
  <div class="section-responsive">
    <div class="component-responsive">
      <h2 class="text-h2 mb-4">Section Title</h2>
      <p class="text-body">Content with semantic spacing and typography</p>
    </div>
  </div>
</div>`}</code
							></pre>
					</div>
				</div>

				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Typography Utility Functions</h3>
					<div class="p-4 bg-base-200 rounded-lg overflow-x-auto">
						<pre class="text-sm"><code
								>{`import { 
  getFontSize, 
  getHeadingStyles, 
  createTypographyStyles 
} from '$lib/utils/typography';

// Get individual token values
const titleSize = getFontSize('2xl'); // '1.5rem'
const h2Styles = getHeadingStyles('h2');

// Create inline styles object
const customStyles = createTypographyStyles({
  fontSize: 'lg',
  fontWeight: 'semibold',
  lineHeight: 'tight',
  letterSpacing: 'tight'
});

// Use in components
<h2 style="font-size: {titleSize}">Custom Title</h2>
<div style={Object.entries(customStyles).map(([k,v]) => \`\${k}: \${v}\`).join('; ')}>
  Styled content
</div>`}</code
							></pre>
					</div>
				</div>
			</Stack>
		</section>

		<!-- Typography Performance -->
		<section>
			<Stack direction="vertical" spacing={6}>
				<div>
					<Heading level={2} class="mb-4">Performance & Accessibility</Heading>
					<Text size="base" class="text-base-content/70 mb-6">
						Our typography system is optimized for performance and accessibility.
					</Text>
				</div>

				<Grid cols={{ default: 1, lg: 2 }} gap={6}>
					<GridItem>
						<div class="p-6 bg-info/10 border border-info/20 rounded-lg">
							<h3 class="text-lg font-semibold text-info-content mb-4">🚀 Performance Features</h3>
							<ul class="space-y-2 text-info-content/80">
								<li>• Font loading with <code class="bg-info/20 px-1 rounded">font-display: swap</code></li>
								<li>• System font fallbacks for instant rendering</li>
								<li>• CSS custom properties for efficient theming</li>
								<li>• Minimal font weight loading</li>
								<li>• Optimized UnoCSS integration</li>
							</ul>
						</div>
					</GridItem>

					<GridItem>
						<div class="p-6 bg-success/10 border border-success/20 rounded-lg">
							<h3 class="text-lg font-semibold text-success-content mb-4">♿ Accessibility Features</h3>
							<ul class="space-y-2 text-success-content/80">
								<li>• Minimum 14px font size for body text</li>
								<li>• Optimal line heights for readability</li>
								<li>• Sufficient color contrast ratios</li>
								<li>• Scalable rem units for user preferences</li>
								<li>• Semantic HTML structure support</li>
							</ul>
						</div>
					</GridItem>
				</Grid>

				<!-- Font Loading Demo -->
				<div>
					<h3 class="text-xl font-semibold text-base-content mb-4">Font Family Examples</h3>
					<Grid cols={{ default: 1, md: 3 }} gap={4}>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3 font-sans">Sans Serif (Rethink Sans)</h4>
								<p class="font-sans text-sm">
									The quick brown fox jumps over the lazy dog. 1234567890
								</p>
								<code class="text-xs bg-base-200 px-2 py-1 rounded mt-2 block">font-sans</code>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3 font-serif">Serif (Instrument Serif)</h4>
								<p class="font-serif text-sm">
									The quick brown fox jumps over the lazy dog. 1234567890
								</p>
								<code class="text-xs bg-base-200 px-2 py-1 rounded mt-2 block">font-serif</code>
							</div>
						</GridItem>
						<GridItem>
							<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
								<h4 class="font-semibold mb-3 font-body">Body (Open Sans)</h4>
								<p class="font-body text-sm">
									The quick brown fox jumps over the lazy dog. 1234567890
								</p>
								<code class="text-xs bg-base-200 px-2 py-1 rounded mt-2 block">font-body</code>
							</div>
						</GridItem>
					</Grid>
				</div>
			</Stack>
		</section>
	</Stack>
</Container>
