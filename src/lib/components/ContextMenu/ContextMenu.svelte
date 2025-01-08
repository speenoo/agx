<script lang="ts">
	import type { ContextMenuState } from './ContextMenuState.svelte';

	interface Props {
		state: ContextMenuState;
	}

	let { state }: Props = $props();
</script>

{#if state.open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="backdrop"
		onclick={state.close}
		oncontextmenu={(e) => {
			e.preventDefault();
			state.close();
		}}
	></div>

	<div
		style:--x="{state.position.x}px"
		style:--y="{state.position.y}px"
		oncontextmenu={(e) => e.preventDefault()}
		role="menu"
		tabindex="-1"
	>
		<ul>
			{#each state.items as item}
				{#if 'is_separator' in item}
					<li>
						<hr />
					</li>
				{:else}
					<li>
						<button
							disabled={item.disabled}
							onclick={async (e) => {
								await item.onClick?.(e);
								state.close();
							}}
						>
							{item.label}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
{/if}

<style>
	div.backdrop {
		position: fixed;
		inset: 0;
		z-index: 9998;
	}

	div[role='menu'] {
		position: fixed;
		left: var(--x);
		top: var(--y);
		z-index: 9999;
		min-width: 120px;

		border: 1px solid hsl(0deg 0% 29%);
		border-radius: 6px;
		background-color: hsl(0deg 0% 18%);
		padding: 5px;

		user-select: none;
		-webkit-user-select: none;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	button {
		appearance: none;
		outline: none;
		border: none;

		width: 100%;
		background-color: transparent;
		text-align: start;
		padding: 4px 8px;
		border-radius: 4px;

		&:hover:not(:disabled) {
			cursor: pointer;
			background-color: hsl(0deg 0% 29%);
		}

		&:disabled {
			color: hsl(0deg 0% 50%);
		}
	}

	li:has(> hr) {
		padding: 0 8px;
	}

	hr {
		border: none;
		border-top: 1px solid hsl(0deg 0% 29%);
	}
</style>
