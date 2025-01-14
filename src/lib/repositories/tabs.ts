import { db, type Database } from '$lib/database';

export interface Tab {
	id: string;
	name: string;
	contents: string;
	query_id?: number;
}

export interface TabRepository {
	get(): Promise<Tab[]>;
	set(tabs: Tab[]): Promise<void>;
}

class SQLiteTabRepository implements TabRepository {
	constructor(private db: Database) {}

	async get(): Promise<Tab[]> {
		const rows = await this.db.exec('select * from tabs order by tab_index');
		return rows.map(row_to_tab);
	}

	async set(tabs: Tab[]): Promise<void> {
		const rows = tabs.map((tab, tab_index) => ({ ...tab, tab_index }));

		await this.db.exec(
			`DELETE FROM tabs;
INSERT INTO tabs (id, name, contents, query_id, tab_index)
VALUES ${Array.from({ length: rows.length }).fill('(?,?,?,?,?)').join(',\n')}
`,
			rows.map((r) => [r.id, r.name, r.contents, r.query_id ?? null, r.tab_index]).flat()
		);
	}
}

function row_to_tab(row: Awaited<ReturnType<Database['exec']>>[number]): Tab {
	return {
		id: row.id as string,
		contents: row.contents as string,
		name: row.name as string,
		query_id: row.query_id as number | undefined
	};
}

export const tab_repository: TabRepository = new SQLiteTabRepository(db);
