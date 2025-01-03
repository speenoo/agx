import { invoke } from '@tauri-apps/api/core';
import type { OLAPEngine, Table, OLAPResponse } from './index';

import CLICKHOUSE_GET_SCHEMA from './queries/clickhouse_get_schema.sql?raw';
import CLICKHOUSE_INIT_DB from './queries/clickhouse_init_db.sql?raw';

export class CHDBEngine implements OLAPEngine {
	async init() {
		await this.exec(CLICKHOUSE_INIT_DB);
	}

	async exec(query: string) {
		try {
			const r: string = await invoke('query', { query });
			if (!r) return;

			return JSON.parse(r) as OLAPResponse;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}

	async getSchema() {
		const response = await this.exec(CLICKHOUSE_GET_SCHEMA);
		if (!response) return [];
		return response.data as Table[];
	}
}
