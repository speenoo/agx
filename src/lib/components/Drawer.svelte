<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		open: boolean;
		position?: 'left' | 'right';
		width: number;
		children?: Snippet;
	}

	let { open = $bindable(false), position = 'left', width, children }: Props = $props();
</script>

{#if open}
	<div
		class="drawer-backdrop"
		onclick={() => (open = false)}
		transition:fly={{ duration: 200, opacity: 0 }}
		role="presentation"
	>
		<div
			role="menu"
			class="drawer {position}"
			style="width: {width}px"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && (open = false)}
			tabindex="-1"
			transition:fly={{ duration: 300, x: position === 'left' ? -width : width }}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.drawer-backdrop {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	.drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		background-color: transparent;
		overflow-y: auto;
	}

	.left {
		left: 0;
	}

	.right {
		right: 0;
	}
</style>
