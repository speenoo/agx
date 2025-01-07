import type { Migration } from '@agnosticeng/migrate';

import CREATE_HISTORY_TABLE_SCRIPT from './001_create_history_table.sql?raw';

export const MIGRATIONS: Migration[] = [
	{ name: 'create_history_table', script: CREATE_HISTORY_TABLE_SCRIPT }
];
