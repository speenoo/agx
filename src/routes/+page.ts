import { engine } from '$lib/olap-engine';
import type { PageLoad } from './$types';

export const load = (async () => {
	await engine.init();

	return {};
}) satisfies PageLoad;
