type Callback = (param: any) => void;

export interface ILogger {
	on(level: 'error', fn: Callback): () => void;
	log(level: 'error', param: any): void;
}

export abstract class Logger implements ILogger {
	#listeners: { [key: string]: Set<Callback> } = {};

	on(logEvent: 'error', fn: Callback) {
		this.#listeners[logEvent] ??= new Set<Callback>();

		this.#listeners[logEvent].add(fn);
		return () => this.#listeners[logEvent].delete(fn);
	}

	log(level: 'error', param: any) {
		if (!this.#listeners[level]?.size) return;

		queueMicrotask(() => {
			for (const fn of this.#listeners[level]) fn(param);
		});
	}
}
