<script lang="ts">
	import { applyType, formatValue, isSupportedType, LineChart } from '$lib/components/charts/Line';
	import type { OLAPResponse } from '$lib/olap-engine';
	import { BarChart } from './charts/Bar';
	interface Props {
		response: OLAPResponse;
		xAxis: string;
		yAxis: string;
		type: string;
	}

	let {
		response,
		xAxis = $bindable(),
		yAxis = $bindable(),
		type: chartType = $bindable()
	}: Props = $props();

	const xType = $derived(response.meta.find((c) => c.name === xAxis)?.type ?? '');
	const yType = $derived(response.meta.find((c) => c.name === yAxis)?.type ?? '');
</script>

<article>
	<div class="Container">
		{#if xAxis && yAxis}
			{#if chartType === 'line' && isSupportedType(xType) && isSupportedType(yType)}
				<LineChart
					data={response.data}
					x_accessor={(d) => applyType(d[xAxis], xType)}
					y_accessor={(d) => applyType(d[yAxis], yType)}
					x_format={(x) => formatValue(x, xType)}
					y_format={(y) => formatValue(y, yType)}
					x_label={xAxis}
					y_label={yAxis}
				/>
			{/if}
			{#if chartType === 'bar' && isSupportedType(yType)}
				<BarChart
					data={response.data}
					x_accessor={(d) => d[xAxis].toString()}
					y_accessor={(d) => applyType(d[yAxis], yType)}
					x_format={(x) => formatValue(x, xType)}
					y_format={(y) => formatValue(y, yType)}
					x_label={xAxis}
					y_label={yAxis}
				/>
			{/if}
		{/if}
	</div>
	<div class="Actions">
		<label>
			chart type:
			<select bind:value={chartType}>
				<option value="line">Line chart</option>
				<option value="bar">Bar chart</option>
			</select>
		</label>
		<label>
			x-axis:
			<select bind:value={xAxis}>
				<option value="">None</option>
				{#each response.meta as column}
					{#if isSupportedType(column.type)}
						<option value={column.name}>{column.name}</option>
					{/if}
				{/each}
			</select>
		</label>
		<label>
			y-axis:
			<select bind:value={yAxis}>
				<option value="">None</option>
				{#each response.meta as column}
					{#if isSupportedType(column.type)}
						<option value={column.name}>{column.name}</option>
					{/if}
				{/each}
			</select>
		</label>
	</div>
</article>

<style>
	article {
		height: 100%;
		width: 100%;

		/* Horizontal-Stack */
		display: flex;
		flex-direction: column;

		& > .Container {
			flex: 1;
			padding: 25px;
			overflow: hidden;
		}

		& > .Actions {
			padding: 7px 5px;

			& select {
				outline: none;
			}
		}
	}
</style>
