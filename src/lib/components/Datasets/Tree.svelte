<script lang="ts">
	import Folder from '$lib/icons/Folder.svelte';
	import FolderOpen from '$lib/icons/FolderOpen.svelte';
	import Table from '$lib/icons/Table.svelte';
	import Columns from './Columns.svelte';
	import Tree from './Tree.svelte';

	let { node = {}, level = 0, expanded: forceExpanded = false } = $props();
	let expanded = $state(false);

	$effect(() => {
		expanded = forceExpanded;
	});

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="node" style:opacity={expanded ? 1 : 0.7 + level}>
	<button
		type="button"
		class:folder={node.type === 'group'}
		onclick={toggleExpanded}
		style="cursor: pointer"
		data-level={level}
	>
		{#if node.type == 'group'}
			<span class="folder name">
				{#if expanded}
					<FolderOpen size={10} />
				{:else}
					<Folder size={10} />
				{/if}
				<span>{node.name}</span>
			</span>
		{/if}

		{#if node.type == 'dataset'}
			<span class="name">
				<Table size={10} />
				<span>{node.name}</span>
			</span>
		{/if}
	</button>
	{#if node.type === 'group' && node.children && expanded}
		{#each node.children as child}
			<Tree node={child} level={level + 1} expanded={forceExpanded} />
		{/each}
	{/if}
	{#if node.type === 'dataset' && expanded}
		<div class="dataset">
			<Columns columns={node.columns} />
		</div>
	{/if}
</div>

<style>
	* {
		font-family: monospace;
		font-size: 12px;
		color: lightgray;
	}

	.node {
		margin-left: 4px;
	}

	button {
		background: transparent;
		border: none;
		padding: 0;
	}

	.name {
		display: flex;
		align-items: center;
		margin-top: 3px;
	}

	.name span {
		margin-left: 3px;
	}
</style>
