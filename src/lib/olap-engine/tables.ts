interface Source {
	slug: string;
	path: string;
}

export function applySlugs(query: string, sources: Source[]) {
	for (const source of sources) {
		query = query.replace(new RegExp(`(from|FROM)[ \n\t]+(${source.slug})`, 'g'), (match) =>
			match.replace(source.slug, `${source.path} ${source.slug}`)
		);

		query = query.replace(
			new RegExp(`(describe|DESCRIBE)([ \n\t]+(table|TABLE))?[ \n\t]+(${source.slug})`, 'g'),
			(match) => match.replace(source.slug, `${source.path}`)
		);
	}

	return query;
}
