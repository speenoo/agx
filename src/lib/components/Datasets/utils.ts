import type { ColumnDescriptor, Table } from '$lib/olap-engine';
import _ from 'lodash';

export function filter(sources: Table[], search: string) {
	if (!search) return sources;
	const search_ = search.toLowerCase();

	return sources.filter(
		(s) =>
			s.name.toLowerCase().includes(search_) ||
			s.columns?.some((c) => c.name.toLowerCase().includes(search_))
	);
}

export type TreeNode = GroupTreeNode | DatasetTreeNode;

type GroupTreeNode = {
	name: string;
	type: 'group';
	children: TreeNode[];
};

type DatasetTreeNode = {
	name: string;
	type: 'dataset';
	value: string;
	columns: ColumnDescriptor[];
};

export function buildTree(tables: Table[]): TreeNode[] {
	const root: Record<string, any> = {};

	tables.forEach(({ name, columns }) => {
		const parts = name.split('__');
		_.setWith(
			root,
			parts.join('.children.'),
			{ name: parts[parts.length - 1], type: 'dataset', value: name, columns },
			Object
		);
	});

	const toArray = (obj: any): TreeNode[] =>
		_.map(
			obj,
			(value, key) =>
				({
					name: key,
					type: value.children ? 'group' : 'dataset',
					value: value.value,
					columns: value.columns,
					children: value.children ? toArray(value.children) : undefined
				}) as TreeNode
		);

	return toArray(root);
}

export function findNodeInTree(
	tree: TreeNode[],
	value: DatasetTreeNode['value']
): TreeNode | undefined {
	for (const node of tree) {
		if (node.type === 'dataset' && node.value === value) return node;
		else if (node.type === 'group') {
			const found = findNodeInTree(node.children!, value);
			if (found) return found;
		}
	}
}
