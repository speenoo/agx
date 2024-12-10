<script lang="ts" generics="Item">
	import { clamp, getRelativeParent, getTextWidth } from '$lib/components/charts/utils';
	import * as d3 from 'd3';
	import { sineOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { line_chart, line_generator } from './graph';
	import { fade } from 'svelte/transition';

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
			const last_index = data.length - 1;
			const text = y_format(y_accessor(data[last_index]));
			margin.left = getTextWidth(text) + tick_size + 4;
		}
	});

	const { scales, coords } = $derived(
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

	function position<N extends HTMLElement>(node: N, position: [x: number, y: number]) {
		const space = 10;

		function update([x, y]: [x: number, y: number]) {
			const constraint_rect = getRelativeParent(node)?.getBoundingClientRect();
			if (!constraint_rect) return;

			const rect = node.getBoundingClientRect();

			const left = x + space;
			const right = left + rect.width;

			node.style.position = 'absolute';
			node.style.left = '';
			if (right > constraint_rect.width) node.style.left = `${x - space - rect.width}px`;
			else node.style.left = `${left}px`;

			const top = clamp(y - rect.height / 2, 0 + space, constraint_rect.height - space);
			node.style.top = `${top}px`;
		}

		update(position);

		return { update };
	}
</script>

<div class="Container" bind:clientWidth={width} bind:clientHeight={height}>
	<svg {height} {width} viewBox="0 0 {width} {height}" onpointermove={handleMouseMove}>
		<g class="X-Axis">
			<line
				x1={margin.left}
				x2={width - margin.right}
				y1={height - margin.bottom}
				y2={height - margin.bottom}
				stroke="var(--line-color)"
				stroke-width="1"
			/>
			{#each scales.x.ticks(10) as tick, i (tick)}
				{@const x = scales.x(tick)}
				<line
					x1={x}
					x2={x}
					y1={height - margin.bottom}
					y2={height - margin.bottom + tick_size}
					stroke="var(--line-color)"
					stroke-width="1"
				/>

				<line
					x1={x}
					x2={x}
					y1={margin.top}
					y2={height - margin.bottom}
					stroke="var(--line-color)"
					stroke-dasharray="4"
					stroke-opacity="0.7"
					stroke-width="1"
				/>

				{#if i % 2 === 1}
					<text
						fill="var(--line-color)"
						text-anchor="middle"
						{x}
						y={height - margin.bottom + tick_size}
						dy="14"
					>
						{x_format(tick)}
					</text>
				{/if}
			{/each}
		</g>

		<g class="Y-Axis">
			<line
				x1={margin.left}
				x2={margin.left}
				y1={height - margin.bottom}
				y2={margin.top}
				stroke="var(--line-color)"
				stroke-width="1"
			/>
			{#each scales.y.ticks(9) as tick, i (tick)}
				{@const y = scales.y(tick)}
				<line
					x1={margin.left}
					x2={margin.left - tick_size}
					y1={y}
					y2={y}
					stroke="var(--line-color)"
					stroke-width="1"
				/>

				<line
					x1={margin.left}
					x2={width - margin.right}
					y1={y}
					y2={y}
					stroke="var(--line-color)"
					stroke-dasharray="4"
					stroke-opacity="0.7"
					stroke-width="1"
				/>

				<text
					fill="var(--line-color)"
					text-anchor="end"
					x={margin.left - tick_size}
					{y}
					dx="-4"
					dy="3"
				>
					{y_format(tick)}
				</text>
			{/each}
		</g>

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
		<div in:fade={{ duration: 150 }} class="Tooltip" use:position={[x, y]}>
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
