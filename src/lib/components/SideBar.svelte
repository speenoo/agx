<script lang="ts">
	import type { Dataset } from '$lib/types';
	import Datasets from './Datasets/Datasets.svelte';

	interface Props {
		sources?: Dataset[];
	}

	type Navigation = 'sources' | 'queries' | 'history';

	let { sources = [] }: Props = $props();

	let tab = $state<Navigation>('sources');
	function navigate(next_tab: Navigation) {
		tab = next_tab;
	}
</script>

<section>
	<nav>
		<button aria-current={tab === 'sources'} onclick={() => navigate('sources')}>Sources</button>
		<button aria-current={tab === 'queries'} onclick={() => navigate('queries')}>Queries</button>
		<button aria-current={tab === 'history'} onclick={() => navigate('history')}>History</button>
	</nav>
	{#if tab === 'sources'}
		<Datasets {sources} />
	{/if}
</section>

<style>
	section {
		padding: 14px 18px;
		background-color: hsl(0deg 0% 9%);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	nav {
		display: flex;
		justify-content: center;
		gap: 12px;

		& > button {
			font-size: 10px;
			font-weight: 500;
			background-color: transparent;
			padding: 4px 10px;
			border-radius: 3px;
			cursor: pointer;

			&:is(:hover, :focus-within, [aria-current='true']) {
				background-color: hsl(0deg 0% 19%);
			}
		}
	}

	button {
		appearance: none;
		outline: none;
		border: none;
		background: none;
		padding: 0;
		display: block;
	}
</style>
