import type { Migration } from '@agnosticeng/migrate';

import CREATE_HISTORY_TABLE_SCRIPT from './001_create_history_table.sql?raw';
import CREATE_QUERIES_TABLE_SCRIPT from './002_create_queries_table.sql?raw';

export const MIGRATIONS: Migration[] = [
	{ name: 'create_history_table', script: CREATE_HISTORY_TABLE_SCRIPT },
	{ name: 'create_queries_table', script: CREATE_QUERIES_TABLE_SCRIPT }
];
