export type Range = [number, number];

export interface ChartConfig<T> {
	x_accessor: (item: T) => d3.NumberValue;
	y_accessor: (item: T) => d3.NumberValue;
	x_range?: Range;
	y_range?: Range;
}
