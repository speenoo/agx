import type { OLAPEngine, Table, OLAPResponse } from './index';

import CLICKHOUSE_GET_SCHEMA from './queries/clickhouse_get_schema.sql?raw';

export class RemoteEngine implements OLAPEngine {
	async init() {}

	async exec(query: string) {
		try {
			const proxy =
				new URLSearchParams(window.location.search).get('proxy') ?? 'https://proxy.agx.app/query';
			const response = await fetch(`${proxy}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: query
			});
			const r = await response.text();
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
