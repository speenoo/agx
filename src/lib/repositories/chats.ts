import type { ChatInput } from '$lib/components/Ai/types';
import type { Table } from '$lib/olap-engine';
import type { Database } from '$lib/store/database';
import type { SqlValue } from '@sqlite.org/sqlite-wasm';

export interface Chat {
	id: string;
	name: string;
	messages: ChatInput['messages'];
	dataset?: Table;
}

export interface ChatsRepository {
	list(): Promise<[chats: Chat[], active: number]>;
	save(chats: Chat[], active: number): Promise<void>;
}

export class SQLiteChatsRepository implements ChatsRepository {
	constructor(private db: Database) {}

	async list(): Promise<[chats: Chat[], active: number]> {
		const rows = await this.db.exec('select * from chats order by idx');
		const index = rows.findIndex((r) => r.active);

		return [rows.map((r) => this.fromRowToChat(r)), Math.max(0, index)];
	}

	private fromRowToChat(row: { [columnName: string]: SqlValue }): Chat {
		return {
			id: row.id as string,
			messages: JSON.parse(row.messages as string),
			name: row.name as string,
			dataset: row.dataset ? JSON.parse(row.dataset as string) : undefined
		};
	}

	async save(chats: Chat[], active: number): Promise<void> {
		const rows = chats.map((c, i) => this.fromChatToRow(c, i));

		try {
			await this.db.exec('BEGIN TRANSACTION;');
			await this.db.exec('DELETE FROM chats;');

			if (rows.length) {
				const values = new Array(chats.length).fill('(?,?,?,?,?,?)').join(',\n');
				const params = rows
					.map((r) => [r.id, r.name, r.messages, r.dataset, r.idx, r.idx === active || null])
					.flat();
				await this.db.exec(
					`INSERT INTO chats (id, name, messages, dataset, idx, active) VALUES ${values}`,
					params
				);
			}

			await this.db.exec('COMMIT;');
		} catch (e) {
			await this.db.exec('ROLLBACK;');
			throw e;
		}
	}

	private fromChatToRow(chat: Chat, index: number): { [columnName: string]: SqlValue } {
		return {
			id: chat.id,
			name: chat.name,
			messages: JSON.stringify(chat.messages),
			dataset: chat.dataset ? JSON.stringify(chat.dataset) : null,
			idx: index
		};
	}
}
