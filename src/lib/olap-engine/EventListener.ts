type Callback = (...param: any[]) => void;

type OptionalRecord<K extends keyof any, T> = { [P in K]?: T };

export interface IListener<Events extends string> {
	on(event: Events, fn: Callback): () => any;
}

export abstract class InternalEventEmitter<Events extends string> implements IListener<Events> {
	#listeners: OptionalRecord<Events, Set<Callback>> = {};

	on(event: Events, fn: Callback) {
		this.#listeners[event] ??= new Set<Callback>();

		this.#listeners[event].add(fn);
		return () => this.#listeners[event]?.delete(fn);
	}

	protected emit(event: Events, ...param: any[]) {
		if (!this.#listeners[event]?.size) return;

		queueMicrotask(() => {
			if (this.#listeners[event]) for (const fn of this.#listeners[event]) fn(...param);
		});
	}
}
