<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { BarChart, Legend, Tooltip } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { schemeSpectral } from 'd3-scale-chromatic';

	const categories = [
		'accommodation',
		'catering',
		'decoration',
		'entertainment',
		'makeup-attire',
		'paperwork',
		'photo-video',
		'venue',
		'miscellaneous',
	] as const;

	const colorScale = scaleOrdinal(categories, schemeSpectral[categories.length]);

	const chartConfig = {
		accommodation: { label: 'Accommodation', color: colorScale('accommodation') },
		catering: { label: 'Catering', color: colorScale('catering') },
		decoration: { label: 'Decoration', color: colorScale('decoration') },
		entertainment: { label: 'Entertainment', color: colorScale('entertainment') },
		'makeup-attire': { label: 'Makeup & Attire', color: colorScale('makeup-attire') },
		paperwork: { label: 'Paperwork', color: colorScale('paperwork') },
		'photo-video': { label: 'Photo & Video', color: colorScale('photo-video') },
		venue: { label: 'Venue', color: colorScale('venue') },
		miscellaneous: { label: 'Miscellaneous', color: colorScale('miscellaneous') },
	} satisfies Chart.ChartConfig;

	const chartData = [
		{
			title: 'Total Expense',
			accommodation: 10000000,
			catering: 20000000,
			decoration: 5000000,
			entertainment: 4000000,
			'makeup-attire': 3000000,
			paperwork: 2000000,
			'photo-video': 5000000,
			venue: 15000000,
			miscellaneous: 1000000,
		},
	];

	const series = Object.entries(chartConfig).map(([key, cfg]) => ({
		key,
		label: cfg.label,
		color: cfg.color,
	}));
</script>

<div class="flex flex-col gap-4">
	<Chart.Container
		config={chartConfig}
		class="max-h-[4rem] w-full text-sm p-0 top-0 left-0 inline-flex items-center justify-center"
	>
		<BarChart
			data={chartData}
			yScale={scaleBand()}
			orientation="horizontal"
			y="title"
			axis="y"
			padding={{ left: -1.75, top: 0 }}
			seriesLayout="stack"
			{series}
			props={{
				bars: {
					stroke: 'none',
					radius: 6,
					insets: {
						left: 2,
					},
					rounded: 'all',
					initialWidth: 0,
					initialX: 0,
					motion: {
						x: { type: 'tween', duration: 500, easing: cubicInOut },
						width: { type: 'tween', duration: 500, easing: cubicInOut },
					},
				},
				highlight: { area: { fill: 'none' } },
			}}
		></BarChart>
	</Chart.Container>
	<Legend
		class="w-full flex items-center justify-center"
		tickFontSize={10}
		scale={scaleOrdinal(
			[
				'accommodation',
				'catering',
				'decoration',
				'entertainment',
				'makeup-attire',
				'paperwork',
				'photo-video',
				'venue',
				'miscellaneous',
			],
			schemeSpectral[10],
		)}
		variant="swatches"
		classes={{ swatch: 'rounded' }}
	></Legend>
</div>
