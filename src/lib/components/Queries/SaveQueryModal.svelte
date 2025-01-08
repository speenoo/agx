<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';
	import Modal from '../Modal.svelte';

	interface Props {
		onCreate?: (query: { name: string }) => MaybePromise<unknown>;
	}

	let { onCreate }: Props = $props();

	let modal = $state<ReturnType<typeof Modal>>();
	let open = $state(false);

	async function handleSubmit(e: Parameters<FormEventHandler<HTMLFormElement>>[0]) {
		e.preventDefault();
		const form_data = new FormData(e.currentTarget);

		const name = form_data.get('name') as string;

		try {
			await onCreate?.({ name });
			modal?.close();
		} catch (e) {
			console.error(e);
		}
	}

	let name_value = $state('');
	$effect(() => {
		open;

		name_value = '';
	});

	export function show() {
		open = true;
	}
</script>

{#if open}
	<Modal onclose={() => (open = false)} bind:this={modal}>
		<form onsubmit={handleSubmit}>
			<label>
				<span>Name</span>
				<input
					type="text"
					placeholder="Price"
					spellcheck="false"
					autocomplete="off"
					name="name"
					bind:value={name_value}
					required
				/>
			</label>

			<div class="Actions">
				<button type="button" onclick={() => modal!.close()}>Cancel</button>
				<button type="submit">Save</button>
			</div>
		</form>
	</Modal>
{/if}

<style>
	form {
		padding: 2rem;
	}

	form label {
		display: block;

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
