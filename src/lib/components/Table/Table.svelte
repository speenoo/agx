<script lang="ts">
	import type { OLAPResponse } from '$lib/olap-engine';

	interface Props {
		response: OLAPResponse;
	}

	let { response }: Props = $props();

	const columns = $derived(response.meta);

	function formatValue(value: any) {
		if (value === null) return 'NULL';
		if (value === undefined) return 'UNDEFINED';
		if (Array.isArray(value)) return JSON.stringify(value);
		if (typeof value === 'object') return JSON.stringify(value);
		if (typeof value === 'string' && !Number.isNaN(Number(value))) {
			return Number(value).toLocaleString('en-US');
		}
		return value;
	}

	let sortedBy = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let columnWidths = $state<Record<string, number>>({});
	let isResizing = $state<string | null>(null);
	let startX = $state<number>(0);
	let startWidth = $state<number>(0);

	$effect(() => {
		sortedBy = null;
		sortDirection = 'asc';
		columnWidths = {};
	});

	const sortedRows = $derived(
		response.data.toSorted((a, b) => {
			if (!sortedBy) return 0;

			let aVal = a[sortedBy];
			let bVal = b[sortedBy];

			const columnType = columns.find((col) => col.name === sortedBy)?.type;
			const isDateType = columnType?.toLowerCase().includes('date');
			const isNumberType =
				columnType?.toLowerCase().includes('int') || columnType?.toLowerCase().includes('float');

			if (isNumberType) {
				aVal = Number(aVal);
				bVal = Number(bVal);
			}

			if (sortDirection === 'asc') {
				return isDateType ? (aVal < bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
			} else {
				return isDateType ? (aVal > bVal ? 1 : -1) : aVal > bVal ? 1 : -1;
			}
		})
	);

	function handleSort(columnName: string) {
		if (sortedBy === columnName) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortedBy = columnName;
			sortDirection = 'asc';
		}
	}

	function startResize(e: MouseEvent, columnName: string) {
		isResizing = columnName;
		startX = e.pageX;
		startWidth = columnWidths[columnName] || 100;
		window.addEventListener('mousemove', handleResize);
		window.addEventListener('mouseup', stopResize);
	}

	function handleResize(e: MouseEvent) {
		if (!isResizing) return;
		const width = startWidth + (e.pageX - startX);
		columnWidths[isResizing] = Math.max(100, width);
	}

	function stopResize() {
		isResizing = null;
		window.removeEventListener('mousemove', handleResize);
		window.removeEventListener('mouseup', stopResize);
	}
</script>

<table>
	<thead>
		<tr>
			{#each columns as { name, type }}
				<th style="width: {columnWidths[name] || 100}px" on:click={() => handleSort(name)}>
					<div class="th-content">
						<span>{name} <i>({type.replace(/Nullable\((.*)\)/, '$1')})</i></span>
						{#if sortedBy === name}
							<span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
						{/if}
					</div>
					<div class="resize-handle" on:mousedown={(e) => startResize(e, name)} />
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each sortedRows as row, i}
			<tr class={i % 2 === 0 ? 'even' : 'odd'}>
				{#each columns as { name, type }}
					{@const value = row[name]}
					{@const isNumberType =
						type.toLowerCase().includes('int') || type.toLowerCase().includes('float')}
					{@const isDateType = type.toLowerCase().includes('date')}
					<td
						class:text-right={isNumberType || isDateType}
						style="width: {columnWidths[name] || 100}px"
					>
						<div class="td-content">
							{formatValue(value)}
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	td,
	th {
		padding: 0 10px;
		height: 26px;
		text-align: left;
		font-family: monospace;
		cursor: default;
		position: relative;
		white-space: nowrap;
		overflow: hidden;
	}

	.text-right {
		text-align: right;
	}

	.th-content,
	.td-content {
		overflow: hidden;
		white-space: nowrap;
		color: hsl(0deg 0% 80%);
		position: relative;
	}

	.sort-arrow {
		position: absolute;
		right: 0;
	}

	td:not(:first-child),
	th:not(:first-child) {
		border-left: 1px solid hsl(0deg 0% 12%);
	}

	i {
		font-size: 10px;
		font-style: normal;
		color: hsl(0deg 0% 60%);
	}

	th {
		text-align: center;
		background-color: hsl(0deg 0% 5%);
		position: sticky;
		top: 0;
		z-index: 1;
		border-top: 1px solid hsl(0deg 0% 20%);
		border-bottom: 1px solid hsl(0deg 0% 12%);
		font-weight: 400;
		cursor: pointer;
		user-select: none;
	}

	.resize-handle {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		cursor: col-resize;
		background-color: transparent;
	}

	.resize-handle:hover {
		background-color: hsl(0deg 0% 30%);
	}

	table {
		width: min-content;
		border-collapse: separate;
		border-spacing: 0;
		table-layout: fixed;
	}

	tr:hover td {
		background-color: hsl(0deg 0% 10%);
	}

	.odd td {
		background-color: hsl(0deg 0% 7%);
	}

	.even td {
		background-color: hsl(0deg 0% 4%);
	}
</style>
