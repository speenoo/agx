<script lang="ts">
	import type { CHResponse } from '$lib/query';
	import Table from '$lib/components/Table/Table.svelte';

	interface Props {
		response: CHResponse;
	}

	let { response }: Props = $props();
</script>

<section>
	<div>
		{#if response}
			<Table {response} />
		{/if}
	</div>
</section>

<style>
	section {
		background: hsl(0deg 0% 0%);
		color: hsl(0deg 0% 96%);
		display: flex;
		flex-direction: column;

		& > div {
			flex: 1;
			overflow: auto;
		}
	}
</style>
