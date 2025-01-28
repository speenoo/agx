<script lang="ts">
	import * as Plot from '@observablehq/plot';
	import * as d3 from 'd3';
	import type { ChartSettingsType } from './types';
	import type { ColumnDescriptor } from '$lib/olap-engine';
	import Settings from './Settings.svelte';

	let {
		data,
		columns
	}: {
		data: Array<{ [key: string]: any }>;
		columns: Array<ColumnDescriptor>;
	} = $props();

	let settings = $state<ChartSettingsType>({
		chartType: 'line',
		xAxis: { series: [] },
		yAxis: { series: [] }
	});

	let div: HTMLElement | undefined = $state();

	const candleKeys = ['open', 'close', 'low', 'high'];

	let hasCandleKeys = candleKeys.every((key) =>
		columns.some((col) => col.name.toLowerCase() === key)
	);

	const createPlot = () => {
		div?.firstChild?.remove();

		const marks = [];

		const xAxisSeries = settings.xAxis.series[0];
		const yAxisSeries = settings.yAxis.series;

		const timeData = data.map((d) => ({
			...d,
			[xAxisSeries]: new Date(d[xAxisSeries]),
			...Object.fromEntries(yAxisSeries.map((s) => [s, Number(d[s])]))
		}));

		const colors = d3.schemeCategory10;

		switch (settings.chartType) {
			case 'line':
				yAxisSeries.forEach((ySeries, index) => {
					marks.push(
						Plot.line(timeData, {
							x: xAxisSeries ?? '',
							y: ySeries ?? '',
							stroke: colors[index % colors.length]
						})
					);
				});
				break;
			case 'candle':
				if (hasCandleKeys) {
					marks.push(
						Plot.ruleX(timeData, {
							x: xAxisSeries,
							y1: 'low',
							y2: 'high'
						}),
						Plot.ruleX(timeData, {
							x: xAxisSeries,
							y1: 'open',
							y2: 'close',
							stroke: (d: { [key: string]: any }) =>
								d['close'] > d['open'] ? '#4daf4a' : '#e41a1c',
							strokeWidth: 4,
							strokeLinecap: 'round'
						})
					);
				}
				break;
		}

		div?.append(
			Plot.plot({
				marks,
				marginTop: 15,
				marginRight: 15,
				marginBottom: 30,
				marginLeft: 40,
				grid: true,
				width: div.clientWidth,
				height: div.clientHeight,
				y: {
					label: null,
					labelArrow: false,
					tickFormat: d3.format('.2s')
				},
				x: {
					label: null,
					labelArrow: false
				}
			})
		);
	};

	let resizeObserver: ResizeObserver;

	$effect(() => {
		if (columns) {
			const seriesNames = columns.map((col) => col.name);
			const allSelectedSeries = [...settings.xAxis.series, ...settings.yAxis.series];
			const hasInvalidSeries = allSelectedSeries.some((series) => !seriesNames.includes(series));

			if (hasInvalidSeries) {
				settings.xAxis.series = [];
				settings.yAxis.series = [];
			}

			if (settings.xAxis.series.length == 0) {
				const xAxis = columns.find((col) => col.type.toLowerCase().includes('date'))?.name;
				const yAxis = columns.find((col) => !col.type.toLowerCase().includes('date'))?.name;

				if (xAxis && yAxis) {
					settings.xAxis.series = [xAxis];
					settings.yAxis.series = [yAxis];
				}
			}
		}

		if (data || settings) {
			createPlot();
		}

		if (div) {
			createPlot();
			resizeObserver = new ResizeObserver(() => {
				createPlot();
			});
			resizeObserver.observe(div);
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	});
</script>

<div class="chart" bind:this={div} role="img"></div>

<Settings bind:settings {columns} {hasCandleKeys} />

<style>
	.chart {
		width: 100%;
		height: 100%;
	}
</style>
