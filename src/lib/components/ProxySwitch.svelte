<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const usingProxy = $derived(page.url.searchParams.has('proxy'));
	async function setProxy(proxy?: string) {
		const url = new URL(page.url);
		url.searchParams.delete('proxy');
		if (proxy) url.searchParams.set('proxy', proxy);
		save(proxy);
		await goto(url, { replaceState: true });
		window.location.reload();
	}

	function save(proxy?: string) {
		if (proxy) localStorage.setItem('agx:proxy', proxy);
		else localStorage.removeItem('agx:proxy');
	}

	onMount(() => {
		const queryParamsProxy = page.url.searchParams.get('proxy') ?? undefined;
		const storageProxy = localStorage.getItem('agx:proxy') ?? undefined;
		if (queryParamsProxy !== storageProxy) setProxy(storageProxy);
	});
</script>

<div>
	<button disabled={!usingProxy} onclick={() => setProxy()}>chDB</button>
	<button disabled={usingProxy} onclick={() => setProxy(CLICKHOUSE_URL)}>agx.app</button>
</div>

<style>
	div {
		width: 100%;
		padding: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	div > button {
		padding: 5px 8px;
		border: 1px solid hsl(0 0% 20%);
		border-radius: 4px;
		background-color: hsl(0deg 0% 7%);
		color: hsl(0 0% 80%);

		&:not(:disabled):hover {
			background-color: hsl(0deg 0% 15%);
			color: hsl(0 0% 90%);
		}

		&:disabled {
			background-color: hsl(0 0% 20%);
			color: hsl(0 0% 90%);
		}

		&:has(~ button) {
			border-bottom-right-radius: 0;
			border-top-right-radius: 0;
		}

		& ~ button {
			border-left: none;
			border-bottom-left-radius: 0;
			border-top-left-radius: 0;
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
