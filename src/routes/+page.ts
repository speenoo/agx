import { engine } from '$lib/olap-engine';
import type { PageLoad } from './$types';

export const load = (async () => {
	await engine.init();
	const udfs = await engine.getUDFs();

	return { udfs };
}) satisfies PageLoad;
