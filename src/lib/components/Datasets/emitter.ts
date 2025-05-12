import type { Table } from '$lib/olap-engine';
import mitt from 'mitt';

type Events = {
	expand: Table['name'];
};

const emitter = mitt<Events>();

export function goToDefinition(tableName: string) {
	emitter.emit('expand', tableName);
}

export function onExpand(handler: (tableName: string) => void) {
	emitter.on('expand', handler);

	return () => emitter.off('expand', handler);
}
