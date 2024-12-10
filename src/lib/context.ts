import { getContext, setContext } from 'svelte';
import type { AppContext } from './types';

const key = Symbol('app');

export function get_app_context(): AppContext {
	return getContext(key);
}

export function set_app_context(value: AppContext) {
	setContext(key, value);
}
