<script lang="ts">
	import '$lib/styles/main.css';
	import { onMount } from 'svelte';

	import { store } from '$lib/store';
	import { MigrationManager } from '@agnosticeng/migrate';

	import { MIGRATIONS } from '$lib/migrations';
	import { EXAMPLES_TABS } from '$lib/onboarding';

	let { children } = $props();
	let mounted = $state(false);

	async function displayOnboarding() {
		for (const example of EXAMPLES_TABS) {
			await store.exec(
				`INSERT INTO tabs (id, name, content, tab_index, active) VALUES (?, ?, ?, ?, ?)`,
				example
			);
		}
	}

	onMount(async () => {
		const m = new MigrationManager(store);
		await m.migrate(MIGRATIONS);

		const [{ count }] = await store.exec('SELECT COUNT(*) as count FROM tabs');

		if (count === 0) {
			await displayOnboarding();
		}

		mounted = true;
	});
</script>

{#if mounted}
	{@render children()}
{/if}
