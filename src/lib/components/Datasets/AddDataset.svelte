<script lang="ts" module>
	export type FormValues = {
		name: string;
		slug: string;
		path: string;
		connection_type: 's3' | 'file';
	};
</script>

<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { slugify } from '$lib/slugify';
	import type { MaybePromise } from '$lib/types';
	import { dialog } from '@tauri-apps/api';

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
	let connection_type = $state('s3');

	$effect(() => {
		open;

		name_value = '';
		path_value = '';
		connection_type = 's3';
	});

	async function open_file() {
		const path = await dialog.open({
			title: 'Open Source',
			filters: [{ name: 'source files', extensions: ['csv', 'parquet'] }],
			multiple: false
		});

		if (typeof path === 'string') {
			path_value = path;
			connection_type = 'file';
		}
	}
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
					placeholder="ethereum_event"
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
						placeholder="https://data.agnostic.dev/ethereum-mainnet-pq/logs/*.parquet"
						name="path"
						bind:value={path_value}
						required
					/>
					<button type="button" onclick={open_file}>Choose file</button>
				</div>
			</label>
			<label>
				<span>Connection type:</span>
				<select name="connection_type" bind:value={connection_type}>
					<option value="s3">S3</option>
					<option value="file">Local file</option>
				</select>
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
	}
</style>
