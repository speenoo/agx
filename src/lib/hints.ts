import type { OLAPResponse } from './olap-engine';

export const LARGE_RESULT = 'Result too large';

export function isResponseTooLarge(r: OLAPResponse) {
	const uint8Array = new TextEncoder().encode(JSON.stringify(r));
	const sizeInMB = uint8Array.byteLength / Math.pow(1024, 2);
	return sizeInMB > 1;
}
