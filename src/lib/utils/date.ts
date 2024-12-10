function number_with_leading_zero(n: number, length: number = 2) {
	if (!isFinite(n)) return 'n/a';
	return n.toString().padStart(length, '0');
}

const getMonth = (date: Date) => date.getUTCMonth() + 1;
const getDay = (date: Date) => date.getUTCDate();
const getYear = (date: Date) => date.getUTCFullYear();

const dd = (date: Date) => number_with_leading_zero(getDay(date), 2);
const MMMM = (date: Date, locale: string) =>
	new Date(date.getUTCFullYear(), date.getUTCMonth(), 1).toLocaleString(locale, { month: 'long' });
const MMM = (date: Date, locale: string) =>
	new Date(date.getUTCFullYear(), date.getUTCMonth(), 1).toLocaleString(locale, { month: 'short' });
const MM = (date: Date) => number_with_leading_zero(getMonth(date), 2);
const yy = (date: Date) => number_with_leading_zero(getYear(date) % 100, 2);
const yyyy = (date: Date) => number_with_leading_zero(getYear(date), 4);

const hh = (date: Date) => number_with_leading_zero(date.getUTCHours(), 2);
const mm = (date: Date) => number_with_leading_zero(date.getUTCMinutes(), 2);
const ss = (date: Date) => number_with_leading_zero(date.getUTCSeconds(), 2);

export function format_date(
	date: Date,
	format: string = 'yyyy-MM-dd',
	locale: string = 'default'
): string {
	return format
		.replace(/yyyy/g, yyyy(date))
		.replace(/yy/g, yy(date))
		.replace(/MMMM/g, MMMM(date, locale))
		.replace(/MMM/g, MMM(date, locale))
		.replace(/MM/g, MM(date))
		.replace(/dd/g, dd(date));
}

export function format_time(date: Date, format: string = '%h:%m:%s'): string {
	return format.replace('%h', hh(date)).replace('%m', mm(date)).replace('%s', ss(date));
}

export enum TimeInterval {
	Second = 0,
	Minute,
	Hour,
	Day,
	Week,
	Month,
	Quarter,
	Year
}

const ONE_SECOND = 1_000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

export function get_interval(a: Date, b: Date): TimeInterval {
	const delta = Math.abs(a.getTime() - b.getTime());

	if (delta <= ONE_SECOND) return TimeInterval.Second;
	if (delta <= ONE_MINUTE) return TimeInterval.Minute;
	if (delta <= ONE_HOUR) return TimeInterval.Hour;
	if (delta <= ONE_DAY) return TimeInterval.Day;
	if (delta <= ONE_WEEK) return TimeInterval.Week;

	const months = Math.abs(
		b.getUTCMonth() - a.getUTCMonth() - 12 * Math.abs(a.getUTCFullYear() - b.getUTCFullYear())
	);

	if (months < 3) return TimeInterval.Month;
	if (months >= 3 && months < 6) return TimeInterval.Quarter;

	return TimeInterval.Year;
}
