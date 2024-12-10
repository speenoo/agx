import { get_sources_from_store } from '$lib/store';
import type { PageLoad } from './$types';

export const load = (async () => {
	return { sources: await get_sources_from_store() };
}) satisfies PageLoad;
