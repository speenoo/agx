import { exec } from './query';
import type { Source } from './types';

const LIST_SOURCES_QUERY = `select
  t.name as name,
  t.engine as engine,
  groupArray(map(
    'name', c.name,
    'type', c.type
  )) as columns
from system.tables as t
inner join system.columns as c on t.name = c.table
where database = 'agx'
group by t.name, t.engine
`;

export class Sources {
	#tables = $state.raw<Source[]>([]);

	constructor() {
		this.fetch();
	}

	public get tables() {
		return this.#tables;
	}

	async fetch() {
		const response = await exec(LIST_SOURCES_QUERY);
		if (response) this.#tables = response.data as Source[];
	}
}
