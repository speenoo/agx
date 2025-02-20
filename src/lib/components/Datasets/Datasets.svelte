<script lang="ts">
	import type { Table } from '$lib/olap-engine';

	import SearchBar from '$lib/components/SearchBar.svelte';
	import { buildTree, filter } from './utils';
	import Tree from './Tree.svelte';

	type Props = {
		tables?: Table[];
	};

	let { tables = [] }: Props = $props();

	let search = $state<string>('');
	const filtered = $derived(filter(tables, search));
	const tree = $derived(buildTree(filtered));
</script>

<SearchBar bind:value={search} />

{#each tree as node}
	<Tree {node} />
{/each}
