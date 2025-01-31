import { type Table } from '$lib/olap-engine';

export function filter(sources: Table[], search: string) {
	if (!search) return sources;
	const search_ = search.toLowerCase();

	return sources.filter(
		(s) =>
			s.name.toLowerCase().includes(search_) ||
			s.columns?.some((c) => c.name.toLowerCase().includes(search_))
	);
}
