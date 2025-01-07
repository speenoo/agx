<script lang="ts">
	import SQLFile from '$lib/icons/SQLFile.svelte';
	import type { Query } from '$lib/repositories/queries';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	interface Props {
		queries?: Query[];
	}

	let { queries = [] }: Props = $props();
</script>

<ol role="menu">
	{#each queries as query (query.id)}
		<li
			tabindex="-1"
			oncontextmenu={(e) => {
				e.preventDefault();
			}}
			role="menuitem"
			onkeydown={(e) => {}}
			onclick={(e) => {
				if (e.detail >= 2) {
					e.currentTarget.blur();
				}
			}}
		>
			<SQLFile size="18" />
			<div>
				<span>{query.name}</span>
				<span>{dayjs(query.createdAt).fromNow()}</span>
			</div>
		</li>
	{/each}
</ol>

<style>
	ol {
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

		& > :global(svg) {
			fill: hsl(0deg 0% 96%);
			flex-shrink: 0;
		}

		& > div {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 2px;
			overflow: hidden;

			& > span:first-of-type {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			& > span:last-of-type {
				font-size: 10px;
				color: hsl(0deg 0% 96%);
			}
		}

		&:focus {
			outline: none;
			background-color: hsl(210deg 100% 52%);
		}
	}
</style>
