import type { ColumnDescriptor, Source } from '$lib/ch-engine';
import type { Completion } from '@codemirror/autocomplete';

export function sources_to_schema(sources: Source[]): {
	[table_name: string]: ColumnDescriptor[];
} {
	return sources.reduce((acc, k) => {
		if (k.columns.length) return { ...acc, [k.name]: k.columns };
		return acc;
	}, {});
}

export function schema_to_completions(schema: { [table_name: string]: ColumnDescriptor[] }): {
	[table_name: string]: Completion[];
} {
	const completions: { [table_name: string]: Completion[] } = {};

	for (const table_name in schema) {
		completions[table_name] = schema[table_name].map(column_descriptor_to_completion);
	}

	return completions;
}

function column_descriptor_to_completion(cd: ColumnDescriptor): Completion {
	return { label: cd.name, detail: cd.type, type: 'property' };
}
