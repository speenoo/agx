<script lang="ts">
	import type { ColumnDescriptor } from '$lib/olap-engine';
	import type { ChartSettingsType } from './_types';

	let {
		columns,
		settings = $bindable()
	}: {
		settings: ChartSettingsType;
		columns: Array<ColumnDescriptor>;
	} = $props();

	let showChartSettings = $state(false);

	const toggleChartSettings = () => {
		showChartSettings = !showChartSettings;
	};

	const handleChartTypeChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;
		settings.chartType = select.value as 'candle' | 'line';
	};

	const handleXAxisChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions).map((option) => option.value);
		settings.xAxis.series = selectedOptions;
	};

	const handleYAxisChange = (event: Event) => {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions).map((option) => option.value);
		settings.yAxis.series = selectedOptions;
	};
</script>

{#if showChartSettings}
	<section class="chart-settings">
		<form>
			<div class="setting">
				<span>type</span>
				<select multiple value={settings.chartType} onchange={handleChartTypeChange} size={2}>
					<option value="line">line</option>
					<option value="candle">candle</option>
				</select>
			</div>
			<div class="setting">
				<span>x-axis</span>
				<select multiple value={settings.xAxis.series} onchange={handleXAxisChange} size={4}>
					{#each columns as column}
						<option value={column.name}>{column.name}</option>
					{/each}
				</select>
			</div>

			<div class="setting">
				<span>y-axis</span>
				<div style="display: flex; gap: 5px;">
					<select
						multiple
						value={settings.yAxis.series}
						onchange={handleYAxisChange}
						size={4}
						disabled={settings.chartType === 'candle'}
					>
						{#each columns as column}
							<option value={column.name}>{column.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</form>
	</section>
{/if}

<svelte:window
	on:click={(e) => {
		const target = e.target as HTMLElement;

		const isTargetWithinSettings = target?.closest('.chart-settings');
		const isTargetWithinChartSettingsButton = target?.closest(
			'[data-action="toggle-chart-settings"]'
		);
		if (isTargetWithinChartSettingsButton || (!isTargetWithinSettings && showChartSettings)) {
			toggleChartSettings();
		}
	}}
/>

<style>
	.chart-settings {
		font-family: monospace;
		font-size: 10px;
		position: absolute;
		top: 10px;
		right: 10px;
		height: 170px;
		width: 200px;
		background: hsla(0, 0%, 5%, 0.8);
		border: 1px solid hsl(0deg 0% 20%);
		padding: 10px;
	}

	.chart-settings select {
		width: 80px;
		border: none;
		background: transparent;
		color: white;
		outline: none;
		color: grey;

		&:disabled,
		&:disabled option {
			opacity: 1;
			color: grey;
			& option:checked {
				color: white;
			}
		}

		& option:checked,
		& option:active {
			background: none;
		}
	}

	.chart-settings .setting {
		display: flex;
		justify-content: space-between;
		padding-bottom: 2px;
		margin-bottom: 5px;
	}

	select::-webkit-scrollbar {
		display: none;
	}
</style>
