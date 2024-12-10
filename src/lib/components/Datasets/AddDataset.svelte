<script lang="ts" module>
	export type FormValues = {
		name: string;
		slug: string;
		path: string;
	};
</script>

<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { slugify } from '$lib/slugify';
	import type { MaybePromise } from '$lib/types';
	import { dialog } from '@tauri-apps/api';
	import { type UnlistenFn } from '@tauri-apps/api/event';
	import { appWindow } from '@tauri-apps/api/window';
	import { onDestroy, tick } from 'svelte';

	interface Props {
		onCreate?: (values: FormValues) => MaybePromise<unknown>;
	}

	let { onCreate }: Props = $props();

	let open = $state(false);

	export function show() {
		open = true;
	}

	let modal = $state<ReturnType<typeof Modal>>();

	async function handleSubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
		e.preventDefault();

		const form_data = new FormData(e.currentTarget);
		const values = Object.fromEntries(form_data) as FormValues;

		modal?.close();
		await onCreate?.(values);
	}

	let name_value = $state('');
	let path_value = $state('');

	$effect(() => {
		open;

		name_value = '';
		path_value = '';
	});

	async function open_file() {
		const path = await dialog.open({
			title: 'Open Source',
			filters: [{ name: 'source files', extensions: ['csv', 'parquet'] }],
			multiple: false
		});

		if (typeof path === 'string') {
			name_value = path.split('/').pop() ?? '';
			path_value = 'file://' + path;
		}
	}

	let unlisten = $state<UnlistenFn>();

	appWindow
		.onFileDropEvent(async (event) => {
			if (event.payload.type !== 'drop') return;
			if (event.payload.paths.length !== 1) return;
			const [path] = event.payload.paths;
			const ext = path.split('.').pop();
			if (!ext || !['csv', 'parquet'].includes(ext.toLowerCase())) return;
			if (!open) {
				open = true;
				await tick();
			}

			name_value = path.split('/').pop() ?? '';
			path_value = 'file://' + path;
		})
		.then((unlistenFn) => (unlisten = unlistenFn));

	onDestroy(() => unlisten?.());
</script>

{#if open}
	<Modal onclose={() => (open = false)} bind:this={modal}>
		<form onsubmit={handleSubmit}>
			<h2>Add Source</h2>
			<label>
				<span>Name:</span>
				<input
					type="text"
					placeholder="Ethereum events"
					name="name"
					bind:value={name_value}
					required
				/>
			</label>
			<label>
				<span>Slug:</span>
				<input
					type="text"
					placeholder="ethereum_events"
					name="slug"
					value={slugify(name_value)}
					readonly
				/>
			</label>
			<label>
				<span>File path:</span>
				<div>
					<input
						type="text"
						placeholder="s3://data.agnostic.dev/ethereum-mainnet-pq/logs/*.parquet"
						name="path"
						bind:value={path_value}
						required
					/>
					<button type="button" onclick={open_file}>Choose file</button>
				</div>
			</label>

			<div class="Actions">
				<button type="button" onclick={() => modal!.close()}>Cancel</button>
				<button type="submit">Add source</button>
			</div>
		</form>
	</Modal>
{/if}

<style>
	h2 {
		margin-top: 0;
	}

	form {
		padding: 2rem;
	}

	form label {
		display: block;

		& ~ label {
			margin-top: 12px;
		}

		& > span {
			display: block;
			margin-bottom: 8px;
		}
	}

	input[type='text'] {
		width: 100%;
		background-color: hsl(0deg 0% 3%);
		border: 1px solid hsl(0deg 0% 3%);
		border-radius: 3px;
		padding: 5px 10px;

		outline: none;
		caret-color: currentcolor;

		&:not(:read-only):is(:focus-within, :hover) {
			border-color: hsl(0deg 0% 34%);
		}

		&:read-only {
			background-color: inherit;
			border-color: transparent;
			padding-left: 0;

			&::placeholder {
				color: inherit;
			}
		}
	}

	label > div {
		display: flex;
		gap: 8px;
	}

	button {
		appearance: none;
		outline: none;
		border: none;
		text-wrap: nowrap;
		background-color: hsl(0deg 0% 33%);
		padding: 2px 8px;
		border-radius: 3px;
		cursor: pointer;

		&:is(:active) {
			background-color: hsl(0deg 0% 52%);
		}
	}

	div.Actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		height: 28px;
		margin-top: 12px;
	}
</style>
