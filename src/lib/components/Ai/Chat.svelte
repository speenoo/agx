<script lang="ts">
	import { autoresize } from '$lib/actions/autoresize.svelte';
	import { scroll_to_bottom } from '$lib/actions/scrollToBottom.svelte';
	import Select from '$lib/components/Select.svelte';
	import CircleStack from '$lib/icons/CircleStack.svelte';
	import PaperClip from '$lib/icons/PaperClip.svelte';
	import Send from '$lib/icons/Send.svelte';
	import Sparkles from '$lib/icons/Sparkles.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import UserCircle from '$lib/icons/UserCircle.svelte';
	import { transform } from '$lib/markdown';
	import type { Table } from '$lib/olap-engine';
	import DatasetsBox from './DatasetsBox.svelte';
	import Loader from './Loader.svelte';
	import type { ChatInput, ChatOutput } from './types';

	interface Props {
		messages?: ChatInput['messages'];
		onClearConversation?: () => void;
		datasets: Table[];
		dataset?: Table;
	}

	let {
		messages = $bindable([]),
		onClearConversation,
		datasets,
		dataset = $bindable()
	}: Props = $props();

	let loading = $state(false);
	let submitter = $state<HTMLButtonElement>();
	let message = $state('');
	let select = $state<ReturnType<typeof Select>>();
	let textarea = $state<HTMLTextAreaElement>();

	function getContextFromTable(table: Table): string {
		const columns = table.columns.map((col) => `- ${col.name} (${col.type})`).join('\n');
		return `## Table schema:\n${table.name}\nColumns:\n${columns}`;
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		let content = data.get('message');
		if (!content || typeof content !== 'string') return;
		content = content.trim();
		if (!content.length) return;

		message = '';
		messages = messages.concat({ content, role: 'user' });
		loading = true;

		try {
			const response = await fetch(event.currentTarget.action, {
				method: event.currentTarget.method,
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({
					messages: dataset
						? [{ role: 'user', content: getContextFromTable(dataset) }, ...messages]
						: messages,
					stream: false
				})
			});

			if (!response.ok) {
				console.error(await response.text());
				return;
			}

			const output: ChatOutput = await response.json();
			messages = messages.concat(output.message);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<nav>
		<span class="spacer"></span>
		<button title="Clear conversation" onclick={() => onClearConversation?.()}>
			<Trash size="12" />
		</button>
	</nav>
	<section
		class="conversation"
		use:scroll_to_bottom
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) textarea?.focus();
		}}
	>
		{#each messages.filter((m) => m.role === 'user' || m.role === 'assistant') as { role, content }}
			<article data-role={role}>
				<h2>
					{#if role === 'user'}
						<UserCircle size="18" /> You
					{:else if role === 'assistant'}
						<Sparkles size="18" /> Assistant
					{/if}
				</h2>
				<p class="markdown">
					{@html transform(content)}
				</p>
			</article>
		{/each}
		{#if loading}
			<article>
				<h2><Sparkles size="18" /> Assistant</h2>
				<Loader />
			</article>
		{:else}
			<article>
				<h2><UserCircle size="18" /> You</h2>
				<form
					id="user-message"
					action="https://ai.agx.app/api/chat"
					method="POST"
					onsubmit={handleSubmit}
				>
					<textarea
						name="message"
						tabindex="0"
						rows="1"
						placeholder="Ask Agnostic Ai"
						disabled={loading}
						use:autoresize
						bind:value={message}
						bind:this={textarea}
						onkeydown={(e) => {
							e.stopPropagation();
							if (e.code === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								submitter?.click();
							}
						}}
					></textarea>
				</form>
			</article>
		{/if}
	</section>
	<div class="submitter">
		{#if dataset}
			<div class="context">
				<CircleStack size="16" />
				<span title={dataset.name}>{dataset.name}</span>
			</div>
		{/if}
		<div class="actions">
			<button type="button" onclick={(e) => select?.open(e.currentTarget)}>
				<PaperClip size="16" />
			</button>
			<Select bind:this={select} placement="top-start">
				<DatasetsBox
					{datasets}
					onSelect={() => (select?.close(), onClearConversation?.())}
					bind:dataset
				/>
			</Select>
			<select>
				<option selected>Agnostic Ai (alpha)</option>
			</select>
			<span class="spacer"></span>
			<button
				form="user-message"
				type="submit"
				disabled={!message.trim() || loading}
				bind:this={submitter}
			>
				<Send size="16" />
			</button>
		</div>
	</div>
</div>

<style>
	.container {
		background-color: hsl(0deg 0% 5%);
		border-left: 1px solid hsl(0deg 0% 20%);

		height: 100%;
		width: 100%;
		display: grid;
		grid-template-rows: 28px 1fr minmax(0px, auto);
		position: relative;
	}

	nav {
		background-color: black;
		display: flex;

		& > span.spacer {
			flex: 1;
		}

		& > button {
			height: 100%;
			aspect-ratio: 1;
			background-color: transparent;
			border-radius: 0;
			color: hsl(0deg 0% 80%);
			display: grid;
			place-items: center;

			&:is(:hover, :focus-within):not(:disabled) {
				background-color: hsl(0deg 0% 10%);
				color: hsl(0deg 0% 90%);
			}
		}
	}

	.conversation {
		overflow-y: auto;
		padding-bottom: 36px;
		padding: 8px 20px 0;
	}

	.conversation > article {
		margin-bottom: 18px;
		padding-bottom: 8px;

		&:not(:last-child) {
			border-bottom: 1px solid hsl(0deg 0% 20%);
		}

		& h2 {
			margin: 0;
			font-size: 13px;
			display: flex;
			align-items: center;
			gap: 8px;
		}
	}

	.submitter {
		border-top: 1px solid hsl(0deg 0% 20%);
		padding: 10px 20px;
		width: 100%;
		overflow: hidden;
	}

	.context {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 4px;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.context > span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	textarea {
		appearance: none;
		resize: none;
		background-color: transparent;
		border-radius: 0;
		border: none;
		padding: 8px 0;
		width: 100%;
		display: block;
		overflow: visible;
	}

	textarea:focus {
		outline: none;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 8px;

		& > span.spacer {
			flex: 1;
		}
	}

	.actions > select {
		cursor: pointer;
		border: none;
		outline: none;
		background-color: transparent;
		color: hsl(0deg 0% 65%);
		font-size: 11px;
		border-radius: 4px;
		padding: 4px;

		&:hover {
			background-color: hsl(0deg 0% 10%);
		}
	}

	.actions > button {
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		height: 22px;
		border-radius: 4px;
		background-color: transparent;
		color: hsl(0deg 0% 80%);
		border: none;

		&:disabled {
			color: hsl(0deg 0% 65%);
		}

		&:not(:disabled):hover {
			color: hsl(0deg 0% 90%);
			background-color: hsl(0deg 0% 10%);
		}
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
