type MaybePromise<T> = T | Promise<T>;

export type AppContext = {
	tables: Table[];
};
