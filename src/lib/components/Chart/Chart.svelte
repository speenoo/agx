<script lang="ts">
	import * as Plot from '@observablehq/plot';
	import * as d3 from 'd3';
	import type { ChartSettingsType } from './types';
	import type { ColumnDescriptor } from '$lib/olap-engine';

	let {
		data,
		columns,
		settings = $bindable()
	}: {
		data: Array<{ [key: string]: any }>;
		columns: Array<ColumnDescriptor>;
		settings: ChartSettingsType;
	} = $props();

	let showChartSettings = $state(false);

	let div: HTMLElement | undefined = $state();

	const hasCandleKeys = () => {
		const candleKeys = ['open', 'close', 'low', 'high'];
		return candleKeys.every((key) => columns.some((col) => col.name.toLowerCase() === key));
	};

	const createPlot = () => {
		div?.firstChild?.remove();

		const marks = [];

		const xAxisSeries = settings.xAxis.series[0];
		const yAxisSeries = settings.yAxis.series;

		const timeData = data.map((d) => ({
			...d,
			[xAxisSeries]: new Date(d[xAxisSeries])
		}));

		switch (settings.chartType) {
			case 'line':
				yAxisSeries.forEach((ySeries) => {
					marks.push(
						Plot.line(timeData, {
							x: xAxisSeries ?? '',
							y: ySeries ?? ''
						})
					);
				});
				break;
			case 'candle':
				if (hasCandleKeys()) {
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

				settings.xAxis.series = xAxis ? [xAxis] : [];
				settings.yAxis.series = yAxis ? [yAxis] : [];
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

	const toggleChartSettings = () => {
		showChartSettings = !showChartSettings;
	};

	const handleChartTypeChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;
		settings.chartType = select.value as 'candle' | 'line';
		if (select.value === 'candle' && hasCandleKeys()) {
			settings.yAxis.series = ['low', 'high', 'open', 'close'];
		}
	};

	const handleXAxisChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions).map((option) => option.value);
		settings.xAxis.series = selectedOptions;
	};

	const handleYAxisChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions).map((option) => option.value);
		settings.yAxis.series = selectedOptions;
	};
</script>

<div class="chart" bind:this={div} role="img"></div>

{#if showChartSettings}
	<section class="chart-settings">
		<form>
			<div class="setting">
				<span>type</span>
				<select multiple value={settings.chartType} onchange={handleChartTypeChange} size={2}>
					<option value="line">line</option>
					<option value="candle">candle</option>
				</select>
			</div>
			<div class="setting">
				<span>x-axis</span>
				<select multiple value={settings.xAxis.series} onchange={handleXAxisChange} size={4}>
					{#each columns as column}
						<option value={column.name}>{column.name}</option>
					{/each}
				</select>
			</div>

			<div class="setting">
				<span>y-axis</span>
				<div style="display: flex; gap: 5px;">
					<select
						multiple
						value={settings.yAxis.series}
						onchange={handleYAxisChange}
						size={4}
						disabled={settings.chartType === 'candle'}
					>
						{#each columns as column}
							<option value={column.name}>{column.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</form>
	</section>
{/if}

<svelte:window
	on:click={(e) => {
		const target = e.target as HTMLElement;

		const isTargetWithinSettings = target?.closest('.chart-settings');
		const isTargetWithinChartSettingsButton = target?.closest(
			'[data-action="toggle-chart-settings"]'
		);
		if (isTargetWithinChartSettingsButton || (!isTargetWithinSettings && showChartSettings)) {
			toggleChartSettings();
		}
	}}
/>

<style>
	.chart {
		width: 100%;
		height: 100%;
	}

	.chart-settings {
		font-family: monospace;
		font-size: 10px;
		position: absolute;
		top: 10px;
		right: 10px;
		height: 170px;
		width: 200px;
		background: hsla(0, 0%, 5%, 0.8);
		border: 1px solid hsl(0deg 0% 20%);
		padding: 10px;
	}

	.chart-settings select {
		width: 80px;
		border: none;
		background: transparent;
		color: white;
		outline: none;
		color: grey;

		&:disabled,
		&:disabled option {
			opacity: 1;
			color: grey;
			& option:checked {
				color: white;
			}
		}

		& option:checked,
		& option:active {
			background: none;
		}
	}

	.chart-settings .setting {
		display: flex;
		justify-content: space-between;
		padding-bottom: 2px;
		margin-bottom: 5px;
	}

	select::-webkit-scrollbar {
		display: none;
	}
</style>
