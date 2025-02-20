<script lang="ts">
	let { columns } = $props();
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
		list-style: none;
		padding: 0;
		font-family: monospace;
		padding-bottom: 3px;
		padding-left: 5px;
		color: lightgray;
	}

	li {
		display: flex;
		justify-content: space-between;
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
	}
</style>
