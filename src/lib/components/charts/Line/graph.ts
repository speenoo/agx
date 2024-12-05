import type { Range } from '$lib/components/charts/types';
import { relative_x_range, relative_y_range } from '$lib/components/charts/utils';
import * as d3 from 'd3';

export const line_generator = d3.line().curve(d3.curveCardinal.tension(0.7));

interface LineConfig<T> {
	x_accessor: (item: T) => d3.NumberValue;
	y_accessor: (item: T) => d3.NumberValue;
	x_range?: Range;
	y_range?: Range;
}

type D3Range = [d3.NumberValue, d3.NumberValue];

export function line_chart<Item>(data: Array<Item>, config: LineConfig<Item>) {
	config.x_range ??= relative_x_range;
	config.y_range ??= relative_y_range;

	const X = d3.map(data, config.x_accessor);
	const Y = d3.map(data, config.y_accessor);

	const x_scale = d3.scaleLinear(d3.extent(X) as D3Range, config.x_range).clamp(true);
	const y_scale = d3.scaleLinear(d3.extent(Y) as D3Range, config.y_range).clamp(true);

	const coords = d3.range(data.length).map((index) => {
		const d = data[index];
		const x = config.x_accessor(d);
		const y = config.y_accessor(d);

		return [x_scale(x), y_scale(y)] as Range;
	});

	const x_to_y_scale = d3.scaleLinear(X, Y);

	return {
		scales: { x: x_scale, y: y_scale, x_to_y: x_to_y_scale },
		coords,
		axis: {
			x: {
				y: y_scale(get_position(...y_scale.domain())),
				y_min: config.y_range[0],
				y_max: config.y_range[1]
			},
			y: {
				x: x_scale(get_position(...x_scale.domain())),
				x_min: config.x_range[0],
				x_max: config.x_range[1]
			}
		}
	};
}

function get_position(...domain: number[]) {
	const max = Math.max(...domain);
	const min = Math.min(...domain);

	if (min < 0 && max < 0) {
		return max;
	}

	if (min < 0 && max > 0) {
		return 0;
	}

	return min;
}
