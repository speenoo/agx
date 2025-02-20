<script lang="ts">
	import FolderOpen from '$lib/icons/FolderOpen.svelte';
	import Folder from '$lib/icons/Folder.svelte';
	import Table from '$lib/icons/Table.svelte';
	import Columns from './Columns.svelte';
	import Tree from './Tree.svelte';

	let { node = {}, level = 0 } = $props();
	let expanded = $state(false);

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="node">
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
		<div class="children">
			{#each node.children as child}
				<div class="tree-line">
					<Tree node={child} level={level + 1} />
				</div>
			{/each}
		</div>
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
		font-size: 11px;
		color: lightgray;
	}

	button {
		background: transparent;
		border: none;
		padding: 0;
	}

	.folder.name {
		margin-bottom: 5px;
	}

	.name {
		display: flex;
		align-items: center;
	}

	.name span {
		margin-left: 3px;
	}

	.tree-line {
		border-left: 1px solid #333;
		padding-left: 3px;
	}

	.children {
		margin-left: 4px;
	}
</style>
