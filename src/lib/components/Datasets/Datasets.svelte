<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { get_app_context } from '$lib/context';
	import Database from '$lib/icons/Database.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Table from '$lib/icons/Table.svelte';
	import { listen } from '@tauri-apps/api/event';
	import { showMenu } from 'tauri-plugin-context-menu';
	import AddDataset from './AddDataset.svelte';
	import {
		DATASOURCE_TYPE_COLOR_MAP,
		DATASOURCE_TYPE_SHORT_NAME_MAP,
		DEFAULT_SOURCE,
		filter,
		remove_nullable
	} from './utils';

	const { datasets } = get_app_context();

	let search = $state<string>('');
	const filtered = $derived(filter(datasets.sources, search));

	let add_dataset_modal: ReturnType<typeof AddDataset>;
</script>

<SearchBar bind:value={search} />
<article>
	{#each filtered as source, i (source.slug)}
		<details open={i === 0}>
			<summary
				oncontextmenu={async (e) => {
					e.preventDefault();
					const element = e.currentTarget;
					element.classList.add('Selected');
					await showMenu({
						theme: 'dark',
						items: [
							{
								label: 'Reload',
								event: () => datasets.refresh(source)
							},
							{
								label: 'Copy path',
								event: () => navigator.clipboard.writeText(source.path)
							},
							{
								label: 'Copy slug',
								event: () => navigator.clipboard.writeText(source.slug)
							},
							{ is_separator: true },
							{
								label: 'Remove',
								event: () => datasets.remove(source),
								disabled: source.slug === DEFAULT_SOURCE.slug
							}
						]
					});

					const unlistenMenuClose = await listen('menu-did-close', () => {
						element.classList.remove('Selected');
						unlistenMenuClose();
					});
				}}
			>
				{#if source.type === 'MergeTree'}
					<Database size="15" />
				{:else}
					<Table size="15" />
				{/if}
				<h3>{source.name}</h3>
				<span class="Tag" style:background-color={DATASOURCE_TYPE_COLOR_MAP[source.type]}>
					{DATASOURCE_TYPE_SHORT_NAME_MAP[source.type]}
				</span>
			</summary>
			<ul>
				{#each source.columns ?? [] as column}
					<li>
						<span>{column.name}</span>
						<span>{remove_nullable(column.type)}</span>
					</li>
				{/each}
			</ul>
		</details>
	{/each}
	<div class="Actions">
		<button onclick={() => add_dataset_modal.show()}><Plus size="12" /></button>
	</div>
</article>

<AddDataset
	bind:this={add_dataset_modal}
	onCreate={async (values) => {
		const index = datasets.sources.findIndex((s) => s.slug === values.slug);
		if (index === -1) datasets.add({ name: values.name, slug: values.slug, path_url: values.path });
	}}
/>

<style>
	article {
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

		padding: 3px 5px;
		border-radius: 3px;

		&::-webkit-details-marker {
			display: none;
		}

		&:global(.Selected) {
			background-color: hsl(210deg 100% 52%);
		}
	}

	h3 {
		margin: 0;
	}

	.Tag {
		display: block;
		font-size: 8px;
		font-weight: 500;
		padding: 3px;
		border-radius: 3px;
		min-width: 16px;
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
		padding-left: 5px;

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
				background-color: hsl(0deg 0% 19%);
				text-align: center;
				font-family: 'Fira Mono', monospace;

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

	div {
		margin-top: 35px;

		& > button {
			/* Reset */
			appearance: none;
			outline: none;
			border: none;

			background-color: hsl(0deg 0% 33%);
			padding: 2px 8px;
			border-radius: 3px;
			cursor: pointer;

			display: flex;
			align-items: center;

			&:is(:active) {
				background-color: hsl(0deg 0% 52%);
			}
		}
	}
</style>
