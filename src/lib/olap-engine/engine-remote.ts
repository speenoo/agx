import type { OLAPEngine, OLAPResponse, Table } from './index';
import { Logger } from './Logger';

import CLICKHOUSE_GET_SCHEMA from './queries/clickhouse_get_schema.sql?raw';

export class RemoteEngine extends Logger implements OLAPEngine {
	async init() {}

	async exec(query: string) {
		try {
			const proxy =
				new URLSearchParams(window.location.search).get('proxy') ?? 'https://proxy.agx.app/query';
			const response = await fetch(proxy, { method: 'POST', body: query });

			if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

			const r = await response.text();
			if (!r) throw new Error(`Empty Response`);

			const data: RemoteEngineResponse = JSON.parse(r);

			if ('exception' in data) throw new Error(data.exception);

			return data;
		} catch (e) {
			console.error(e);
			this.log('error', e);
		}
	}

	async getSchema() {
		const response = await this.exec(CLICKHOUSE_GET_SCHEMA);
		if (!response) return [];
		return response.data as Table[];
	}
}

interface RemoteEngineException {
	meta: [];
	data: [];
	rows: 0;
	exception: string;
}

type RemoteEngineResponse = OLAPResponse | RemoteEngineException;
