<script lang="ts">
	import { Table } from '$lib/components/Table';
	import type { OLAPResponse } from '$lib/olap-engine';
	import { untrack } from 'svelte';
	import ChartContainer from './ChartContainer.svelte';

	interface Props {
		response?: OLAPResponse;
	}

	let { response }: Props = $props();

	let tab = $state<'data' | 'chart'>('data');
	let yAxis = $state<string>('');
	let xAxis = $state<string>('');
	let chartType = $state('line');

	$effect(() => {
		const names = response?.meta.map((m) => m.name);

		if (!names?.includes(untrack(() => yAxis))) yAxis = '';
		if (!names?.includes(untrack(() => xAxis))) xAxis = '';
	});
</script>

<section>
	<nav>
		<button aria-current={tab === 'data'} onclick={() => (tab = 'data')}>Data</button>
		<button aria-current={tab === 'chart'} onclick={() => (tab = 'chart')}>Chart</button>
	</nav>
	<div>
		{#if response}
			{#if tab === 'data'}
				<Table {response} />
			{:else if tab === 'chart'}
				<ChartContainer {response} bind:xAxis bind:yAxis bind:type={chartType} />
			{/if}
		{/if}
	</div>
</section>

<style>
	section {
		background: hsl(0deg 0% 5%);
		color: hsl(0deg 0% 96%);
		display: flex;
		flex-direction: column;

		& > div {
			flex: 1;
			overflow: auto;
		}

		& > nav {
			flex-shrink: 0;
			user-select: none;
			-webkit-user-select: none;
			height: 28px;

			display: flex;
			align-items: center;

			position: relative;

			&::before {
				content: '';
				position: absolute;
				width: 100%;
				height: 1px;
				bottom: 0px;
				left: 0;
				background-color: hsl(0deg 0% 20%);
				z-index: 1;
			}

			& > button {
				height: 100%;
				font-size: 10px;
				font-weight: 500;
				background-color: transparent;
				padding: 0 16px;
				border-top: 1px solid hsl(0deg 0% 20%);
				border-right: 1px solid hsl(0deg 0% 20%);

				&:is(:hover, :focus-within) {
					cursor: pointer;
				}

				&:is([aria-current='true']) {
					background-color: hsl(0deg 0% 5%);
					z-index: 1;
				}
			}
		}
	}

	button {
		appearance: none;
		outline: none;
		border: none;
		background: none;
		padding: 0;
		display: block;
	}
</style>
