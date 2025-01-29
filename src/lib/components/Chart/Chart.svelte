<script lang="ts">
	import type { ChartSettingsType } from './types';
	import type { ColumnDescriptor } from '$lib/olap-engine';
	import Settings from './Settings.svelte';
	import { renderChart } from './render';

	let {
		data,
		columns
	}: {
		data: Array<{ [key: string]: any }>;
		columns: Array<ColumnDescriptor>;
	} = $props();

	let div: HTMLElement;
	let resizeObserver: ResizeObserver;

	const render = () => renderChart(div, data, columns, settings);

	function setDefaultSettings() {
		const candleColumns = ['open', 'close', 'low', 'high'];

		const dateColumn = columns.find((col) => col.type.toLowerCase().includes('date'))?.name;
		const otherColumn = columns.find((col) => !col.type.toLowerCase().includes('date'))?.name;

		const hasCandleColumns = candleColumns.some((col) =>
			columns.some((column) => column.name.toLowerCase() === col)
		);

		if (dateColumn && hasCandleColumns) {
			settings.chartType = 'candle';
			settings.xAxis.series = [dateColumn];
			settings.yAxis.series = candleColumns;
			return;
		}

		if (dateColumn && otherColumn) {
			settings.chartType = 'line';
			settings.xAxis.series = [dateColumn];
			settings.yAxis.series = [otherColumn];
			return;
		}
	}

	let settings = $state<ChartSettingsType>({
		chartType: 'line',
		xAxis: { series: [] },
		yAxis: { series: [] }
	});

	$effect(() => {
		render();

		if (settings.xAxis.series.length === 0 && settings.yAxis.series.length === 0) {
			setDefaultSettings();
		}
	});

	$effect(() => {
		if (div) {
			resizeObserver = new ResizeObserver(() => {
				render();
			});
			resizeObserver.observe(div);

			return () => {
				resizeObserver.disconnect();
			};
		}
	});
</script>

<div class="chart" bind:this={div} role="img"></div>

<Settings bind:settings {columns} />

<style>
	.chart {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
