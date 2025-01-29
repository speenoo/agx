import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import type { ChartSettingsType } from './_types';
import type { ColumnDescriptor } from '$lib/olap-engine';

export const renderChart = (
	inputDiv: HTMLElement,
	inputData: Array<{ [key: string]: any }>,
	columns: Array<ColumnDescriptor>,
	inputSettings: ChartSettingsType
) => {
	const candleKeys = ['open', 'close', 'low', 'high'];

	const hasCandleKeys = candleKeys.every((key) =>
		columns.some((col) => col.name.toLowerCase() === key)
	);

	inputDiv?.firstChild?.remove();

	const marks = [];

	const xAxisSeries = inputSettings.xAxis.series[0];
	const yAxisSeries = inputSettings.yAxis.series;

	const timeData = inputData.map((d) => ({
		...d,
		[xAxisSeries]: new Date(d[xAxisSeries]),
		...Object.fromEntries(yAxisSeries.map((s) => [s, Number(d[s])]))
	}));

	const colors = d3.schemeCategory10;

	switch (inputSettings.chartType) {
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
						stroke: (d: { [key: string]: any }) => (d['close'] > d['open'] ? '#4daf4a' : '#e41a1c'),
						strokeWidth: 4,
						strokeLinecap: 'round'
					})
				);
			}
			break;
	}

	inputDiv?.append(
		Plot.plot({
			marks,
			marginTop: 15,
			marginRight: 15,
			marginBottom: 30,
			marginLeft: 40,
			grid: true,
			width: inputDiv.clientWidth,
			height: inputDiv.clientHeight,
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
