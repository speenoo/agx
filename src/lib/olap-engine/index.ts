import { CHDBEngine } from './engine-chdb';
import { RemoteEngine } from './engine-remote';

export type OLAPResponse = {
	meta: Array<ColumnDescriptor>;
	data: Array<{ [key: string]: any }>;
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

export interface OLAPEngine {
	init(): Promise<void>;
	exec(query: string): Promise<OLAPResponse | undefined>;
	getSchema(): Promise<Table[]>;
}

export const engine: OLAPEngine = PLATFORM === 'WEB' ? new RemoteEngine() : new CHDBEngine();
