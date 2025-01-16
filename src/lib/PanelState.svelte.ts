import type { Length } from '@rich_harris/svelte-split-pane';

export class PanelState {
	open = $state<boolean>()!;
	#position = $state<Length>()!;
	#disabledPosition: Length;

	constructor(pos: Length, open: boolean = true, disabledPosition: Length = '0px') {
		this.open = open;
		this.#position = pos;
		this.#disabledPosition = disabledPosition;
	}

	get position() {
		if (this.open) return this.#position;
		return this.#disabledPosition;
	}

	set position(pos: Length) {
		if (this.open) this.#position = pos;
	}
}
