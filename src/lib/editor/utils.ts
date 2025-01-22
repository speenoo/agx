import type { ColumnDescriptor, Table } from '$lib/olap-engine';
import type { Completion } from '@codemirror/autocomplete';
import { SQLDialect } from '@codemirror/lang-sql';

export function tablesToSQLNamespace(tables: Table[]) {
	return tables.reduce((acc, table) => {
		if (table.columns.length)
			return { ...acc, [table.name]: table.columns.map(columnDescriptorToCompletion) };
		return acc;
	}, {});
}

function columnDescriptorToCompletion(cd: ColumnDescriptor): Completion {
	return { label: cd.name, detail: cd.type, type: 'property' };
}

export function extendsDialect(dialect: SQLDialect, keywords: string[]) {
	if (!keywords.length) return dialect;

	return SQLDialect.define({
		...dialect.spec,
		keywords: dialect.spec.keywords + ' ' + keywords.join(' ')
	});
}
