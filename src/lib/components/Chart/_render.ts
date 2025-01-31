import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import type { ChartSettingsType } from './_types';

export const renderChart = (
	inputDiv: HTMLElement,
	inputData: Array<{ [key: string]: any }>,
	settings: ChartSettingsType
) => {
	inputDiv?.firstChild?.remove();

	if (settings.xAxis.series.length == 0 || settings.yAxis.series.length == 0) {
		return;
	}

	const marks = [];

	const xAxisSeries = settings.xAxis.series[0];
	const yAxisSeries = settings.yAxis.series;

	const timeData = inputData
		.map((d) => ({
			...d,
			[xAxisSeries]: new Date(d[xAxisSeries]),
			...Object.fromEntries(yAxisSeries.map((s) => [s, Number(d[s])]))
		}))
		.sort((a, b) => a[xAxisSeries] - b[xAxisSeries]);

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
