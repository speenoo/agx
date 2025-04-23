import type { Table } from '$lib/olap-engine';
import type { ChatInput, Model } from './types';

export { default as AiPanel } from './Panel.svelte';

export interface Chat {
	id: string;
	name: string;
	messages: ChatInput['messages'];
	dataset?: Table;
}

export type { Model };

export const ArgnosticModel: Model = {
	brand: 'Agnostic',
	name: 'Agnostic AI (v0)',
	endpoint: 'https://ai.agx.app/api/chat'
};

export function serializeModel(model: Model) {
	return JSON.stringify(model);
}

export function deserializeModel(model: string): Model | null {
	try {
		return JSON.parse(model);
	} catch {
		return null;
	}
}
