import { clamp, getRelativeParent } from '../utils';

export function position<N extends HTMLElement>(node: N, position: [x: number, y: number]) {
	function update([x, y]: [x: number, y: number]) {
		const constraint_rect = getRelativeParent(node)?.getBoundingClientRect();
		if (!constraint_rect) return;

		const spacing = parseIntSafe(node.dataset.spacing ?? '', 0);

		const rect = node.getBoundingClientRect();
		const left = x + spacing;
		const right = left + rect.width;
		node.style.position = 'absolute';
		node.style.left = '';
		if (right > constraint_rect.width) node.style.left = `${x - spacing - rect.width}px`;
		else node.style.left = `${left}px`;
		const top = clamp(y - rect.height / 2, 0 + spacing, constraint_rect.height - spacing);
		node.style.top = `${top}px`;
	}

	update(position);

	return { update };
}

function parseIntSafe(raw: string, default_value = 0) {
	const value = parseInt(raw, 10);
	if (isNaN(value)) return default_value;

	return value;
}
