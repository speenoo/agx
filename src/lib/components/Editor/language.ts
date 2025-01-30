import * as monaco from 'monaco-editor';

// shared keywords and functions
const keywords = [
	'SELECT',
	'FROM',
	'WHERE',
	'GROUP BY',
	'ORDER BY',
	'LIMIT',
	'OFFSET',
	'HAVING',
	'PREWHERE',
	'UNION ALL',
	'JOIN',
	'LEFT JOIN',
	'RIGHT JOIN',
	'INNER JOIN',
	'FULL JOIN',
	'CROSS JOIN',
	'ON',
	'USING',
	'WITH',
	'DISTINCT',
	'ANY',
	'ALL',
	'DESCRIBE',
	'DESC',
	'ASC',
	'AS',
	'IN',
	'BETWEEN',
	'LIKE',
	'ILIKE',
	'NOT',
	'OR',
	'AND',
	'SHOW TABLES',
	'SHOW CREATE TABLE',
	'SHOW DICTIONARIES',
	'SHOW DATABASES'
];

const functions = [
	// Arithmetic Functions
	'plus',
	'minus',
	'multiply',
	'divide',
	'intDiv',
	'intDivOrZero',
	'modulo',
	'negate',
	'abs',
	'gcd',
	'lcm',
	// Array Functions
	'empty',
	'notEmpty',
	'length',
	'emptyArrayUInt8',
	'emptyArrayUInt16',
	'emptyArrayUInt32',
	'emptyArrayUInt64',
	'emptyArrayInt8',
	'emptyArrayInt16',
	'emptyArrayInt32',
	'emptyArrayInt64',
	'emptyArrayFloat32',
	'emptyArrayFloat64',
	'emptyArrayDate',
	'emptyArrayDateTime',
	'emptyArrayString',
	'range',
	'array',
	'arrayConcat',
	'arrayElement',
	// Comparison Functions
	'equals',
	'notEquals',
	'less',
	'greater',
	'lessOrEquals',
	'greaterOrEquals',
	'notIn',
	// Date/Time Functions
	'toYear',
	'toQuarter',
	'toMonth',
	'toDayOfYear',
	'toDayOfMonth',
	'toDayOfWeek',
	'toHour',
	'toMinute',
	'toSecond',
	'toUnixTimestamp',
	'toStartOfYear',
	'toStartOfQuarter',
	'toStartOfMonth',
	'toMonday',
	'toStartOfDay',
	'toStartOfHour',
	'toStartOfMinute',
	'toStartOfSecond',
	'toStartOfFiveMinute',
	'toStartOfTenMinutes',
	'toStartOfFifteenMinutes',
	'toStartOfInterval',
	'toTime',
	'toRelativeYearNum',
	'toRelativeQuarterNum',
	'toRelativeMonthNum',
	'toRelativeDayNum',
	'toRelativeHourNum',
	'toRelativeMinuteNum',
	'toRelativeSecondNum',
	'now',
	'today',
	'yesterday',
	'date_trunc',
	// String Functions
	'empty',
	'notEmpty',
	'length',
	'lengthUTF8',
	'lower',
	'upper',
	'lowerUTF8',
	'upperUTF8',
	'reverse',
	'reverseUTF8',
	'concat',
	'substring',
	'substringUTF8',
	'appendTrailingCharIfAbsent',
	'convertCharset',
	'base64Encode',
	'base64Decode',
	'tryBase64Decode',
	'endsWith',
	'startsWith',
	'trim',
	'trimLeft',
	'trimRight',
	'trimBoth',
	// JSON Functions
	'JSONExtract',
	'JSONExtractString',
	'JSONExtractInt',
	'JSONExtractUInt',
	'JSONExtractFloat',
	'JSONExtractBool',
	// Aggregate Functions
	'count',
	'min',
	'max',
	'sum',
	'avg',
	'any',
	'stddevPop',
	'stddevSamp',
	'varPop',
	'varSamp',
	'covarPop',
	'covarSamp',
	'anyHeavy',
	'anyLast',
	'argMin',
	'argMax',
	'avgWeighted',
	'corr',
	'topK',
	'topKWeighted',
	'groupArray',
	'groupUniqArray',
	'groupArrayInsertAt',
	'groupArrayMovingAvg',
	'groupArrayMovingSum',
	'groupBitAnd',
	'groupBitOr',
	'groupBitXor',
	'groupBitmap',
	'groupBitmapAnd',
	'groupBitmapOr',
	'groupBitmapXor',
	'quantile',
	'quantileDeterministic',
	'quantileTiming',
	'quantileTimingWeighted',
	'quantileExact',
	'quantileExactWeighted',
	'quantileTDigest',
	'quantileTDigestWeighted',
	// Bitmap Functions
	'bitmapBuild',
	'bitmapToArray',
	'bitmapSubsetInRange',
	'bitmapContains',
	'bitmapHasAny',
	'bitmapHasAll',
	// Conditional Functions
	'if',
	'multiIf',
	'ifNull',
	'nullIf',
	'coalesce',
	'assumeNotNull',
	'isNull',
	'isNotNull',
	// Type Conversion Functions
	'toUInt8',
	'toUInt16',
	'toUInt32',
	'toUInt64',
	'toInt8',
	'toInt16',
	'toInt32',
	'toInt64',
	'toFloat32',
	'toFloat64',
	'toDate',
	'toDateTime',
	'toString',
	'cast',
	'accurate cast',
	'toFixedString',
	'toStringCutToZero',
	// Hash Functions
	'halfMD5',
	'MD5',
	'sipHash64',
	'sipHash128',
	'cityHash64',
	'intHash32',
	'intHash64',
	'SHA1',
	'SHA224',
	'SHA256',
	'URLHash',
	'hex',
	'unhex',
	'bitmapHasAny',
	'bitmapHasAll'
];

// language definition
monaco.languages.register({ id: 'clickhouse' });

monaco.languages.setMonarchTokensProvider('clickhouse', {
	ignoreCase: true,
	keywords: keywords.map((k) => k.split(' ')[0]), // Handle multi-word keywords
	functions: functions,

	typeKeywords: [
		'Int8',
		'Int16',
		'Int32',
		'Int64',
		'UInt8',
		'UInt16',
		'UInt32',
		'UInt64',
		'Float32',
		'Float64',
		'String',
		'Date',
		'DateTime',
		'UUID',
		'Array'
	],

	operators: [
		'=',
		'>',
		'<',
		'!',
		'~',
		'?',
		':',
		'==',
		'<=',
		'>=',
		'!=',
		'&&',
		'||',
		'++',
		'--',
		'+',
		'-',
		'*',
		'/',
		'&',
		'|',
		'^',
		'%',
		'>>',
		'<<',
		'>>>',
		'+=',
		'-=',
		'*=',
		'/=',
		'&=',
		'|=',
		'^=',
		'%=',
		'>>=',
		'<<=',
		'>>>='
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
						'@typeKeywords': 'type',
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

const sql = {
	provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn
		};

		const allItems = [...keywords, ...functions];
		const uniqueItems = [...new Set(allItems)];

		return {
			suggestions: uniqueItems.map((item) => ({
				label: item,
				kind: keywords.includes(item)
					? monaco.languages.CompletionItemKind.Keyword
					: monaco.languages.CompletionItemKind.Function,
				insertText: item,
				range: range
			}))
		};
	}
};

monaco.languages.registerCompletionItemProvider('clickhouse', sql);
