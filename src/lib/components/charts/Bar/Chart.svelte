<script lang="ts" generics="Item">
	import XAxis from '../axis/XAxis.svelte';
	import YAxis from '../axis/YAxis.svelte';
	import { getTextWidth } from '../utils';
	import { bar_chart } from './graph';

	interface Props {
		data: Array<Item>;
		x_accessor: (item: Item) => { toString(): string };
		y_accessor: (item: Item) => d3.NumberValue;
		x_format: (x: ReturnType<Props['x_accessor']>) => string;
		y_format: (y: ReturnType<Props['y_accessor']>) => string;
		x_label: string;
		y_label: string;
		color?: string;
	}

	let {
		color = 'hsl(208deg 100% 66%)',
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

	const { scales, axis } = $derived(
		bar_chart(data, {
			x_accessor,
			y_accessor,
			x_range: [margin.left, width - margin.right],
			y_range: [height - margin.bottom, margin.top]
		})
	);
</script>

<div class="Container" bind:clientWidth={width} bind:clientHeight={height}>
	<svg {height} {width} viewBox="0 0 {width} {height}">
		<XAxis
			grid={false}
			scale={scales.x}
			y={axis.x.y}
			y-min={axis.x.y_min}
			y-max={axis.x.y_max}
			line-color="var(--line-color)"
			format={(d) => x_format(d)}
			tick-position={(_, i) => (y_accessor(data[i]).valueOf() < 0 ? 'top' : 'bottom')}
		/>

		<YAxis
			scale={scales.y}
			x={axis.y.x}
			x-max={axis.y.x_max}
			x-min={axis.y.x_min}
			line-color="var(--line-color)"
			format={y_format}
		/>

		<g class="Positive" fill={color}>
			{#each data as d}
				{@const x_value = x_accessor(d)}
				{@const y_value = y_accessor(d)}
				{#if Number(y_value) >= 0}
					<rect
						x={scales.x(x_value)}
						y={scales.y(y_value)}
						height={scales.y(0) - scales.y(y_value)}
						width={scales.x.bandwidth()}
					/>
				{:else}
					<rect
						x={scales.x(x_value)}
						y={scales.y(0)}
						height={scales.y(0) - scales.y(-y_value)}
						width={scales.x.bandwidth()}
					/>
				{/if}
			{/each}
		</g>
	</svg>
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
</style>
