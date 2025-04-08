import type { Migration } from '@agnosticeng/migrate';

import CREATE_HISTORY_TABLE_SCRIPT from './001_create_history_table.sql?raw';
import CREATE_QUERIES_TABLE_SCRIPT from './002_create_queries_table.sql?raw';
import CREATE_TABS_TABLE_SCRIPT from './003_create_tabs_table.sql?raw';
import CREATE_CHATS_TABLE_SCRIPT from './004_create_chats_table.sql?raw';

export const MIGRATIONS: Migration[] = [
	{ name: 'create_history_table', script: CREATE_HISTORY_TABLE_SCRIPT },
	{ name: 'create_queries_table', script: CREATE_QUERIES_TABLE_SCRIPT },
	{ name: 'create_tabs_table', script: CREATE_TABS_TABLE_SCRIPT },
	{ name: 'create_chats_table', script: CREATE_CHATS_TABLE_SCRIPT }
];
