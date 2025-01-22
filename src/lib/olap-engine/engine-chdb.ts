import { invoke } from '@tauri-apps/api/core';
import type { OLAPEngine, OLAPResponse, Table } from './index';
import { Logger } from './Logger';

import CLICKHOUSE_GET_SCHEMA from './queries/clickhouse_get_schema.sql?raw';
import CLICKHOUSE_GET_UDFS from './queries/clickhouse_get_udfs.sql?raw';
import CLICKHOUSE_INIT_DB from './queries/clickhouse_init_db.sql?raw';

export class CHDBEngine extends Logger implements OLAPEngine {
	async init() {
		await this.exec(CLICKHOUSE_INIT_DB);
	}

	async exec(query: string) {
		try {
			const r: string = await invoke('query', { query });
			if (!r) return;

			return JSON.parse(r) as OLAPResponse;
		} catch (e) {
			if (typeof e === 'string') e = new Error(e);
			console.error(e);
			this.log('error', e);
		}
	}

	async getSchema() {
		const response = await this.exec(CLICKHOUSE_GET_SCHEMA);
		if (!response) return [];
		return response.data as Table[];
	}

	async getUDFs() {
		const response = await this.exec(CLICKHOUSE_GET_UDFS);
		if (!response) return [];

		return response.data.map((row) => row.name as string);
	}
}
