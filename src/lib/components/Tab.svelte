<script lang="ts">
	import XMark from '$lib/icons/XMark.svelte';

	interface Props {
		label: string;
		onSelect: () => void;
		onClose: () => void;
		active: boolean;
		'hide-close': boolean;
	}

	let { active, label, onClose, onSelect, 'hide-close': hideClose }: Props = $props();
</script>

<div class="tab" class:active role="button" onclick={onSelect} tabindex="0" onkeyup={() => {}}>
	<span>{label}</span>

	{#if !hideClose}
		<button
			onclick={(e) => {
				e.stopPropagation();
				onClose();
			}}
		>
			<XMark size="10" />
		</button>
	{/if}
</div>

<style>
	div {
		height: 100%;
		font-size: 12px;
		border-right: 1px solid hsl(0deg 0% 20%);
		padding: 0 16px;
		display: inline-flex;
		align-items: center;
		height: 100%;
		color: hsl(0deg 0% 70%);
		position: relative;
		user-select: none;
		-webkit-user-select: none;

		&:hover {
			cursor: pointer;
		}

		&.active {
			background-color: hsl(0deg 0% 5%);
			color: hsl(0deg 0% 100%);
			z-index: 2;
		}

		& > button {
			appearance: none;
			outline: none;
			border: none;
			position: absolute;

			display: flex;
			place-items: center;
			background-color: transparent;
			right: 2px;
			padding: 1px;
			opacity: 0;
			cursor: inherit;
			border-radius: 3px;

			&:hover {
				background-color: hsl(0deg 0% 20%);
			}
		}

		&:hover > button {
			opacity: 1;
		}
	}
</style>
