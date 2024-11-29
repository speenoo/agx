<script lang="ts">
	import { SplitPane } from '$lib/components/SplitPane';
	import WindowTitleBar from '$lib/components/WindowTitleBar.svelte';
	import { datasets_to_schema, Editor } from '$lib/components/Editor';
	import { exec, type CHResponse } from '$lib/query';
	import SideBar from '$lib/components/SideBar.svelte';
	import Result from '$lib/components/Result.svelte';
	import type { Dataset } from '$lib/types';
	import { getDefaultSource } from '$lib/components/Datasets/utils';
	import { applySlugs } from '$lib/utils/datasets';

	let response: CHResponse = $state.raw(undefined);

	let query = $state('');
	let loading = $state(false);

	async function handleExec() {
		if (loading) return;
		loading = true;
		response = await exec(applySlugs(query, sources)).finally(() => (loading = false));
	}

	let sources = $state<Dataset[]>([]);
	$effect.pre(() => {
		if (!sources.length) {
			getDefaultSource().then((source) => {
				if (source) sources.push(source);
			});
		}
	});
</script>

<WindowTitleBar>
	{#snippet actions()}
		<button onclick={handleExec} disabled={loading}>Run</button>
	{/snippet}
</WindowTitleBar>

<section class="screen">
	<SplitPane orientation="horizontal" position="242px" min="242px" max="40%">
		{#snippet a()}
			<SideBar bind:sources />
		{/snippet}
		{#snippet b()}
			<SplitPane orientation="vertical" min="20%" max="80%" --color="hsl(0deg 0% 12%)">
				{#snippet a()}
					<Editor bind:value={query} onExec={handleExec} schema={datasets_to_schema(sources)} />
				{/snippet}
				{#snippet b()}
					<Result {response} />
				{/snippet}
			</SplitPane>
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
		width: 100vw;
	}
</style>
