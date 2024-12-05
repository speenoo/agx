<svelte:options namespace="svg" />

<script lang="ts" generics="Domain extends d3.AxisDomain">
	interface Props {
		scale: d3.AxisScale<Domain>;
		x: number;
		'x-min'?: number;
		'x-max': number;
		grid?: boolean;
		ticks?: number;
		format?: (d: Domain, i: number) => string;
		'line-color'?: string;
		'line-width'?: number | string;
		'tick-width'?: number;
	}

	let {
		scale,
		x,
		'x-min': x_min = x,
		'x-max': x_max,
		grid = true,
		'line-color': line_color = 'white',
		'line-width': line_width = '1',
		format = (d) => d.toString(),
		ticks: ticks_count = 9,
		'tick-width': tick_width = 3
	}: Props = $props();

	const [min, max] = $derived.by(() => {
		const range = scale.range();
		return [range[0], range[range.length - 1]];
	});

	const ticks = $derived.by(() => {
		if ('ticks' in scale) {
			return (scale.ticks as (count: number) => Domain[]).call(scale, ticks_count);
		}

		return scale.domain();
	});
</script>

<g stroke={line_color} stroke-width={line_width}>
	<line x1={x} x2={x} y1={max} y2={min} />

	{#each ticks as tick, i (tick)}
		{@const y = scale(tick)}
		<line x1={x} x2={x - tick_width} y1={y} y2={y} />

		{#if grid}
			<line x1={x_min} x2={x_max} y1={y} y2={y} stroke-dasharray="4" stroke-opacity="0.7" />
		{/if}

		{@const text = format(tick, i)}
		{#if text}
			<text fill={line_color} stroke="none" text-anchor="end" x={x - tick_width} {y} dx="-4" dy="3">
				{text}
			</text>
		{/if}
	{/each}
</g>
