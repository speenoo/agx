<script lang="ts">
	import type { HistoryEntry } from '$lib/repositories/history';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	interface Props {
		history: HistoryEntry[];
		onHistoryClick?: (entry: HistoryEntry) => void;
	}

	let { history: entries, onHistoryClick }: Props = $props();
</script>

<ol role="menu">
	{#each entries as entry}
		<li
			tabindex="-1"
			oncontextmenu={(e) => {
				e.preventDefault();
			}}
			role="menuitem"
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					onHistoryClick?.(entry);
					e.currentTarget.blur();
				}
			}}
			onclick={(e) => {
				if (e.detail >= 2) {
					onHistoryClick?.(entry);
					e.currentTarget.blur();
				}
			}}
		>
			<span class="time">{dayjs(entry.timestamp).fromNow()}</span>
			<div class="content">{entry.content}</div>
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

	.time {
		font-size: 10px;
		color: hsl(0deg 0% 96%);
	}

	li {
		padding: 3px 5px;
		border-radius: 3px;

		cursor: default;
		user-select: none;
		-webkit-user-select: none;

		&:focus {
			outline: none;
			background-color: hsl(210deg 100% 52%);
		}
	}

	.content {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
