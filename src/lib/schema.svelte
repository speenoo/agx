<script lang="ts">
	import { appWindow } from '@tauri-apps/api/window';
	import { exec, type CHResponse } from './query';
	import { onMount } from 'svelte';

	let schema: CHResponse = $state.raw(undefined);

	onMount(async () => {
		schema = await exec(
			`DESCRIBE TABLE s3('https://data.agnostic.dev/ethereum-mainnet-pq/logs/*.parquet', 'Parquet')`
		);
	});

	appWindow.onFileDropEvent(async (event) => {
		if (event.payload.type === 'drop') {
			const path = event.payload.paths[0];
			schema = await exec(`DESCRIBE '${path}'`);
		}
	});
</script>

<section>
	{#if schema}
		{#each schema.data as column}
			<div class="column">
				<span class="name">{column.name}</span>
				<span class="type">{column.type}</span>
			</div>
		{/each}
	{/if}
</section>

<style>
	section {
		padding: 10px;
		background: hsl(0deg 0% 12%);
		overflow: scroll;
		font-size: 10px;
	}

	.column {
		display: flex;
		white-space: nowrap;
	}

	.name {
		font-weight: 600;
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.type {
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
