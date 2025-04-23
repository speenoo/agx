import { invoke } from '@tauri-apps/api/core';
import { InternalEventEmitter } from './EventListener';
import type { Events, ExecOptions, OLAPEngine, OLAPResponse, Table } from './index';

import CLICKHOUSE_GET_SCHEMA from './queries/clickhouse_get_schema.sql?raw';
import CLICKHOUSE_GET_UDFS from './queries/clickhouse_get_udfs.sql?raw';
import CLICKHOUSE_INIT_DB from './queries/clickhouse_init_db.sql?raw';

export class CHDBEngine extends InternalEventEmitter<Events> implements OLAPEngine {
	async init() {
		await this.exec(CLICKHOUSE_INIT_DB);
	}

	async exec(query: string, options: ExecOptions = {}, _emit = true) {
		try {
			const r: string = await invoke('query', { query });

			let data: OLAPResponse | undefined;
			if (r) data = JSON.parse(r) as OLAPResponse;

			if (_emit) this.emit('success', query, data);

			return data;
		} catch (e) {
			if (typeof e === 'string') e = new Error(e);
			console.error(e);
			if (_emit) this.emit('error', e);
		}
	}

	async getSchema() {
		const response = await this.exec(CLICKHOUSE_GET_SCHEMA, {}, false);
		if (!response) return [];
		return response.data as Table[];
	}

	async getUDFs() {
		const response = await this.exec(CLICKHOUSE_GET_UDFS, {}, false);
		if (!response) return [];

		return response.data.map((row) => row.name as string);
	}
}
