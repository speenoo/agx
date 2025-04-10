<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface Props extends Omit<SvelteHTMLElements['svg'], 'width' | 'height'> {
		size?: string | number | null;
	}

	let { size = 24, ...rest }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	aria-hidden="true"
	width={size}
	height={size}
	{...rest}
	data-name="paper-clip"
>
	<path
		fill="none"
		stroke-width="1.5"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
	/>
</svg>
