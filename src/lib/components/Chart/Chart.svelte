<script lang="ts">
	import type { ChartSettingsType } from './_types';
	import { renderChart } from './_render';

	let {
		data,
		settings
	}: {
		data: Array<{ [key: string]: any }>;
		settings: ChartSettingsType;
	} = $props();

	let div: HTMLElement;
	let resizeObserver: ResizeObserver;

	const render = () => renderChart(div, data, settings);

	$effect(() => {
		render();

		if (div) {
			resizeObserver = new ResizeObserver(() => {
				settings && render();
			});
			resizeObserver.observe(div);

			return () => {
				resizeObserver.disconnect();
			};
		}
	});
</script>

<div class="chart" bind:this={div} role="img"></div>

<style>
	.chart {
		width: 100%;
		height: 100%;
	}
</style>
