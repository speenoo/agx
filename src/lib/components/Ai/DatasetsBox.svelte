<script lang="ts">
	import type { Table } from '$lib/olap-engine';

	interface Props {
		datasets: Table[];
		dataset?: Table;
		onSelect?: (d: Table) => void;
	}

	let { datasets, dataset = $bindable(), onSelect }: Props = $props();
	let filter = $state('');
	const filtered = $derived(
		filter ? datasets.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase())) : datasets
	);
</script>

<div>
	<ul role="listbox">
		{#each filtered as d (d.name)}
			{@const name = d.name.split('__').pop()}
			<li role="option" aria-selected={dataset?.name === d.name}>
				<button
					title={[name, d.short].filter(Boolean).join(' • ')}
					type="button"
					onclick={() => onSelect?.((dataset = d))}
				>
					<span class="name">{name}</span>
					<span class="description">
						{#each d.name.split('__').slice(0, -1) as tag}
							<span class="tag">{tag}</span>
						{/each}
					</span>
				</button>
			</li>
		{/each}
	</ul>
	<input type="text" placeholder="Select a dataset" bind:value={filter} />
</div>

<style>
	div {
		background-color: hsl(0, 0%, 10%);
		border: 1px solid hsl(0, 0%, 15%);
		border-radius: 6px;
		overflow: hidden;
	}

	input {
		height: 30px;
		width: 100%;
		background-color: hsl(0, 0%, 10%);
		border: none;
		border-top: 1px solid hsl(0, 0%, 15%);
		outline: none;
		padding: 0 10px;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style-type: none;
	}

	ul[role='listbox'] {
		padding: 4px;
		width: 265px;
		max-height: 265px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	li[role='option'] {
		width: 100%;

		&:not(:last-of-type) {
			padding-bottom: 2px;
		}

		& > button {
			height: 100%;
			width: 100%;
			overflow: hidden;
			text-align: start;
			padding: 6px;
			color: hsl(0, 0%, 80%);
			border-radius: 4px;

			& > span {
				display: block;

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				&:first-of-type {
					font-family: monospace;
					margin-bottom: 3px;
				}

				&:last-of-type {
					color: hsl(0, 0%, 75%);
				}
			}
		}

		&:is(:hover, :focus-within) > button:not(:disabled) {
			background-color: hsl(0deg 0% 15%);
			color: hsl(0deg 0% 90%);
		}

		&:is([aria-selected='true']) > button:not(:disabled) {
			background-color: hsl(0deg 0% 20%);
			color: hsl(0deg 0% 90%);
		}
	}

	span.tag {
		display: inline-block;
		padding: 2px 4px;
		border-radius: 4px;
		background-color: hsl(0deg 0% 17%);
		margin-right: 4px;
	}

	button {
		appearance: none;
		outline: none;
		border: none;
		background: none;
		padding: 0;

		&:not(:disabled):hover {
			cursor: pointer;
		}
	}
</style>
