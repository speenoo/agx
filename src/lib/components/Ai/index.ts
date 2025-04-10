import type { Table } from '$lib/olap-engine';
import type { ChatInput } from './types';

export { default as AiPanel } from './Panel.svelte';

export interface Chat {
	id: string;
	name: string;
	messages: ChatInput['messages'];
	dataset?: Table;
}
