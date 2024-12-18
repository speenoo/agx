import { invoke } from '@tauri-apps/api/core';
import type { CHResponse } from './types';

export async function exec(query: string) {
	try {
		const r: string = await invoke('query', { query });
		if (!r) return;

		return JSON.parse(r) as CHResponse;
	} catch (e) {
		console.error(e);
	}
}
