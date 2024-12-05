<svelte:options namespace="svg" />

<script lang="ts" generics="Domain extends d3.AxisDomain">
	interface Props {
		scale: d3.AxisScale<Domain>;
		y: number;
		'y-min'?: number;
		'y-max': number;
		grid?: boolean;
		ticks?: number;
		format?: (d: Domain, i: number) => string;
		'line-color'?: string;
		'line-width'?: number | string;
		'tick-height'?: number;
	}

	let {
		scale,
		y,
		'y-min': y_min = y,
		'y-max': y_max,
		grid = true,
		'line-color': line_color = 'white',
		'line-width': line_width = '1',
		format = (d) => d.toString(),
		ticks: ticks_count = 9,
		'tick-height': tick_height = 3
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
	<line x1={min} x2={max} y1={y} y2={y} />

	{#each ticks as tick, i (tick)}
		{@const x = scale(tick)}

		<line x1={x} x2={x} y1={y} y2={y + tick_height} />

		{#if grid}
			<line x1={x} x2={x} y1={y_min} y2={y_max} stroke-dasharray="4" stroke-opacity="0.7" />
		{/if}

		{@const text = format(tick, i)}
		{#if text}
			<text fill={line_color} stroke="none" text-anchor="middle" {x} y={y + tick_height} dy="14">
				{text}
			</text>
		{/if}
	{/each}
</g>
