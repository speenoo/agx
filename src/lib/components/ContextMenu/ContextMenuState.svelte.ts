import type { ContextMenuItem, ContextMenuOptions } from './types';

export class ContextMenuState {
	#items = $state.raw<ContextMenuItem[]>([]);
	#is_open = $derived(!!this.#items.length);
	#position = $state.raw<{ x: number; y: number }>({ x: 0, y: 0 });

	get items() {
		return this.#items;
	}

	get open() {
		return this.#is_open;
	}

	get position() {
		return this.#position;
	}

	constructor() {
		this.close = this.close.bind(this);
	}

	show(options: ContextMenuOptions) {
		this.#items = options.items;
		this.#position = options.position;
	}

	close() {
		this.#items = [];
	}
}
