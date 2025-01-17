<script lang="ts" module>
	export interface Log {
		level: 'error';
		timestamp: Date;
		data: string;
	}
</script>

<script lang="ts">
	interface Props {
		logs: Log[];
	}

	let { logs }: Props = $props();
</script>

<div class="container">
	{#each logs as log}
		<div class="line">
			<span class="timestamp">{log.timestamp.toUTCString()}</span>
			<span class={log.level}>{log.data}</span>
		</div>
	{/each}
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
		padding: 4px 7px;
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
	}
</style>
