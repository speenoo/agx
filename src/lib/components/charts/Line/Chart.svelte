<script lang="ts" generics="Item">
	import { position } from '$lib/components/charts/actions/constraints';
	import { getTextWidth } from '$lib/components/charts/utils';
	import * as d3 from 'd3';
	import { sineOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import XAxis from '../axis/XAxis.svelte';
	import YAxis from '../axis/YAxis.svelte';
	import { line_chart, line_generator } from './graph';

	interface Props {
		data: Array<Item>;
		x_accessor: (item: Item) => d3.NumberValue;
		y_accessor: (item: Item) => d3.NumberValue;
		x_format: (x: d3.NumberValue) => string;
		y_format: (y: d3.NumberValue) => string;
		x_label: string;
		y_label: string;
		line_color?: string;
	}

	let {
		line_color: color = 'hsl(208deg 100% 66%)',
		data,
		x_accessor,
		y_accessor,
		x_format,
		y_format,
		x_label,
		y_label
	}: Props = $props();

	let width = $state(0);
	let height = $state(0);

	const margin = $state({ top: 30, right: 0, bottom: 30, left: 0 });
	const tick_size = 3;

	$effect(() => {
		if (data.length) {
			const max_text_width = Math.max(...data.map((d) => getTextWidth(y_format(y_accessor(d)))));
			margin.left = max_text_width + tick_size + 4;
		}
	});

	const { scales, coords, axis } = $derived(
		line_chart(data, {
			x_accessor,
			y_accessor,
			x_range: [margin.left, width - margin.right],
			y_range: [height - margin.bottom, margin.top]
		})
	);

	const cursor = tweened<number | undefined>(undefined, { easing: sineOut });
	function handleMouseMove(e: PointerEvent) {
		const [pointer_x] = d3.pointer(e);
		cursor.set(scales.x.invert(pointer_x));
	}
</script>

<div class="Container" bind:clientWidth={width} bind:clientHeight={height}>
	<svg {height} {width} viewBox="0 0 {width} {height}" onpointermove={handleMouseMove}>
		<XAxis
			scale={scales.x}
			y={axis.x.y}
			y-min={axis.x.y_min}
			y-max={axis.x.y_max}
			line-color="var(--line-color)"
			format={(d, i) => (i % 2 === 1 ? x_format(d) : '')}
			tick-height={tick_size}
		/>

		<YAxis
			scale={scales.y}
			x={axis.y.x}
			x-min={axis.y.x_min}
			x-max={axis.y.x_max}
			line-color="var(--line-color)"
			format={y_format}
			tick-width={tick_size}
		/>

		<g stroke-width="2" fill="transparent">
			<path d={line_generator(coords)} stroke={color} />
		</g>

		{#if $cursor}
			{@const y_value = scales.x_to_y($cursor)}
			{@const y_ = scales.y(y_value)}
			{@const x_ = scales.x($cursor)}
			<g>
				<line
					x1={x_}
					x2={x_}
					y1={margin.top}
					y2={height - margin.bottom}
					stroke="var(--line-color)"
					stroke-width="2"
				/>

				<circle
					cx={x_}
					cy={y_}
					r={7}
					stroke-width="1"
					stroke="var(--line-color)"
					fill="transparent"
				/>
				<circle cx={x_} cy={y_} r={4} fill={color} />
			</g>
		{/if}
	</svg>
	{#if $cursor}
		{@const y_value = scales.x_to_y($cursor)}
		{@const x = scales.x($cursor)}
		{@const y = scales.y(y_value)}
		<div in:fade={{ duration: 150 }} class="Tooltip" data-spacing="10" use:position={[x, y]}>
			<article>
				<span>{x_label}: </span>
				<span>{x_format($cursor)}</span>
			</article>
			<article>
				<span>{y_label}: </span>
				<span>{y_format(y_value)}</span>
			</article>
		</div>
	{/if}
</div>

<style>
	div.Container {
		--line-color: hsl(0deg 0% 59%);

		position: relative;
		height: 100%;
		width: 100%;
	}

	svg {
		position: relative;
		z-index: 1;

		height: 100%;
		width: 100%;
	}

	.Tooltip {
		pointer-events: none;
		user-select: none;
		-webkit-user-select: none;

		border: 1px solid hsl(0deg 0% 29%);
		border-radius: 6px;
		background-color: hsl(0deg 0% 0%);
		padding: 8px 12px;
		z-index: 1;

		& > article {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 20px;
			text-wrap: nowrap;

			& > span:first-of-type {
				color: hsl(0deg 0% 71%);
			}
		}
	}
</style>
