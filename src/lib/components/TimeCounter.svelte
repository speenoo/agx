<script lang="ts">
	let ms = $state(0);
	let running = $state(false);

	let raf: number | null;
	let start_at: number | null;

	function loop() {
		if (!running) return;

		if (start_at === null) start_at = new Date().getTime();

		ms = new Date().getTime() - start_at;
		raf = requestAnimationFrame(loop);
	}

	export function start() {
		running = true;
		start_at = new Date().getTime();
		raf = requestAnimationFrame(loop);
	}

	export function stop() {
		if (!raf) return;
		running = false;
		cancelAnimationFrame(raf);
		raf = null;
	}

	function format(n: number) {
		return (n / 1000).toFixed(3) + 's';
	}
</script>

{#if ms !== 0}
	<span title="Response time">
		{format(ms)}
	</span>
{/if}

<style>
	span {
		height: 100%;
		display: flex;
		place-items: center;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
