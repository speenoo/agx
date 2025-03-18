import GAS_PRICE from './example1.sql?raw';
import TOKEN_PRICE from './example2.sql?raw';

const AGX = location.hostname === 'agx.app' || location.hostname.endsWith('agx-80h.pages.dev');

export const EXAMPLES_TABS = AGX
	? [GAS_PRICE, TOKEN_PRICE].map((example: string, index: number) => [
			crypto.randomUUID(),
			`Example ${index + 1}`,
			example,
			index,
			null
		])
	: [];
