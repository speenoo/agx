import { Store } from 'tauri-plugin-store-api';
import type { Dataset } from './types';

const path = 'datasets.json';

const sources_key = 'sources';

const store = new Store(path);

export async function get_sources_from_store(): Promise<Dataset[]> {
	return (await store.get<Dataset[]>(sources_key)) ?? [];
}

export async function set_sources_in_store(sources: Dataset[]) {
	await store.set(sources_key, sources);
}
