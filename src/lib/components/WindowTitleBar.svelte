<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		actions: Snippet;
	}

	let { actions }: Props = $props();
</script>

<!-- 
 @component
 @description Placeholder for a custom window titlebar. 
 It can only work with `titleBarStyle` set to `Overlay` in `tauri.conf.json`
 -->

<header data-tauri-drag-region>
	<div>
		{@render actions()}
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--window-title-bar-height);
		background-color: hsl(0deg 0% 18%);
		user-select: none;
		-webkit-user-select: none;

		display: flex;
		align-items: center;
		justify-content: end;
		padding: 0 8px;
	}
</style>
