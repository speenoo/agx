export { default as LineChart } from './Chart.svelte';

const isIntegerRegExp = /U?Int[0-9]+/i;
const isDateRegExp = /Date(Time)?(32|64)?/;
const isFloatRegExp = /Float(32|64)|Decimal(32|64|128|256)?(\(\d+(, ?\d+)\))?/;

const isObjectRegexp = /Array|Map|Tuple|Variant/;

function remove_nullable(type: string) {
	return type.replace(/Nullable\((.*)\)/, '$1');
}

export function isSupportedType(type: string) {
	const normalized = remove_nullable(type);

	if (isObjectRegexp.test(normalized)) return false;

	return (
		isIntegerRegExp.test(normalized) ||
		isFloatRegExp.test(normalized) ||
		isDateRegExp.test(normalized)
	);
}

export function applyType(value: any, type: string) {
	const normalized = remove_nullable(type);

	if (isDateRegExp.test(normalized)) return new Date(value);
	return Number(value);
}

export function formatValue(value: any, type: string) {
	const normalized = remove_nullable(type);

	if (isDateRegExp.test(normalized)) return new Date(value).toISOString();
	if (isIntegerRegExp.test(normalized)) return Math.round(value).toLocaleString('en');
	return Number(value).toLocaleString('en');
}
