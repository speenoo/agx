<script lang="ts" module>
	export interface Log {
		level: 'error';
		timestamp: Date;
		data: string;
	}
</script>

<script lang="ts">
	import Trash from '$lib/icons/Trash.svelte';

	interface Props {
		logs: Log[];
		onClear?: () => void;
	}

	let { logs, onClear }: Props = $props();
</script>

<div class="container">
	{#each logs as log}
		<div class="line">
			<span class="timestamp">{log.timestamp.toUTCString()}</span>
			<span class={log.level}>{log.data}</span>
		</div>
	{/each}
	<div class="footer">
		<button onclick={() => onClear?.()}><Trash size="12" /></button>
	</div>
</div>

<style>
	.container {
		--footer-height: 22px;

		height: 100%;
		width: 100%;
		padding: 4px 7px;
		padding-bottom: var(--footer-height);
		position: relative;

		overflow-y: auto;

		& > .line {
			display: block;
			font-family: monospace;
			font-size: 11px;

			& .timestamp {
				display: block;

				&::before {
					content: '-- ';
				}
			}

			& .error {
				color: hsl(0deg 100% 90%);
			}

			&:not(:last-of-type) {
				margin-bottom: 12px;
			}
		}

		& > .footer {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: var(--footer-height);
			padding: 0 7px;

			display: flex;
			align-items: center;
			justify-content: end;

			border-top: 1px solid hsl(0deg 0% 20%);

			& > button {
				appearance: none;
				border: none;
				outline: none;
				background-color: transparent;

				height: 100%;
				aspect-ratio: 1;

				display: flex;
				align-items: center;
				justify-content: center;

				&:is(:hover):not(:disabled) {
					background-color: hsl(0deg 0% 10%);
					cursor: pointer;

					&:active {
						background-color: hsl(0deg 0% 13%);
					}
				}
			}
		}
	}
</style>
