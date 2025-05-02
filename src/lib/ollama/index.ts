import type { Model } from '$lib/components/Ai';
import { OllamaClient } from './client';

const ollama = new OllamaClient(OLLAMA_BASE_URL);

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
	return models.map((m) => ({ brand: 'Ollama', name: m.name, baseURL: OLLAMA_BASE_URL }));
}
