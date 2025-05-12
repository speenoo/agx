import * as monaco from 'monaco-editor';

export function setupLanguage(
	id: string,
	keywords: string[] = [],
	functions: string[] = [],
	types: string[] = [],
	operators: string[] = [],
	tables: string[] = [],
	columns: string[] = []
) {
	monaco.languages.register({ id });
	monaco.languages.setLanguageConfiguration(id, {
		comments: {
			lineComment: '--',
			blockComment: ['/*', '*/']
		},
		brackets: [
			['{', '}'],
			['[', ']'],
			['(', ')']
		],
		autoClosingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" }
		],
		surroundingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" }
		]
	});
	monaco.languages.setMonarchTokensProvider(id, {
		ignoreCase: true,
		keywords: keywords.map((k) => k.split(' ')[0]),
		functions: functions,
		tables: tables,
		typeKeywords: types,
		operators: operators,
		columns: columns,

		brackets: [
			{ open: '[', close: ']', token: 'delimiter.square' },
			{ open: '(', close: ')', token: 'delimiter.parenthesis' }
		],

		symbols: /[=><!~?:&|+\-*\/\^%]+/,

		tokenizer: {
			root: [
				[
					/[a-zA-Z_]\w*/,
					{
						cases: {
							'@keywords': 'keyword',
							'@functions': 'function',
							'@tables': 'identifier',
							'@typeKeywords': 'type',
							'@columns': 'identifier',
							'@default': 'identifier'
						}
					}
				],
				{ include: '@whitespace' },
				[/[{}()\[\]]/, '@brackets'],
				[
					/@symbols/,
					{
						cases: {
							'@operators': 'operator',
							'@default': ''
						}
					}
				],
				[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
				[/\d+/, 'number'],
				[/'([^'\\]|\\.)*$/, 'string.invalid'],
				[/'/, { token: 'string.quote', bracket: '@open', next: '@string' }]
			],

			string: [
				[/[^\\']+/, 'string'],
				[/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			whitespace: [
				[/[ \t\r\n]+/, 'white'],
				[/--.*$/, 'comment']
			]
		}
	});

	const sql: monaco.languages.CompletionItemProvider = {
		provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
			const word = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn
			};

			const allItems = [...keywords, ...functions, ...tables, ...columns];
			const uniqueItems = [...new Set(allItems)];

			return {
				suggestions: uniqueItems.map((item) => ({
					label: item,
					kind: keywords.includes(item)
						? monaco.languages.CompletionItemKind.Keyword
						: functions.includes(item)
							? monaco.languages.CompletionItemKind.Function
							: columns.includes(item)
								? monaco.languages.CompletionItemKind.Field
								: monaco.languages.CompletionItemKind.Class,
					insertText: item,
					range: range
				}))
			};
		}
	};

	monaco.languages.registerCompletionItemProvider(id, sql);
}
