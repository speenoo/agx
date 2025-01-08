export type ContextMenuItem = ContextMenuAction | ContextMenuSeparator;

export interface ContextMenuAction {
	label: string;
	disabled?: boolean;
	onClick?: (e: MouseEvent) => MaybePromise<any>;
}

export interface ContextMenuSeparator {
	is_separator: true;
}

export interface ContextMenuOptions {
	position: { x: number; y: number };
	items: ContextMenuItem[];
}
