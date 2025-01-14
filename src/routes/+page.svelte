<script lang="ts">
	import { ContextMenuState } from '$lib/components/ContextMenu';
	import ContextMenu from '$lib/components/ContextMenu/ContextMenu.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import { Editor } from '$lib/components/Editor';
	import { SaveQueryModal } from '$lib/components/Queries';
	import Result from '$lib/components/Result.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import TabComponent from '$lib/components/Tab.svelte';
	import { setAppContext } from '$lib/context';
	import Bars3 from '$lib/icons/Bars3.svelte';
	import Play from '$lib/icons/Play.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Save from '$lib/icons/Save.svelte';
	import type { Table } from '$lib/olap-engine';
	import { engine, type OLAPResponse } from '$lib/olap-engine';
	import { historyRepository, type HistoryEntry } from '$lib/repositories/history';
	import { queryRepository, type Query } from '$lib/repositories/queries';
	import { tabRepository, type Tab } from '$lib/repositories/tabs';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import debounce from 'p-debounce';
	import type { ComponentProps } from 'svelte';

	let response = $state.raw<OLAPResponse>();

	let loading = $state(false);

	async function handleExec() {
		const query = currentTab.contents;
		if (loading || !query) {
			return;
		}

		loading = true;
		response = await engine.exec(query).finally(() => (loading = false));

		const last = await historyRepository.getLast();

		if (response && last?.content !== query) await addHistoryEntry(query);

		if (response) responsePanelOpened = true;
	}

	let tables = $state.raw<Table[]>([]);
	let history = $state.raw<HistoryEntry[]>([]);
	let queries = $state.raw<Query[]>([]);

	$effect(() => void engine.getSchema().then((t) => (tables = t)));
	$effect(() => void historyRepository.getAll().then((entries) => (history = entries)));
	$effect(() => void queryRepository.getAll().then((q) => (queries = q)));

	async function addHistoryEntry(query: string) {
		try {
			const entry = await historyRepository.add(query);
			history = [entry, ...history];
		} catch (e) {
			console.error(e);
		}
	}

	function handleHistoryOpen(entry: HistoryEntry) {
		if (currentTab.contents) {
			selectedTabIndex =
				tabs.push({ id: crypto.randomUUID(), contents: entry.content, name: 'Untitled' }) - 1;
		} else tabs[selectedTabIndex] = { ...currentTab, contents: entry.content };
		if (isMobile) drawerOpened = false;
	}

	async function handleHistoryDelete(entry: HistoryEntry) {
		const index = history.indexOf(entry);
		await historyRepository.delete(entry.id);
		history = history.toSpliced(index, 1);
	}

	let saveQueryModal = $state<ReturnType<typeof SaveQueryModal>>();

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
		const q = await queryRepository.create(name, currentTab.contents);
		queries = queries.concat(q);
		tabs[selectedTabIndex] = { ...currentTab, name, query_id: q.id };
	}

	async function handleDeleteQuery(query: Query) {
		await queryRepository.delete(query.id);
		queries = queries.toSpliced(queries.indexOf(query), 1);

		const index = tabs.findIndex((t) => t.query_id === query.id);
		if (index !== -1)
			tabs[index] = { ...tabs[index], query_id: undefined, name: tabs[index].name + ' (deleted)' };
	}

	function handleQueryOpen(query: Query) {
		const index = tabs.findIndex((t) => t.query_id === query.id);
		if (index === -1) {
			if (currentTab.contents) {
				selectedTabIndex =
					tabs.push({
						id: crypto.randomUUID(),
						contents: query.sql,
						name: query.name,
						query_id: query.id
					}) - 1;
			} else
				tabs[selectedTabIndex] = {
					...currentTab,
					contents: query.sql,
					name: query.name,
					query_id: query.id
				};
		} else selectedTabIndex = index;

		if (isMobile) drawerOpened = false;
	}

	async function handleQueryRename(query: Query) {
		const updated = await queryRepository.update(query);
		const index = queries.findIndex((query) => query.id === updated.id);
		if (index !== -1) queries = queries.with(index, updated);

		const tab_index = tabs.findIndex((t) => t.query_id === updated.id);
		if (tab_index !== -1) {
			tabs[tab_index] = { ...tabs[tab_index], name: updated.name, contents: updated.sql };
		}
	}

	async function handleSaveQuery() {
		const { contents, query_id: query_id } = currentTab;
		if (contents && !query_id) {
			return saveQueryModal?.show();
		}

		const index = queries.findIndex((q) => q.id === query_id);
		if (index !== -1) {
			const updated = await queryRepository.update({ ...queries[index], sql: contents });
			queries = queries.with(index, updated);
		}
	}

	const contextmenu = new ContextMenuState();
	setAppContext({ contextmenu: contextmenu });

	let screenWidth = $state(0);
	let isMobile = $derived(screenWidth < 768 && PLATFORM === 'WEB');
	let drawerOpened = $state(false);

	$effect(() => {
		if (!isMobile) drawerOpened = false;
	});

	let tabs = $state<Tab[]>([]);
	$effect(
		() =>
			void tabRepository.get().then(([t, active]) => {
				if (t.length) (tabs = t), (selectedTabIndex = active);
				else tabs.push({ id: crypto.randomUUID(), contents: '', name: 'Untitled' });
			})
	);

	const saveTabs = debounce(
		(tabs: Tab[], activeIndex: number) => tabRepository.save(tabs, activeIndex),
		2_000
	);

	let selectedTabIndex = $state(0);
	const currentTab = $derived(tabs[selectedTabIndex]);
	const canSave = $derived.by(() => {
		if (!tabs.length) return false;
		if (currentTab.query_id) {
			const query = queries.find((q) => q.id === currentTab.query_id);
			return query?.sql !== currentTab.contents;
		}

		return !!currentTab.contents;
	});

	function addNewTab() {
		selectedTabIndex = tabs.push({ id: crypto.randomUUID(), name: 'Untitled', contents: '' }) - 1;
	}

	function closeTab(index: number) {
		tabs.splice(index, 1);
		selectedTabIndex = Math.max(0, selectedTabIndex - 1);
	}

	$effect(() => void saveTabs($state.snapshot(tabs), selectedTabIndex).catch(console.error));

	let responsePanelOpened = $state(false);
</script>

<svelte:window onkeydown={handleKeyDown} bind:innerWidth={screenWidth} />

<ContextMenu state={contextmenu} />

{#snippet sidebar()}
	<SideBar
		{tables}
		{history}
		onHistoryOpen={handleHistoryOpen}
		onHistoryDelete={handleHistoryDelete}
		{queries}
		onQueryDelete={handleDeleteQuery}
		onQueryOpen={handleQueryOpen}
		onQueryRename={handleQueryRename}
	/>
{/snippet}

<section class="screen">
	{#if isMobile}
		<Drawer bind:open={drawerOpened} width={242}>
			{@render sidebar()}
		</Drawer>
	{/if}
	<SplitPane
		type="horizontal"
		disabled={isMobile}
		pos={isMobile ? '0px' : '242px'}
		min={isMobile ? '0px' : '242px'}
		max="40%"
	>
		{#snippet a()}
			{#if !isMobile}
				{@render sidebar()}
			{/if}
		{/snippet}
		{#snippet b()}
			<SplitPane
				type="vertical"
				min="20%"
				max={responsePanelOpened ? '80%' : '100%'}
				pos={responsePanelOpened ? '65%' : '100%'}
				disabled={!responsePanelOpened}
				--color="hsl(0deg 0% 12%)"
			>
				{#snippet a()}
					<div>
						<nav class="navigation">
							<div class="tabs-container">
								{#if isMobile}
									<button class="action" onclick={() => (drawerOpened = true)}>
										<Bars3 size="12" />
									</button>
								{/if}
								{#each tabs as tab, i}
									<TabComponent
										hide-close={tabs.length === 1}
										active={i === selectedTabIndex}
										label={tab.name}
										onClose={() => closeTab(i)}
										onSelect={() => (selectedTabIndex = i)}
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
								<button class="action" onclick={handleSaveQuery} disabled={!canSave}>
									<Save size="12" />
								</button>
								<button class="action" onclick={handleExec} disabled={loading}>
									<Play size="12" />
								</button>
							</div>
						</nav>
						{#each tabs as tab, i (tab.id)}
							<div style:display={selectedTabIndex == i ? 'block' : 'none'}>
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

<SaveQueryModal bind:this={saveQueryModal} onCreate={handleCreateQuery} />

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
			height: 100%;
			aspect-ratio: 1;
			background-color: transparent;
			border-radius: 0;

			&:is(:hover, :focus-within):not(:disabled) {
				background: hsl(0deg 0% 10%);
			}
		}

		& ~ div {
			height: calc(100% - 28px);
		}
	}

	.add-new {
		height: calc(100% - 8px);
		aspect-ratio: 1;
		display: flex;
		place-items: center;
		justify-content: center;
		padding: 0;
		margin-left: 4px;
		border-radius: 4px;
		background-color: transparent;

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

		&:is(:hover, :focus-within):not(:disabled) {
			cursor: pointer;
		}
	}

	.screen {
		height: 100%;
		width: 100%;
	}
</style>
