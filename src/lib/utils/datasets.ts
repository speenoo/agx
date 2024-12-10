import type { Dataset } from '$lib/types';

export function applySlugs(query: string, datasets: Dataset[]) {
	let q = query;

	for (const dataset of datasets) {
		q = q.replace(new RegExp(`(from|FROM)[ \n\t]+(${dataset.slug})`, 'g'), (match) =>
			match.replace(dataset.slug, `${dataset.path} ${dataset.slug}`)
		);

		q = q.replace(
			new RegExp(`(describe|DESCRIBE)([ \n\t]+(table|TABLE))?[ \n\t]+(${dataset.slug})`, 'g'),
			(match) => match.replace(dataset.slug, `${dataset.path}`)
		);
	}

	return q;
}
