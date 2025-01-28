export type ChartSettingsType = {
	chartType: 'candle' | 'line';
	xAxis: {
		series: string[];
	};
	yAxis: {
		series: string[];
	};
};
