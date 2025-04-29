export interface ChatInput {
	messages: {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}[];
	stream?: false | undefined;
}

export interface ChatOutput {
	created_at: string;
	message: { role: 'assistant'; content: string };
}

export interface Model {
	name: string;
	brand: string;
	baseURL: string;
}
