import { db, type Database } from '$lib/database';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface HistoryEntry {
	id: number;
	content: string;
	timestamp: Date;
}

export interface HistoryRepository {
	getAll(): Promise<HistoryEntry[]>;
	add(content: string): Promise<HistoryEntry>;
}

class SQLiteHistoryRepository implements HistoryRepository {
	constructor(private db: Database) {}

	async getAll(): Promise<HistoryEntry[]> {
		const rows = await this.db.exec('SELECT * FROM history ORDER BY timestamp DESC');
		return rows.map((row) => ({
			id: row.id as number,
			content: row.content as string,
			timestamp: dayjs(row.timestamp as string)
				.utc(true)
				.toDate()
		}));
	}

	async add(content: string): Promise<HistoryEntry> {
		const [row] = await this.db.exec('INSERT INTO history (content) VALUES (?) RETURNING *', [
			content
		]);

		if (!row) throw Error('Failed to insert history entry');

		return {
			id: row.id as number,
			content: row.content as string,
			timestamp: dayjs(row.timestamp as string)
				.utc(true)
				.toDate()
		};
	}
}

export const history_repository: HistoryRepository = new SQLiteHistoryRepository(db);
