<script lang="ts">
	import type { Table } from '$lib/olap-engine';

	import SearchBar from '$lib/components/SearchBar.svelte';
	import TableC from '$lib/icons/Table.svelte';
	import { filter, SOURCE_TYPE_COLOR_MAP, SOURCE_TYPE_SHORT_NAME_MAP } from './utils';

	type Props = {
		tables?: Table[];
	};

	let { tables = [] }: Props = $props();

	let search = $state<string>('');
	const filtered = $derived(filter(tables, search));
</script>

<SearchBar bind:value={search} />
<article>
	{#each filtered as source, i (source.name)}
		<details open={i === 0}>
			<summary>
				{#if Object.keys(SOURCE_TYPE_SHORT_NAME_MAP).includes(source.engine)}
					<span class="Tag" style:color={SOURCE_TYPE_COLOR_MAP[source.engine]}>
						{SOURCE_TYPE_SHORT_NAME_MAP[source.engine]}
					</span>
				{:else}
					<TableC size="15" />
				{/if}
				<h3>{source.name}</h3>
			</summary>
			<ul>
				{#each source.columns ?? [] as column}
					<li>
						<span>{column.name}</span>
						<span>{column.type.replace(/Nullable\((.*)\)/i, '$1')}</span>
					</li>
				{/each}
			</ul>
		</details>
	{/each}
</article>

<style>
	article {
		font-family: monospace;
		font-size: 10px;
		flex: 1;
		overflow-y: auto;
	}

	details {
		width: 100%;

		details ~ & {
			margin-top: 12px;
		}
	}

	summary {
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		display: flex;
		align-items: center;
		gap: 5px;

		padding: 3px 0px;
		border-radius: 3px;

		&::-webkit-details-marker {
			display: none;
		}

		& > :global(svg),
		& > span {
			flex-shrink: 0;
		}

		& > h3 {
			flex-shrink: 1;

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
	}

	h3 {
		color: hsl(0deg 0% 85%);
		font-size: 11px;
		font-weight: 500;
		margin: 0;
	}

	.Tag {
		font-size: 9px;
		font-weight: 600;
		border-radius: 3px;
		background: hsl(0deg 0% 10%);
		padding: 3px;
	}

	ul {
		/* Reset */
		list-style: none;
		margin: 0;
		padding: 0;

		/* Stack */
		display: flex;
		flex-direction: column;
		gap: 5px;

		/* Custom style */
		padding: 12px 0;
		color: hsl(0deg 0% 75%);

		& > li {
			display: flex;
			align-items: center;

			& > span:first-of-type {
				flex-grow: 1;
			}

			& > span:last-of-type {
				font-size: 8px;
				font-weight: 500;
				padding: 2px;
				border-radius: 3px;
				background-color: hsl(0deg 0% 10%);
				color: hsl(0deg 0% 55%);
				text-align: center;
				flex-shrink: 1;

				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}

		&:last-of-type {
			padding-bottom: 0;
		}
	}
</style>
