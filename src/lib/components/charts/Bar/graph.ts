import type { Range } from '$lib/components/charts/types';
import { relative_x_range, relative_y_range } from '$lib/components/charts/utils';
import * as d3 from 'd3';

interface ChartConfig<T> {
	x_accessor: (item: T) => { toString(): string };
	y_accessor: (item: T) => d3.NumberValue;
	x_range?: Range;
	y_range?: Range;
	padding?: number;
}

export function bar_chart<Item>(data: Array<Item>, config: ChartConfig<Item>) {
	config.x_range ??= relative_x_range;
	config.y_range ??= relative_y_range;
	config.padding ??= 0.1;

	const X = d3.map(data, config.x_accessor);
	const Y = d3.map(data, config.y_accessor);

	const x = d3.scaleBand(X, config.x_range).padding(config.padding);

	const y = d3.scaleLinear(config.y_range);

	const y_min = d3.min(Y, (d) => Number(d))!;
	const y_max = d3.max(Y, (d) => Number(d))!;

	if (Y.every((y) => Number(y) < 0)) {
		y.domain([y_min, 0]);
	} else if (Y.some((y) => Number(y) < 0)) {
		const max = Math.max(Math.abs(y_min), Math.abs(y_max));
		y.domain([-max, max]);
	} else {
		y.domain([0, y_max]);
	}

	y.nice().clamp(true);

	return {
		scales: { x, y },
		axis: {
			x: { y: y(0), y_min: config.y_range[0], y_max: config.y_range[1] },
			y: { x: config.x_range[0], x_min: config.x_range[0], x_max: config.x_range[1] }
		}
	};
}
