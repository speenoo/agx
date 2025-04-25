interface OllamaVersion {
	version: string;
}

interface OllamaModel {
	name: string;
	modified_at: string;
	size: number;
	digest: string;
	details: {
		format: string;
		family: string;
		parameter_size: string;
		quantization_level: string;
	};
}

export class OllamaClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash if present
	}

	/**
	 * Check if Ollama is available and get version information
	 */
	async getVersion(): Promise<OllamaVersion> {
		try {
			const response = await fetch(`${this.baseUrl}/api/version`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return (await response.json()) as OllamaVersion;
		} catch (error) {
			const message = error instanceof Error ? error.message : error;
			throw new Error(`Failed to get Ollama version: ${message}`);
		}
	}

	/**
	 * List all available models
	 */
	async listModels(): Promise<OllamaModel[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/tags`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data.models as OllamaModel[];
		} catch (error) {
			const message = error instanceof Error ? error.message : error;
			throw new Error(`Failed to list models: ${message}`);
		}
	}
}
