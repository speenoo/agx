export function useResizeObserver(
	target: () => HTMLElement | undefined | null,
	callback: ResizeObserverCallback,
	options: ResizeObserverOptions = {}
) {
	let observer: ResizeObserver | undefined;

	const target_ = $derived(target());

	$effect(() => {
		if (!target_) return;
		observer = new ResizeObserver(callback);
		observer.observe(target_, options);

		return () => {
			observer?.disconnect();
			observer = undefined;
		};
	});
}
