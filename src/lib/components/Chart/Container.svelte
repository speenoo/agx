<script lang="ts">
	import type { ColumnDescriptor } from '$lib/olap-engine';
	import type { ChartSettingsType } from './_types';

	import Chart from './Chart.svelte';
	import Settings from './Settings.svelte';

	let {
		data,
		columns
	}: {
		data: Array<{ [key: string]: any }>;
		columns: Array<ColumnDescriptor>;
	} = $props();

	function setDefaultSettings() {
		const candleColumns = ['open', 'close', 'low', 'high'];

		const dateColumn = columns.find((col) => col.type.toLowerCase().includes('date'))?.name;
		const otherColumns = columns
			.filter((col) => !col.type.toLowerCase().includes('date'))
			.map((col) => col.name);

		const hasCandleColumns = candleColumns.some((col) =>
			columns.some((column) => column.name.toLowerCase() === col)
		);

		if (dateColumn && hasCandleColumns) {
			settings.chartType = 'candle';
			settings.xAxis.series = [dateColumn];
			settings.yAxis.series = candleColumns;
			return;
		}

		if (dateColumn && otherColumns.length > 0) {
			settings.chartType = 'line';
			settings.xAxis.series = [dateColumn];
			settings.yAxis.series = otherColumns;
			return;
		}
	}

	let settings = $state<ChartSettingsType>({
		chartType: 'line',
		xAxis: { series: [] },
		yAxis: { series: [] }
	});

	$effect(() => {
		if (columns) {
			setDefaultSettings();
		}
	});

	$effect(() => {
		if (settings.xAxis.series.length === 0 && settings.yAxis.series.length === 0) {
			setDefaultSettings();
		}
	});
</script>

<Chart {data} {settings} />
<Settings bind:settings {columns} />
