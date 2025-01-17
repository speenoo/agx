import { CHDBEngine } from './engine-chdb';
import { RemoteEngine } from './engine-remote';
import type { ILogger } from './Logger';

export type OLAPResponse = {
	meta: Array<ColumnDescriptor>;
	data: Array<{ [key: string]: any }>;
	rows: number;
	statistics: {
		bytes_read: number;
		elapsed: number;
		rows_read: number;
	};
};

export interface ColumnDescriptor {
	name: string;
	type: string;
}

export interface Table {
	name: string;
	engine: string;
	columns: ColumnDescriptor[];
}

export interface OLAPEngine extends ILogger {
	init(): Promise<void>;
	exec(query: string): Promise<OLAPResponse | undefined>;
	getSchema(): Promise<Table[]>;
}

export const engine: OLAPEngine = PLATFORM === 'WEB' ? new RemoteEngine() : new CHDBEngine();
