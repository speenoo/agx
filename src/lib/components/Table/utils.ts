export const Types = {
	remove_nullable(type: string) {
		return type.replace(/Nullable\((.*)\)/, '$1');
	},
	is_number(type: string) {
		if (/(Array|Map|Tuple)/.test(type)) return false;
		return /(Int|Float|Decimal)/.test(type);
	}
};
