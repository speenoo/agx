<script lang="ts">
	import { ContextMenuState } from '$lib/components/ContextMenu';
	import ContextMenu from '$lib/components/ContextMenu/ContextMenu.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import { Editor } from '$lib/components/Editor';
	import { SaveQueryModal } from '$lib/components/Queries';
	import Result from '$lib/components/Result.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import TabComponent from '$lib/components/Tab.svelte';
	import { set_app_context } from '$lib/context';
	import Bars3 from '$lib/icons/Bars3.svelte';
	import Play from '$lib/icons/Play.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Save from '$lib/icons/Save.svelte';
	import type { Table } from '$lib/olap-engine';
	import { engine, type OLAPResponse } from '$lib/olap-engine';
	import { history_repository, type HistoryEntry } from '$lib/repositories/history';
	import { query_repository, type Query } from '$lib/repositories/queries';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import type { ComponentProps } from 'svelte';

	let response = $state.raw<OLAPResponse>();

	let loading = $state(false);

	async function handleExec() {
		const query = current_tab.contents;
		if (loading || !query) {
			return;
		}

		loading = true;
		response = await engine.exec(query).finally(() => (loading = false));

		const last = await history_repository.getLast();

		if (response && last?.content !== query) await addHistoryEntry(query);
	}

	let tables = $state.raw<Table[]>([]);
	let history = $state.raw<HistoryEntry[]>([]);
	let queries = $state.raw<Query[]>([]);

	$effect(() => {
		engine.getSchema().then((t) => {
			tables = t;
		});
	});

	$effect(() => {
		history_repository.getAll().then((entries) => {
			history = entries;
		});
	});

	async function addHistoryEntry(query: string) {
		try {
			const entry = await history_repository.add(query);
			history = [entry, ...history];
		} catch (e) {
			console.error(e);
		}
	}

	function handleHistoryClick(entry: HistoryEntry) {
		if (current_tab.contents) {
			selected_tab_index =
				tabs.push({ id: crypto.randomUUID(), contents: entry.content, name: 'Untitled' }) - 1;
		} else tabs[selected_tab_index] = { ...current_tab, contents: entry.content };
		if (is_mobile) open_drawer = false;
	}

	$effect(() => {
		query_repository.getAll().then((q) => (queries = q));
	});

	let save_query_modal = $state<ReturnType<typeof SaveQueryModal>>();

	async function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 's' && event.metaKey) {
			event.preventDefault();
			handleSaveQuery();
		}

		if (event.key === 'Enter' && event.metaKey) handleExec();
	}

	async function handleCreateQuery({
		name
	}: Parameters<NonNullable<ComponentProps<typeof SaveQueryModal>['onCreate']>>['0']) {
		const q = await query_repository.create(name, current_tab.contents);
		queries = queries.concat(q);
		tabs[selected_tab_index] = { ...current_tab, name, query_id: q.id };
	}

	async function handleDeleteQuery(query: Query) {
		await query_repository.delete(query.id);
		queries = queries.toSpliced(queries.indexOf(query), 1);
	}

	function handleQueryOpen(query: Query) {
		const index = tabs.findIndex((t) => t.query_id === query.id);
		if (index === -1) {
			if (current_tab.contents) {
				selected_tab_index =
					tabs.push({
						id: crypto.randomUUID(),
						contents: query.sql,
						name: query.name,
						query_id: query.id
					}) - 1;
			} else
				tabs[selected_tab_index] = {
					...current_tab,
					contents: query.sql,
					name: query.name,
					query_id: query.id
				};
		} else selected_tab_index = index;

		if (is_mobile) open_drawer = false;
	}

	async function handleQueryRename(query: Query) {
		const updated = await query_repository.update(query);
		const index = queries.findIndex((query) => query.id === updated.id);
		if (index !== -1) queries = queries.with(index, updated);

		const tab_index = tabs.findIndex((t) => t.query_id === updated.id);
		if (tab_index !== -1) {
			tabs[tab_index] = { ...tabs[tab_index], name: updated.name, contents: updated.sql };
		}
	}

	async function handleSaveQuery() {
		const { contents, query_id } = current_tab;
		if (contents && !query_id) {
			return save_query_modal?.show();
		}

		const index = queries.findIndex((q) => q.id === query_id);
		if (index !== -1) {
			const updated = await query_repository.update({ ...queries[index], sql: contents });
			queries = queries.with(index, updated);
		}
	}

	const context_menu = new ContextMenuState();
	set_app_context({ context_menu });

	let screen_width = $state(0);
	let is_mobile = $derived(screen_width < 768 && PLATFORM === 'WEB');
	let open_drawer = $state(false);

	$effect(() => {
		if (!is_mobile) open_drawer = false;
	});

	interface Tab {
		id: string;
		contents: string;
		name: string;
		query_id?: Query['id'];
	}

	let tabs = $state<Tab[]>([{ id: crypto.randomUUID(), contents: '', name: 'Untitled' }]);
	let selected_tab_index = $state(0);
	const current_tab = $derived(tabs[selected_tab_index]);
	const can_save = $derived.by(() => {
		if (current_tab.query_id) {
			const query = queries.find((q) => q.id === current_tab.query_id);
			if (!query) return true;
			return query.sql !== current_tab.contents;
		}

		return !!current_tab.contents;
	});

	function addNewTab() {
		const next_index = tabs.length;
		tabs.push({ id: crypto.randomUUID(), name: 'Untitled', contents: '' });
		selected_tab_index = next_index;
	}

	function closeTab(index: number) {
		tabs.splice(index, 1);
		selected_tab_index = Math.max(0, selected_tab_index - 1);
	}
</script>

<svelte:window onkeydown={handleKeyDown} bind:innerWidth={screen_width} />

<ContextMenu state={context_menu} />

{#snippet sidebar()}
	<SideBar
		{tables}
		{history}
		onHistoryClick={handleHistoryClick}
		{queries}
		onQueryDelete={handleDeleteQuery}
		onQueryOpen={handleQueryOpen}
		onQueryRename={handleQueryRename}
	/>
{/snippet}

<section class="screen">
	{#if is_mobile}
		<Drawer bind:open={open_drawer} width={242}>
			{@render sidebar()}
		</Drawer>
	{/if}
	<SplitPane
		type="horizontal"
		disabled={is_mobile}
		pos={is_mobile ? '0px' : '242px'}
		min={is_mobile ? '0px' : '242px'}
		max="40%"
	>
		{#snippet a()}
			{#if !is_mobile}
				{@render sidebar()}
			{/if}
		{/snippet}
		{#snippet b()}
			<SplitPane type="vertical" min="20%" max="80%" --color="hsl(0deg 0% 12%)">
				{#snippet a()}
					<div>
						<nav class="navigation">
							<div class="tabs-container">
								{#if is_mobile}
									<button class="action" onclick={() => (open_drawer = true)}>
										<Bars3 size="12" />
									</button>
								{/if}
								{#each tabs as tab, i}
									<TabComponent
										close-hidden={tabs.length === 1}
										active={i === selected_tab_index}
										label={tab.name}
										onClose={() => closeTab(i)}
										onSelect={() => (selected_tab_index = i)}
									/>
								{/each}
								<button
									onclick={addNewTab}
									class="add-new"
									aria-label="Open new tab"
									title="Open new tab"
								>
									<Plus size="14" />
								</button>
							</div>
							<div class="workspace-actions">
								<button class="action" onclick={handleSaveQuery} disabled={!can_save}>
									<Save size="12" />
								</button>
								<button class="action" onclick={handleExec} disabled={loading}>
									<Play size="12" />
								</button>
							</div>
						</nav>
						{#each tabs as tab, i (tab.id)}
							<div style:display={selected_tab_index == i ? 'block' : 'none'}>
								<Editor bind:value={tab.contents} {tables} />
							</div>
						{/each}
					</div>
				{/snippet}
				{#snippet b()}
					<Result {response} />
				{/snippet}
			</SplitPane>
		{/snippet}
	</SplitPane>
</section>

<SaveQueryModal bind:this={save_query_modal} onCreate={handleCreateQuery} />

<style>
	.navigation {
		height: 28px;
		display: flex;

		position: relative;

		&::before {
			content: '';
			position: absolute;
			width: 100%;
			height: 1px;
			bottom: 0px;
			left: 0;
			background-color: hsl(0deg 0% 20%);
			z-index: 1;
		}

		& > .tabs-container {
			flex: 1;
			display: flex;
			align-items: center;
			height: 100%;
			overflow-x: hidden;
		}

		& > .workspace-actions {
			display: flex;
			gap: 0px;
		}

		& button.action {
			background-color: transparent;
			border-radius: 0;
		}

		& ~ div {
			height: calc(100% - 28px);
		}
	}

	.add-new {
		height: calc(100% - 8px);
		aspect-ratio: 1;
		padding: 4px;
		margin-left: 4px;
		border-radius: 4px;

		&:hover {
			cursor: pointer;
			background-color: hsl(0deg 0% 17%);
		}

		&:active {
			background-color: hsl(0deg 0% 20%);
		}
	}

	button {
		appearance: none;
		outline: none;
		border: none;
		font-size: 10px;
		font-weight: 500;
		background-color: hsl(0deg 0% 9%);
		padding: 4px 2;
		border-radius: 3px;

		&:is(:hover, :focus-within):not(:disabled) {
			cursor: pointer;
			background: hsl(0deg 0% 10%);
		}
	}

	.screen {
		height: 100vh;
		width: 100vw;
	}
</style>
