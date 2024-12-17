import type { Sources } from './ch-engine';

type MaybePromise<T> = T | Promise<T>;

export type AppContext = {
	sources: Sources;
};
