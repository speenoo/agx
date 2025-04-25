import type { Model } from '$lib/components/Ai';
import { OllamaClient } from './client';

const ollama = new OllamaClient(OLLAMA_BASE_URL);
const OLLAMA_CHAT_API_ENDPOINT = `${OLLAMA_BASE_URL}/api/chat`;

export async function isInstalled() {
	try {
		await ollama.getVersion();
		return true;
	} catch {
		return false;
	}
}

export async function getModels(): Promise<Model[]> {
	const models = await ollama.listModels();
	return models.map((m) => ({ brand: 'Ollama', name: m.name, endpoint: OLLAMA_CHAT_API_ENDPOINT }));
}
