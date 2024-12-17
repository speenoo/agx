import { exec } from './query';

export async function init() {
	await exec(`
		CREATE DATABASE IF NOT EXISTS agx;
		USE agx;
	`);
}

export { Sources } from './sources.svelte';
export type * from './types';
export { exec };
