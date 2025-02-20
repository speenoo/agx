import { type ColumnDescriptor, type Table } from '$lib/olap-engine';
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

type TreeNode = {
	name: string;
	type: 'group' | 'dataset';
	value?: string;
	columns?: ColumnDescriptor[];
	children?: TreeNode[];
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
			(value, key): TreeNode => ({
				name: key,
				type: value.children ? 'group' : 'dataset',
				value: value.value,
				columns: value.columns,
				children: value.children ? toArray(value.children) : undefined
			})
		);

	return toArray(root);
}
