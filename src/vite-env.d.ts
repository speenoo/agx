declare const PLATFORM: 'NATIVE' | 'WEB';
declare const BUILD: string;
declare const CLICKHOUSE_URL: string;

type MaybePromise<T> = T | Promise<T>;
