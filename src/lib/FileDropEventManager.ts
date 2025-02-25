import { webview } from '@tauri-apps/api';
import type { Webview } from '@tauri-apps/api/webview';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { on } from 'svelte/events';

type FileInfo = {
	path: string;
	content: () => Promise<string>;
	type: string;
};

type Listener = (file: FileInfo) => any;
type NativeEvent = Parameters<Parameters<Webview['onDragDropEvent']>[0]>[0];

export class FileDropEventManager {
	#listeners = new Set<Listener>();

	#unlisten?: () => void;

	constructor() {
		if (PLATFORM === 'WEB') this.#unlisten = on(window, 'drop', this.#web_handler.bind(this));
		else
			webview
				.getCurrentWebview()
				.onDragDropEvent(this.#native_handler.bind(this))
				.then((un) => (this.#unlisten = un));
	}

	async #web_handler(event: DragEvent) {
		const files = Array.from(event.dataTransfer?.files ?? []);
		if (!files.length) return;
		event.preventDefault();

		for (const file of files) {
			this.#emit({
				path: file.name,
				content: () => file.text(),
				type: getFileTypeFromPath(file.name)
			});
		}
	}

	async #native_handler({ payload }: NativeEvent) {
		if (payload.type !== 'drop') return;
		const paths = payload.paths;

		if (!paths.length) return;

		for (const path of paths) {
			this.#emit({ path, content: () => readTextFile(path), type: getFileTypeFromPath(path) });
		}
	}

	#emit(file: FileInfo) {
		if (!this.#listeners.size) return;

		queueMicrotask(() => {
			for (const fn of this.#listeners) fn(file);
		});
	}

	on(e: 'drop', handler: Listener) {
		this.#listeners.add(handler);
		return () => {
			this.#listeners.delete(handler);
		};
	}

	unlisten() {
		this.#listeners.clear();
		this.#unlisten?.();
	}
}

function getFileTypeFromPath(path: string) {
	return path.split('.').pop()?.toLowerCase() ?? '';
}
