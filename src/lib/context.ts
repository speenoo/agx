import { getContext, setContext } from 'svelte';
import type { AppContext } from './types';

const key = Symbol('@app/context');

export function getAppContext(): AppContext {
	return getContext(key);
}

export function setAppContext(value: AppContext) {
	setContext(key, value);
}
