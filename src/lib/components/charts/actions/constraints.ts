import { clamp, getRelativeParent } from '../utils';

export function position<N extends HTMLElement>(node: N, position: [x: number, y: number]) {
	const padding = 10;

	function update([x, y]: [x: number, y: number]) {
		const constraint_rect = getRelativeParent(node)?.getBoundingClientRect();
		if (!constraint_rect) return;

		const rect = node.getBoundingClientRect();

		const left = x + padding;
		const right = left + rect.width;

		node.style.position = 'absolute';
		node.style.left = '';
		if (right > constraint_rect.width) node.style.left = `${x - padding - rect.width}px`;
		else node.style.left = `${left}px`;

		const top = clamp(y - rect.height / 2, 0 + padding, constraint_rect.height - padding);
		node.style.top = `${top}px`;
	}

	update(position);

	return { update };
}
