<script lang="ts">
	import { getAppContext } from '$lib/context';
	import type { Query } from '$lib/repositories/queries';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import SearchBar from '../SearchBar.svelte';

	dayjs.extend(relativeTime);

	interface Props {
		queries?: Query[];

		onOpen?: (query: Query) => MaybePromise<void>;
		onDelete?: (query: Query) => MaybePromise<void>;
		onRename?: (query: Query) => MaybePromise<void>;
	}

	let { queries = [], onOpen, onDelete, onRename }: Props = $props();

	const { contextmenu: context_menu } = getAppContext();

	let editingId = $state<Query['id']>();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			editingId = undefined;
		}
	}

	let input = $state.raw<HTMLInputElement>();
	$effect(() => input?.focus());

	let search = $state('');
	const filtered = $derived(search ? filter(queries, search) : queries);

	function filter(queries: Query[], search: string) {
		if (!search) return queries;

		const lower_search = search.toLowerCase();
		return queries.filter((q) => {
			return (
				q.name.toLowerCase().includes(lower_search) || q.sql.toLowerCase().includes(lower_search)
			);
		});
	}
</script>

<SearchBar bind:value={search} />
<ol role="menu">
	{#each filtered as query (query.id)}
		<li
			tabindex="-1"
			oncontextmenu={(e) => {
				e.preventDefault();
				context_menu.show({
					items: [
						{
							label: 'Open',
							onClick: () => onOpen?.(query),
							disabled: !onOpen
						},
						{
							label: 'Rename',
							onClick: () => (editingId = query.id),
							disabled: !onRename
						},
						{ is_separator: true },
						{
							label: 'Delete',
							onClick: () => onDelete?.(query),
							disabled: !onDelete
						}
					],
					position: { x: e.clientX, y: e.clientY }
				});
			}}
			role="menuitem"
			onkeydown={async (e) => {
				if (editingId) return;
				if (e.key === 'Enter') {
					e.preventDefault();
					editingId = query.id;
				}

				if (e.key === 'Backspace') {
					await onDelete?.(query);
					e.currentTarget.blur();
				}
			}}
			onclick={async (e) => {
				if (e.detail >= 2) {
					await onOpen?.(query);
					e.currentTarget.blur();
				}
			}}
			ontouchend={async (e) => {
				await onOpen?.(query);
				e.currentTarget.blur();
			}}
		>
			<div>
				{#if editingId === query.id}
					<form
						onsubmit={async (e) => {
							e.preventDefault();
							const form_data = new FormData(e.currentTarget);
							const name = form_data.get('name') as string;
							if (name && name !== query.name) {
								await onRename?.({ ...query, name });
							}
							editingId = undefined;
						}}
					>
						<input
							bind:this={input}
							type="text"
							name="name"
							value={query.name}
							onkeydown={handleKeydown}
							onblur={() => (editingId = undefined)}
							autocomplete="off"
						/>
					</form>
				{:else}
					<span class="name">{query.name}</span>
				{/if}
				<span class="time">{dayjs(query.createdAt).fromNow()}</span>
			</div>
		</li>
	{/each}
</ol>

<style>
	ol {
		color: hsl(0deg 0% 90%);

		list-style: none;
		margin: 0;
		padding: 0;

		flex: 1;
		overflow-y: auto;
	}

	li {
		padding: 3px 5px;
		border-radius: 3px;

		cursor: default;
		user-select: none;
		-webkit-user-select: none;

		display: flex;
		align-items: center;
		gap: 5px;

		& > div {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 2px;
			overflow: hidden;

			& > form {
				width: 100%;

				& > input {
					appearance: none;
					-webkit-appearance: none;
					width: 100%;
					height: 18px;
					font-weight: 500;
					outline: none;
					margin: 0;
					padding: 0;
					border: none;
				}
			}

			& > span.name {
				display: block;
				height: 18px;
				font-weight: 600;
				padding: 3px 0;
				line-height: 1.15;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-weight: 500;
			}

			& > span.time {
				font-size: 10px;
				color: hsl(0deg 0% 60%);
			}
		}

		&:is(:focus-within) {
			outline: none;
			background-color: hsl(0deg 0% 19% / 100%);
		}
	}
</style>
