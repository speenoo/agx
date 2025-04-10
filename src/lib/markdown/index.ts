import hljs from 'highlight.js';
import { Marked } from 'marked';
import './markdown.css';

export function transform(content: string) {
	const marked = new Marked({
		renderer: {
			code({ text, lang = 'text' }) {
				const language = hljs.getLanguage(lang) ? lang : 'text';

				let html = '<div class="code-block">';
				if (lang === 'sql') {
					html += '<div class="controls">';
					html += '<button type="button" class="copy" title="copy to clipboard"></button>';
					html += '<button type="button" class="open" title="open in editor"></button>';
					html += '</div>';
				}
				html += `<pre><code class="hljs language-${language}">`;
				html += hljs.highlight(text, { language }).value;
				html += '</code></pre>';
				html += '</div>';

				return html;
			}
		}
	});

	return marked.parse(content, { async: false });
}

export function getTextFromElement(element: HTMLElement) {
	let result = '';

	for (const child of element.childNodes ?? []) {
		if (child.nodeType === Node.TEXT_NODE) {
			result += (child as Text).data;
		}

		if (child.nodeType === Node.ELEMENT_NODE) {
			result += getTextFromElement(child as HTMLElement);
		}
	}

	return result;
}
