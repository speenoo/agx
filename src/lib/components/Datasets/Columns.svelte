<script lang="ts">
	import type { ColumnDescriptor } from '$lib/olap-engine';

	interface Props {
		columns: ColumnDescriptor[];
	}

	let { columns }: Props = $props();
</script>

<ul>
	{#each columns ?? [] as column}
		<li>
			<span>{column.name}</span>
			<span>{column.type.replace(/Nullable\((.*)\)/i, '$1')}</span>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0;
		margin-top: 2px;
		margin-bottom: 2px;
		padding: 0;
		list-style: none;
		font-family: monospace;
		color: #bbb;
		font-size: 11px;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		white-space: nowrap;
	}

	li span:first-child {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 50%;
	}

	li span:last-child {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 50%;
		padding: 0 2px;
		color: #777;
		font-size: 9px;
	}
</style>
