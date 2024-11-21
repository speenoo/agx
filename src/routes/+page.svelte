<script lang="ts">
	import { SplitPane } from '$lib/components/SplitPane';
	import WindowTitleBar from '$lib/components/WindowTitleBar.svelte';
	import Editor from '$lib/editor.svelte';
	import type { CHResponse } from '$lib/query';
	import Schema from '$lib/schema.svelte';
	import Table from '$lib/table.svelte';

	let response: CHResponse = $state.raw(undefined);
</script>

<WindowTitleBar>
	{#snippet actions()}
		<button>Run</button>
	{/snippet}
</WindowTitleBar>

<section class="screen">
	<SplitPane orientation="horizontal" position="242px" min="242px" max="40%">
		{#snippet a()}
			<Schema />
		{/snippet}
		{#snippet b()}
			<section class="right">
				<SplitPane orientation="vertical" min="20%" max="80%">
					{#snippet a()}
						<Editor bind:response />
					{/snippet}
					{#snippet b()}
						<Table {response} />
					{/snippet}
				</SplitPane>
			</section>
		{/snippet}
	</SplitPane>
</section>

<style>
	button {
		appearance: none;
		outline: none;
		border: none;
		font-size: 10px;
		font-weight: 500;
		background-color: hsl(0deg 0% 9%);
		padding: 4px 10px;
		border-radius: 3px;

		cursor: pointer;

		&:is(:hover, :focus-within) {
			background-color: hsl(0deg 0% 15%);
		}
	}

	.screen {
		padding-top: var(--window-title-bar-height);
		height: 100vh;
	}
</style>
